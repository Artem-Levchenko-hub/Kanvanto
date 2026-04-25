"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { auth } from "@/auth";
import { createPayment, isConfigured as isYooKassaConfigured } from "@/lib/payments/yookassa";

const createDepositSchema = z.object({
  bookingId: z.string().min(1),
  amountRub: z.number().int().min(100).max(50_000),
});

export async function createBookingDeposit(input: z.infer<typeof createDepositSchema>) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, error: "Требуется авторизация" };
  }
  const parsed = createDepositSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Некорректные данные" };
  }

  if (!isYooKassaConfigured()) {
    return { ok: false as const, error: "Платежи временно недоступны" };
  }

  const booking = await prisma.booking.findFirst({
    where: { id: parsed.data.bookingId, userId: session.user.id },
    include: { service: true, branch: true, user: true },
  });
  if (!booking) return { ok: false as const, error: "Запись не найдена" };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const payment = await createPayment({
      amount: parsed.data.amountRub,
      description: `Депозит за бронирование ${booking.id.slice(0, 8).toUpperCase()} · ${booking.service.title}`,
      returnUrl: `${baseUrl}/booking/success?id=${booking.id}&payment_returned=1`,
      metadata: {
        bookingId: booking.id,
        userId: booking.userId ?? "",
      },
      customerEmail: booking.user?.email || booking.guestEmail || undefined,
      customerPhone: booking.user?.phone || booking.guestPhone || undefined,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { depositAmount: parsed.data.amountRub * 100, depositStatus: "HELD" },
    });

    return { ok: true as const, confirmationUrl: payment.confirmation.confirmation_url };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Не удалось создать платёж" };
  }
}
