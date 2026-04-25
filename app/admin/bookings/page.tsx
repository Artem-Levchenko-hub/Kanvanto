import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { listBookingsForAdmin } from "@/lib/db/bookings";
import { prisma } from "@/lib/db/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import { Phone } from "lucide-react";

export const metadata = { title: "Admin · Записи" };

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

const STATUS_VARIANT: Record<BookingStatus, "default" | "accent" | "chrome" | "success" | "warning" | "error" | "outline"> = {
  DRAFT: "outline",
  PENDING: "warning",
  CONFIRMED: "accent",
  ARRIVED: "chrome",
  IN_PROGRESS: "accent",
  COMPLETED: "success",
  CANCELLED: "error",
  NO_SHOW: "error",
};

interface PageProps {
  searchParams: Promise<{ status?: string; branch?: string; q?: string; page?: string }>;
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const statusFilter = params.status?.split(",").filter(Boolean) as BookingStatus[] | undefined;
  const page = Number(params.page) || 1;

  const [{ items, total, pageSize }, branches] = await Promise.all([
    listBookingsForAdmin({
      status: statusFilter,
      branchId: params.branch,
      search: params.q,
      page,
    }),
    prisma.branch.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-h1 text-graphite-50">Записи</h1>
          <p className="mt-2 text-body-base text-graphite-200">
            Всего: <span className="font-mono tabular-nums text-graphite-50">{total}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <form className="grid sm:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="text-caption uppercase tracking-wider text-chrome block mb-1.5">Поиск</label>
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="Имя, телефон..."
            className="h-10 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 text-body-sm text-graphite-50 placeholder:text-graphite-300 focus:outline-none focus:border-red-primary"
          />
        </div>
        <div>
          <label className="text-caption uppercase tracking-wider text-chrome block mb-1.5">Статус</label>
          <select
            name="status"
            defaultValue={params.status || ""}
            className="h-10 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 text-body-sm text-graphite-50 focus:outline-none focus:border-red-primary"
          >
            <option value="">Все статусы</option>
            {(Object.keys(STATUS_LABEL) as BookingStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-caption uppercase tracking-wider text-chrome block mb-1.5">Филиал</label>
          <select
            name="branch"
            defaultValue={params.branch || ""}
            className="h-10 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 text-body-sm text-graphite-50 focus:outline-none focus:border-red-primary"
          >
            <option value="">Все филиалы</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="h-10 w-full rounded-md bg-red-primary text-white font-medium text-body-sm hover:bg-red-hover transition-colors"
          >
            Применить
          </button>
        </div>
      </form>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-body-base text-graphite-200">Записей по фильтру нет</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="bg-graphite-900 text-caption uppercase tracking-wider text-chrome">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Дата</th>
                  <th className="text-left px-4 py-3 font-semibold">Клиент</th>
                  <th className="text-left px-4 py-3 font-semibold">Авто</th>
                  <th className="text-left px-4 py-3 font-semibold">Услуга</th>
                  <th className="text-left px-4 py-3 font-semibold">Филиал</th>
                  <th className="text-left px-4 py-3 font-semibold">Цена</th>
                  <th className="text-left px-4 py-3 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-500/30">
                {items.map((b) => (
                  <tr key={b.id} className="hover:bg-graphite-700 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <div className="text-graphite-50 font-medium font-mono tabular-nums">
                        {new Intl.DateTimeFormat("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(b.scheduledAt)}
                      </div>
                      <div className="text-caption text-graphite-300 font-mono">
                        {b.id.slice(0, 8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-graphite-50">{b.user?.name || b.guestName || "Без имени"}</div>
                      {(b.user?.phone || b.guestPhone) && (
                        <a
                          href={`tel:${(b.user?.phone || b.guestPhone || "").replace(/[^+\d]/g, "")}`}
                          className="inline-flex items-center gap-1 text-caption text-graphite-300 hover:text-red-primary mt-1 font-mono tabular-nums"
                        >
                          <Phone className="size-3" />
                          {b.user?.phone || b.guestPhone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-graphite-200">
                      {b.car ? (
                        <>
                          {b.car.brand} {b.car.model}
                          <div className="text-caption text-graphite-300 font-mono tabular-nums">
                            {b.car.year}
                          </div>
                        </>
                      ) : (
                        <>
                          {b.guestCarBrand} {b.guestCarModel}
                          <div className="text-caption text-graphite-300 font-mono tabular-nums">
                            {b.guestCarYear}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-graphite-200">{b.service.title}</td>
                    <td className="px-4 py-3 align-top text-graphite-200">{b.branch.name}</td>
                    <td className="px-4 py-3 align-top">
                      {b.estimatedPrice ? (
                        <span className="font-mono tabular-nums text-graphite-50">
                          от {formatPrice(b.estimatedPrice)}
                        </span>
                      ) : (
                        <span className="text-graphite-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge variant={STATUS_VARIANT[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).slice(0, 10).map((_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                href={`?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                className={`size-9 rounded-md grid place-items-center text-body-sm ${
                  p === page
                    ? "bg-red-primary text-white"
                    : "border border-graphite-500/40 text-graphite-200 hover:bg-graphite-700"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
