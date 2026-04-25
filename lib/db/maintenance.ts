import { prisma } from "@/lib/db/client";
import { addMonths } from "date-fns";

export async function getMyReminders(userId: string) {
  return prisma.maintenanceReminder.findMany({
    where: {
      car: { userId, isActive: true },
      status: { notIn: ["DONE"] },
    },
    include: {
      car: { select: { id: true, brand: true, model: true, year: true, mileage: true } },
      rule: true,
    },
    orderBy: { dueAt: "asc" },
  });
}

export async function getRemindersDueSoon(userId: string, days = 60) {
  const limitDate = addMonths(new Date(), Math.ceil(days / 30));
  return prisma.maintenanceReminder.findMany({
    where: {
      car: { userId, isActive: true },
      status: { notIn: ["DONE", "SNOOZED"] },
      dueAt: { lte: limitDate },
    },
    include: {
      car: { select: { id: true, brand: true, model: true, mileage: true } },
      rule: true,
    },
    orderBy: { dueAt: "asc" },
  });
}

export async function getNextReminderForUser(userId: string) {
  return prisma.maintenanceReminder.findFirst({
    where: {
      car: { userId, isActive: true },
      status: { in: ["UPCOMING", "DUE", "OVERDUE"] },
    },
    include: {
      car: { select: { id: true, brand: true, model: true, year: true, mileage: true } },
      rule: true,
    },
    orderBy: [{ status: "desc" }, { dueAt: "asc" }],
  });
}

export async function snoozeReminder(reminderId: string, userId: string, until: Date) {
  const reminder = await prisma.maintenanceReminder.findFirst({
    where: { id: reminderId, car: { userId } },
  });
  if (!reminder) throw new Error("Напоминание не найдено");

  return prisma.maintenanceReminder.update({
    where: { id: reminderId },
    data: { status: "SNOOZED", snoozedUntil: until },
  });
}

export async function markReminderDone(args: {
  reminderId: string;
  userId: string;
  doneAt: Date;
  doneMileage: number;
}) {
  const reminder = await prisma.maintenanceReminder.findFirst({
    where: { id: args.reminderId, car: { userId: args.userId } },
    include: { rule: true, car: true },
  });
  if (!reminder) throw new Error("Напоминание не найдено");

  // Закрываем текущий и создаём следующий цикл
  await prisma.maintenanceReminder.update({
    where: { id: args.reminderId },
    data: {
      status: "DONE",
      lastDoneAt: args.doneAt,
      lastDoneMileage: args.doneMileage,
    },
  });

  const nextDueMileage = reminder.rule.intervalKm
    ? args.doneMileage + reminder.rule.intervalKm
    : Number.MAX_SAFE_INTEGER;
  const nextDueAt = reminder.rule.intervalMonths
    ? addMonths(args.doneAt, reminder.rule.intervalMonths)
    : new Date(8640000000000000);

  return prisma.maintenanceReminder.create({
    data: {
      carId: reminder.carId,
      ruleId: reminder.ruleId,
      type: reminder.type,
      lastDoneAt: args.doneAt,
      lastDoneMileage: args.doneMileage,
      dueAt: nextDueAt,
      dueAtMileage: nextDueMileage,
      status: "PENDING",
    },
  });
}
