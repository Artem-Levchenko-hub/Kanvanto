"use client";

import * as React from "react";
import { useBookingStore } from "@/lib/booking/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CarBrandValue } from "@/lib/booking/schema";

interface Props {
  userCars?: Array<{
    id: string;
    brand: CarBrandValue;
    model: string;
    year: number;
    licensePlate: string | null;
  }>;
  isAuthenticated: boolean;
}

const BRAND_LABELS: Record<CarBrandValue, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes-Benz",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "Volkswagen",
  OTHER: "Другая марка",
};

export function StepCar({ userCars = [], isAuthenticated }: Props) {
  const carId = useBookingStore((s) => s.carId);
  const guestCarBrand = useBookingStore((s) => s.guestCarBrand);
  const guestCarModel = useBookingStore((s) => s.guestCarModel);
  const guestCarYear = useBookingStore((s) => s.guestCarYear);
  const guestCarLicensePlate = useBookingStore((s) => s.guestCarLicensePlate);
  const setKey = useBookingStore((s) => s.set);
  const [showGuestForm, setShowGuestForm] = React.useState(false);

  const showCarsList = isAuthenticated && userCars.length > 0;

  return (
    <div>
      <h2 className="font-display text-h3 text-graphite-50">На каком авто приедете?</h2>
      <p className="text-body-base text-graphite-200 mt-2 mb-6">
        Это поможет мастеру подготовить инструменты и подходящие запчасти.
      </p>

      {showCarsList && !showGuestForm && (
        <div className="space-y-2 mb-4">
          {userCars.map((car) => {
            const isSelected = carId === car.id;
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => {
                  setKey("carId", car.id);
                  setKey("guestCarBrand", null);
                  setKey("guestCarModel", null);
                  setKey("guestCarYear", null);
                }}
                className={`w-full text-left rounded-lg border p-4 transition-all duration-base flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-red-primary bg-red-primary/5"
                    : "border-graphite-500/30 bg-graphite-800 hover:border-chrome/40 hover:bg-graphite-700"
                }`}
              >
                <div>
                  <p className="text-body-base font-medium text-graphite-50">
                    {BRAND_LABELS[car.brand]} {car.model} <span className="text-graphite-300">{car.year}</span>
                  </p>
                  {car.licensePlate && (
                    <p className="mt-1 text-caption text-chrome font-mono tabular-nums">
                      {car.licensePlate}
                    </p>
                  )}
                </div>
                <div
                  className={`size-5 rounded-full border-2 ${
                    isSelected ? "border-red-primary bg-red-primary" : "border-graphite-400"
                  }`}
                />
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowGuestForm(true)}
            className="w-full text-center py-3 text-body-sm text-graphite-300 hover:text-red-primary border border-dashed border-graphite-500 rounded-lg hover:border-red-primary/40 transition-colors"
          >
            + Другое авто
          </button>
        </div>
      )}

      {(!isAuthenticated || showGuestForm || userCars.length === 0) && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Марка</Label>
              <Select
                value={guestCarBrand ?? ""}
                onValueChange={(v) => {
                  setKey("guestCarBrand", v as CarBrandValue);
                  setKey("carId", null);
                }}
              >
                <SelectTrigger id="brand" className="mt-2">
                  <SelectValue placeholder="Выберите марку" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BRAND_LABELS) as CarBrandValue[]).map((b) => (
                    <SelectItem key={b} value={b}>
                      {BRAND_LABELS[b]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Год выпуска</Label>
              <Input
                id="year"
                type="number"
                min={1990}
                max={new Date().getFullYear() + 1}
                placeholder="2021"
                value={guestCarYear ?? ""}
                onChange={(e) => setKey("guestCarYear", e.target.value ? Number(e.target.value) : null)}
                className="mt-2 font-mono tabular-nums"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="model">Модель</Label>
            <Input
              id="model"
              placeholder="Например, X5 G05"
              value={guestCarModel ?? ""}
              onChange={(e) => setKey("guestCarModel", e.target.value || null)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="plate">Гос. номер (опционально)</Label>
            <Input
              id="plate"
              placeholder="A123BC 23"
              value={guestCarLicensePlate ?? ""}
              onChange={(e) => setKey("guestCarLicensePlate", e.target.value.toUpperCase() || null)}
              className="mt-2 font-mono tabular-nums"
            />
          </div>
          {showCarsList && (
            <button
              type="button"
              onClick={() => setShowGuestForm(false)}
              className="text-caption text-graphite-300 hover:text-red-primary"
            >
              ← Выбрать из моих авто
            </button>
          )}
        </div>
      )}
    </div>
  );
}
