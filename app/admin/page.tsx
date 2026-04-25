import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Users, Calendar, TrendingUp } from "lucide-react";
import { startOfDay, addDays, startOfWeek, endOfWeek } from "date-fns";

export const metadata = { title: "Admin · Дашборд" };

export default async function AdminDashboardPage() {
  const todayStart = startOfDay(new Date());
  const tomorrowStart = addDays(todayStart, 1);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const [todayCount, weekCount, totalUsers, pendingCount] = await Promise.all([
    prisma.booking.count({
      where: {
        scheduledAt: { gte: todayStart, lt: tomorrowStart },
        status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS"] },
      },
    }),
    prisma.booking.count({
      where: {
        scheduledAt: { gte: weekStart, lte: weekEnd },
        status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS", "COMPLETED"] },
      },
    }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="max-w-7xl">
      <h1 className="font-display text-h1 text-graphite-50">Дашборд</h1>
      <p className="mt-2 text-body-base text-graphite-200">
        Сводка по записям, клиентам и операционной нагрузке.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Calendar} label="Сегодня" value={todayCount} description="активных записей" />
        <KpiCard icon={ClipboardList} label="На этой неделе" value={weekCount} description="всего записей" />
        <KpiCard icon={TrendingUp} label="Ожидают подтверждения" value={pendingCount} description="требуется реакция" tone={pendingCount > 0 ? "warning" : "default"} />
        <KpiCard icon={Users} label="Клиентов" value={totalUsers} description="зарегистрированных" />
      </div>

      <div className="mt-12">
        <h2 className="font-display text-h3 text-graphite-50">Что доступно</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <Link href="/admin/bookings" className="rounded-lg border border-graphite-500/30 bg-graphite-800 p-5 hover:border-red-primary/40 transition-colors group">
            <ClipboardList className="size-6 text-chrome group-hover:text-red-primary transition-colors mb-3" />
            <p className="font-display text-h5 text-graphite-50">Записи</p>
            <p className="text-body-sm text-graphite-200 mt-1">Полный список с фильтрами по филиалу, услуге, дате, статусу.</p>
          </Link>
          <Link href="/" target="_blank" className="rounded-lg border border-graphite-500/30 bg-graphite-800 p-5 hover:border-chrome/30 transition-colors">
            <p className="font-display text-h5 text-graphite-50">Сайт</p>
            <p className="text-body-sm text-graphite-200 mt-1">Открыть публичную часть сайта в новой вкладке.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "default",
}: {
  icon: typeof Calendar;
  label: string;
  value: number;
  description: string;
  tone?: "default" | "warning";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-caption uppercase tracking-wider text-chrome">{label}</p>
          <Icon className={`size-5 ${tone === "warning" ? "text-warning" : "text-chrome"}`} />
        </div>
        <p className={`font-display text-h1 leading-none font-semibold ${tone === "warning" ? "text-warning" : "text-graphite-50"}`}>
          {value.toLocaleString("ru-RU")}
        </p>
        <p className="mt-2 text-body-sm text-graphite-300">{description}</p>
      </CardContent>
    </Card>
  );
}
