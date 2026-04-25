"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { CarBrand } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createBranchAction, updateBranchAction, archiveBranchAction } from "@/app/admin/branches/actions";

interface Props {
  branch?: {
    id: string;
    slug: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string | null;
    openHours: unknown;
    brandsSupported: CarBrand[];
    capacity: number;
    isHQ: boolean;
    isActive: boolean;
    sortOrder: number;
  } | null;
}

const BRAND_LABELS: Record<CarBrand, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes-Benz",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "Volkswagen",
  OTHER: "Другая",
};

const DAYS = [
  { key: "mon", label: "Пн" },
  { key: "tue", label: "Вт" },
  { key: "wed", label: "Ср" },
  { key: "thu", label: "Чт" },
  { key: "fri", label: "Пт" },
  { key: "sat", label: "Сб" },
  { key: "sun", label: "Вс" },
];

export function BranchForm({ branch }: Props) {
  const router = useRouter();
  const isEdit = !!branch;

  const initialOpenHours = (branch?.openHours as Record<string, string>) || {
    mon: "08:00-19:00", tue: "08:00-19:00", wed: "08:00-19:00", thu: "08:00-19:00", fri: "08:00-19:00", sat: "08:00-19:00", sun: "",
  };

  const [form, setForm] = React.useState({
    slug: branch?.slug || "",
    name: branch?.name || "",
    address: branch?.address || "",
    city: branch?.city || "Краснодар",
    latitude: branch?.latitude || 45.0356,
    longitude: branch?.longitude || 38.9753,
    phone: branch?.phone || "",
    email: branch?.email || "",
    capacity: branch?.capacity || 10,
    isHQ: branch?.isHQ || false,
    isActive: branch?.isActive ?? true,
    sortOrder: branch?.sortOrder || 0,
  });
  const [openHours, setOpenHours] = React.useState<Record<string, string>>(initialOpenHours);
  const [brands, setBrands] = React.useState<Set<CarBrand>>(new Set(branch?.brandsSupported || []));
  const [submitting, setSubmitting] = React.useState(false);
  const [archiving, setArchiving] = React.useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((s) => ({ ...s, [key]: value }));

  const toggleBrand = (b: CarBrand) => {
    const next = new Set(brands);
    if (next.has(b)) next.delete(b);
    else next.add(b);
    setBrands(next);
  };

  const updateHours = (day: string, value: string) => {
    setOpenHours((prev) => ({ ...prev, [day]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (brands.size === 0) {
      toast.error("Выберите хотя бы одну марку");
      return;
    }
    setSubmitting(true);
    const cleanedHours: Record<string, string> = {};
    Object.entries(openHours).forEach(([k, v]) => {
      if (v.trim()) cleanedHours[k] = v.trim();
    });

    const payload = {
      slug: form.slug,
      name: form.name,
      address: form.address,
      city: form.city,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      phone: form.phone,
      email: form.email || undefined,
      openHours: cleanedHours,
      brandsSupported: Array.from(brands),
      capacity: Number(form.capacity),
      isHQ: form.isHQ,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
    };

    const res = isEdit
      ? await updateBranchAction(branch!.id, payload)
      : await createBranchAction(payload);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success(isEdit ? "Филиал обновлён" : "Филиал создан");
    if (!isEdit && "id" in res) {
      router.push(`/admin/branches/${res.id}`);
    } else {
      router.refresh();
    }
  };

  const handleArchive = async () => {
    if (!branch) return;
    if (!confirm(`Архивировать «${branch.name}»?`)) return;
    setArchiving(true);
    const res = await archiveBranchAction(branch.id);
    setArchiving(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success("Филиал архивирован");
    router.push("/admin/branches");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            placeholder="budennogo"
            required
            className="mt-2 font-mono"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Постов</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            max={100}
            value={form.capacity}
            onChange={(e) => update("capacity", Number(e.target.value))}
            required
            className="mt-2 font-mono tabular-nums"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Название</Label>
        <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required className="mt-2" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="address">Адрес</Label>
          <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="city">Город</Label>
          <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-2" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="mt-2 font-mono" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-2" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lat">Широта</Label>
          <Input id="lat" type="number" step="0.000001" value={form.latitude} onChange={(e) => update("latitude", Number(e.target.value))} required className="mt-2 font-mono tabular-nums" />
        </div>
        <div>
          <Label htmlFor="lng">Долгота</Label>
          <Input id="lng" type="number" step="0.000001" value={form.longitude} onChange={(e) => update("longitude", Number(e.target.value))} required className="mt-2 font-mono tabular-nums" />
        </div>
      </div>

      <div>
        <Label>Часы работы</Label>
        <p className="text-caption text-graphite-300 mt-1 mb-2">Формат: 08:00-19:00. Оставьте пустым для выходного.</p>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {DAYS.map((d) => (
            <div key={d.key}>
              <label className="text-caption text-chrome uppercase block mb-1">{d.label}</label>
              <Input
                value={openHours[d.key] || ""}
                onChange={(e) => updateHours(d.key, e.target.value)}
                placeholder="08:00-19:00"
                className="font-mono tabular-nums text-caption"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Марки специализации</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(BRAND_LABELS) as CarBrand[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => toggleBrand(b)}
              className={`px-3 py-1.5 rounded-md text-body-sm border transition-colors ${
                brands.has(b)
                  ? "bg-red-primary text-white border-red-primary"
                  : "bg-graphite-800 text-graphite-100 border-graphite-500 hover:border-chrome/40"
              }`}
            >
              {BRAND_LABELS[b]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-graphite-500/30 bg-graphite-900 p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={form.isHQ} onCheckedChange={(v) => update("isHQ", v === true)} />
          <span className="text-body-sm text-graphite-100">Главный офис (HQ)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={form.isActive} onCheckedChange={(v) => update("isActive", v === true)} />
          <span className="text-body-sm text-graphite-100">Активен</span>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-graphite-500/30">
        {isEdit && (
          <Button type="button" variant="ghost" onClick={handleArchive} disabled={archiving} className="text-error hover:text-error">
            <Trash2 className="size-4" />
            {archiving ? "Архивируем..." : "Архивировать"}
          </Button>
        )}
        <Button type="submit" disabled={submitting} className="ml-auto">
          {submitting ? <><Loader2 className="size-4 animate-spin" />Сохраняем...</> : (isEdit ? "Сохранить" : "Создать")}
        </Button>
      </div>
    </form>
  );
}
