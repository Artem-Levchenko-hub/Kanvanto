import Link from "next/link";
import { Plus, Star, Sparkles } from "lucide-react";
import { listServicesForAdmin } from "@/lib/db/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";

export const metadata = { title: "Admin · Услуги" };

export default async function AdminServicesPage() {
  const services = await listServicesForAdmin();

  return (
    <div className="max-w-7xl">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-h1 text-graphite-50">Услуги</h1>
          <p className="mt-2 text-body-base text-graphite-200">
            Каталог услуг — отображается на главной и `/services`. Архив скрывает услугу с сайта.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="size-4" />
            Создать услугу
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-graphite-900 text-caption uppercase tracking-wider text-chrome">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Название</th>
                <th className="text-left px-4 py-3 font-semibold">Категория</th>
                <th className="text-left px-4 py-3 font-semibold">Цена</th>
                <th className="text-left px-4 py-3 font-semibold">Время</th>
                <th className="text-left px-4 py-3 font-semibold">Метки</th>
                <th className="text-left px-4 py-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-500/30">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-graphite-700 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <Link href={`/admin/services/${s.id}`} className="block group">
                      <div className="text-graphite-50 font-medium group-hover:text-red-primary transition-colors">
                        {s.title}
                      </div>
                      <div className="text-caption text-graphite-300 font-mono">/{s.slug}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 align-top text-graphite-200">{s.category}</td>
                  <td className="px-4 py-3 align-top">
                    <span className="font-mono tabular-nums text-graphite-100">от {formatPrice(s.basePrice)}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-graphite-200 font-mono tabular-nums">
                    {Math.round(s.durationMinutes / 60 * 10) / 10} ч
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1">
                      {s.isFlagship && (
                        <Badge variant="accent" className="text-[9px]">
                          <Star className="size-2.5" />
                          Флагман
                        </Badge>
                      )}
                      {s.isExclusive && (
                        <Badge variant="chrome" className="text-[9px]">
                          <Sparkles className="size-2.5" />
                          Excl.
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Badge variant={s.isActive ? "success" : "default"} className="text-[10px]">
                      {s.isActive ? "Активна" : "Архив"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
