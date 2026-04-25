import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { consumeLinkToken, sendTelegramMessage } from "@/lib/telegram/bot";
import { getNextReminderForUser } from "@/lib/db/maintenance";
import { getActiveOrdersForUser } from "@/lib/db/orders";
import { formatTimeUntilDue } from "@/lib/maintenance/engine";
import { MAINTENANCE_TYPE_LABELS } from "@/lib/maintenance/rules";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: { id: number; first_name: string; username?: string };
    chat: { id: number };
    text?: string;
  };
}

export async function POST(request: Request) {
  // Защита через secret в URL
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const message = update.message;
  if (!message?.text) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const text = message.text.trim();

  try {
    if (text.startsWith("/start")) {
      const tokenPart = text.split(" ")[1]?.trim();
      if (!tokenPart) {
        await sendTelegramMessage(
          chatId,
          "👋 Привет! Я бот <b>Kanavto</b>.\n\nЧтобы получать напоминания о ТО — войдите в личный кабинет на kanavto.com и нажмите «Привязать Telegram».\n\nКоманды:\n/status — мои активные заказы\n/to — следующее ТО"
        );
        return NextResponse.json({ ok: true });
      }
      const userId = await consumeLinkToken(tokenPart);
      if (!userId) {
        await sendTelegramMessage(chatId, "❌ Токен недействителен или истёк. Сгенерируйте новый в кабинете.");
        return NextResponse.json({ ok: true });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          telegramId: String(chatId),
          notifyTelegram: true,
        },
      });

      await sendTelegramMessage(
        chatId,
        "✅ <b>Готово!</b>\n\nTelegram привязан к вашему аккаунту. Будем присылать напоминания о ТО и статусы заказов сюда.\n\n<i>Команды:</i>\n/status — активные заказы\n/to — следующее ТО"
      );
      return NextResponse.json({ ok: true });
    }

    // Все остальные команды требуют linked user
    const user = await prisma.user.findFirst({ where: { telegramId: String(chatId) } });
    if (!user) {
      await sendTelegramMessage(chatId, "🔒 Аккаунт не привязан. Войдите в кабинет на kanavto.com и нажмите «Привязать Telegram».");
      return NextResponse.json({ ok: true });
    }

    if (text === "/to" || text === "/maintenance") {
      const next = await getNextReminderForUser(user.id);
      if (!next) {
        await sendTelegramMessage(chatId, "✨ Активных напоминаний нет. Все ваши авто в порядке.");
      } else {
        const f = formatTimeUntilDue({
          dueAt: next.dueAt,
          dueAtMileage: next.dueAtMileage,
          currentMileage: next.car.mileage,
          avgKmPerMonth: 1500,
        });
        await sendTelegramMessage(
          chatId,
          `🔧 <b>${MAINTENANCE_TYPE_LABELS[next.type]}</b>\n\n${next.car.brand} ${next.car.model} ${next.car.year}\n${f.primary}\n${f.secondary || ""}\n\nЗаписаться: ${process.env.NEXT_PUBLIC_SITE_URL}/booking`
        );
      }
      return NextResponse.json({ ok: true });
    }

    if (text === "/status" || text === "/orders") {
      const orders = await getActiveOrdersForUser(user.id);
      if (orders.length === 0) {
        await sendTelegramMessage(chatId, "Нет активных заказов.");
      } else {
        const lines = orders.map((o) =>
          `📋 <b>${o.number}</b> — ${o.car.brand} ${o.car.model}\n${o.items.map((i) => i.title).join(", ") || "—"}\n${o.branch.name}`
        );
        await sendTelegramMessage(chatId, `Активные заказы:\n\n${lines.join("\n\n")}`);
      }
      return NextResponse.json({ ok: true });
    }

    await sendTelegramMessage(
      chatId,
      "Не понял команду. Попробуйте:\n/status — активные заказы\n/to — следующее ТО"
    );
  } catch (e) {
    console.error("[telegram webhook]", e);
  }

  return NextResponse.json({ ok: true });
}
