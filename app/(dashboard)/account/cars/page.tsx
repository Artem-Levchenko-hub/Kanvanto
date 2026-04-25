import Link from "next/link";
import { Plus, Car as CarIcon } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/dashboard/CarCard";
import { AddCarDialog } from "@/components/dashboard/AddCarDialog";
import { MAINTENANCE_TYPE_LABELS } from "@/lib/maintenance/rules";

export const metadata = { title: "Мои авто" };

export default async function MyCarsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const cars = await prisma.car.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      reminders: {
        where: { status: { in: ["UPCOMING", "DUE", "OVERDUE"] } },
        orderBy: { dueAt: "asc" },
        take: 1,
      },
    },
  });

  return (
    <Container className="py-6 lg:py-10">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-h1 text-graphite-50">Мои авто</h1>
          <p className="mt-2 text-body-base text-graphite-200">
            {cars.length === 0
              ? "Добавьте свой первый автомобиль — настроим напоминания о ТО."
              : `${cars.length} авто под наблюдением`}
          </p>
        </div>
        <AddCarDialog />
      </div>

      {cars.length === 0 ? (
        <div className="rounded-xl border border-graphite-500/30 bg-graphite-800 p-12 lg:p-16 text-center">
          <div className="size-16 mx-auto rounded-md bg-red-primary/15 grid place-items-center mb-6">
            <CarIcon className="size-8 text-red-primary" />
          </div>
          <h2 className="font-display text-h3 text-graphite-50">Пока нет ни одного авто</h2>
          <p className="mt-3 text-body-base text-graphite-200 max-w-md mx-auto">
            Добавьте автомобиль через VIN или вручную — мы создадим персональный календарь ТО на
            основе нормативов производителя и марки.
          </p>
          <div className="mt-8">
            <AddCarDialog
              trigger={
                <Button size="lg">
                  <Plus className="size-5" />
                  Добавить первое авто
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => {
            const next = car.reminders[0];
            return (
              <CarCard
                key={car.id}
                car={car}
                nextReminder={
                  next
                    ? {
                        type: next.type,
                        label: MAINTENANCE_TYPE_LABELS[next.type],
                        dueAt: next.dueAt,
                        status: next.status,
                      }
                    : null
                }
              />
            );
          })}
        </div>
      )}
    </Container>
  );
}
