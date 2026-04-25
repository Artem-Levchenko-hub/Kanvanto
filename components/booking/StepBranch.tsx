"use client";

import { useBookingStore } from "@/lib/booking/store";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Branch {
  id: string;
  slug: string;
  name: string;
  address: string;
  hours: string;
  brands: string[];
  isHQ?: boolean;
}

interface Props {
  branches: Branch[];
  selectedBrand?: string | null;
}

const BRAND_DISPLAY: Record<string, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "VW",
  OTHER: "",
};

export function StepBranch({ branches, selectedBrand }: Props) {
  const branchSlug = useBookingStore((s) => s.branchSlug);
  const setKey = useBookingStore((s) => s.set);

  // Если выбрана марка — рекомендуем филиалы где она поддерживается
  const targetBrand = selectedBrand ? BRAND_DISPLAY[selectedBrand] : null;

  return (
    <div>
      <h2 className="font-display text-h3 text-graphite-50">В какой филиал приедете?</h2>
      <p className="text-body-base text-graphite-200 mt-2 mb-6">
        Все филиалы — в Краснодаре. Выберите ближайший к дому или работе.
      </p>

      <div className="space-y-3">
        {branches.map((b) => {
          const isSelected = branchSlug === b.slug;
          const supportsBrand = !targetBrand || b.brands.includes(targetBrand);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setKey("branchSlug", b.slug)}
              className={cn(
                "w-full text-left rounded-lg border p-5 transition-all duration-base",
                isSelected
                  ? "border-red-primary bg-red-primary/5 shadow-glow-red"
                  : "border-graphite-500/30 bg-graphite-800 hover:border-chrome/40 hover:bg-graphite-700",
                !supportsBrand && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-h5 text-graphite-50">{b.name}</h3>
                  {b.isHQ && <Badge variant="accent" className="text-[9px]">Главный</Badge>}
                </div>
                {isSelected && (
                  <span className="size-6 rounded-full bg-red-primary grid place-items-center shrink-0">
                    <Check className="size-3.5 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-body-sm text-graphite-200">
                <p className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-chrome" />
                  {b.address}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="size-3.5 text-chrome" />
                  {b.hours}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {b.brands.map((brand) => (
                  <Badge
                    key={brand}
                    variant={brand === targetBrand ? "accent" : "chrome"}
                    className="text-[9px]"
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
              {!supportsBrand && targetBrand && (
                <p className="mt-3 text-caption text-warning">
                  Этот филиал не специализируется на {targetBrand}. Лучше выбрать другой.
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
