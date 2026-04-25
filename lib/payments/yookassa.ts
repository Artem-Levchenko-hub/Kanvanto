import { randomUUID } from "crypto";

/**
 * ЮKassa Payments API клиент.
 * Документация: https://yookassa.ru/developers/api
 *
 * Используется для:
 *  - Депозита за бронирование (anti-no-show)
 *  - В будущем — для пополнения бонусного баланса, оплаты услуг онлайн
 */

const YOOKASSA_API = "https://api.yookassa.ru/v3";

export class YooKassaNotConfiguredError extends Error {
  constructor() {
    super("ЮKassa не настроена (YOOKASSA_SHOP_ID или YOOKASSA_SECRET_KEY отсутствуют)");
    this.name = "YooKassaNotConfiguredError";
  }
}

function getAuth(): string {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secret = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secret) throw new YooKassaNotConfiguredError();
  return Buffer.from(`${shopId}:${secret}`).toString("base64");
}

export interface CreatePaymentInput {
  amount: number; // в копейках (rубль×100) внутри функции, на входе — рубли
  description: string;
  returnUrl: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
  customerPhone?: string;
}

export interface YooKassaPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  amount: { value: string; currency: string };
  confirmation: { type: string; confirmation_url: string };
  created_at: string;
  metadata?: Record<string, string>;
}

export async function createPayment(input: CreatePaymentInput): Promise<YooKassaPayment> {
  const idempotenceKey = randomUUID();

  const body = {
    amount: { value: input.amount.toFixed(2), currency: "RUB" },
    capture: true,
    description: input.description,
    confirmation: { type: "redirect", return_url: input.returnUrl },
    metadata: input.metadata ?? {},
    receipt: input.customerEmail || input.customerPhone
      ? {
          customer: {
            ...(input.customerEmail ? { email: input.customerEmail } : {}),
            ...(input.customerPhone ? { phone: input.customerPhone.replace(/\D/g, "") } : {}),
          },
          items: [
            {
              description: input.description.slice(0, 128),
              quantity: "1.0",
              amount: { value: input.amount.toFixed(2), currency: "RUB" },
              vat_code: 1,
              payment_subject: "service",
              payment_mode: "full_prepayment",
            },
          ],
        }
      : undefined,
  };

  const response = await fetch(`${YOOKASSA_API}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
      Authorization: `Basic ${getAuth()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ЮKassa error: ${response.status} ${error}`);
  }

  return response.json();
}

export async function getPayment(paymentId: string): Promise<YooKassaPayment | null> {
  const response = await fetch(`${YOOKASSA_API}/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${getAuth()}` },
  });
  if (!response.ok) return null;
  return response.json();
}

export function isConfigured(): boolean {
  return !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}
