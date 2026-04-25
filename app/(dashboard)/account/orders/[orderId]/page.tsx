import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ShieldCheck, Star, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/db/orders";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";
import { addMonths, isAfter } from "date-fns";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const STATUS_LABELS = {
  IN_PROGRESS: "В работе",
  COMPLETED: "Готов",
  WARRANTY_CASE: "Гарантийный случай",
  CANCELLED: "Отменён",
} as const;

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const session = await auth();
  const order = await getOrderById(orderId, session!.user.id);

  if (!order) notFound();

  const labor = order.items.filter((i) => i.type === "LABOR");
  const parts = order.items.filter((i) => i.type === "PART");
  const warrantyEnd = addMonths(order.warrantyStartDate, order.warrantyMonths);
  const warrantyValid = isAfter(warrantyEnd, new Date());

  return (
    <Container className="py-6 lg:py-10">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4"
      >
        <ArrowLeft className="size-3.5" />
        Все заказы
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-graphite-500/40 bg-graphite-800 p-6 lg:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <p className="text-caption text-chrome uppercase tracking-wider">Заказ-наряд</p>
            <h1 className="mt-2 font-display text-h1 text-graphite-50 font-mono tabular-nums">
              {order.number}
            </h1>
            <p className="mt-2 text-body-base text-graphite-200">
              {order.car.brand} {order.car.model} {order.car.year} ·{" "}
              <span className="font-mono tabular-nums">{formatNumber(order.mileageAtService)} км</span>
            </p>
            <p className="mt-1 text-caption text-graphite-300">
              {order.branch.name} · мастер: {order.masterName || "—"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <Badge
              variant={
                order.status === "COMPLETED" ? "success" : order.status === "IN_PROGRESS" ? "warning" : "error"
              }
              className="mb-3"
            >
              {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]}
            </Badge>
            <p className="font-display text-h2 text-graphite-50 font-mono tabular-nums">
              {formatPrice(order.totalAmount)}
            </p>
            <p className="text-caption text-chrome">
              {formatDate(order.startedAt)}
              {order.completedAt && ` → ${formatDate(order.completedAt)}`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={`/api/orders/${order.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <Download className="size-4" />
              Скачать PDF
            </a>
          </Button>
          {order.status === "COMPLETED" && (
            <Button variant="outline" asChild>
              <Link href={`/booking?service=${order.items[0]?.serviceId || ""}`}>
                Повторить заказ
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Labor */}
      {labor.length > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-4">Работы</p>
            <div className="divide-y divide-graphite-500/30">
              {labor.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-body-sm text-graphite-50 font-medium">{item.title}</p>
                    {item.description && (
                      <p className="mt-0.5 text-caption text-graphite-300">{item.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-caption text-chrome">×{item.quantity}</p>
                    <p className="font-mono tabular-nums text-body-sm text-graphite-100 font-semibold">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-graphite-500/30 flex items-center justify-between">
              <span className="text-body-sm text-graphite-300">Итого работа</span>
              <span className="font-mono tabular-nums text-body-base text-graphite-50 font-semibold">
                {formatPrice(order.laborAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parts */}
      {parts.length > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-4">Запчасти</p>
            <div className="divide-y divide-graphite-500/30">
              {parts.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-body-sm text-graphite-50 font-medium">{item.title}</p>
                      {item.partOrigin === "ORIGINAL" && <Badge variant="accent" className="text-[9px]">Оригинал</Badge>}
                      {item.partOrigin === "ANALOG" && <Badge variant="chrome" className="text-[9px]">Аналог</Badge>}
                    </div>
                    {item.partNumber && (
                      <p className="text-caption text-graphite-300 font-mono tabular-nums">{item.partNumber}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-caption text-chrome">×{item.quantity}</p>
                    <p className="font-mono tabular-nums text-body-sm text-graphite-100 font-semibold">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-graphite-500/30 flex items-center justify-between">
              <span className="text-body-sm text-graphite-300">Итого запчасти</span>
              <span className="font-mono tabular-nums text-body-base text-graphite-50 font-semibold">
                {formatPrice(order.partsAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warranty */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div
              className={`size-10 shrink-0 rounded-md grid place-items-center ${
                warrantyValid ? "bg-success/10 text-success" : "bg-graphite-700 text-graphite-300"
              }`}
            >
              <ShieldCheck className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display text-h6 text-graphite-50">
                Гарантия {warrantyValid ? "действует" : "истекла"}
              </p>
              <p className="mt-1 text-body-sm text-graphite-200">
                {order.warrantyMonths} мес ·{" "}
                <span className="font-mono tabular-nums">
                  {formatNumber(order.warrantyKm)} км
                </span>{" "}
                с {formatDate(order.warrantyStartDate)}
                <br />
                Действует до{" "}
                <span className={`font-mono tabular-nums ${warrantyValid ? "text-success" : "text-error"}`}>
                  {formatDate(warrantyEnd)}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bonus */}
      {order.bonusTransaction.length > 0 && order.bonusTransaction[0].amount > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-success" />
              <p className="text-body-base text-graphite-100">
                Начислено{" "}
                <span className="font-mono tabular-nums text-success font-semibold">
                  {formatPrice(order.bonusTransaction[0].amount)}
                </span>{" "}
                бонусов за этот заказ
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review */}
      {order.status === "COMPLETED" && !order.rating && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="size-8 text-warning mx-auto mb-3" />
            <p className="font-display text-h5 text-graphite-50">Как прошёл визит?</p>
            <p className="mt-2 text-body-sm text-graphite-200">
              Оставьте оценку — это поможет нам становиться лучше.
            </p>
            <Button className="mt-4" disabled>
              Оставить отзыв (на этапе 5)
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
