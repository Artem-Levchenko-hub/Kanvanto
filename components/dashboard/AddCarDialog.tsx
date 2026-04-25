"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, ScanLine, Plus, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { decodeVin, isValidVin } from "@/lib/vin/decode";
import { addCar } from "@/app/(dashboard)/account/cars/actions";
import type { CarBrand } from "@prisma/client";

const BRAND_LABELS: Record<CarBrand, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes-Benz",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "Volkswagen",
  OTHER: "Другая марка",
};

const BRANDS = Object.keys(BRAND_LABELS) as CarBrand[];

interface DraftCar {
  brand: CarBrand | "";
  model: string;
  year: number | "";
  vin: string;
  licensePlate: string;
  mileage: number | "";
  purchaseDate: string;
}

const EMPTY: DraftCar = {
  brand: "",
  model: "",
  year: "",
  vin: "",
  licensePlate: "",
  mileage: "",
  purchaseDate: "",
};

type Step = 1 | 2 | 3;

export function AddCarDialog({ trigger }: { trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [draft, setDraft] = React.useState<DraftCar>(EMPTY);
  const [vinDecoded, setVinDecoded] = React.useState<{ brand: CarBrand | null; year: number | null; country: string | null } | null>(null);
  const [skipVin, setSkipVin] = React.useState(false);

  const reset = () => {
    setDraft(EMPTY);
    setVinDecoded(null);
    setSkipVin(false);
    setStep(1);
  };

  const onClose = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  const handleVinChange = (value: string) => {
    const upper = value.toUpperCase().slice(0, 17);
    setDraft({ ...draft, vin: upper });
    if (upper.length === 17 && isValidVin(upper)) {
      const result = decodeVin(upper);
      if (result.isValid) {
        setVinDecoded({ brand: result.brand, year: result.year, country: result.country });
        setDraft((prev) => ({
          ...prev,
          vin: upper,
          brand: result.brand ?? prev.brand,
          year: result.year ?? prev.year,
        }));
      } else {
        setVinDecoded(null);
      }
    } else {
      setVinDecoded(null);
    }
  };

  const canGoNext = (() => {
    if (step === 1) {
      return skipVin || (draft.vin.length === 17 && isValidVin(draft.vin));
    }
    if (step === 2) {
      return !!draft.brand && draft.model.trim().length >= 1 && typeof draft.year === "number" && draft.year >= 1990;
    }
    return typeof draft.mileage === "number" && draft.mileage >= 0;
  })();

  const handleSubmit = async () => {
    if (!draft.brand || !draft.model || typeof draft.year !== "number" || typeof draft.mileage !== "number") return;
    setSubmitting(true);
    const res = await addCar({
      brand: draft.brand as CarBrand,
      model: draft.model,
      year: draft.year,
      vin: draft.vin || undefined,
      licensePlate: draft.licensePlate || undefined,
      mileage: draft.mileage,
      purchaseDate: draft.purchaseDate || undefined,
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`Авто добавлено · создано ${res.remindersCreated} напоминаний о ТО`);
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : onClose())}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            Добавить авто
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавление автомобиля</DialogTitle>
          <p className="text-caption text-graphite-300 mt-1">Шаг {step} из 3</p>
          <Progress value={(step / 3) * 100} className="mt-3" />
        </DialogHeader>

        <div className="min-h-[260px]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="font-display text-h5 text-graphite-50 mb-1">Введите VIN</p>
                <p className="text-body-sm text-graphite-200">
                  По VIN автоматически определим марку, модель, год выпуска. Найти VIN можно на лобовом стекле или на стойке двери водителя.
                </p>
              </div>
              <div>
                <Label htmlFor="vin">VIN (17 символов)</Label>
                <div className="mt-2 relative">
                  <Input
                    id="vin"
                    value={draft.vin}
                    onChange={(e) => handleVinChange(e.target.value)}
                    placeholder="WBAGZ4108L0K12345"
                    maxLength={17}
                    className="font-mono tabular-nums uppercase pr-12"
                    autoFocus
                  />
                  {draft.vin.length === 17 && vinDecoded ? (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-success" />
                  ) : (
                    <ScanLine className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-graphite-400" />
                  )}
                </div>
                <p className="mt-2 text-caption text-graphite-300 font-mono tabular-nums">
                  {draft.vin.length}/17 символов
                </p>
              </div>

              {vinDecoded && (
                <div className="rounded-md bg-success/5 border border-success/30 p-4">
                  <p className="text-caption uppercase tracking-wider text-success font-semibold mb-2">
                    VIN распознан
                  </p>
                  <div className="space-y-1 text-body-sm">
                    <p className="text-graphite-100">
                      Марка:{" "}
                      <span className="text-graphite-50 font-medium">
                        {vinDecoded.brand ? BRAND_LABELS[vinDecoded.brand] : "не определена"}
                      </span>
                    </p>
                    <p className="text-graphite-100">
                      Год:{" "}
                      <span className="text-graphite-50 font-mono tabular-nums">{vinDecoded.year ?? "—"}</span>
                    </p>
                    {vinDecoded.country && (
                      <p className="text-graphite-100">
                        Страна: <span className="text-graphite-50">{vinDecoded.country}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setSkipVin(true);
                  setStep(2);
                }}
                className="block text-caption text-graphite-300 hover:text-red-primary"
              >
                Ввести вручную без VIN →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="font-display text-h5 text-graphite-50 mb-1">Уточните детали</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="brand">Марка</Label>
                  <Select
                    value={draft.brand || ""}
                    onValueChange={(v) => setDraft({ ...draft, brand: v as CarBrand })}
                  >
                    <SelectTrigger id="brand" className="mt-2">
                      <SelectValue placeholder="Выберите марку" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((b) => (
                        <SelectItem key={b} value={b}>{BRAND_LABELS[b]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Год</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    value={draft.year}
                    onChange={(e) => setDraft({ ...draft, year: e.target.value ? Number(e.target.value) : "" })}
                    className="mt-2 font-mono tabular-nums"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="model">Модель</Label>
                <Input
                  id="model"
                  value={draft.model}
                  onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                  placeholder="Например, X5 G05"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="plate">Гос. номер (опционально)</Label>
                <Input
                  id="plate"
                  value={draft.licensePlate}
                  onChange={(e) => setDraft({ ...draft, licensePlate: e.target.value.toUpperCase() })}
                  placeholder="A123BC 23"
                  className="mt-2 font-mono tabular-nums uppercase"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="font-display text-h5 text-graphite-50 mb-1">Пробег и дата покупки</p>
              <p className="text-body-sm text-graphite-200">
                Эти данные нужны, чтобы рассчитать график плановых ТО.
              </p>
              <div>
                <Label htmlFor="mileage">Текущий пробег, км</Label>
                <Input
                  id="mileage"
                  type="number"
                  min={0}
                  max={2_000_000}
                  value={draft.mileage}
                  onChange={(e) =>
                    setDraft({ ...draft, mileage: e.target.value ? Number(e.target.value) : "" })
                  }
                  placeholder="84320"
                  className="mt-2 font-mono tabular-nums"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Дата покупки (опционально)</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={draft.purchaseDate}
                  onChange={(e) => setDraft({ ...draft, purchaseDate: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                  className="mt-2 font-mono tabular-nums"
                />
                <p className="mt-2 text-caption text-graphite-300">
                  Если не помните точно — оставьте пустым.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-graphite-500/30">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((step - 1) as Step)} disabled={submitting}>
              <ArrowLeft className="size-4" />
              Назад
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button type="button" onClick={() => setStep((step + 1) as Step)} disabled={!canGoNext}>
              Далее
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={!canGoNext || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Сохраняем...
                </>
              ) : (
                <>
                  Добавить
                  <Check className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
