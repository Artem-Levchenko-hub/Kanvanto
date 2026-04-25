import Link from "next/link";
import { ArrowUpRight, Gauge, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber, maskVin } from "@/lib/utils/format";
import type { CarBrand, MaintenanceStatus } from "@prisma/client";

interface Props {
  car: {
    id: string;
    brand: CarBrand;
    model: string;
    year: number;
    vin: string | null;
    licensePlate: string | null;
    mileage: number;
    purchaseDate: Date | null;
  };
  nextReminder?: {
    type: string;
    label: string;
    dueAt: Date;
    status: MaintenanceStatus;
  } | null;
}

const BRAND_LABELS: Record<CarBrand, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes-Benz",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "Volkswagen",
  OTHER: "Другая",
};

export function CarCard({ car, nextReminder }: Props) {
  return (
    <Link
      href={`/account/cars/${car.id}`}
      className="group block rounded-lg border border-graphite-500/30 bg-graphite-800 overflow-hidden hover:border-chrome/30 hover:-translate-y-0.5 transition-all duration-base"
    >
      {/* Hero */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-graphite-700 to-graphite-900 grid place-items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-900 to-transparent opacity-60" />
        <span className="font-display text-[6rem] font-semibold text-chrome/15 group-hover:text-chrome/25 transition-colors leading-none">
          {BRAND_LABELS[car.brand].slice(0, 3)}
        </span>
        <span className="absolute top-3 right-3">
          <ArrowUpRight className="size-5 text-graphite-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-h5 text-graphite-50 leading-tight">
          {BRAND_LABELS[car.brand]} {car.model}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-caption text-chrome">
          <span className="font-mono tabular-nums">{car.year}</span>
          {car.licensePlate && (
            <>
              <span>·</span>
              <span className="font-mono tabular-nums uppercase">{car.licensePlate}</span>
            </>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-body-sm">
          <Detail icon={Gauge} label="Пробег" value={`${formatNumber(car.mileage)} км`} />
          {car.purchaseDate && (
            <Detail icon={Calendar} label="Куплен" value={formatDate(car.purchaseDate)} />
          )}
          {car.vin && (
            <Detail
              icon={Hash}
              label="VIN"
              value={maskVin(car.vin)}
              mono
              className="col-span-2"
            />
          )}
        </div>

        {/* Timeline indicator */}
        {nextReminder && (
          <div className="mt-4 pt-4 border-t border-graphite-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption text-chrome">Следующее ТО</span>
              <Badge
                variant={
                  nextReminder.status === "OVERDUE"
                    ? "error"
                    : nextReminder.status === "DUE"
                      ? "warning"
                      : "default"
                }
                className="text-[9px]"
              >
                {nextReminder.status === "OVERDUE"
                  ? "Просрочено"
                  : nextReminder.status === "DUE"
                    ? "Срочно"
                    : "В плане"}
              </Badge>
            </div>
            <p className="text-body-sm text-graphite-100 truncate">{nextReminder.label}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  mono = false,
  className = "",
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="flex items-center gap-1.5 text-caption text-chrome uppercase tracking-wider">
        <Icon className="size-3" />
        {label}
      </span>
      <span className={`mt-0.5 block text-body-sm text-graphite-50 truncate ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </span>
    </div>
  );
}
