import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { OrderStatus, CarBrand } from "@prisma/client";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: "warning" | "success" | "error" | "chrome" }
> = {
  IN_PROGRESS: { label: "В работе", variant: "warning" },
  COMPLETED: { label: "Готов", variant: "success" },
  WARRANTY_CASE: { label: "Гарантия", variant: "warning" },
  CANCELLED: { label: "Отменён", variant: "error" },
};

const BRAND_LABELS: Record<CarBrand, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "VW",
  OTHER: "Другая",
};

interface Props {
  order: {
    id: string;
    number: string;
    startedAt: Date;
    completedAt: Date | null;
    status: OrderStatus;
    totalAmount: number;
    car: { brand: CarBrand; model: string; year: number };
    branch: { name: string };
    items: Array<{ title: string }>;
  };
}

export function OrderRow({ order }: Props) {
  const statusCfg = STATUS_CONFIG[order.status];
  const date = order.completedAt ?? order.startedAt;

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-lg border border-graphite-500/30 bg-graphite-800 hover:border-chrome/30 hover:bg-graphite-700 transition-all duration-base group"
    >
      <div className="p-5 grid sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-3">
          <p className="text-caption text-chrome uppercase tracking-wider">Дата</p>
          <p className="mt-1 text-body-sm text-graphite-50 font-medium">{formatDate(date)}</p>
          <p className="text-caption text-graphite-300 font-mono tabular-nums mt-0.5">
            {order.number}
          </p>
        </div>

        <div className="sm:col-span-3">
          <p className="text-caption text-chrome uppercase tracking-wider">Авто</p>
          <p className="mt-1 text-body-sm text-graphite-50 truncate">
            {BRAND_LABELS[order.car.brand]} {order.car.model}
          </p>
          <p className="text-caption text-graphite-300 font-mono tabular-nums">{order.car.year}</p>
        </div>

        <div className="sm:col-span-3">
          <p className="text-caption text-chrome uppercase tracking-wider">Услуги</p>
          <p className="mt-1 text-body-sm text-graphite-100 line-clamp-2">
            {order.items.map((i) => i.title).join(", ") || "—"}
          </p>
        </div>

        <div className="sm:col-span-2 sm:text-right">
          <p className="text-caption text-chrome uppercase tracking-wider">Сумма</p>
          <p className="mt-1 font-mono tabular-nums text-body-base text-graphite-50 font-semibold">
            {formatPrice(order.totalAmount)}
          </p>
        </div>

        <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2">
          <Badge variant={statusCfg.variant} className="text-[10px]">
            {statusCfg.label}
          </Badge>
          <ArrowUpRight className="size-4 text-graphite-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}
