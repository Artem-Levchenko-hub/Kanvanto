import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { listUsersForAdmin } from "@/lib/db/users";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { UserRole } from "@prisma/client";

export const metadata = { title: "Admin · Клиенты" };

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Клиент",
  MASTER: "Мастер",
  ADMIN: "Админ",
};

interface Props {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const role = params.role && (Object.keys(ROLE_LABELS) as UserRole[]).includes(params.role as UserRole)
    ? (params.role as UserRole)
    : undefined;

  const { items, total, page, pageSize } = await listUsersForAdmin({
    search: params.q,
    role,
    page: Number(params.page) || 1,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="font-display text-h1 text-graphite-50">Клиенты</h1>
        <p className="mt-2 text-body-base text-graphite-200">Всего: {total}</p>
      </div>

      <form className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="sm:col-span-2">
          <label className="text-caption uppercase tracking-wider text-chrome block mb-1.5">Поиск</label>
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="Имя, телефон, email..."
            className="h-10 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 text-body-sm text-graphite-50 focus:outline-none focus:border-red-primary"
          />
        </div>
        <div>
          <label className="text-caption uppercase tracking-wider text-chrome block mb-1.5">Роль</label>
          <select
            name="role"
            defaultValue={params.role || ""}
            className="h-10 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 text-body-sm text-graphite-50 focus:outline-none focus:border-red-primary"
          >
            <option value="">Все роли</option>
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
      </form>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-graphite-300">Клиентов по фильтру нет</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="bg-graphite-900 text-caption uppercase tracking-wider text-chrome">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Имя / Контакты</th>
                  <th className="text-left px-4 py-3 font-semibold">Авто</th>
                  <th className="text-left px-4 py-3 font-semibold">Заказы</th>
                  <th className="text-left px-4 py-3 font-semibold">Уровень</th>
                  <th className="text-left px-4 py-3 font-semibold">Регистрация</th>
                  <th className="text-left px-4 py-3 font-semibold">Роль</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-500/30">
                {items.map((u) => (
                  <tr key={u.id} className="hover:bg-graphite-700 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <Link href={`/admin/customers/${u.id}`} className="block group">
                        <div className="text-graphite-50 font-medium group-hover:text-red-primary transition-colors">
                          {u.name || "Без имени"}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-caption text-graphite-300">
                          <span className="flex items-center gap-1 font-mono tabular-nums">
                            <Phone className="size-3" />
                            {u.phone}
                          </span>
                          {u.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="size-3" />
                              {u.email}
                            </span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top font-mono tabular-nums text-graphite-200">{u._count.cars}</td>
                    <td className="px-4 py-3 align-top font-mono tabular-nums text-graphite-200">
                      {u._count.orders}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div>
                        <Badge variant="chrome" className="text-[10px]">{u.bonusLevel}</Badge>
                      </div>
                      <p className="text-caption text-graphite-300 font-mono tabular-nums mt-1">
                        {formatPrice(u.totalSpent)}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-graphite-200">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 align-top">
                      <Badge variant={u.role === "ADMIN" ? "accent" : u.role === "MASTER" ? "warning" : "default"} className="text-[10px]">
                        {ROLE_LABELS[u.role]}
                      </Badge>
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
          {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
            const p = i + 1;
            const search = new URLSearchParams();
            if (params.q) search.set("q", params.q);
            if (params.role) search.set("role", params.role);
            search.set("page", String(p));
            return (
              <Link
                key={p}
                href={`?${search.toString()}`}
                className={`size-9 rounded-md grid place-items-center text-body-sm ${
                  p === page ? "bg-red-primary text-white" : "border border-graphite-500/40 text-graphite-200 hover:bg-graphite-700"
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
