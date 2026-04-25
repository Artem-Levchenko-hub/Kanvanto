import { addMonths, differenceInDays, differenceInMonths } from "date-fns";
import type { MaintenanceRule, MaintenanceStatus } from "@prisma/client";

const FAR_FUTURE = new Date(8640000000000000);

/**
 * Расчёт «следующего ТО» при добавлении авто или после факта выполнения.
 *
 * Точка отсчёта:
 *  - Если задан `lastDoneAt` / `lastDoneMileage` — отсчитываем от них.
 *  - Иначе — от `purchaseDate` / текущего пробега (приближение для машин с пробегом).
 */
export function computeDue(args: {
  rule: Pick<MaintenanceRule, "intervalKm" | "intervalMonths">;
  lastDoneAt: Date | null;
  lastDoneMileage: number | null;
  fallbackDate: Date;
  fallbackMileage: number;
}): { dueAt: Date; dueAtMileage: number } {
  const startDate = args.lastDoneAt ?? args.fallbackDate;
  const startMileage = args.lastDoneMileage ?? args.fallbackMileage;

  const dueAtMileage = args.rule.intervalKm ? startMileage + args.rule.intervalKm : Number.MAX_SAFE_INTEGER;
  const dueAt = args.rule.intervalMonths ? addMonths(startDate, args.rule.intervalMonths) : FAR_FUTURE;

  return { dueAt, dueAtMileage };
}

/**
 * Усреднённый пробег в месяц (км/мес).
 * Для новых клиентов без истории — 1500 (≈18к/год).
 */
export function computeAvgKmPerMonth(args: {
  currentMileage: number;
  earliestMileage: number;
  earliestDate: Date;
}): number {
  const monthsSpan = Math.max(differenceInMonths(new Date(), args.earliestDate), 1);
  const kmDelta = Math.max(args.currentMileage - args.earliestMileage, 0);
  if (kmDelta === 0) return 1500;
  return Math.round(kmDelta / monthsSpan);
}

/**
 * Рассчитываем статус reminder на основе:
 *  - сколько дней до dueAt
 *  - сколько км до dueAtMileage (с учётом среднего пробега → переводим в дни)
 *
 * Финальный «days until due» = min из двух эстимейтов.
 *
 * Пороги:
 *  - PENDING: > 60 дней и > 1500 км
 *  - UPCOMING: ≤ 60 дней или ≤ 1500 км
 *  - DUE: ≤ 14 дней или ≤ 500 км
 *  - OVERDUE: < 0 (пропущено)
 */
export function computeStatus(args: {
  dueAt: Date;
  dueAtMileage: number;
  currentMileage: number;
  avgKmPerMonth: number;
  now?: Date;
}): MaintenanceStatus {
  const now = args.now ?? new Date();
  const daysToDate = differenceInDays(args.dueAt, now);
  const kmToDue = args.dueAtMileage - args.currentMileage;

  // Перевод km-расстояния в дни: avgKmPerMonth → avgKmPerDay
  const avgKmPerDay = Math.max(args.avgKmPerMonth / 30, 1);
  const daysToKm = kmToDue > 0 ? Math.floor(kmToDue / avgKmPerDay) : -1;

  const effectiveDays = Math.min(daysToDate, daysToKm);

  if (effectiveDays < 0 || kmToDue < 0) return "OVERDUE";
  if (effectiveDays <= 14 || kmToDue <= 500) return "DUE";
  if (effectiveDays <= 60 || kmToDue <= 1500) return "UPCOMING";
  return "PENDING";
}

/**
 * Возвращает «человеко-читаемую» строку до ТО для UI.
 */
export function formatTimeUntilDue(args: {
  dueAt: Date;
  dueAtMileage: number;
  currentMileage: number;
  avgKmPerMonth: number;
  now?: Date;
}): { primary: string; secondary: string; isOverdue: boolean } {
  const now = args.now ?? new Date();
  const daysToDate = differenceInDays(args.dueAt, now);
  const kmToDue = args.dueAtMileage - args.currentMileage;
  const avgKmPerDay = Math.max(args.avgKmPerMonth / 30, 1);
  const daysToKm = kmToDue > 0 ? Math.floor(kmToDue / avgKmPerDay) : -1;

  const isOverdue = daysToDate < 0 || kmToDue < 0;

  if (isOverdue) {
    return {
      primary: kmToDue < 0 ? `просрочено на ${Math.abs(kmToDue).toLocaleString("ru-RU")} км` : `просрочено на ${Math.abs(daysToDate)} дн`,
      secondary: "Запишитесь как можно скорее",
      isOverdue: true,
    };
  }

  // Что наступит раньше — то и показываем primary
  if (kmToDue < 1500 && daysToKm < daysToDate) {
    return {
      primary: `через ${kmToDue.toLocaleString("ru-RU")} км`,
      secondary: `~${daysToKm} дн при текущем пробеге`,
      isOverdue: false,
    };
  }
  return {
    primary: `через ${daysToDate} дн`,
    secondary: kmToDue > 0 ? `или ${kmToDue.toLocaleString("ru-RU")} км пробега` : "",
    isOverdue: false,
  };
}
