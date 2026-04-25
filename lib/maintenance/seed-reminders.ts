import { prisma } from "@/lib/db/client";
import { computeDue, computeStatus } from "@/lib/maintenance/engine";
import type { Car, MaintenanceRule, CarBrand } from "@prisma/client";

/**
 * Создаёт MaintenanceReminder-ы для нового авто.
 *
 * Берёт все универсальные правила (brand=null) + бренд-специфичные для марки авто.
 * Если для одного типа есть и универсальное, и бренд-специфичное — берём бренд-специфичное.
 */
export async function seedRemindersForCar(carId: string): Promise<{ created: number }> {
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) throw new Error("Car not found");

  const rules = await prisma.maintenanceRule.findMany({
    where: {
      isActive: true,
      OR: [{ brand: null }, { brand: car.brand }],
    },
  });

  // Дедуп по типу — приоритет бренд-специфике
  const byType = new Map<string, MaintenanceRule>();
  for (const rule of rules) {
    const existing = byType.get(rule.type);
    if (!existing) {
      byType.set(rule.type, rule);
      continue;
    }
    // Если существующее — универсальное, а новое — бренд-специфичное → заменить
    if (existing.brand === null && rule.brand !== null) {
      byType.set(rule.type, rule);
    }
  }

  const fallbackDate = car.purchaseDate ?? car.createdAt;

  const remindersToCreate = Array.from(byType.values()).map((rule) => {
    const { dueAt, dueAtMileage } = computeDue({
      rule,
      lastDoneAt: null,
      lastDoneMileage: null,
      fallbackDate,
      fallbackMileage: car.mileage,
    });
    const status = computeStatus({
      dueAt,
      dueAtMileage,
      currentMileage: car.mileage,
      avgKmPerMonth: 1500,
    });
    return {
      carId: car.id,
      ruleId: rule.id,
      type: rule.type,
      lastDoneAt: null,
      lastDoneMileage: null,
      dueAt,
      dueAtMileage,
      status,
    };
  });

  if (remindersToCreate.length === 0) return { created: 0 };

  // Удалить существующие (на случай повторной seed-операции после смены пробега)
  await prisma.maintenanceReminder.deleteMany({ where: { carId, status: { not: "DONE" } } });
  await prisma.maintenanceReminder.createMany({ data: remindersToCreate });

  return { created: remindersToCreate.length };
}

/**
 * Пересчёт статусов всех активных reminder-ов для конкретного авто.
 * Вызывается при апдейте пробега, например.
 */
export async function recomputeRemindersForCar(carId: string): Promise<{ updated: number }> {
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) throw new Error("Car not found");

  const reminders = await prisma.maintenanceReminder.findMany({
    where: { carId, status: { notIn: ["DONE", "SNOOZED"] } },
  });

  let updated = 0;
  for (const r of reminders) {
    const newStatus = computeStatus({
      dueAt: r.dueAt,
      dueAtMileage: r.dueAtMileage,
      currentMileage: car.mileage,
      avgKmPerMonth: 1500,
    });
    if (newStatus !== r.status) {
      await prisma.maintenanceReminder.update({
        where: { id: r.id },
        data: { status: newStatus },
      });
      updated++;
    }
  }
  return { updated };
}
