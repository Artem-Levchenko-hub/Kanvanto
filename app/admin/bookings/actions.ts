"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { BookingStatus, OrderItemType, PartOrigin } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/client";
import { completeBookingAsOrder } from "@/lib/db/orders";
import { accrueBonusesForOrder } from "@/lib/bonuses/calculate";
import { sendEmail } from "@/lib/email/resend";

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  await requireAdmin();
  try {
    await prisma.booking.update({ where: { id: bookingId }, data: { status } });
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    revalidatePath("/account/orders");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

const completeSchema = z.object({
  bookingId: z.string().min(1),
  masterName: z.string().min(2).max(120),
  mileageAtService: z.number().int().min(0).max(2_000_000),
  warrantyMonths: z.number().int().min(0).max(60).optional(),
  warrantyKm: z.number().int().min(0).max(200_000).optional(),
  discountAmount: z.number().int().min(0).optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(500).optional(),
        quantity: z.number().int().min(1).max(100),
        unitPrice: z.number().int().min(0).max(10_000_000),
        type: z.nativeEnum(OrderItemType),
        partOrigin: z.nativeEnum(PartOrigin).optional(),
        partNumber: z.string().max(100).optional(),
        serviceId: z.string().optional(),
      })
    )
    .min(1, "Добавьте хотя бы одну строку работ или запчастей"),
});

export async function completeBookingAction(rawInput: z.infer<typeof completeSchema>) {
  await requireAdmin();
  const parsed = completeSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Проверьте корректность полей",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const labor = parsed.data.items.filter((i) => i.type === "LABOR").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const parts = parsed.data.items.filter((i) => i.type === "PART").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discount = parsed.data.discountAmount ?? 0;
  const total = labor + parts - discount;

  try {
    const order = await completeBookingAsOrder({
      bookingId: parsed.data.bookingId,
      masterName: parsed.data.masterName,
      mileageAtService: parsed.data.mileageAtService,
      warrantyMonths: parsed.data.warrantyMonths,
      warrantyKm: parsed.data.warrantyKm,
      discountAmount: discount,
      laborAmount: labor,
      partsAmount: parts,
      totalAmount: total,
      items: parsed.data.items,
    });

    // Начислить бонусы (1% от total)
    const bonusResult = await accrueBonusesForOrder(order.id).catch((e) => {
      console.error("[completeBooking] bonus accrual failed:", e);
      return null;
    });

    // Уведомить клиента (best-effort)
    const user = await prisma.user.findUnique({
      where: { id: order.userId },
      select: { email: true, name: true },
    });
    if (user?.email) {
      const totalFmt = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(total);
      const bonusFmt = bonusResult ? new Intl.NumberFormat("ru-RU").format(bonusResult.earned) : "0";
      await sendEmail({
        to: user.email,
        subject: `Заказ-наряд ${order.number} закрыт · ${totalFmt}`,
        html: `
<div style="background:#0A0A0B; padding:32px; font-family:'Jost', sans-serif; color:#F5F5F7;">
  <div style="max-width:560px; margin:0 auto; background:#17171B; border:1px solid rgba(58,58,68,0.4); border-radius:16px; padding:32px;">
    <h1 style="font-family:'Playfair Display', serif; font-size:28px; margin:0 0 16px; color:#F5F5F7;">${user.name || "Клиент"}, заказ закрыт</h1>
    <p style="font-size:15px; color:#A8A8B0;">Спасибо, что доверили нам ${parsed.data.items[0]?.title || "обслуживание"}.</p>
    <p style="font-family:'Playfair Display', serif; font-size:36px; color:#F5F5F7; margin:24px 0;">${totalFmt}</p>
    ${bonusResult ? `<p style="color:#34D399; font-size:15px;">+${bonusFmt} ₽ бонусов начислено${bonusResult.levelUp ? ` · вы перешли на уровень <b>${bonusResult.newLevel}</b>` : ""}</p>` : ""}
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.id}" style="display:inline-block; margin-top:24px; background:#DC2626; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">Открыть заказ</a>
  </div>
</div>`,
      }).catch(() => null);
    }

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${parsed.data.bookingId}`);
    revalidatePath("/account/orders");
    revalidatePath("/account/bonuses");

    return {
      ok: true as const,
      orderId: order.id,
      orderNumber: order.number,
      bonusEarned: bonusResult?.earned ?? 0,
      levelUp: bonusResult?.levelUp ?? false,
    };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function attachBookingToUserAction(bookingId: string, userId: string) {
  await requireAdmin();
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId }, select: { id: true } });
    if (!booking) return { ok: false as const, error: "Запись не найдена" };

    await prisma.booking.update({
      where: { id: bookingId },
      data: { userId, guestName: null, guestPhone: null, guestEmail: null },
    });
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}
