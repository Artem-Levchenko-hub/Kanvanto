"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Phone, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidPhone } from "@/lib/db/users";

export default function LoginPage() {
  return (
    <React.Suspense fallback={<Card><CardContent className="pt-8 px-6 sm:px-8 pb-8"><div className="h-64" /></CardContent></Card>}>
      <LoginPageInner />
    </React.Suspense>
  );
}

function LoginPageInner() {
  return (
    <Card>
      <CardContent className="pt-8 px-6 sm:px-8 pb-8">
        <h1 className="font-display text-h2 text-graphite-50">Войти в Kanavto</h1>
        <p className="mt-2 text-body-sm text-graphite-200">
          Без пароля. По телефону или email — что удобнее.
        </p>

        <Tabs defaultValue="phone" className="mt-8">
          <TabsList className="grid grid-cols-2 w-full h-12">
            <TabsTrigger value="phone">
              <Phone className="size-4" />
              Телефон
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="size-4" />
              Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone" className="mt-6">
            <PhoneAuthForm />
          </TabsContent>
          <TabsContent value="email" className="mt-6">
            <EmailAuthForm />
          </TabsContent>
        </Tabs>

        {process.env.NEXT_PUBLIC_YANDEX_OAUTH_ENABLED === "true" && (
          <>
            <div className="my-6 flex items-center gap-3 text-caption text-graphite-300">
              <span className="flex-1 h-px bg-graphite-500/40" />
              <span>или</span>
              <span className="flex-1 h-px bg-graphite-500/40" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => signIn("yandex", { callbackUrl: "/account" })}
            >
              Войти через Yandex
            </Button>
          </>
        )}

        <p className="mt-8 text-caption text-graphite-300 text-center">
          Создавая аккаунт, вы соглашаетесь с{" "}
          <Link href="/privacy" className="text-graphite-100 hover:text-red-primary">
            политикой обработки персональных данных
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function PhoneAuthForm() {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [loading, setLoading] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const requestOtp = async () => {
    if (!isValidPhone(phone)) {
      toast.error("Введите корректный номер телефона");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Не удалось отправить код");
        return;
      }
      setStep("code");
      setResendTimer(60);
      if (data.devCode) {
        toast.info(`Код для теста: ${data.devCode}`, { duration: 30000 });
      } else {
        toast.success(`Код отправлен на ${phone}`);
      }
    } catch (e) {
      toast.error("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSignIn = async () => {
    if (code.length !== 4) {
      toast.error("Код должен быть из 4 цифр");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("phone-otp", {
        phone,
        code,
        callbackUrl,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Неверный код или код истёк");
        return;
      }
      toast.success("Вход выполнен");
      router.push(callbackUrl);
      router.refresh();
    } catch (e) {
      toast.error("Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void requestOtp();
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="phone">Номер телефона</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 font-mono tabular-nums"
            disabled={loading}
            required
          />
          <p className="mt-2 text-caption text-graphite-300">
            Отправим код в SMS. Никаких паролей запоминать не нужно.
          </p>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Отправляем..." : "Получить код"}
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void verifyAndSignIn();
      }}
      className="space-y-4"
    >
      <button
        type="button"
        onClick={() => setStep("phone")}
        className="inline-flex items-center gap-1 text-caption text-graphite-300 hover:text-red-primary"
      >
        <ArrowLeft className="size-3.5" />
        Изменить номер
      </button>
      <div>
        <Label htmlFor="code">Код из SMS</Label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          placeholder="0000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="mt-2 font-mono tabular-nums tracking-[0.4em] text-center text-h4"
          disabled={loading}
          required
        />
        <p className="mt-2 text-caption text-graphite-300">
          Отправили на <span className="font-mono text-graphite-100">{phone}</span>
        </p>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading || code.length !== 4}>
        {loading ? "Проверяем..." : "Войти"}
      </Button>
      <button
        type="button"
        onClick={() => void requestOtp()}
        disabled={resendTimer > 0 || loading}
        className="w-full text-caption text-graphite-300 hover:text-red-primary disabled:opacity-50"
      >
        {resendTimer > 0 ? `Отправить код повторно через ${resendTimer} сек` : "Отправить код повторно"}
      </button>
    </form>
  );
}

function EmailAuthForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("email", { email, callbackUrl, redirect: false });
      if (result?.error) {
        toast.error("Не удалось отправить письмо. Проверьте адрес.");
        return;
      }
      toast.success("Письмо отправлено. Откройте ссылку из почты.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2"
          disabled={loading}
          required
        />
        <p className="mt-2 text-caption text-graphite-300">
          Отправим magic-link. Действует 24 часа.
        </p>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Отправляем..." : "Отправить ссылку"}
      </Button>
      <p className="flex items-center gap-2 text-caption text-graphite-300 justify-center">
        <ShieldCheck className="size-3.5" />
        Безопасный вход без пароля
      </p>
    </form>
  );
}
