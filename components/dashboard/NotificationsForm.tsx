"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateNotifications } from "@/app/(dashboard)/account/settings/actions";

interface Props {
  initialEmail: boolean;
  initialSms: boolean;
  initialTelegram: boolean;
  initialDays: number[];
  telegramConnected: boolean;
  hasEmail: boolean;
}

const DAY_OPTIONS = [1, 3, 7, 14, 30, 60];

export function NotificationsForm({
  initialEmail, initialSms, initialTelegram, initialDays, telegramConnected, hasEmail,
}: Props) {
  const router = useRouter();
  const [notifyEmail, setNotifyEmail] = React.useState(initialEmail);
  const [notifySms, setNotifySms] = React.useState(initialSms);
  const [notifyTelegram, setNotifyTelegram] = React.useState(initialTelegram);
  const [days, setDays] = React.useState<number[]>(initialDays);
  const [submitting, setSubmitting] = React.useState(false);

  const dirty =
    notifyEmail !== initialEmail ||
    notifySms !== initialSms ||
    notifyTelegram !== initialTelegram ||
    days.sort().join(",") !== initialDays.sort().join(",");

  const toggleDay = (d: number) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => b - a)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateNotifications({
      notifyEmail,
      notifySms,
      notifyTelegram,
      remindDaysBefore: days,
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Настройки уведомлений сохранены");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-body-sm font-medium text-graphite-50 mb-3">Каналы</p>
        <div className="space-y-3">
          <ChannelRow
            icon={Mail}
            label="Email"
            description={hasEmail ? "Подробные напоминания с ценами и кнопкой записи" : "Сначала укажите email в профиле"}
            checked={notifyEmail}
            onChange={setNotifyEmail}
            disabled={!hasEmail}
          />
          <ChannelRow
            icon={MessageSquare}
            label="SMS"
            description="Короткое напоминание на телефон"
            checked={notifySms}
            onChange={setNotifySms}
          />
          <ChannelRow
            icon={Send}
            label="Telegram"
            description={
              telegramConnected
                ? "Бот привязан"
                : "Привяжите бот @kanavto_bot командой /start (доступно в этапе 4)"
            }
            checked={notifyTelegram}
            onChange={setNotifyTelegram}
            disabled={!telegramConnected}
          />
        </div>
      </div>

      <div>
        <p className="text-body-sm font-medium text-graphite-50 mb-2">За сколько дней предупреждать</p>
        <p className="text-caption text-graphite-300 mb-3">
          Можно выбрать несколько — напоминания придут поэтапно
        </p>
        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors ${
                days.includes(d)
                  ? "bg-red-primary text-white border border-red-primary"
                  : "bg-graphite-800 text-graphite-100 border border-graphite-500 hover:bg-graphite-700"
              }`}
            >
              {d} {d === 1 ? "день" : d < 5 ? "дня" : "дней"}
            </button>
          ))}
        </div>
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

function ChannelRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: typeof Mail;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3 rounded-md border border-graphite-500/30 ${
        disabled ? "opacity-50" : "cursor-pointer hover:bg-graphite-800"
      } transition-colors`}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => !disabled && onChange(v === true)}
        disabled={disabled}
        className="mt-0.5"
      />
      <Icon className="size-4 text-chrome mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-graphite-50 font-medium">{label}</p>
        <p className="text-caption text-graphite-300 mt-0.5">{description}</p>
      </div>
    </label>
  );
}
