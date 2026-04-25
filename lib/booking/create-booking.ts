"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { createBookingTx } from "@/lib/db/bookings";
import { fullBookingSchema, type FullBookingInput } from "@/lib/booking/schema";
import { sendEmail } from "@/lib/email/resend";
import { bookingConfirmationEmail } from "@/lib/email/templates";
import { sendBookingConfirmationSms } from "@/lib/sms/notifications";

export type CreateBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createBooking(rawInput: FullBookingInput): Promise<CreateBookingResult> {
  const session = await auth();

  // Если пользователь авторизован — guest fields не нужны (приоритет user)
  const parsed = fullBookingSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Проверьте корректность полей",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  // Service
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) return { ok: false, error: "Услуга не найдена" };

  // Branch
  const branch = await prisma.branch.findUnique({ where: { slug: data.branchSlug } });
  if (!branch) return { ok: false, error: "Филиал не найден" };

  // Car
  let carId: string | null = null;
  if (session?.user) {
    if (data.carId) {
      const ownCar = await prisma.car.findFirst({
        where: { id: data.carId, userId: session.user.id },
      });
      if (!ownCar) return { ok: false, error: "Авто не найдено" };
      carId = ownCar.id;
    }
  }

  try {
    const scheduledAt = new Date(data.scheduledAt);

    const booking = await createBookingTx({
      userId: session?.user?.id ?? null,
      guestName: session?.user ? null : data.guestName,
      guestPhone: session?.user ? null : data.guestPhone,
      guestEmail: session?.user ? null : data.guestEmail || null,
      carId,
      guestCarBrand: !carId ? data.guestCarBrand : null,
      guestCarModel: !carId ? data.guestCarModel : null,
      guestCarYear: !carId ? data.guestCarYear : null,
      serviceId: data.serviceId,
      branchId: branch.id,
      scheduledAt,
      durationMinutes: service.durationMinutes,
      estimatedPrice: service.basePrice,
      notes: data.notes || null,
    });

    // Email подтверждение (best-effort, не блокирует)
    const recipientEmail = session?.user?.email || data.guestEmail || null;
    const recipientName = session?.user?.name || data.guestName || "Клиент";

    if (recipientEmail) {
      const template = bookingConfirmationEmail({
        name: recipientName,
        serviceTitle: service.title,
        branchName: branch.name,
        branchAddress: branch.address,
        scheduledAt,
        estimatedPrice: service.basePrice,
        bookingId: booking.id.slice(0, 8).toUpperCase(),
        magicLinkUrl: !session?.user && data.guestEmail
          ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/login?email=${encodeURIComponent(data.guestEmail)}`
          : undefined,
      });

      await sendEmail({
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }).catch((e) => {
        console.error("[booking] email send failed:", e);
      });
    }

    // SMS подтверждение (best-effort)
    const recipientPhone = session?.user
      ? (session.user as { phone?: string }).phone || null
      : data.guestPhone || null;
    if (recipientPhone) {
      await sendBookingConfirmationSms({
        phone: recipientPhone,
        name: recipientName,
        serviceTitle: service.title,
        scheduledAt,
        branchAddress: branch.address,
        bookingShortId: booking.id.slice(0, 8).toUpperCase(),
      }).catch((e) => console.error("[booking] sms send failed:", e));
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/account");

    return { ok: true, bookingId: booking.id };
  } catch (e) {
    console.error("[createBooking] error:", e);
    const msg = e instanceof Error ? e.message : "Не удалось создать запись";
    return { ok: false, error: msg };
  }
}

export async function getServerAvailability(branchSlug: string, date: string): Promise<
  { ok: true; slots: Array<{ start: string; end: string; available: boolean }> } | { ok: false; error: string }
> {
  const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
  if (!branch) return { ok: false, error: "Филиал не найден" };

  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) return { ok: false, error: "Некорректная дата" };

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.booking.findMany({
    where: {
      branchId: branch.id,
      scheduledAt: { gte: startOfDay, lte: endOfDay },
      status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS"] },
    },
    select: { scheduledAt: true, durationMinutes: true },
  });

  const { computeSlots } = await import("@/lib/booking/availability");
  const slots = computeSlots({
    openHours: branch.openHours as Record<string, string>,
    durationMinutes: 60, // дефолт; реально нужно по выбранной услуге, передаётся отдельно
    capacity: branch.capacity,
    existingBookings: existing,
    date: targetDate,
  });

  return {
    ok: true,
    slots: slots.map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
      available: s.available,
    })),
  };
}
