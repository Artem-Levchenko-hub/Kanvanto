import Link from "next/link";
import {
  Car as CarIcon,
  Gauge,
  Bell,
  Sparkles,
  Wrench,
  ArrowRight,
  CalendarPlus,
  Phone,
  Plus,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { getCarsForUser } from "@/lib/db/cars";
import { getNextReminderForUser } from "@/lib/db/maintenance";
import { getActiveOrdersForUser } from "@/lib/db/orders";
import { getBonusOverview } from "@/lib/db/bonuses";
import { formatTimeUntilDue } from "@/lib/maintenance/engine";
import { MAINTENANCE_TYPE_LABELS } from "@/lib/maintenance/rules";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { formatNumber, formatPrice, pluralRu } from "@/lib/utils/format";

export const metadata = { title: "Личный кабинет" };

export default async function AccountHomePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, cars, nextReminder, activeOrders, bonus] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, phone: true } }),
    getCarsForUser(userId),
    getNextReminderForUser(userId),
    getActiveOrdersForUser(userId),
    getBonusOverview(userId),
  ]);

  const primaryCar = cars[0] || null;
  const greetingName = user?.name?.split(" ")[0] || "Уважаемый клиент";

  const reminderTime = nextReminder
    ? formatTimeUntilDue({
        dueAt: nextReminder.dueAt,
        dueAtMileage: nextReminder.dueAtMileage,
        currentMileage: nextReminder.car.mileage,
        avgKmPerMonth: 1500,
      })
    : null;

  return (
    <Container className="py-6 lg:py-10">
      {/* Greeting + primary car */}
      <section className="rounded-xl border border-graphite-500/40 bg-gradient-to-br from-graphite-800 via-graphite-800 to-graphite-900 p-6 lg:p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-64 bg-red-glow blur-3xl opacity-40 pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <p className="text-caption uppercase tracking-wider text-chrome">С возвращением</p>
            <h1 className="mt-2 font-display text-h1 text-graphite-50 leading-tight">{greetingName}</h1>
            {primaryCar && reminderTime ? (
              <p className="mt-3 text-body-lg text-graphite-200 max-w-xl">
                Ваш <span className="text-graphite-50 font-medium">{primaryCar.brand} {primaryCar.model} {primaryCar.year}</span>{" "}
                — следующее ТО{" "}
                <span className={reminderTime.isOverdue ? "text-error" : "text-warning"}>
                  {reminderTime.primary}
                </span>
                .
              </p>
            ) : !primaryCar ? (
              <p className="mt-3 text-body-lg text-graphite-200">
                Добавьте свой автомобиль — настроим напоминания о ТО, сохраним историю работ и предложим персональные скидки.
              </p>
            ) : (
              <p className="mt-3 text-body-lg text-graphite-200">
                Все системы вашего {primaryCar.brand} {primaryCar.model} в порядке. Так держать.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <Button asChild size="lg">
              <Link href="/booking">
                <CalendarPlus className="size-4" />
                Записаться
              </Link>
            </Button>
            {!primaryCar && (
              <Button asChild size="lg" variant="outline">
                <Link href="/account/cars">
                  <Plus className="size-4" />
                  Добавить авто
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <MetricCard
          icon={Gauge}
          label="Пробег"
          value={primaryCar ? `${formatNumber(primaryCar.mileage)} км` : "—"}
          description={
            primaryCar
              ? `обновлён ${primaryCar.mileageUpdatedAt.toLocaleDateString("ru-RU")}`
              : "добавьте авто"
          }
          href={primaryCar ? `/account/cars/${primaryCar.id}` : "/account/cars"}
        />
        <MetricCard
          icon={Bell}
          label="До ТО"
          value={reminderTime ? reminderTime.primary : "—"}
          description={nextReminder ? MAINTENANCE_TYPE_LABELS[nextReminder.type] : "напоминаний нет"}
          tone={
            reminderTime?.isOverdue
              ? "error"
              : nextReminder?.status === "DUE"
                ? "warning"
                : "default"
          }
          href="/account/maintenance"
        />
        <MetricCard
          icon={Sparkles}
          label="Бонусы"
          value={bonus.balance > 0 ? `${formatNumber(bonus.balance)} ₽` : "0"}
          description={`уровень ${bonus.levelLabel}${bonus.discount > 0 ? ` · −${bonus.discount}%` : ""}`}
          tone={bonus.balance > 0 ? "success" : "default"}
          href="/account/bonuses"
        />
        <MetricCard
          icon={Wrench}
          label="В работе"
          value={activeOrders.length === 0 ? "0" : `${activeOrders.length}`}
          description={
            activeOrders.length === 0
              ? "нет активных заказов"
              : pluralRu(activeOrders.length, ["заказ", "заказа", "заказов"])
          }
          href="/account/orders"
        />
      </section>

      {/* Reminder alert */}
      {nextReminder && reminderTime && (
        <section className="mb-8">
          <div
            className={`rounded-xl border p-6 lg:p-8 ${
              reminderTime.isOverdue
                ? "border-error/40 bg-error/5"
                : nextReminder.status === "DUE"
                  ? "border-warning/40 bg-warning/5"
                  : "border-graphite-500/30 bg-graphite-800"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={`size-12 shrink-0 rounded-md grid place-items-center ${
                    reminderTime.isOverdue ? "bg-error/15 text-error" : "bg-warning/15 text-warning"
                  }`}
                >
                  <Bell className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-caption uppercase tracking-wider text-chrome">
                    {reminderTime.isOverdue ? "Просрочено" : "Скоро ТО"}
                  </p>
                  <h2 className="mt-1 font-display text-h3 text-graphite-50">
                    {MAINTENANCE_TYPE_LABELS[nextReminder.type]}
                  </h2>
                  <p className="mt-1 text-body-sm text-graphite-200">
                    {nextReminder.car.brand} {nextReminder.car.model} ·{" "}
                    <span className="text-graphite-100 font-mono tabular-nums">
                      {formatNumber(nextReminder.car.mileage)} км
                    </span>{" "}
                    · ориентир.{" "}
                    <span className="font-mono tabular-nums text-graphite-100">
                      {formatPrice(nextReminder.rule.estimatedPrice ?? 0)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`font-display text-h2 leading-none font-semibold ${
                    reminderTime.isOverdue ? "text-error" : "text-warning"
                  }`}
                >
                  {reminderTime.primary}
                </p>
                {reminderTime.secondary && (
                  <p className="text-caption text-graphite-300 mt-1">{reminderTime.secondary}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Button asChild size="default">
                <Link href={`/booking?service=to-reglamentnoe`}>
                  Записаться сейчас
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="default" variant="ghost">
                <Link href="/account/maintenance">Все напоминания</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-h3 text-graphite-50 mb-4">Активные заказы</h2>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-h6 text-graphite-50 truncate">
                        {order.items.map((i) => i.title).join(" + ") || order.number}
                      </p>
                      <p className="text-caption text-chrome mt-1">
                        {order.car.brand} {order.car.model} · {order.branch.name} ·{" "}
                        <span className="font-mono tabular-nums">{order.number}</span>
                      </p>
                    </div>
                    <Badge variant="warning" className="shrink-0">В работе</Badge>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/account/orders/${order.id}`}>
                        Смотреть детали
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section>
        <h2 className="font-display text-h3 text-graphite-50 mb-4">Быстрые действия</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <QuickActionCard
            icon={CalendarPlus}
            title="Записаться"
            description="Онлайн-запись за 90 секунд"
            href="/booking"
          />
          <QuickActionCard
            icon={CarIcon}
            title="Добавить авто"
            description="VIN-декодер, нормативы ТО"
            href="/account/cars"
          />
          <QuickActionCard
            icon={Phone}
            title="Связаться"
            description="Позвонить на +7 (905) 405-11-11"
            href="tel:+79054051111"
            external
          />
        </div>
      </section>
    </Container>
  );
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  external = false,
}: {
  icon: typeof CarIcon;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const className =
    "flex items-start gap-3 p-5 rounded-lg border border-graphite-500/30 bg-graphite-800 hover:bg-graphite-700 hover:border-chrome/30 transition-all duration-base group";
  const inner = (
    <>
      <div className="size-10 shrink-0 rounded-md bg-graphite-700 grid place-items-center text-chrome group-hover:text-red-primary transition-colors">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-h6 text-graphite-50">{title}</p>
        <p className="mt-1 text-body-sm text-graphite-200">{description}</p>
      </div>
    </>
  );

  return external ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
