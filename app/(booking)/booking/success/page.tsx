import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, MapPin, Wrench, Home, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db/client";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { SuccessAnimation } from "@/components/booking/SuccessAnimation";

export const metadata = { title: "Запись подтверждена" };

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  if (!id) redirect("/");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: { select: { title: true, durationMinutes: true } },
      branch: { select: { name: true, address: true, phone: true } },
    },
  });

  if (!booking) redirect("/");

  const session = await auth();
  const dateStr = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(booking.scheduledAt);

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="text-center">
        <SuccessAnimation />
        <h1 className="mt-6 font-display text-h1 text-graphite-50 text-balance">
          Записаны на {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(booking.scheduledAt)}
        </h1>
        <p className="mt-3 text-body-lg text-graphite-200">
          Ждём вас в назначенное время. Если что-то изменится — напишите или позвоните.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-graphite-500/30 bg-graphite-800 divide-y divide-graphite-500/30">
        <DetailRow icon={Wrench} label="Услуга" value={booking.service.title} extra={`~${Math.round(booking.service.durationMinutes / 60 * 10) / 10} ч`} />
        <DetailRow icon={Calendar} label="Дата и время" value={dateStr} />
        <DetailRow icon={MapPin} label="Филиал" value={booking.branch.name} extra={booking.branch.address} />
      </div>

      <div className="mt-6 rounded-lg bg-graphite-900 border border-graphite-500/30 px-5 py-4 text-center">
        <p className="text-caption uppercase tracking-wider text-chrome">Номер записи</p>
        <p className="mt-1 font-mono tabular-nums text-h5 text-graphite-50">
          {booking.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        {session?.user ? (
          <Button asChild size="lg" className="w-full">
            <Link href="/account">
              В личный кабинет
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        ) : booking.guestEmail ? (
          <Button asChild size="lg" className="w-full">
            <Link href={`/login?email=${encodeURIComponent(booking.guestEmail)}`}>
              Активировать кабинет
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href="/login">
              Создать кабинет
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        )}
        <Button asChild size="lg" variant="outline" className="w-full">
          <Link href="/">
            <Home className="size-5" />
            На главную
          </Link>
        </Button>
      </div>

      {!session?.user && booking.guestEmail && (
        <p className="mt-6 text-center text-caption text-graphite-300 max-w-md mx-auto">
          Мы отправили письмо на <span className="text-graphite-100">{booking.guestEmail}</span>.
          Откройте ссылку, чтобы активировать кабинет — там будут все ваши заказы и напоминания о ТО.
        </p>
      )}
    </main>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  extra,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  extra?: string | null;
}) {
  return (
    <div className="px-5 py-4 flex items-start gap-4">
      <div className="size-10 shrink-0 rounded-md bg-graphite-700 grid place-items-center">
        <Icon className="size-5 text-chrome" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-caption uppercase tracking-wider text-chrome">{label}</p>
        <p className="mt-1 text-body-base text-graphite-50 font-medium capitalize">{value}</p>
        {extra && <p className="text-body-sm text-graphite-200 mt-0.5">{extra}</p>}
      </div>
    </div>
  );
}
