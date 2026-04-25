"use client";

import { useBookingStore } from "@/lib/booking/store";
import { SERVICES } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  Activity, Wrench, Cog, GitBranch, DiscAlbum, ArrowDownUp,
  Zap, Cpu, KeyRound, Palette, CircleDot, Wind, Check, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Activity, Wrench, Cog, GitBranch, DiscAlbum, ArrowDownUp, Zap, Cpu, KeyRound, Palette, CircleDot, Wind,
};

interface Props {
  services: Array<{ id: string; slug: string; title: string; basePrice: number; durationMinutes: number; iconName: string | null; isFlagship: boolean; isExclusive: boolean; shortDescription: string }>;
}

export function StepService({ services }: Props) {
  const serviceId = useBookingStore((s) => s.serviceId);
  const setKey = useBookingStore((s) => s.set);

  return (
    <div className="space-y-2">
      <h2 className="font-display text-h3 text-graphite-50">Какая услуга нужна?</h2>
      <p className="text-body-base text-graphite-200 mb-6">
        Выберите основную работу. Дополнительные услуги можно добавить на приёмке.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => {
          const Icon = ICONS[s.iconName || "Wrench"] ?? Wrench;
          const isSelected = serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setKey("serviceId", s.id)}
              className={cn(
                "group text-left rounded-lg border bg-graphite-800 p-5 transition-all duration-base",
                isSelected
                  ? "border-red-primary bg-red-primary/5 shadow-glow-red"
                  : "border-graphite-500/30 hover:border-chrome/40 hover:bg-graphite-700"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={cn(
                    "size-10 rounded-md grid place-items-center transition-colors",
                    isSelected ? "bg-red-primary text-white" : "bg-graphite-700 text-chrome"
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.isFlagship && <Badge variant="accent" className="text-[9px]">Флагман</Badge>}
                  {s.isExclusive && <Badge variant="chrome" className="text-[9px]">Exclusive</Badge>}
                  {isSelected && (
                    <span className="size-5 rounded-full bg-red-primary grid place-items-center">
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-display text-h6 text-graphite-50 leading-tight">{s.title}</h3>
              <p className="mt-2 text-body-sm text-graphite-200 line-clamp-2">{s.shortDescription}</p>
              <div className="mt-4 pt-3 border-t border-graphite-500/30 flex items-center justify-between text-caption">
                <span className="text-chrome">~{Math.round(s.durationMinutes / 60 * 10) / 10} ч</span>
                <span className="font-mono tabular-nums text-graphite-50 font-semibold">
                  от {formatPrice(s.basePrice)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
