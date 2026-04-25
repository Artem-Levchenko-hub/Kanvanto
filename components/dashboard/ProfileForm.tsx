"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/(dashboard)/account/settings/actions";

interface Props {
  initialName: string;
  initialEmail: string;
  phone: string;
}

export function ProfileForm({ initialName, initialEmail, phone }: Props) {
  const router = useRouter();
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [submitting, setSubmitting] = React.useState(false);

  const dirty = name !== initialName || email !== initialEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateProfile({ name: name.trim() || undefined, email: email.trim() });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Профиль обновлён");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Дмитрий"
          autoComplete="name"
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          value={phone}
          disabled
          className="mt-2 font-mono tabular-nums"
        />
        <p className="mt-1 text-caption text-graphite-300">
          Изменение номера — через службу поддержки.
        </p>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="mt-2"
        />
        <p className="mt-1 text-caption text-graphite-300">
          На email будут приходить заказ-наряды, гарантии и напоминания о ТО.
        </p>
      </div>
      <Button type="submit" disabled={!dirty || submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Сохраняем...
          </>
        ) : (
          "Сохранить"
        )}
      </Button>
    </form>
  );
}
