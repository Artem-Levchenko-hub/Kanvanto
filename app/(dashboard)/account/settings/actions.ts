"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/client";
import { deleteUserAccount } from "@/lib/db/users";
import { generateLinkToken } from "@/lib/telegram/bot";
import { signOut } from "@/auth";

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

const notificationsSchema = z.object({
  notifyEmail: z.boolean(),
  notifySms: z.boolean(),
  notifyTelegram: z.boolean(),
  remindDaysBefore: z.array(z.number().int().min(1).max(60)).max(5),
});

export async function updateProfile(input: z.infer<typeof profileSchema>) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Некорректные данные" };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
        ...(parsed.data.email !== undefined
          ? { email: parsed.data.email ? parsed.data.email.toLowerCase() : null }
          : {}),
      },
    });
    revalidatePath("/account/settings");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function updateNotifications(input: z.infer<typeof notificationsSchema>) {
  const user = await requireUser();
  const parsed = notificationsSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Некорректные данные" };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        notifyEmail: parsed.data.notifyEmail,
        notifySms: parsed.data.notifySms,
        notifyTelegram: parsed.data.notifyTelegram,
        remindDaysBefore: parsed.data.remindDaysBefore,
      },
    });
    revalidatePath("/account/settings");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function generateTelegramLinkAction() {
  const user = await requireUser();
  try {
    const { deepLink } = await generateLinkToken(user.id);
    return { ok: true as const, deepLink };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function unlinkTelegramAction() {
  const user = await requireUser();
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { telegramId: null, notifyTelegram: false },
    });
    revalidatePath("/account/settings");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

const deleteAccountSchema = z.object({
  confirmation: z.string().refine((v) => v.toLowerCase() === "удалить", "Введите слово «удалить» для подтверждения"),
});

export async function deleteAccountAction(input: z.infer<typeof deleteAccountSchema>) {
  const user = await requireUser();
  const parsed = deleteAccountSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.flatten().fieldErrors.confirmation?.[0] ?? "Подтверждение неверное",
    };
  }

  try {
    await deleteUserAccount(user.id);
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Не удалось удалить аккаунт" };
  }

  // signOut обязательно после удаления
  await signOut({ redirect: false });
  redirect("/?deleted=1");
}
