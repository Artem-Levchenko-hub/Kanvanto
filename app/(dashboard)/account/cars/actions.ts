"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { CarBrand, FuelType, Transmission } from "@prisma/client";
import { requireUser } from "@/lib/auth/rbac";
import { archiveCar, createCarForUser, updateCarMileage } from "@/lib/db/cars";
import { recomputeRemindersForCar, seedRemindersForCar } from "@/lib/maintenance/seed-reminders";
import { decodeVin, isValidVin } from "@/lib/vin/decode";

const createCarSchema = z.object({
  brand: z.nativeEnum(CarBrand),
  model: z.string().min(1, "Укажите модель").max(80),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
  licensePlate: z.string().optional(),
  mileage: z.number().int().min(0).max(2_000_000),
  purchaseDate: z.string().optional(),
  color: z.string().optional(),
  engineVolume: z.number().optional(),
  fuelType: z.nativeEnum(FuelType).optional(),
  transmission: z.nativeEnum(Transmission).optional(),
});

export type AddCarResult =
  | { ok: true; carId: string; remindersCreated: number }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function addCar(rawInput: z.infer<typeof createCarSchema>): Promise<AddCarResult> {
  const user = await requireUser();
  const parsed = createCarSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Проверьте корректность полей",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  if (data.vin && !isValidVin(data.vin)) {
    return { ok: false, error: "Некорректный VIN", fieldErrors: { vin: ["VIN должен быть 17 символов"] } };
  }

  try {
    const car = await createCarForUser(user.id, {
      brand: data.brand,
      model: data.model,
      year: data.year,
      vin: data.vin?.toUpperCase() || null,
      licensePlate: data.licensePlate?.toUpperCase() || null,
      mileage: data.mileage,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      color: data.color || null,
      engineVolume: data.engineVolume || null,
      fuelType: data.fuelType || null,
      transmission: data.transmission || null,
    });

    const seedResult = await seedRemindersForCar(car.id);

    revalidatePath("/account");
    revalidatePath("/account/cars");
    revalidatePath("/account/maintenance");

    return { ok: true, carId: car.id, remindersCreated: seedResult.created };
  } catch (e) {
    console.error("[addCar] error:", e);
    return { ok: false, error: e instanceof Error ? e.message : "Не удалось добавить авто" };
  }
}

export async function updateMileage(carId: string, mileage: number) {
  const user = await requireUser();
  if (!Number.isFinite(mileage) || mileage < 0 || mileage > 2_000_000) {
    return { ok: false as const, error: "Некорректный пробег" };
  }
  try {
    await updateCarMileage(carId, user.id, mileage);
    await recomputeRemindersForCar(carId);
    revalidatePath("/account");
    revalidatePath(`/account/cars/${carId}`);
    revalidatePath("/account/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function removeCar(carId: string) {
  const user = await requireUser();
  try {
    await archiveCar(carId, user.id);
    revalidatePath("/account");
    revalidatePath("/account/cars");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function decodeVinAction(vin: string) {
  return decodeVin(vin);
}
