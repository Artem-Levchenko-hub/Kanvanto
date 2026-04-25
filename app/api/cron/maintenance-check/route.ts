import { NextResponse } from "next/server";
import { addDays, differenceInDays } from "date-fns";
import { prisma } from "@/lib/db/client";
import { computeStatus } from "@/lib/maintenance/engine";
import { sendReminderNotification } from "@/lib/maintenance/notify";

/**
 * Cron-задача для пересчёта статусов напоминаний и рассылки уведомлений.
 *
 * Защищена `Authorization: Bearer ${CRON_SECRET}`.
 *
 * Vercel Cron вызывает раз в день. Алгоритм:
 *  1. Достаём все активные reminder-ы у которых dueAt < +60 дней
 *  2. Для каждого пересчитываем статус (PENDING → UPCOMING → DUE → OVERDUE)
 *  3. Если статус сменился И (notifiedAt > 14 дней назад ИЛИ null) → отправляем уведомление
 *  4. Обновляем notifiedAt
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const limitDate = addDays(new Date(), 60);

  const reminders = await prisma.maintenanceReminder.findMany({
    where: {
      status: { notIn: ["DONE", "SNOOZED"] },
      dueAt: { lt: limitDate },
    },
    include: {
      car: { include: { user: true } },
      rule: true,
    },
  });

  let processed = 0;
  let notified = 0;
  let errors = 0;

  for (const reminder of reminders) {
    try {
      // Пропускаем если авто архивировано
      if (!reminder.car.isActive) continue;
      // Пропускаем snooze ещё не истёкший
      if (reminder.snoozedUntil && reminder.snoozedUntil > new Date()) continue;

      const newStatus = computeStatus({
        dueAt: reminder.dueAt,
        dueAtMileage: reminder.dueAtMileage,
        currentMileage: reminder.car.mileage,
        avgKmPerMonth: 1500,
      });

      const statusChanged = newStatus !== reminder.status;
      const shouldNotify =
        ["UPCOMING", "DUE", "OVERDUE"].includes(newStatus) &&
        (!reminder.notifiedAt || differenceInDays(new Date(), reminder.notifiedAt) >= 14);

      if (statusChanged) {
        await prisma.maintenanceReminder.update({
          where: { id: reminder.id },
          data: { status: newStatus },
        });
        processed++;
      }

      if (shouldNotify) {
        await sendReminderNotification({
          reminder,
          rule: reminder.rule,
          car: reminder.car,
          user: reminder.car.user,
        });
        await prisma.maintenanceReminder.update({
          where: { id: reminder.id },
          data: { notifiedAt: new Date() },
        });
        notified++;
      }
    } catch (e) {
      console.error("[cron] reminder failed:", reminder.id, e);
      errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    total: reminders.length,
    processed,
    notified,
    errors,
  });
}
