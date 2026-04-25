import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Wrench, ShieldCheck, FileText } from "lucide-react";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/db/orders";
import { prisma } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";
import { addMonths, isAfter } from "date-fns";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MasterOrderPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  // У мастера нет своего ownership на Order, но мы загружаем по userId владельца авто
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      car: true,
      branch: true,
      items: { orderBy: { type: "asc" } },
    },
  });
  if (!order) notFound();

  const role = (session.user as { role?: string }).role;
  // ADMIN видит все, MASTER только свои (по masterName)
  if (role === "MASTER" && order.masterName !== session.user.name) {
    redirect("/master");
  }

  const labor = order.items.filter((i) => i.type === "LABOR");
  const parts = order.items.filter((i) => i.type === "PART");
  const warrantyEnd = addMonths(order.warrantyStartDate, order.warrantyMonths);
  const warrantyValid = isAfter(warrantyEnd, new Date());

  return (
    <div>
      <Link href="/master" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Мои заказы
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-caption text-chrome uppercase tracking-wider">Заказ-наряд</p>
          <h1 className="mt-1 font-display text-h1 text-graphite-50 font-mono tabular-nums">{order.number}</h1>
          <p className="mt-2 text-body-sm text-graphite-200">
            {order.car.brand} {order.car.model} {order.car.year} ·{" "}
            <span className="font-mono tabular-nums">{formatNumber(order.mileageAtService)} км</span>
          </p>
        </div>
        <Badge variant={order.status === "COMPLETED" ? "success" : "warning"}>
          {order.status === "COMPLETED" ? "Готов" : "В работе"}
        </Badge>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-chrome mb-3">Клиент</p>
          <p className="text-body-base text-graphite-50 font-medium">{order.user.name || "—"}</p>
          {order.user.phone && (
            <a href={`tel:${order.user.phone.replace(/[^+\d]/g, "")}`} className="mt-2 inline-flex items-center gap-2 text-body-sm text-graphite-100 hover:text-red-primary font-mono tabular-nums">
              <Phone className="size-3.5" />
              {order.user.phone}
            </a>
          )}
        </CardContent>
      </Card>

      {labor.length > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-3 flex items-center gap-2">
              <Wrench className="size-3.5" />
              Работы
            </p>
            <div className="divide-y divide-graphite-500/30">
              {labor.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-body-sm">
                  <div>
                    <p className="text-graphite-50">{item.title}</p>
                    {item.description && <p className="text-caption text-graphite-300 mt-0.5">{item.description}</p>}
                  </div>
                  <p className="font-mono tabular-nums text-graphite-100 shrink-0">
                    ×{item.quantity} · {formatPrice(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {parts.length > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-3">Запчасти</p>
            <div className="divide-y divide-graphite-500/30">
              {parts.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-body-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-graphite-50">{item.title}</p>
                      {item.partOrigin === "ORIGINAL" && <Badge variant="accent" className="text-[9px]">Оригинал</Badge>}
                      {item.partOrigin === "ANALOG" && <Badge variant="chrome" className="text-[9px]">Аналог</Badge>}
                    </div>
                    {item.partNumber && <p className="text-caption text-graphite-300 mt-0.5 font-mono tabular-nums">{item.partNumber}</p>}
                  </div>
                  <p className="font-mono tabular-nums text-graphite-100 shrink-0">
                    ×{item.quantity} · {formatPrice(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-chrome mb-3">Сумма</p>
          <p className="font-display text-h2 text-graphite-50 font-mono tabular-nums">{formatPrice(order.totalAmount)}</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-caption">
            <SmallStat label="Работа" value={formatPrice(order.laborAmount)} />
            <SmallStat label="Запчасти" value={formatPrice(order.partsAmount)} />
            {order.discountAmount > 0 && <SmallStat label="Скидка" value={`−${formatPrice(order.discountAmount)}`} />}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className={`size-5 ${warrantyValid ? "text-success" : "text-graphite-400"}`} />
            <div>
              <p className="text-body-sm text-graphite-50">
                Гарантия {warrantyValid ? "действует" : "истекла"}
              </p>
              <p className="text-caption text-graphite-300 mt-0.5">
                {order.warrantyMonths} мес · {formatNumber(order.warrantyKm)} км · до {formatDate(warrantyEnd)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-graphite-300">{label}</p>
      <p className="font-mono tabular-nums text-graphite-100 mt-0.5">{value}</p>
    </div>
  );
}
