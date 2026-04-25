import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getPayment } from "@/lib/payments/yookassa";

/**
 * Webhook от ЮKassa для обработки оплаты бронирования.
 *
 * Workflow:
 *  1. ЮKassa POST на этот endpoint при изменении статуса платежа
 *  2. Получаем bookingId из metadata
 *  3. Если платёж succeeded — переводим Booking в DepositStatus=PAID + status=CONFIRMED
 *  4. Если canceled — DepositStatus=NONE
 */
export async function POST(request: Request) {
  let event: { event: string; object?: { id: string; status: string; metadata?: { bookingId?: string } } };
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const paymentObj = event.object;
  if (!paymentObj?.id) return NextResponse.json({ ok: true });

  // Подтверждаем платёж через API (защита от подделки webhook-а)
  const payment = await getPayment(paymentObj.id).catch(() => null);
  if (!payment) return NextResponse.json({ ok: true });

  const bookingId = payment.metadata?.bookingId;
  if (!bookingId) return NextResponse.json({ ok: true });

  if (payment.status === "succeeded" && payment.paid) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { depositStatus: "PAID", status: "CONFIRMED" },
    }).catch((e) => {
      console.error("[yookassa webhook] update failed:", e);
    });
  } else if (payment.status === "canceled") {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { depositStatus: "NONE" },
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
