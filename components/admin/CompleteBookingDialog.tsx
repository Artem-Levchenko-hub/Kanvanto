"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { OrderItemType, PartOrigin } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { completeBookingAction } from "@/app/admin/bookings/actions";
import { formatPrice } from "@/lib/utils/format";

interface DraftItem {
  id: string;
  type: OrderItemType;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  partOrigin: PartOrigin | "";
  partNumber: string;
}

const newItem = (type: OrderItemType): DraftItem => ({
  id: Math.random().toString(36).slice(2),
  type,
  title: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  partOrigin: type === "PART" ? "ORIGINAL" : "",
  partNumber: "",
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bookingId: string;
  serviceTitle: string;
  carMileage: number | null;
  servicePrice: number;
}

export function CompleteBookingDialog({ open, onOpenChange, bookingId, serviceTitle, carMileage, servicePrice }: Props) {
  const router = useRouter();
  const [masterName, setMasterName] = React.useState("");
  const [mileage, setMileage] = React.useState<number>(carMileage ?? 0);
  const [warrantyMonths, setWarrantyMonths] = React.useState(12);
  const [warrantyKm, setWarrantyKm] = React.useState(20000);
  const [discount, setDiscount] = React.useState(0);
  const [items, setItems] = React.useState<DraftItem[]>([
    { ...newItem("LABOR"), title: serviceTitle, unitPrice: servicePrice },
  ]);
  const [submitting, setSubmitting] = React.useState(false);

  const labor = items.filter((i) => i.type === "LABOR").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const parts = items.filter((i) => i.type === "PART").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = labor + parts - discount;
  const expectedBonus = Math.floor(total * 0.01);

  const updateItem = (id: string, patch: Partial<DraftItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const canSubmit = masterName.trim().length >= 2 && mileage > 0 && items.every((i) => i.title.trim() && i.unitPrice >= 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await completeBookingAction({
      bookingId,
      masterName: masterName.trim(),
      mileageAtService: mileage,
      warrantyMonths,
      warrantyKm,
      discountAmount: discount,
      items: items.map((i) => ({
        title: i.title.trim(),
        description: i.description.trim() || undefined,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        type: i.type,
        partOrigin: i.partOrigin || undefined,
        partNumber: i.partNumber.trim() || undefined,
      })),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    const bonusFmt = res.bonusEarned > 0 ? ` · +${formatPrice(res.bonusEarned)} бонусов` : "";
    const levelFmt = res.levelUp ? " · повышен уровень" : "";
    toast.success(`Создан заказ ${res.orderNumber}${bonusFmt}${levelFmt}`);
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Закрыть запись и создать заказ-наряд</DialogTitle>
          <p className="text-caption text-graphite-300 mt-1">
            Запись будет переведена в COMPLETED, создан Order. Бонусы (1% от суммы) начислятся автоматически.
          </p>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="master">Мастер</Label>
              <Input
                id="master"
                value={masterName}
                onChange={(e) => setMasterName(e.target.value)}
                placeholder="Алексей М."
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="mileage">Пробег при приёмке, км</Label>
              <Input
                id="mileage"
                type="number"
                min={0}
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="mt-2 font-mono tabular-nums"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="wMonths">Гарантия, мес</Label>
              <Input
                id="wMonths"
                type="number"
                min={0}
                max={60}
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                className="mt-2 font-mono tabular-nums"
              />
            </div>
            <div>
              <Label htmlFor="wKm">Гарантия, км</Label>
              <Input
                id="wKm"
                type="number"
                min={0}
                max={200000}
                value={warrantyKm}
                onChange={(e) => setWarrantyKm(Number(e.target.value))}
                className="mt-2 font-mono tabular-nums"
              />
            </div>
            <div>
              <Label htmlFor="discount">Скидка, ₽</Label>
              <Input
                id="discount"
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="mt-2 font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Состав заказа</Label>
              <div className="flex gap-1">
                <Button type="button" size="sm" variant="ghost" onClick={() => setItems((p) => [...p, newItem("LABOR")])}>
                  <Plus className="size-3.5" />
                  Работа
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setItems((p) => [...p, newItem("PART")])}>
                  <Plus className="size-3.5" />
                  Запчасть
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-md border border-graphite-500/30 bg-graphite-900 p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-caption uppercase tracking-wider text-chrome">
                      {item.type === "LABOR" ? "Работа" : "Запчасть"}
                    </span>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-error hover:underline">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    placeholder={item.type === "LABOR" ? "Название работы" : "Название детали"}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                      placeholder="Кол-во"
                      className="font-mono tabular-nums"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                      placeholder="Цена"
                      className="font-mono tabular-nums col-span-2"
                    />
                  </div>
                  {item.type === "PART" && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Select
                        value={item.partOrigin || ""}
                        onValueChange={(v) => updateItem(item.id, { partOrigin: v as PartOrigin })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORIGINAL">Оригинал</SelectItem>
                          <SelectItem value="ANALOG">Аналог</SelectItem>
                          <SelectItem value="USED">Б/у</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={item.partNumber}
                        onChange={(e) => updateItem(item.id, { partNumber: e.target.value })}
                        placeholder="Артикул"
                        className="font-mono tabular-nums"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-graphite-900 border border-graphite-500/30 p-4 space-y-1.5">
            <Row label="Работа" value={formatPrice(labor)} />
            <Row label="Запчасти" value={formatPrice(parts)} />
            <Row label="Скидка" value={`−${formatPrice(discount)}`} muted />
            <div className="pt-2 border-t border-graphite-500/30">
              <Row label="Итого" value={formatPrice(total)} bold />
            </div>
            <p className="text-caption text-success mt-2">
              Будет начислено: <span className="font-mono tabular-nums">+{formatPrice(expectedBonus)}</span> бонусов
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-graphite-500/30">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? <><Loader2 className="size-4 animate-spin" />Создаём...</> : "Создать заказ-наряд"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between text-body-sm">
      <span className={muted ? "text-graphite-400" : "text-graphite-200"}>{label}</span>
      <span className={`font-mono tabular-nums ${bold ? "text-graphite-50 font-semibold" : muted ? "text-graphite-400" : "text-graphite-100"}`}>
        {value}
      </span>
    </div>
  );
}
