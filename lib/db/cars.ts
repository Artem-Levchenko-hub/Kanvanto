import { prisma } from "@/lib/db/client";
import type { CarBrand, FuelType, Transmission } from "@prisma/client";

export async function getCarsForUser(userId: string) {
  return prisma.car.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCarById(carId: string, userId: string) {
  return prisma.car.findFirst({
    where: { id: carId, userId },
  });
}

export async function getCarWithRemindersAndOrders(carId: string, userId: string) {
  return prisma.car.findFirst({
    where: { id: carId, userId },
    include: {
      reminders: {
        where: { status: { notIn: ["DONE"] } },
        include: { rule: true },
        orderBy: { dueAt: "asc" },
      },
      orders: {
        orderBy: { startedAt: "desc" },
        take: 50,
      },
    },
  });
}

export interface CreateCarInput {
  brand: CarBrand;
  model: string;
  year: number;
  vin?: string | null;
  licensePlate?: string | null;
  mileage: number;
  purchaseDate?: Date | null;
  color?: string | null;
  engineVolume?: number | null;
  fuelType?: FuelType | null;
  transmission?: Transmission | null;
}

export async function createCarForUser(userId: string, input: CreateCarInput) {
  return prisma.car.create({
    data: {
      userId,
      brand: input.brand,
      model: input.model,
      year: input.year,
      vin: input.vin || null,
      licensePlate: input.licensePlate || null,
      mileage: input.mileage,
      purchaseDate: input.purchaseDate,
      color: input.color || null,
      engineVolume: input.engineVolume,
      fuelType: input.fuelType,
      transmission: input.transmission,
      isActive: true,
    },
  });
}

export async function updateCarMileage(carId: string, userId: string, mileage: number) {
  const owned = await prisma.car.findFirst({ where: { id: carId, userId } });
  if (!owned) throw new Error("Авто не найдено");
  return prisma.car.update({
    where: { id: carId },
    data: { mileage, mileageUpdatedAt: new Date() },
  });
}

export async function archiveCar(carId: string, userId: string) {
  const owned = await prisma.car.findFirst({ where: { id: carId, userId } });
  if (!owned) throw new Error("Авто не найдено");
  return prisma.car.update({ where: { id: carId }, data: { isActive: false } });
}
