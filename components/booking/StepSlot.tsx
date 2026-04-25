"use client";

import * as React from "react";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CalendarDays } from "lucide-react";
import { useBookingStore } from "@/lib/booking/store";
import { fetchAvailability } from "@/lib/booking/availability-action";
import { cn } from "@/lib/utils/cn";
import { formatSlotTime } from "@/lib/booking/availability";

export function StepSlot() {
  const branchSlug = useBookingStore((s) => s.branchSlug);
  const serviceId = useBookingStore((s) => s.serviceId);
  const scheduledAt = useBookingStore((s) => s.scheduledAt);
  const setKey = useBookingStore((s) => s.set);

  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (scheduledAt) return new Date(scheduledAt);
    return addDays(new Date(), 1);
  });
  const [slots, setSlots] = React.useState<Array<{ start: string; end: string; available: boolean }>>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!date || !branchSlug || !serviceId) return;
    setLoading(true);
    fetchAvailability({ branchSlug, serviceId, dateISO: date.toISOString() })
      .then((r) => setSlots(r.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [date, branchSlug, serviceId]);

  const selectedSlotISO = scheduledAt;
  const dateLabel = date
    ? new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(date)
    : null;

  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div>
      <h2 className="font-display text-h3 text-graphite-50">Когда удобно приехать?</h2>
      <p className="text-body-base text-graphite-200 mt-2 mb-6">
        Сначала выберите дату, потом конкретное время. Слоты обновляются в реальном времени.
      </p>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="rounded-lg border border-graphite-500/30 bg-graphite-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-graphite-500/30 flex items-center gap-2">
              <CalendarDays className="size-4 text-chrome" />
              <span className="text-caption uppercase tracking-wider text-chrome">Выберите дату</span>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d > addDays(new Date(), 90)}
              fromDate={new Date()}
              toDate={addDays(new Date(), 90)}
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-lg border border-graphite-500/30 bg-graphite-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-graphite-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="size-4 text-chrome shrink-0" />
                <span className="text-caption uppercase tracking-wider text-chrome truncate">
                  {dateLabel || "Выберите дату"}
                </span>
              </div>
              {!loading && slots.length > 0 && (
                <span className="text-caption text-graphite-300 shrink-0">
                  Свободно: <span className="text-graphite-50 font-semibold tabular-nums">{availableCount}</span>
                </span>
              )}
            </div>

            <div className="p-4">
              {loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-11" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="size-8 text-graphite-400 mx-auto mb-3" />
                  <p className="text-body-base text-graphite-200">
                    В выбранный день филиал закрыт или нет свободных слотов.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const slotStart = new Date(slot.start);
                    const isSelected = selectedSlotISO === slot.start;
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setKey("scheduledAt", slot.start)}
                        className={cn(
                          "h-11 px-3 rounded-md text-body-sm font-mono tabular-nums font-semibold transition-all",
                          "disabled:cursor-not-allowed",
                          isSelected
                            ? "bg-red-primary text-white shadow-glow-red"
                            : slot.available
                              ? "border border-graphite-500/40 bg-graphite-900 text-graphite-50 hover:border-red-primary hover:bg-graphite-700"
                              : "border border-graphite-500/20 bg-graphite-900/50 text-graphite-500 line-through"
                        )}
                      >
                        {formatSlotTime(slotStart)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-graphite-500/30 bg-graphite-900/40">
              <p className="text-caption text-graphite-300">
                Зачёркнутые слоты — заняты или прошли. Можно выбрать только свободные.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
