import { sendEmail } from "@/lib/email/resend";
import { sendMaintenanceReminderSms } from "@/lib/sms/notifications";
import { MAINTENANCE_TYPE_LABELS } from "@/lib/maintenance/rules";
import type { MaintenanceReminder, MaintenanceRule, Car, User } from "@prisma/client";
import { formatTimeUntilDue } from "./engine";

export async function sendReminderNotification(args: {
  reminder: MaintenanceReminder;
  rule: MaintenanceRule;
  car: Car;
  user: User;
}): Promise<{ channels: string[] }> {
  const { reminder, rule, car, user } = args;
  const sent: string[] = [];

  if (user.notifyEmail && user.email) {
    const formatted = formatTimeUntilDue({
      dueAt: reminder.dueAt,
      dueAtMileage: reminder.dueAtMileage,
      currentMileage: car.mileage,
      avgKmPerMonth: 1500,
    });

    const html = buildReminderEmail({
      userName: user.name || "Клиент",
      carLabel: `${car.brand} ${car.model} ${car.year}`,
      maintenanceTitle: MAINTENANCE_TYPE_LABELS[reminder.type],
      timeUntilDue: formatted.primary,
      estimatedPrice: rule.estimatedPrice ?? 0,
      isOverdue: formatted.isOverdue,
      bookingLink: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/booking`,
    });

    const result = await sendEmail({
      to: user.email,
      subject: formatted.isOverdue
        ? `🔴 Просрочено: ${MAINTENANCE_TYPE_LABELS[reminder.type]} · ${car.brand} ${car.model}`
        : `${MAINTENANCE_TYPE_LABELS[reminder.type]} ${formatted.primary}`,
      html,
    });

    if (result) sent.push("email");
  }

  if (user.notifySms && user.phone) {
    const formatted = formatTimeUntilDue({
      dueAt: reminder.dueAt,
      dueAtMileage: reminder.dueAtMileage,
      currentMileage: car.mileage,
      avgKmPerMonth: 1500,
    });
    const smsResult = await sendMaintenanceReminderSms({
      phone: user.phone,
      carLabel: `${car.brand} ${car.model}`,
      maintenanceTitle: MAINTENANCE_TYPE_LABELS[reminder.type],
      timeUntilDue: formatted.primary,
      isOverdue: formatted.isOverdue,
    }).catch((e) => {
      console.error("[notify] SMS send failed:", e);
      return { ok: false } as const;
    });
    if (smsResult.ok) sent.push("sms");
  }

  return { channels: sent };
}

function buildReminderEmail(args: {
  userName: string;
  carLabel: string;
  maintenanceTitle: string;
  timeUntilDue: string;
  estimatedPrice: number;
  isOverdue: boolean;
  bookingLink: string;
}): string {
  const accentColor = args.isOverdue ? "#F87171" : "#FBBF24";
  return `
<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#0A0A0B; font-family:'Jost', sans-serif; color:#F5F5F7;">
  <div style="max-width:560px; margin:0 auto; padding:40px 24px;">
    <div style="background:#17171B; border:1px solid rgba(58,58,68,0.4); border-radius:16px; padding:40px;">
      <div style="display:inline-flex; align-items:center; gap:12px; margin-bottom:32px;">
        <div style="width:40px; height:40px; background:#DC2626; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-family:'Playfair Display', serif; font-weight:700; color:#fff; font-size:20px;">K</div>
        <span style="font-family:'Playfair Display', serif; font-size:24px; color:#F5F5F7;">Kanavto</span>
      </div>
      <p style="font-size:13px; color:${accentColor}; text-transform:uppercase; letter-spacing:0.15em; margin:0 0 8px; font-weight:600;">${args.isOverdue ? "Просрочено" : "Скоро ТО"}</p>
      <h1 style="font-family:'Playfair Display', serif; font-size:28px; font-weight:600; line-height:1.2; margin:0 0 16px;">${args.maintenanceTitle}</h1>
      <p style="font-size:18px; color:${accentColor}; margin:0 0 24px; font-weight:500;">${args.timeUntilDue}</p>
      <p style="font-size:15px; color:#A8A8B0; line-height:1.6; margin:0 0 24px;">
        ${args.userName}, ваш <strong style="color:#F5F5F7;">${args.carLabel}</strong> требует обслуживания. Ориентировочная стоимость работ — от <strong style="color:#C0C0C8; font-family:monospace;">${args.estimatedPrice.toLocaleString("ru-RU")} ₽</strong>.
      </p>
      <a href="${args.bookingLink}" style="display:inline-block; background:#DC2626; color:#fff; padding:14px 32px; border-radius:12px; font-weight:600; text-decoration:none; font-size:16px;">Записаться на ${args.maintenanceTitle.toLowerCase()}</a>
      <hr style="border:none; border-top:1px solid rgba(58,58,68,0.4); margin:32px 0;">
      <p style="font-size:12px; color:#6E6E76; margin:0;">Чтобы отписаться от напоминаний — измените настройки в личном кабинете.</p>
    </div>
  </div>
</body>
</html>`;
}
