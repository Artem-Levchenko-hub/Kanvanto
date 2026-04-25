"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Gauge, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMileage } from "@/app/(dashboard)/account/cars/actions";

interface Props {
  carId: string;
  currentMileage: number;
}

export function UpdateMileageDialog({ carId, currentMileage }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number | "">(currentMileage);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (typeof value !== "number" || value < currentMileage) {
      toast.error("Новый пробег не может быть меньше текущего");
      return;
    }
    setSubmitting(true);
    const res = await updateMileage(carId, value);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Пробег обновлён · напоминания пересчитаны");
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Gauge className="size-4" />
          Обновить пробег
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Текущий пробег</DialogTitle>
          <p className="text-caption text-graphite-300 mt-1">
            После обновления пересчитаем график напоминаний о ТО.
          </p>
        </DialogHeader>

        <div className="py-2">
          <Label htmlFor="mileage">Пробег, км</Label>
          <Input
            id="mileage"
            type="number"
            min={currentMileage}
            max={2_000_000}
            value={value}
            onChange={(e) => setValue(e.target.value ? Number(e.target.value) : "")}
            className="mt-2 font-mono tabular-nums text-h5"
            autoFocus
          />
          <p className="mt-2 text-caption text-graphite-300 font-mono tabular-nums">
            Текущий: {currentMileage.toLocaleString("ru-RU")} км
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Обновляем...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
