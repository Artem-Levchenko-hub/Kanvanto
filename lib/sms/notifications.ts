/**
 * SMS-уведомления для бронирования и ТО.
 *
 * В dev-mode без `SMSC_LOGIN/PASSWORD` — логирует в console.
 * В проде использует SMSC.ru API.
 */

interface SmsResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

async function sendSms(phone: string, text: string): Promise<SmsResult> {
  const login = process.env.SMSC_LOGIN;
  const password = process.env.SMSC_PASSWORD;

  if (!login || !password) {
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [DEV-MODE SMS] To: ${phone}\n${text}`);
      return { ok: true };
    }
    return { ok: false, error: "SMS provider not configured" };
  }

  // Нормализация номера: только цифры
  const normalized = phone.replace(/\D/g, "");

  const params = new URLSearchParams({
    login,
    psw: password,
    phones: normalized,
    mes: text,
    fmt: "3",
    sender: "KANAVTO",
  });

  try {
    const response = await fetch(`https://smsc.ru/sys/send.php?${params.toString()}`);
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }
    const data = (await response.json()) as { id?: string; error_code?: number; error?: string };
    if (data.error_code) {
      return { ok: false, error: data.error || `Code ${data.error_code}` };
    }
    return { ok: true, messageId: String(data.id ?? "") };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function sendBookingConfirmationSms(args: {
  phone: string;
  name: string;
  serviceTitle: string;
  scheduledAt: Date;
  branchAddress: string;
  bookingShortId: string;
}): Promise<SmsResult> {
  const dateStr = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(args.scheduledAt);

  const text = `Kanavto: ${args.name}, запись подтверждена. ${args.serviceTitle}, ${dateStr}, ${args.branchAddress}. Заказ ${args.bookingShortId}.`;
  return sendSms(args.phone, text);
}

export async function sendMaintenanceReminderSms(args: {
  phone: string;
  carLabel: string;
  maintenanceTitle: string;
  timeUntilDue: string;
  isOverdue: boolean;
}): Promise<SmsResult> {
  const prefix = args.isOverdue ? "ПРОСРОЧЕНО:" : "Скоро ТО:";
  const text = `Kanavto. ${prefix} ${args.maintenanceTitle} (${args.carLabel}) — ${args.timeUntilDue}. Записаться: kanavto.com/booking`;
  return sendSms(args.phone, text);
}

export async function sendBookingReminderSms(args: {
  phone: string;
  name: string;
  serviceTitle: string;
  scheduledAt: Date;
  branchAddress: string;
}): Promise<SmsResult> {
  const dateStr = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(args.scheduledAt);
  const text = `Kanavto: ${args.name}, напоминаем о визите ${dateStr}. ${args.serviceTitle}, ${args.branchAddress}. Перенести: +7 905 405-1111`;
  return sendSms(args.phone, text);
}
