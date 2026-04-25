import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { NotificationsForm } from "@/components/dashboard/NotificationsForm";
import { TelegramLinkSection } from "@/components/dashboard/TelegramLinkSection";
import { DeleteAccountDialog } from "@/components/dashboard/DeleteAccountDialog";

export const metadata = { title: "Настройки" };

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      notifyEmail: true,
      notifySms: true,
      notifyTelegram: true,
      remindDaysBefore: true,
      telegramId: true,
    },
  });

  if (!user) return null;

  return (
    <Container className="py-6 lg:py-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-h1 text-graphite-50">Настройки</h1>
        <p className="mt-2 text-body-base text-graphite-200">
          Профиль, каналы уведомлений, безопасность.
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-chrome mb-4">Профиль</p>
          <ProfileForm
            initialName={user.name || ""}
            initialEmail={user.email || ""}
            phone={user.phone}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-chrome mb-4">
            Уведомления о ТО
          </p>
          <NotificationsForm
            initialEmail={user.notifyEmail}
            initialSms={user.notifySms}
            initialTelegram={user.notifyTelegram}
            initialDays={user.remindDaysBefore}
            telegramConnected={!!user.telegramId}
            hasEmail={!!user.email}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-chrome mb-4">Telegram</p>
          <p className="text-body-sm text-graphite-200 mb-4">
            Привяжите Telegram-бота — напоминания о ТО и статусы заказов будут приходить туда же,
            где у вас все остальные чаты.
          </p>
          <TelegramLinkSection isLinked={!!user.telegramId} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-caption uppercase tracking-wider text-error mb-3">Опасная зона</p>
          <p className="text-body-sm text-graphite-200 mb-4">
            Удаление аккаунта необратимо: история заказов, авто и бонусы будут удалены безвозвратно.
            Запрос на удаление обрабатывается до 24 часов согласно требованиям 152-ФЗ.
          </p>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </Container>
  );
}
