import Link from "next/link";
import { Bell, ArrowRight, Calendar as CalendarIcon, Settings } from "lucide-react";
import { auth } from "@/auth";
import { getMyReminders } from "@/lib/db/maintenance";
import { formatTimeUntilDue } from "@/lib/maintenance/engine";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReminderCard } from "@/components/dashboard/ReminderCard";

export const metadata = { title: "ТО-напоминания" };

export default async function MaintenancePage() {
  const session = await auth();
  const userId = session!.user.id;

  const reminders = await getMyReminders(userId);

  const buckets = {
    overdue: reminders.filter((r) => r.status === "OVERDUE"),
    due: reminders.filter((r) => r.status === "DUE"),
    upcoming: reminders.filter((r) => r.status === "UPCOMING"),
    pending: reminders.filter((r) => r.status === "PENDING"),
    snoozed: reminders.filter((r) => r.status === "SNOOZED"),
  };

  const urgentCount = buckets.overdue.length + buckets.due.length;

  if (reminders.length === 0) {
    return (
      <Container className="py-6 lg:py-10">
        <div className="mb-6">
          <h1 className="font-display text-h1 text-graphite-50">Напоминания о ТО</h1>
        </div>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Bell className="size-12 text-graphite-400 mx-auto mb-4" />
            <h2 className="font-display text-h3 text-graphite-50">Напоминаний пока нет</h2>
            <p className="mt-2 text-body-base text-graphite-200 max-w-md mx-auto">
              Добавьте автомобиль — на основе нормативов марки создадим график плановых работ.
            </p>
            <Button asChild className="mt-6">
              <Link href="/account/cars">
                Добавить авто
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-6 lg:py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-h1 text-graphite-50">Напоминания о ТО</h1>
          <p className="mt-2 text-body-base text-graphite-200">
            {urgentCount > 0 ? (
              <>
                <span className="text-warning font-semibold">{urgentCount}</span> требуют внимания · всего активных:{" "}
                {reminders.length}
              </>
            ) : (
              `${reminders.length} в плане`
            )}
          </p>
        </div>
        <Button asChild variant="outline" size="default">
          <Link href="/account/settings">
            <Settings className="size-4" />
            Каналы
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={urgentCount > 0 ? "urgent" : "all"}>
        <TabsList>
          <TabsTrigger value="urgent">
            Срочно
            {urgentCount > 0 && (
              <Badge variant="error" className="text-[9px] ml-2">
                {urgentCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">
            Все ({reminders.length})
          </TabsTrigger>
          <TabsTrigger value="snoozed">
            Отложенные ({buckets.snoozed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urgent">
          {urgentCount === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-body-base text-graphite-200">
                  Срочных напоминаний нет. Все ваши авто в порядке.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {[...buckets.overdue, ...buckets.due].map((r) => {
                const f = formatTimeUntilDue({
                  dueAt: r.dueAt,
                  dueAtMileage: r.dueAtMileage,
                  currentMileage: r.car.mileage,
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
                      car: r.car,
                      rule: { description: r.rule.description, estimatedPrice: r.rule.estimatedPrice ?? 0 },
                    }}
                    primary={f.primary}
                    secondary={f.secondary}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-6">
            {(["overdue", "due", "upcoming", "pending"] as const).map((bucketKey) => {
              const items = buckets[bucketKey];
              if (items.length === 0) return null;
              const labels = {
                overdue: "Просроченные",
                due: "Срочные (≤14 дней)",
                upcoming: "Скоро (≤60 дней)",
                pending: "В плане",
              };
              return (
                <div key={bucketKey}>
                  <h3 className="text-caption uppercase tracking-wider text-chrome mb-3">
                    {labels[bucketKey]}
                  </h3>
                  <div className="space-y-3">
                    {items.map((r) => {
                      const f = formatTimeUntilDue({
                        dueAt: r.dueAt,
                        dueAtMileage: r.dueAtMileage,
                        currentMileage: r.car.mileage,
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
                            car: r.car,
                            rule: { description: r.rule.description, estimatedPrice: r.rule.estimatedPrice ?? 0 },
                          }}
                          primary={f.primary}
                          secondary={f.secondary}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="snoozed">
          {buckets.snoozed.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-body-base text-graphite-200">Отложенных напоминаний нет.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {buckets.snoozed.map((r) => {
                const f = formatTimeUntilDue({
                  dueAt: r.dueAt,
                  dueAtMileage: r.dueAtMileage,
                  currentMileage: r.car.mileage,
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
                      car: r.car,
                      rule: { description: r.rule.description, estimatedPrice: r.rule.estimatedPrice ?? 0 },
                    }}
                    primary={f.primary}
                    secondary={f.secondary}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Container>
  );
}
