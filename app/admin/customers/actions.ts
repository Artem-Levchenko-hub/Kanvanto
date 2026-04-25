"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/rbac";
import { updateUserRole } from "@/lib/db/users";

export async function setUserRoleAction(userId: string, role: UserRole) {
  await requireAdmin();
  const parsed = z.nativeEnum(UserRole).safeParse(role);
  if (!parsed.success) return { ok: false as const, error: "Некорректная роль" };
  try {
    await updateUserRole(userId, parsed.data);
    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${userId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}
