import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { auth } from "@/auth";
import { getOrdersForMaster } from "@/lib/db/orders";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils/format";

export const metadata = { title: "Master · Мои заказы" };

export default async function MasterDashboardPage() {
  const session = await auth();
  const masterName = session!.user.name ?? "";
  const orders = masterName ? await getOrdersForMaster(masterName) : [];

  const inProgress = orders.filter((o) => o.status === "IN_PROGRESS");
  const completedRecent = orders.filter((o) => o.status === "COMPLETED").slice(0, 10);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-h1 text-graphite-50">Мои заказы</h1>
        <p className="mt-2 text-body-base text-graphite-200">
          Заказы, где мастер — <span className="text-graphite-50 font-medium">{masterName || "не определён"}</span>
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Wrench className="size-10 text-graphite-400 mx-auto mb-3" />
            <p className="text-body-base text-graphite-200">
              Заказов нет. Имя мастера в Order должно совпадать с именем в вашем профиле.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section className="mb-6">
              <h2 className="text-caption uppercase tracking-wider text-warning mb-3">
                В работе ({inProgress.length})
              </h2>
              <div className="space-y-3">
                {inProgress.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            </section>
          )}

          {completedRecent.length > 0 && (
            <section>
              <h2 className="text-caption uppercase tracking-wider text-chrome mb-3">
                Недавно завершённые
              </h2>
              <div className="space-y-2">
                {completedRecent.map((o) => (
                  <OrderCard key={o.id} order={o} compact />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function OrderCard({ order, compact = false }: { order: Awaited<ReturnType<typeof getOrdersForMaster>>[number]; compact?: boolean }) {
  return (
    <Card>
      <Link
        href={`/master/orders/${order.id}`}
        className={`block ${compact ? "p-4" : "p-5"} hover:bg-graphite-700 transition-colors group`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono tabular-nums text-body-sm text-graphite-50 font-semibold group-hover:text-red-primary transition-colors">
              {order.number}
            </p>
            <p className="text-caption text-graphite-300 mt-0.5">
              {order.car.brand} {order.car.model} {order.car.year} · {order.user?.name || order.user?.phone}
            </p>
            {!compact && (
              <p className="mt-2 text-body-sm text-graphite-100 line-clamp-2">
                {order.items.map((i) => i.title).join(", ")}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <Badge variant={order.status === "IN_PROGRESS" ? "warning" : "success"} className="text-[10px]">
              {order.status === "IN_PROGRESS" ? "В работе" : "Готов"}
            </Badge>
            <p className="mt-2 font-mono tabular-nums text-body-sm text-graphite-100 font-semibold">
              {formatPrice(order.totalAmount)}
            </p>
            <p className="text-caption text-graphite-300 mt-0.5">{formatDate(order.startedAt)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end text-caption text-graphite-300 group-hover:text-red-primary">
          Открыть
          <ArrowRight className="size-3 ml-1 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </Card>
  );
}
