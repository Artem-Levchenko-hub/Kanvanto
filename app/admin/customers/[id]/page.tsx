import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Send } from "lucide-react";
import { getUserDetailForAdmin } from "@/lib/db/users";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRoleSelector } from "@/components/admin/UserRoleSelector";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getUserDetailForAdmin(id);
  if (!user) notFound();

  return (
    <div className="max-w-7xl">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Клиенты
      </Link>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h1 className="font-display text-h2 text-graphite-50">{user.name || "Без имени"}</h1>
              <p className="mt-1 text-caption text-graphite-300 font-mono tabular-nums">
                ID: {user.id.slice(0, 8)}
              </p>
              <div className="mt-4 space-y-2 text-body-sm">
                <p className="flex items-center gap-2 text-graphite-100">
                  <Phone className="size-4 text-chrome" />
                  <a href={`tel:${user.phone.replace(/[^+\d]/g, "")}`} className="font-mono tabular-nums hover:text-red-primary">
                    {user.phone}
                  </a>
                </p>
                {user.email && (
                  <p className="flex items-center gap-2 text-graphite-100">
                    <Mail className="size-4 text-chrome" />
                    <a href={`mailto:${user.email}`} className="hover:text-red-primary">{user.email}</a>
                  </p>
                )}
                {user.telegramId && (
                  <p className="flex items-center gap-2 text-graphite-100">
                    <Send className="size-4 text-chrome" />
                    <span className="font-mono tabular-nums">@{user.telegramId}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-graphite-500/30">
                <p className="text-caption uppercase tracking-wider text-chrome">Регистрация</p>
                <p className="text-body-sm text-graphite-100 mt-1">{formatDate(user.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-caption uppercase tracking-wider text-chrome mb-2">Бонусная программа</p>
              <p className="font-display text-h2 text-graphite-50">{formatPrice(user.bonusBalance)}</p>
              <Badge variant="chrome" className="mt-2">{user.bonusLevel}</Badge>
              <p className="mt-3 text-caption text-graphite-300">
                Оборот: <span className="font-mono tabular-nums text-graphite-100">{formatPrice(user.totalSpent)}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-caption uppercase tracking-wider text-chrome mb-3">Роль</p>
              <UserRoleSelector userId={user.id} currentRole={user.role} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiSmall label="Авто" value={user._count.cars} />
            <KpiSmall label="Заказов" value={user._count.orders} />
            <KpiSmall label="Записей" value={user._count.bookings} />
          </div>

          {user.cars.length > 0 && (
            <Card>
              <CardContent className="pt-5">
                <p className="text-caption uppercase tracking-wider text-chrome mb-3">Автомобили</p>
                <div className="space-y-2">
                  {user.cars.map((car) => (
                    <div key={car.id} className="flex items-center justify-between text-body-sm">
                      <div>
                        <p className="text-graphite-50 font-medium">{car.brand} {car.model} {car.year}</p>
                        {car.licensePlate && <p className="text-caption text-graphite-300 font-mono tabular-nums">{car.licensePlate}</p>}
                      </div>
                      <p className="text-graphite-200 font-mono tabular-nums">{formatNumber(car.mileage)} км</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {user.orders.length > 0 && (
            <Card>
              <CardContent className="pt-5">
                <p className="text-caption uppercase tracking-wider text-chrome mb-3">Последние заказы</p>
                <div className="divide-y divide-graphite-500/30">
                  {user.orders.map((o) => (
                    <Link
                      key={o.id}
                      href={`/account/orders/${o.id}`}
                      className="py-2 flex items-center justify-between text-body-sm hover:text-red-primary transition-colors group"
                    >
                      <div>
                        <p className="font-mono tabular-nums text-graphite-50 group-hover:text-red-primary">{o.number}</p>
                        <p className="text-caption text-graphite-300">
                          {o.car.brand} {o.car.model} · {o.branch.name} · {formatDate(o.startedAt)}
                        </p>
                      </div>
                      <p className="font-mono tabular-nums text-graphite-100">{formatPrice(o.totalAmount)}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiSmall({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-graphite-500/30 bg-graphite-800 px-4 py-3">
      <p className="text-caption uppercase tracking-wider text-chrome">{label}</p>
      <p className="mt-1 font-mono tabular-nums text-h4 text-graphite-50 font-semibold">{value}</p>
    </div>
  );
}
