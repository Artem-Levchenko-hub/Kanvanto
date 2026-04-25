"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { STEP_ORDER, type WizardStep, getStepIndex } from "@/lib/booking/store";

const STEP_LABELS: Record<WizardStep, string> = {
  service: "Услуга",
  car: "Авто",
  branch: "Филиал",
  slot: "Дата",
  contacts: "Контакты",
  confirm: "Подтверждение",
};

export function WizardProgress({ current }: { current: WizardStep }) {
  const currentIdx = getStepIndex(current);
  const total = STEP_ORDER.length;
  const progressPct = ((currentIdx + 1) / total) * 100;

  return (
    <div className="w-full">
      {/* Header — всегда видно */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-caption text-chrome uppercase tracking-[0.18em]">
            Шаг {currentIdx + 1} из {total}
          </p>
          <p className="mt-1 font-display text-h5 text-graphite-50">
            {STEP_LABELS[current]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-caption text-chrome uppercase tracking-[0.18em]">Прогресс</p>
          <p className="mt-1 font-mono tabular-nums text-h5 text-graphite-50 font-semibold">
            {Math.round(progressPct)}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-graphite-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-red-primary transition-all duration-slow ease-emphasized"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step dots — только на desktop, читаемые */}
      <ol className="hidden md:grid grid-cols-6 gap-2">
        {STEP_ORDER.map((step, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <li
              key={step}
              className={cn(
                "flex flex-col items-center gap-2 text-center px-2 py-3 rounded-md transition-colors",
                isCurrent && "bg-red-primary/5 border border-red-primary/30",
                !isCurrent && "border border-transparent"
              )}
            >
              <span
                className={cn(
                  "size-7 rounded-full grid place-items-center text-[11px] font-bold shrink-0 transition-colors",
                  isPast && "bg-red-primary text-white",
                  isCurrent && "bg-red-primary text-white shadow-glow-red",
                  !isPast && !isCurrent && "bg-graphite-700 text-graphite-300 border border-graphite-500"
                )}
              >
                {isPast ? <Check className="size-3.5" strokeWidth={3} /> : idx + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium leading-tight",
                  isCurrent ? "text-graphite-50" : isPast ? "text-graphite-200" : "text-graphite-400"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
