import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Gauge, Calendar, Hash, Palette, Cog, Fuel, GitBranch, Bell, ClipboardList,
} from "lucide-react";
import { auth } from "@/auth";
import { getCarWithRemindersAndOrders } from "@/lib/db/cars";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReminderCard } from "@/components/dashboard/ReminderCard";
import { UpdateMileageDialog } from "@/components/dashboard/UpdateMileageDialog";
import { formatTimeUntilDue } from "@/lib/maintenance/engine";
import { formatDate, formatNumber, maskVin } from "@/lib/utils/format";
import type { CarBrand, FuelType, Transmission } from "@prisma/client";

const BRAND_LABELS: Record<CarBrand, string> = {
  BMW: "BMW", MERCEDES: "Mercedes-Benz", AUDI: "Audi", PORSCHE: "Porsche",
  SKODA: "Škoda", VW: "Volkswagen", OTHER: "Другая",
};

const FUEL_LABELS: Record<FuelType, string> = {
  GASOLINE: "Бензин",
  DIESEL: "Дизель",
  HYBRID: "Гибрид",
  ELECTRIC: "Электро",
};

const TRANSMISSION_LABELS: Record<Transmission, string> = {
  MANUAL: "МКПП",
  AUTOMATIC: "АКПП",
  DSG: "DSG",
  CVT: "Вариатор",
};

interface PageProps {
  params: Promise<{ carId: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { carId } = await params;
  const session = await auth();
  const car = await getCarWithRemindersAndOrders(carId, session!.user.id);

  if (!car) notFound();

  const remindersBySeverity = {
    overdue: car.reminders.filter((r) => r.status === "OVERDUE"),
    due: car.reminders.filter((r) => r.status === "DUE"),
    upcoming: car.reminders.filter((r) => r.status === "UPCOMING"),
    pending: car.reminders.filter((r) => r.status === "PENDING"),
  };

  return (
    <Container className="py-6 lg:py-10">
      <Link
        href="/account/cars"
        className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4"
      >
        <ArrowLeft className="size-3.5" />
        Все мои авто
      </Link>

      {/* Hero */}
      <div className="rounded-xl border border-graphite-500/40 bg-gradient-to-br from-graphite-800 to-graphite-900 p-6 lg:p-10 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 bg-red-glow blur-3xl opacity-30 pointer-events-none" />
        <div className="relative grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <p className="text-caption uppercase tracking-wider text-chrome">Автомобиль</p>
            <h1 className="mt-2 font-display text-display-xl text-graphite-50 leading-[0.95]">
              {BRAND_LABELS[car.brand]}
            </h1>
            <p className="mt-2 font-display text-h2 text-graphite-100">
              {car.model} <span className="text-chrome font-mono tabular-nums">{car.year}</span>
            </p>
            {car.licensePlate && (
              <Badge variant="chrome" className="mt-4 font-mono tabular-nums">
                {car.licensePlate}
              </Badge>
            )}
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <Stat icon={Gauge} label="Пробег" value={`${formatNumber(car.mileage)} км`} />
            {car.purchaseDate && (
              <Stat icon={Calendar} label="Куплен" value={formatDate(car.purchaseDate)} />
            )}
            {car.engineVolume && (
              <Stat icon={Cog} label="Объём" value={`${car.engineVolume} л`} />
            )}
            {car.fuelType && (
              <Stat icon={Fuel} label="Топливо" value={FUEL_LABELS[car.fuelType]} />
            )}
            {car.transmission && (
              <Stat icon={GitBranch} label="КПП" value={TRANSMISSION_LABELS[car.transmission]} />
            )}
            {car.color && <Stat icon={Palette} label="Цвет" value={car.color} />}
          </div>
        </div>
        {car.vin && (
          <div className="mt-6 pt-6 border-t border-graphite-500/30 flex items-center gap-3">
            <Hash className="size-4 text-chrome" />
            <span className="text-caption uppercase tracking-wider text-chrome">VIN</span>
            <span className="font-mono tabular-nums text-body-sm text-graphite-100">
              {maskVin(car.vin)}
            </span>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <UpdateMileageDialog carId={car.id} currentMileage={car.mileage} />
          <Button asChild variant="outline">
            <Link href={`/booking?car=${car.id}`}>Записать на ТО</Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reminders">
        <TabsList>
          <TabsTrigger value="reminders">
            <Bell className="size-3.5" />
            ТО ({car.reminders.length})
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ClipboardList className="size-3.5" />
            История ({car.orders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reminders">
          {car.reminders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-body-base text-graphite-200">Все системы в порядке. Напоминаний нет.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[
                ...remindersBySeverity.overdue,
                ...remindersBySeverity.due,
                ...remindersBySeverity.upcoming,
                ...remindersBySeverity.pending,
              ]
                .slice(0, 12)
                .map((r) => {
                  const formatted = formatTimeUntilDue({
                    dueAt: r.dueAt,
                    dueAtMileage: r.dueAtMileage,
                    currentMileage: car.mileage,
                    avgKmPerMonth: 1500,
                  });
                  return (
                    <ReminderCard
                      key={r.id}
                      reminder={{
                        id: r.id,
                        type: r.type,
                        status: r.status,
                        dueAt: r.dueAt,
                        dueAtMileage: r.dueAtMileage,
                        car: { brand: car.brand, model: car.model, mileage: car.mileage },
                        rule: { description: r.rule.description, estimatedPrice: r.rule.estimatedPrice ?? 0 },
                      }}
                      primary={formatted.primary}
                      secondary={formatted.secondary}
                    />
                  );
                })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {car.orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-body-base text-graphite-200">
                  Истории работ по этому авто пока нет.
                </p>
                <Button asChild className="mt-4">
                  <Link href={`/booking?car=${car.id}`}>Записаться на первое ТО</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {car.orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-caption text-chrome">{formatDate(order.startedAt)}</p>
                        <p className="font-display text-h6 text-graphite-50 mt-1 font-mono tabular-nums">
                          {order.number}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/account/orders/${order.id}`}>Открыть</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Container>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-graphite-900/60 border border-graphite-500/30 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-chrome font-semibold">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-1 text-body-sm text-graphite-50 font-medium font-mono tabular-nums">{value}</p>
    </div>
  );
}
