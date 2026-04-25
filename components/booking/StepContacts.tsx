"use client";

import { useBookingStore } from "@/lib/booking/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  isAuthenticated: boolean;
  userInfo?: { name: string | null; phone: string | null; email: string | null };
}

export function StepContacts({ isAuthenticated, userInfo }: Props) {
  const guestName = useBookingStore((s) => s.guestName);
  const guestPhone = useBookingStore((s) => s.guestPhone);
  const guestEmail = useBookingStore((s) => s.guestEmail);
  const notes = useBookingStore((s) => s.notes);
  const consent = useBookingStore((s) => s.consent);
  const notifyMaintenance = useBookingStore((s) => s.notifyMaintenance);
  const setKey = useBookingStore((s) => s.set);

  if (isAuthenticated) {
    return (
      <div>
        <h2 className="font-display text-h3 text-graphite-50">Дополнительная информация</h2>
        <p className="text-body-base text-graphite-200 mt-2 mb-6">
          Контакты возьмём из вашего профиля. Если нужно что-то уточнить мастеру — напишите ниже.
        </p>

        <div className="rounded-lg bg-graphite-800 border border-graphite-500/30 p-4 space-y-2 mb-6">
          {userInfo?.name && (
            <div className="flex justify-between text-body-sm">
              <span className="text-graphite-300">Имя</span>
              <span className="text-graphite-50 font-medium">{userInfo.name}</span>
            </div>
          )}
          {userInfo?.phone && (
            <div className="flex justify-between text-body-sm">
              <span className="text-graphite-300">Телефон</span>
              <span className="text-graphite-50 font-mono tabular-nums">{userInfo.phone}</span>
            </div>
          )}
          {userInfo?.email && (
            <div className="flex justify-between text-body-sm">
              <span className="text-graphite-300">Email</span>
              <span className="text-graphite-50">{userInfo.email}</span>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Комментарий мастеру (опционально)</Label>
          <textarea
            id="notes"
            value={notes ?? ""}
            onChange={(e) => setKey("notes", e.target.value || null)}
            maxLength={500}
            rows={4}
            placeholder="Например: горит ошибка двигателя при холодном пуске. Слышен стук в подвеске на ямах."
            className="mt-2 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 py-2 text-body-base text-graphite-50 placeholder:text-graphite-300 focus-visible:outline-none focus-visible:border-red-primary focus-visible:ring-2 focus-visible:ring-red-glow"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-h3 text-graphite-50">Контакты для связи</h2>
      <p className="text-body-base text-graphite-200 mt-2 mb-6">
        Подтверждение записи отправим по SMS. Email — для напоминаний и заказ-нарядов.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Как к вам обращаться?</Label>
          <Input
            id="name"
            value={guestName ?? ""}
            onChange={(e) => setKey("guestName", e.target.value || null)}
            placeholder="Дмитрий"
            autoComplete="name"
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={guestPhone ?? ""}
            onChange={(e) => setKey("guestPhone", e.target.value || null)}
            placeholder="+7 (___) ___-__-__"
            required
            className="mt-2 font-mono tabular-nums"
          />
        </div>
        <div>
          <Label htmlFor="email">Email (опционально)</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={guestEmail ?? ""}
            onChange={(e) => setKey("guestEmail", e.target.value || null)}
            placeholder="you@example.com"
            className="mt-2"
          />
          <p className="mt-2 text-caption text-graphite-300">
            Если укажете — отправим письмо для активации личного кабинета.
          </p>
        </div>
        <div>
          <Label htmlFor="notes">Комментарий мастеру</Label>
          <textarea
            id="notes"
            value={notes ?? ""}
            onChange={(e) => setKey("notes", e.target.value || null)}
            maxLength={500}
            rows={3}
            placeholder="Что беспокоит, что нужно посмотреть"
            className="mt-2 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 py-2 text-body-base text-graphite-50 placeholder:text-graphite-300 focus-visible:outline-none focus-visible:border-red-primary focus-visible:ring-2 focus-visible:ring-red-glow"
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={consent}
            onCheckedChange={(v) => setKey("consent", v === true)}
            id="consent"
            className="mt-0.5"
          />
          <span className="text-body-sm text-graphite-200">
            Согласен на{" "}
            <a href="/privacy" target="_blank" className="text-red-primary hover:underline">
              обработку персональных данных
            </a>{" "}
            (требуется по 152-ФЗ)
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={notifyMaintenance}
            onCheckedChange={(v) => setKey("notifyMaintenance", v === true)}
            id="notify"
            className="mt-0.5"
          />
          <span className="text-body-sm text-graphite-200">
            Получать напоминания о ТО (за 30, 14 и 3 дня) — email, SMS, Telegram
          </span>
        </label>
      </div>
    </div>
  );
}
