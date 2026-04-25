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
  const progress = ((currentIdx + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="w-full">
      {/* Mobile: simple progress bar with step counter */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption text-chrome uppercase tracking-wider">
            Шаг {currentIdx + 1} из {STEP_ORDER.length}
          </span>
          <span className="text-body-sm text-graphite-50 font-medium">{STEP_LABELS[current]}</span>
        </div>
        <div className="h-1 w-full bg-graphite-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-primary transition-all duration-slow ease-emphasized"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop: step dots with labels */}
      <ol className="hidden lg:flex items-center gap-1">
        {STEP_ORDER.map((step, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <li key={step} className="flex-1 flex items-center gap-3">
              <div
                className={cn(
                  "size-8 rounded-full grid place-items-center text-caption font-semibold shrink-0 transition-colors",
                  isPast && "bg-red-primary text-white",
                  isCurrent && "bg-red-primary text-white shadow-glow-red",
                  !isPast && !isCurrent && "bg-graphite-700 text-graphite-300 border border-graphite-500"
                )}
              >
                {isPast ? <Check className="size-4" strokeWidth={3} /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-body-sm font-medium truncate",
                    isCurrent ? "text-graphite-50" : "text-graphite-300"
                  )}
                >
                  {STEP_LABELS[step]}
                </p>
              </div>
              {idx < STEP_ORDER.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    isPast ? "bg-red-primary" : "bg-graphite-500"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
