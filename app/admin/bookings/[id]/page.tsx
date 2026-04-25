import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone, Mail, Calendar, MapPin, Car as CarIcon, Wrench } from "lucide-react";
import { getBookingById } from "@/lib/db/bookings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingDetailWorkflow } from "@/components/admin/BookingDetailWorkflow";
import { prisma } from "@/lib/db/client";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { BookingStatus } from "@prisma/client";

const STATUS_LABEL: Record<BookingStatus, string> = {
  DRAFT: "Черновик",
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждена",
  ARRIVED: "На приёмке",
  IN_PROGRESS: "В работе",
  COMPLETED: "Готова",
  CANCELLED: "Отменена",
  NO_SHOW: "Не пришёл",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  // Получим связанный Order если есть
  const order = await prisma.order.findUnique({
    where: { bookingId: booking.id },
    select: { id: true, number: true },
  });

  const customerName = booking.user?.name || booking.guestName || "—";
  const customerPhone = booking.user?.phone || booking.guestPhone || "—";
  const customerEmail = booking.user?.email || booking.guestEmail;

  const carDisplay = booking.car
    ? `${booking.car.brand} ${booking.car.model} ${booking.car.year}`
    : booking.guestCarBrand
      ? `${booking.guestCarBrand} ${booking.guestCarModel ?? ""} ${booking.guestCarYear ?? ""}`
      : "—";

  return (
    <div className="max-w-5xl">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Записи
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-caption text-chrome uppercase tracking-wider">Запись</p>
          <h1 className="mt-2 font-display text-h1 text-graphite-50 font-mono tabular-nums">
            {booking.id.slice(0, 8).toUpperCase()}
          </h1>
        </div>
        <Badge variant={booking.status === "COMPLETED" ? "success" : booking.status === "CANCELLED" ? "error" : "warning"} className="mt-3">
          {STATUS_LABEL[booking.status]}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-3">Клиент</p>
            <p className="font-display text-h5 text-graphite-50">{customerName}</p>
            {!booking.userId && <Badge variant="outline" className="mt-2 text-[10px]">Гость</Badge>}
            <div className="mt-3 space-y-1.5 text-body-sm">
              <p className="flex items-center gap-2 text-graphite-100">
                <Phone className="size-4 text-chrome" />
                <span className="font-mono tabular-nums">{customerPhone}</span>
              </p>
              {customerEmail && (
                <p className="flex items-center gap-2 text-graphite-100">
                  <Mail className="size-4 text-chrome" />
                  {customerEmail}
                </p>
              )}
            </div>
            {booking.userId && (
              <Link href={`/admin/customers/${booking.userId}`} className="mt-3 inline-flex items-center gap-1 text-caption text-red-primary hover:underline">
                Открыть карточку клиента
                <ArrowRight className="size-3" />
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-3">Авто</p>
            <p className="font-display text-h5 text-graphite-50 flex items-center gap-2">
              <CarIcon className="size-5 text-chrome" />
              {carDisplay}
            </p>
            {booking.car?.licensePlate && (
              <Badge variant="chrome" className="mt-2 font-mono tabular-nums">{booking.car.licensePlate}</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-3">Услуга</p>
            <p className="font-display text-h5 text-graphite-50 flex items-center gap-2">
              <Wrench className="size-5 text-chrome" />
              {booking.service.title}
            </p>
            <p className="mt-2 text-caption text-graphite-300 font-mono tabular-nums">
              ~{Math.round(booking.durationMinutes / 60 * 10) / 10} ч · от {formatPrice(booking.estimatedPrice ?? booking.service.basePrice)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-3">Время и филиал</p>
            <p className="font-display text-h5 text-graphite-50 flex items-center gap-2">
              <Calendar className="size-5 text-chrome" />
              {new Intl.DateTimeFormat("ru-RU", {
                weekday: "short",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              }).format(booking.scheduledAt)}
            </p>
            <p className="mt-2 text-body-sm text-graphite-100 flex items-center gap-2">
              <MapPin className="size-4 text-chrome" />
              {booking.branch.name}
            </p>
            <p className="text-caption text-graphite-300 mt-1">{booking.branch.address}</p>
          </CardContent>
        </Card>
      </div>

      {booking.notes && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-2">Комментарий клиента</p>
            <p className="text-body-base text-graphite-100">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      {order && (
        <Card className="mb-6">
          <CardContent className="pt-5 flex items-center justify-between">
            <div>
              <p className="text-caption uppercase tracking-wider text-chrome">Связанный заказ-наряд</p>
              <p className="font-display text-h5 text-graphite-50 font-mono tabular-nums mt-1">{order.number}</p>
            </div>
            <Link href={`/account/orders/${order.id}`} className="text-body-sm text-red-primary hover:underline inline-flex items-center gap-1">
              Открыть
              <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-chrome mb-4">Действия</p>
          {!booking.userId && booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
            <div className="rounded-md border border-warning/30 bg-warning/5 p-3 mb-4 text-body-sm text-graphite-200">
              Это гостевая запись (без аккаунта). Чтобы создать заказ-наряд и начислить бонусы — сначала закрепите запись за клиентом из карточки клиента.
            </div>
          )}
          <BookingDetailWorkflow
            bookingId={booking.id}
            currentStatus={booking.status}
            serviceTitle={booking.service.title}
            servicePrice={booking.estimatedPrice ?? booking.service.basePrice}
            carMileage={booking.car?.mileage ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
