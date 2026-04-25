import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Проверьте почту" };

export default function VerifyRequestPage() {
  return (
    <Card>
      <CardContent className="pt-8 px-6 sm:px-8 pb-8 text-center">
        <div className="size-14 mx-auto rounded-md bg-red-primary/15 grid place-items-center">
          <Mail className="size-7 text-red-primary" />
        </div>
        <h1 className="mt-6 font-display text-h2 text-graphite-50">Проверьте почту</h1>
        <p className="mt-3 text-body-base text-graphite-200">
          Мы отправили письмо со ссылкой для входа. Откройте его в любом устройстве — ссылка
          действует 24 часа.
        </p>
        <p className="mt-6 text-caption text-graphite-300">
          Не пришло? Проверьте папку «Спам». Если письма нет в течение 5 минут — попробуйте
          другой способ входа.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-8">
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Вернуться ко входу
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
