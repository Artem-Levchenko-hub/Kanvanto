"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { ServiceCategory } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createServiceAction, updateServiceAction, archiveServiceAction } from "@/app/admin/services/actions";

interface Props {
  service?: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    fullDescription: string | null;
    category: ServiceCategory;
    durationMinutes: number;
    basePrice: number;
    iconName: string | null;
    isFlagship: boolean;
    isExclusive: boolean;
    sortOrder: number;
    isActive: boolean;
  } | null;
}

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  DIAGNOSTICS: "Диагностика",
  MAINTENANCE: "Регламентное ТО",
  ENGINE: "Двигатель",
  TRANSMISSION: "Трансмиссия",
  BRAKES: "Тормоза",
  SUSPENSION: "Подвеска",
  ELECTRICAL: "Электрика",
  TUNING: "Тюнинг",
  BODY: "Кузовной",
  TIRES: "Шины",
  AC: "Кондиционеры",
};

export function ServiceForm({ service }: Props) {
  const router = useRouter();
  const isEdit = !!service;

  const [form, setForm] = React.useState({
    slug: service?.slug || "",
    title: service?.title || "",
    shortDescription: service?.shortDescription || "",
    fullDescription: service?.fullDescription || "",
    category: service?.category || ("MAINTENANCE" as ServiceCategory),
    durationMinutes: service?.durationMinutes || 60,
    basePrice: service?.basePrice || 5000,
    iconName: service?.iconName || "Wrench",
    isFlagship: service?.isFlagship || false,
    isExclusive: service?.isExclusive || false,
    sortOrder: service?.sortOrder || 0,
    isActive: service?.isActive ?? true,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [archiving, setArchiving] = React.useState(false);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      slug: form.slug,
      title: form.title,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription || undefined,
      category: form.category,
      durationMinutes: Number(form.durationMinutes),
      basePrice: Number(form.basePrice),
      iconName: form.iconName || undefined,
      isFlagship: form.isFlagship,
      isExclusive: form.isExclusive,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };
    const res = isEdit
      ? await updateServiceAction(service!.id, payload)
      : await createServiceAction(payload);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success(isEdit ? "Услуга обновлена" : "Услуга создана");
    if (!isEdit && "id" in res) {
      router.push(`/admin/services/${res.id}`);
    } else {
      router.refresh();
    }
  };

  const handleArchive = async () => {
    if (!service) return;
    if (!confirm(`Архивировать «${service.title}»? Услуга станет недоступна на сайте.`)) return;
    setArchiving(true);
    const res = await archiveServiceAction(service.id);
    setArchiving(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success("Услуга архивирована");
    router.push("/admin/services");
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
            placeholder="diagnostika"
            required
            className="mt-2 font-mono"
          />
        </div>
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v as ServiceCategory)}>
            <SelectTrigger id="category" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                <SelectItem key={k} value={k}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Название</Label>
        <Input id="title" value={form.title} onChange={(e) => update("title", e.target.value)} required className="mt-2" />
      </div>

      <div>
        <Label htmlFor="shortDescription">Краткое описание</Label>
        <textarea
          id="shortDescription"
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          maxLength={500}
          rows={2}
          required
          className="mt-2 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 py-2 text-body-base text-graphite-50 focus:border-red-primary focus:outline-none"
        />
      </div>

      <div>
        <Label htmlFor="fullDescription">Полное описание</Label>
        <textarea
          id="fullDescription"
          value={form.fullDescription}
          onChange={(e) => update("fullDescription", e.target.value)}
          maxLength={5000}
          rows={4}
          className="mt-2 w-full rounded-md border border-graphite-500 bg-graphite-800 px-3 py-2 text-body-base text-graphite-50 focus:border-red-primary focus:outline-none"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="basePrice">Базовая цена, ₽</Label>
          <Input
            id="basePrice"
            type="number"
            min={0}
            value={form.basePrice}
            onChange={(e) => update("basePrice", Number(e.target.value))}
            required
            className="mt-2 font-mono tabular-nums"
          />
        </div>
        <div>
          <Label htmlFor="durationMinutes">Время, мин</Label>
          <Input
            id="durationMinutes"
            type="number"
            min={5}
            max={2880}
            value={form.durationMinutes}
            onChange={(e) => update("durationMinutes", Number(e.target.value))}
            required
            className="mt-2 font-mono tabular-nums"
          />
        </div>
        <div>
          <Label htmlFor="sortOrder">Порядок сортировки</Label>
          <Input
            id="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value))}
            className="mt-2 font-mono tabular-nums"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="iconName">Иконка (Lucide)</Label>
        <Input
          id="iconName"
          value={form.iconName}
          onChange={(e) => update("iconName", e.target.value)}
          placeholder="Wrench, Activity, Cog..."
          className="mt-2 font-mono"
        />
        <p className="mt-1 text-caption text-graphite-300">
          Имя иконки из{" "}
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-red-primary hover:underline">
            Lucide
          </a>
        </p>
      </div>

      <div className="space-y-3 rounded-md border border-graphite-500/30 bg-graphite-900 p-4">
        <CheckboxRow id="isFlagship" label="Флагман (выделить на главной)" checked={form.isFlagship} onChange={(v) => update("isFlagship", v)} />
        <CheckboxRow id="isExclusive" label="Exclusive (бейдж на карточке)" checked={form.isExclusive} onChange={(v) => update("isExclusive", v)} />
        <CheckboxRow id="isActive" label="Активна (показывать на сайте)" checked={form.isActive} onChange={(v) => update("isActive", v)} />
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

function CheckboxRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <span className="text-body-sm text-graphite-100">{label}</span>
    </label>
  );
}
