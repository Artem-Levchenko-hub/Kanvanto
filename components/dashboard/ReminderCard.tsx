"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Droplet, Droplets, Wind, Filter, GitBranch, Link2 as Link2Icon, Snowflake, DiscAlbum,
  RotateCw, Zap, CircleDot, Crosshair, Wrench, Bell, ArrowRight, MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MAINTENANCE_TYPE_LABELS, MAINTENANCE_TYPE_ICONS } from "@/lib/maintenance/rules";
import { formatPrice } from "@/lib/utils/format";
import { snoozeReminderAction } from "@/app/(dashboard)/account/maintenance/actions";
import type { MaintenanceStatus, MaintenanceType, CarBrand } from "@prisma/client";

const ICONS: Record<string, LucideIcon> = {
  Droplet, Droplets, Wind, Filter, GitBranch, Link: Link2Icon, Snowflake, DiscAlbum,
  RotateCw, Zap, CircleDot, Crosshair, Wrench, Bell,
};

const BRAND_LABELS: Record<CarBrand, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "VW",
  OTHER: "—",
};

interface Props {
  reminder: {
    id: string;
    type: MaintenanceType;
    status: MaintenanceStatus;
    dueAt: Date;
    dueAtMileage: number;
    car: { brand: CarBrand; model: string; mileage: number };
    rule: { description: string; estimatedPrice: number };
  };
  primary: string;
  secondary: string;
}

const STATUS_CONFIG: Record<
  MaintenanceStatus,
  { label: string; variant: "warning" | "error" | "chrome" | "default" | "success" }
> = {
  PENDING: { label: "В плане", variant: "default" },
  UPCOMING: { label: "Скоро", variant: "chrome" },
  DUE: { label: "Срочно", variant: "warning" },
  OVERDUE: { label: "Просрочено", variant: "error" },
  DONE: { label: "Выполнено", variant: "success" },
  SNOOZED: { label: "Отложено", variant: "default" },
};

export function ReminderCard({ reminder, primary, secondary }: Props) {
  const [snoozing, setSnoozing] = React.useState(false);
  const Icon = ICONS[MAINTENANCE_TYPE_ICONS[reminder.type]] ?? Wrench;
  const statusCfg = STATUS_CONFIG[reminder.status];

  const handleSnooze = async (days: number) => {
    setSnoozing(true);
    const res = await snoozeReminderAction(reminder.id, days);
    setSnoozing(false);
    if (res.ok) toast.success(`Отложено на ${days} дн`);
    else toast.error(res.error || "Не удалось отложить");
  };

  const isUrgent = reminder.status === "DUE" || reminder.status === "OVERDUE";

  return (
    <article
      className={`rounded-lg border ${
        reminder.status === "OVERDUE"
          ? "border-error/30 bg-error/5"
          : reminder.status === "DUE"
            ? "border-warning/30 bg-warning/5"
            : "border-graphite-500/30 bg-graphite-800"
      } p-5 transition-colors`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`size-11 shrink-0 rounded-md grid place-items-center ${
            isUrgent ? "bg-warning/15 text-warning" : "bg-graphite-700 text-chrome"
          }`}
        >
          <Icon className="size-5" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-h6 text-graphite-50 truncate">
                {MAINTENANCE_TYPE_LABELS[reminder.type]}
              </h3>
              <p className="text-caption text-chrome mt-0.5">
                {BRAND_LABELS[reminder.car.brand]} {reminder.car.model}
              </p>
            </div>
            <Badge variant={statusCfg.variant} className="text-[10px] shrink-0">
              {statusCfg.label}
            </Badge>
          </div>

          <p className="mt-3 text-body-base font-semibold text-graphite-50">{primary}</p>
          {secondary && <p className="mt-0.5 text-caption text-graphite-300">{secondary}</p>}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-caption text-chrome">
              ~ <span className="font-mono tabular-nums text-graphite-100">{formatPrice(reminder.rule.estimatedPrice)}</span>
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/booking?service=${getServiceSlugForReminderType(reminder.type)}`}>
                Записаться
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" size="icon" variant="outline" disabled={snoozing}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-44 p-1.5">
                <p className="text-caption uppercase tracking-wider text-chrome px-3 py-1.5">
                  Отложить на
                </p>
                {[7, 14, 30, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    disabled={snoozing}
                    onClick={() => handleSnooze(d)}
                    className="w-full text-left px-3 py-2 rounded-md text-body-sm text-graphite-100 hover:bg-graphite-700"
                  >
                    {d} {d === 1 ? "день" : d < 5 ? "дня" : "дней"}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </article>
  );
}

function getServiceSlugForReminderType(type: MaintenanceType): string {
  if (type.startsWith("OIL") || type.startsWith("FILTER") || type.includes("FULL_SERVICE") || type === "COOLANT") {
    return "to-reglamentnoe";
  }
  if (type.startsWith("BRAKE")) return "tormoznaya-sistema";
  if (type === "TIRE_SEASON" || type === "WHEEL_ALIGNMENT") return "shinomontazh";
  if (type === "AC_REFILL") return "kondicioner";
  if (type === "TIMING_BELT" || type === "TIMING_CHAIN") return "remont-dvigatelya";
  return "diagnostika";
}
