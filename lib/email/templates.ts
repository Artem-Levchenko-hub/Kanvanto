import { formatDate, formatPrice } from "@/lib/utils/format";

export function magicLinkEmail({ url, host }: { url: string; host: string }): { subject: string; html: string; text: string } {
  return {
    subject: `Вход в Kanavto`,
    html: `
<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><title>Вход в Kanavto</title></head>
<body style="margin:0; padding:0; background:#0A0A0B; font-family:'Jost', sans-serif; color:#F5F5F7;">
  <div style="max-width:560px; margin:0 auto; padding:40px 24px;">
    <div style="background:#17171B; border:1px solid rgba(58,58,68,0.4); border-radius:16px; padding:40px; text-align:left;">
      <div style="display:inline-flex; align-items:center; gap:12px; margin-bottom:32px;">
        <div style="width:40px; height:40px; background:#DC2626; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-family:'Playfair Display', serif; font-weight:700; color:#fff; font-size:20px;">K</div>
        <span style="font-family:'Playfair Display', serif; font-size:24px; color:#F5F5F7;">Kanavto</span>
      </div>
      <h1 style="font-family:'Playfair Display', serif; font-size:32px; font-weight:600; line-height:1.2; margin:0 0 16px; color:#F5F5F7;">Вход в личный кабинет</h1>
      <p style="font-size:16px; line-height:1.6; color:#A8A8B0; margin:0 0 32px;">Нажмите на кнопку ниже, чтобы войти. Ссылка действует 24 часа.</p>
      <a href="${url}" style="display:inline-block; background:#DC2626; color:#fff; padding:14px 32px; border-radius:12px; font-weight:600; text-decoration:none; font-size:16px;">Войти в Kanavto</a>
      <p style="font-size:13px; color:#6E6E76; margin:32px 0 0;">Если кнопка не работает, скопируйте ссылку в адресную строку браузера:<br><span style="color:#A8A8B0; word-break:break-all;">${url}</span></p>
      <hr style="border:none; border-top:1px solid rgba(58,58,68,0.4); margin:32px 0;">
      <p style="font-size:12px; color:#6E6E76; margin:0;">Если вы не запрашивали вход — просто проигнорируйте это письмо. ${host}</p>
    </div>
  </div>
</body>
</html>`,
    text: `Вход в Kanavto\n\nНажмите ссылку чтобы войти (действует 24 часа):\n${url}\n\nЕсли не запрашивали — проигнорируйте.`,
  };
}

export function bookingConfirmationEmail(args: {
  name: string;
  serviceTitle: string;
  branchName: string;
  branchAddress: string;
  scheduledAt: Date;
  estimatedPrice?: number;
  bookingId: string;
  magicLinkUrl?: string;
}): { subject: string; html: string; text: string } {
  const dateStr = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(args.scheduledAt);

  return {
    subject: `Запись подтверждена — ${dateStr}`,
    html: `
<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><title>Запись подтверждена</title></head>
<body style="margin:0; padding:0; background:#0A0A0B; font-family:'Jost', sans-serif; color:#F5F5F7;">
  <div style="max-width:560px; margin:0 auto; padding:40px 24px;">
    <div style="background:#17171B; border:1px solid rgba(58,58,68,0.4); border-radius:16px; padding:40px;">
      <div style="display:inline-flex; align-items:center; gap:12px; margin-bottom:32px;">
        <div style="width:40px; height:40px; background:#DC2626; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-family:'Playfair Display', serif; font-weight:700; color:#fff; font-size:20px;">K</div>
        <span style="font-family:'Playfair Display', serif; font-size:24px; color:#F5F5F7;">Kanavto</span>
      </div>
      <h1 style="font-family:'Playfair Display', serif; font-size:28px; font-weight:600; margin:0 0 8px; color:#F5F5F7;">${args.name}, спасибо за запись!</h1>
      <p style="font-size:16px; color:#A8A8B0; margin:0 0 32px;">Ждём вас в назначенное время. Если что-то изменилось — напишите или позвоните.</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:32px;">
        <tr><td style="padding:12px 0; border-bottom:1px solid rgba(58,58,68,0.4); color:#6E6E76; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Услуга</td><td style="padding:12px 0; border-bottom:1px solid rgba(58,58,68,0.4); color:#F5F5F7; font-weight:500; text-align:right;">${args.serviceTitle}</td></tr>
        <tr><td style="padding:12px 0; border-bottom:1px solid rgba(58,58,68,0.4); color:#6E6E76; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Дата и время</td><td style="padding:12px 0; border-bottom:1px solid rgba(58,58,68,0.4); color:#F5F5F7; font-weight:500; text-align:right;">${dateStr}</td></tr>
        <tr><td style="padding:12px 0; border-bottom:1px solid rgba(58,58,68,0.4); color:#6E6E76; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Филиал</td><td style="padding:12px 0; border-bottom:1px solid rgba(58,58,68,0.4); color:#F5F5F7; text-align:right;">${args.branchName}<br><span style="color:#A8A8B0; font-size:13px;">${args.branchAddress}</span></td></tr>
        ${args.estimatedPrice ? `<tr><td style="padding:12px 0; color:#6E6E76; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Ориентир. цена</td><td style="padding:12px 0; color:#C0C0C8; font-family:monospace; font-weight:600; text-align:right;">от ${formatPrice(args.estimatedPrice)}</td></tr>` : ""}
      </table>

      ${args.magicLinkUrl ? `
      <div style="background:#1F1F25; border:1px solid rgba(220,38,38,0.3); border-radius:12px; padding:20px; margin-bottom:24px;">
        <p style="font-size:14px; color:#F5F5F7; margin:0 0 12px; font-weight:500;">Закрепите запись за личным кабинетом</p>
        <p style="font-size:13px; color:#A8A8B0; margin:0 0 16px;">Войдите по ссылке ниже — все данные о вашем авто и истории работ сохранятся в одном месте, и мы сможем напоминать о ТО.</p>
        <a href="${args.magicLinkUrl}" style="display:inline-block; background:#DC2626; color:#fff; padding:12px 24px; border-radius:8px; font-weight:600; text-decoration:none; font-size:14px;">Активировать кабинет</a>
      </div>` : ""}

      <p style="font-size:13px; color:#6E6E76; margin:24px 0 0;">Номер записи: <span style="font-family:monospace; color:#A8A8B0;">${args.bookingId}</span></p>
    </div>
  </div>
</body>
</html>`,
    text: `${args.name}, спасибо за запись!\n\nУслуга: ${args.serviceTitle}\nДата: ${dateStr}\nФилиал: ${args.branchName} (${args.branchAddress})\n${args.estimatedPrice ? `Ориентир. цена: от ${formatPrice(args.estimatedPrice)}\n` : ""}\nНомер: ${args.bookingId}\n${args.magicLinkUrl ? `\nЗакрепить запись за кабинетом: ${args.magicLinkUrl}` : ""}`,
  };
}
