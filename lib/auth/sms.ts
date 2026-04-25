import { prisma } from "@/lib/db/client";
import { normalizePhone } from "@/lib/db/users";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 минут
const OTP_RATE_LIMIT_MS = 60 * 1000; // 1 минута между запросами

export class OtpRateLimitError extends Error {
  constructor(public retryAfterMs: number) {
    super(`Слишком частые запросы. Попробуйте через ${Math.ceil(retryAfterMs / 1000)} сек.`);
    this.name = "OtpRateLimitError";
  }
}

export class OtpInvalidError extends Error {
  constructor(message = "Неверный или истёкший код") {
    super(message);
    this.name = "OtpInvalidError";
  }
}

export function generateOtp(): string {
  // 4-значный код для удобства ввода
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function requestOtp(phone: string): Promise<{ phone: string; devCode?: string }> {
  const normalized = normalizePhone(phone);

  // Rate limit: проверяем последний токен по phone
  const recent = await prisma.verificationToken.findFirst({
    where: { identifier: `phone:${normalized}` },
    orderBy: { expires: "desc" },
  });

  if (recent && recent.expires.getTime() - (OTP_TTL_MS - OTP_RATE_LIMIT_MS) > Date.now()) {
    const wait = recent.expires.getTime() - (OTP_TTL_MS - OTP_RATE_LIMIT_MS) - Date.now();
    throw new OtpRateLimitError(wait);
  }

  // Удалить старые токены для этого номера
  await prisma.verificationToken.deleteMany({ where: { identifier: `phone:${normalized}` } });

  const code = generateOtp();
  const expires = new Date(Date.now() + OTP_TTL_MS);

  await prisma.verificationToken.create({
    data: {
      identifier: `phone:${normalized}`,
      token: code,
      expires,
    },
  });

  await sendSmsOtp(normalized, code);

  // В dev возвращаем код для удобства тестирования
  return process.env.NODE_ENV === "development" ? { phone: normalized, devCode: code } : { phone: normalized };
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const normalized = normalizePhone(phone);

  const token = await prisma.verificationToken.findFirst({
    where: { identifier: `phone:${normalized}`, token: code.trim() },
  });

  if (!token) return false;
  if (token.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier: `phone:${normalized}` } });
    return false;
  }

  // Одноразовое использование
  await prisma.verificationToken.deleteMany({ where: { identifier: `phone:${normalized}` } });
  return true;
}

async function sendSmsOtp(phone: string, code: string): Promise<void> {
  const login = process.env.SMSC_LOGIN;
  const password = process.env.SMSC_PASSWORD;

  if (!login || !password) {
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [DEV-MODE SMS] Phone: ${phone} → код: ${code}`);
      return;
    }
    throw new Error("SMS-провайдер не настроен (SMSC_LOGIN / SMSC_PASSWORD)");
  }

  const message = `Kanavto: ваш код подтверждения ${code}. Никому не сообщайте.`;
  const params = new URLSearchParams({
    login,
    psw: password,
    phones: phone,
    mes: message,
    fmt: "3",
    sender: "KANAVTO",
  });

  const response = await fetch(`https://smsc.ru/sys/send.php?${params.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`SMS API responded with ${response.status}`);
  }

  const data = (await response.json()) as { error_code?: number; error?: string };
  if (data.error_code) {
    throw new Error(`SMSC error: ${data.error || data.error_code}`);
  }
}
