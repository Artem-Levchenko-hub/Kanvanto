import { prisma } from "@/lib/db/client";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";

const TG_API_BASE = "https://api.telegram.org";
const LINK_TOKEN_PREFIX = "tg-link:";
const LINK_TTL_MINUTES = 30;

export class TelegramNotConfiguredError extends Error {
  constructor() {
    super("Telegram bot не настроен (TELEGRAM_BOT_TOKEN отсутствует)");
    this.name = "TelegramNotConfiguredError";
  }
}

function botToken(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new TelegramNotConfiguredError();
  return t;
}

export async function sendTelegramMessage(chatId: string | number, text: string, parseMode: "HTML" | "MarkdownV2" = "HTML") {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [DEV-MODE TG] To: ${chatId}\n${text}`);
      return { ok: true };
    }
    return { ok: false, error: "Bot not configured" };
  }

  const response = await fetch(`${TG_API_BASE}/bot${botToken()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true }),
  });
  if (!response.ok) {
    const err = await response.text();
    console.error("[telegram] sendMessage failed:", err);
    return { ok: false, error: err };
  }
  return { ok: true };
}

/**
 * Генерирует одноразовый токен для привязки Telegram-чата к пользователю.
 * Возвращает deep-link для t.me/<bot>?start=<token>.
 */
export async function generateLinkToken(userId: string): Promise<{ token: string; deepLink: string }> {
  // Удалить старые токены пользователя
  await prisma.verificationToken.deleteMany({
    where: { identifier: `${LINK_TOKEN_PREFIX}${userId}` },
  });

  const token = randomBytes(16).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: `${LINK_TOKEN_PREFIX}${userId}`,
      token,
      expires: addMinutes(new Date(), LINK_TTL_MINUTES),
    },
  });

  const botUsername = process.env.TELEGRAM_BOT_USERNAME || "kanavto_bot";
  return {
    token,
    deepLink: `https://t.me/${botUsername}?start=${token}`,
  };
}

/**
 * Найти userId по токену из /start <token> и удалить токен.
 */
export async function consumeLinkToken(token: string): Promise<string | null> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return null;
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }
  if (!record.identifier.startsWith(LINK_TOKEN_PREFIX)) return null;
  const userId = record.identifier.slice(LINK_TOKEN_PREFIX.length);
  await prisma.verificationToken.delete({ where: { token } });
  return userId;
}
