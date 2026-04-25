import { addMinutes, format, isBefore, parseISO, setHours, setMinutes, startOfDay } from "date-fns";

const SLOT_GRANULARITY_MIN = 30;
const MIN_HOURS_BEFORE_SLOT = 2;

export interface SlotAvailabilityArgs {
  /** Тип "Mon-Fri": "08:00-19:00" / для каждого дня недели */
  openHours: Record<string, string>;
  /** Длительность услуги в минутах */
  durationMinutes: number;
  /** Емкость филиала (одновременных машин) */
  capacity: number;
  /** Существующие активные booking-ы (status ∈ {PENDING, CONFIRMED, ARRIVED, IN_PROGRESS}) */
  existingBookings: Array<{ scheduledAt: Date; durationMinutes: number }>;
  /** Желаемая дата */
  date: Date;
}

export interface Slot {
  start: Date;
  end: Date;
  available: boolean;
  reason?: string;
}

/**
 * Расчёт доступных слотов для филиала на конкретную дату.
 *
 * Алгоритм:
 *  1. Берём `openHours` для дня недели.
 *  2. Делим на 30-мин сетку.
 *  3. Для каждого слота считаем сколько активных booking-ов в этот момент → доступно если < capacity.
 *  4. Скрываем прошедшие и слишком близкие (< MIN_HOURS_BEFORE_SLOT).
 */
export function computeSlots(args: SlotAvailabilityArgs): Slot[] {
  const dayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][args.date.getDay()];
  const window = args.openHours[dayKey];
  if (!window) return [];

  const [from, to] = window.split("-");
  if (!from || !to) return [];

  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);

  const dayStart = setMinutes(setHours(startOfDay(args.date), fh), fm);
  const dayEnd = setMinutes(setHours(startOfDay(args.date), th), tm);

  const slots: Slot[] = [];
  const minBookingTime = addMinutes(new Date(), MIN_HOURS_BEFORE_SLOT * 60);

  let cursor = dayStart;
  while (addMinutes(cursor, args.durationMinutes) <= dayEnd) {
    const slotStart = cursor;
    const slotEnd = addMinutes(cursor, args.durationMinutes);

    // Проверка прошедшего/близкого
    if (isBefore(slotStart, minBookingTime)) {
      slots.push({ start: slotStart, end: slotEnd, available: false, reason: "past" });
      cursor = addMinutes(cursor, SLOT_GRANULARITY_MIN);
      continue;
    }

    // Сколько booking-ов перекрывается со слотом
    const overlapping = args.existingBookings.filter((b) => {
      const bStart = b.scheduledAt;
      const bEnd = addMinutes(bStart, b.durationMinutes);
      return slotStart < bEnd && slotEnd > bStart;
    }).length;

    const available = overlapping < args.capacity;
    slots.push({
      start: slotStart,
      end: slotEnd,
      available,
      reason: available ? undefined : "fully_booked",
    });

    cursor = addMinutes(cursor, SLOT_GRANULARITY_MIN);
  }

  return slots;
}

export function formatSlotTime(d: Date): string {
  return format(d, "HH:mm");
}

export function formatSlotRange(start: Date, end: Date): string {
  return `${format(start, "HH:mm")}–${format(end, "HH:mm")}`;
}

export function parseISOSafe(value: string | null | undefined): Date | null {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}
