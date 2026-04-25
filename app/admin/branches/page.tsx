import Link from "next/link";
import { Plus } from "lucide-react";
import { listBranchesForAdmin } from "@/lib/db/branches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Admin · Филиалы" };

export default async function AdminBranchesPage() {
  const branches = await listBranchesForAdmin();

  return (
    <div className="max-w-7xl">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-h1 text-graphite-50">Филиалы</h1>
          <p className="mt-2 text-body-base text-graphite-200">
            Сеть автосервисов · {branches.filter((b) => b.isActive).length} активных
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/branches/new">
            <Plus className="size-4" />
            Добавить филиал
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => (
          <Card key={b.id}>
            <Link href={`/admin/branches/${b.id}`} className="block p-5 group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-display text-h5 text-graphite-50 group-hover:text-red-primary transition-colors truncate">
                    {b.name}
                  </p>
                  <p className="text-caption text-graphite-300 font-mono mt-0.5">/{b.slug}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {b.isHQ && <Badge variant="accent" className="text-[9px]">HQ</Badge>}
                  <Badge variant={b.isActive ? "success" : "default"} className="text-[10px]">
                    {b.isActive ? "Активен" : "Архив"}
                  </Badge>
                </div>
              </div>
              <p className="text-body-sm text-graphite-200">{b.address}</p>
              <p className="text-caption text-chrome mt-1 font-mono tabular-nums">{b.phone}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {b.brandsSupported.map((br) => (
                  <Badge key={br} variant="chrome" className="text-[9px]">{br}</Badge>
                ))}
              </div>
              <p className="mt-3 text-caption text-graphite-300">
                <span className="font-mono tabular-nums">{b.capacity}</span> постов
              </p>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
