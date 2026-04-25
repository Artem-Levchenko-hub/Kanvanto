"use server";

import { revalidatePath } from "next/cache";
import { addDays } from "date-fns";
import { requireUser } from "@/lib/auth/rbac";
import { markReminderDone, snoozeReminder } from "@/lib/db/maintenance";

export async function snoozeReminderAction(reminderId: string, days: number) {
  const user = await requireUser();
  try {
    await snoozeReminder(reminderId, user.id, addDays(new Date(), days));
    revalidatePath("/account");
    revalidatePath("/account/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function markReminderDoneAction(reminderId: string, mileage: number) {
  const user = await requireUser();
  try {
    await markReminderDone({
      reminderId,
      userId: user.id,
      doneAt: new Date(),
      doneMileage: mileage,
    });
    revalidatePath("/account");
    revalidatePath("/account/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}
