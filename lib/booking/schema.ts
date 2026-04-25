import { z } from "zod";
import { isValidPhone } from "@/lib/db/users";

export const carBrandEnum = z.enum(["BMW", "MERCEDES", "AUDI", "PORSCHE", "SKODA", "VW", "OTHER"]);
export type CarBrandValue = z.infer<typeof carBrandEnum>;

export const stepServiceSchema = z.object({
  serviceId: z.string().min(1, "Выберите услугу"),
});

export const stepCarSchema = z
  .object({
    carId: z.string().nullable(),
    guestCarBrand: carBrandEnum.nullable(),
    guestCarModel: z.string().min(1).max(100).nullable(),
    guestCarYear: z.number().int().min(1990).max(new Date().getFullYear() + 1).nullable(),
  })
  .refine((data) => data.carId || (data.guestCarBrand && data.guestCarModel && data.guestCarYear), {
    message: "Выберите авто или укажите марку, модель и год",
    path: ["guestCarBrand"],
  });

export const stepBranchSchema = z.object({
  branchSlug: z.string().min(1, "Выберите филиал"),
});

export const stepSlotSchema = z.object({
  scheduledAt: z.string().datetime({ message: "Выберите дату и время" }),
});

export const stepContactsSchema = z.object({
  guestName: z.string().min(2, "Минимум 2 символа").max(100),
  guestPhone: z.string().refine(isValidPhone, "Некорректный номер"),
  guestEmail: z.string().email("Некорректный email").optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Требуется согласие на обработку ПДн" }) }),
  notifyMaintenance: z.boolean().default(true),
});

export const fullBookingSchema = z.object({
  serviceId: z.string().min(1),
  carId: z.string().nullable(),
  guestCarBrand: carBrandEnum.nullable(),
  guestCarModel: z.string().nullable(),
  guestCarYear: z.number().nullable(),
  branchSlug: z.string().min(1),
  scheduledAt: z.string().datetime(),
  guestName: z.string().min(2).max(100).nullable(),
  guestPhone: z.string().refine(isValidPhone).nullable(),
  guestEmail: z.string().email().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  notifyMaintenance: z.boolean().default(true),
});

export type FullBookingInput = z.infer<typeof fullBookingSchema>;
