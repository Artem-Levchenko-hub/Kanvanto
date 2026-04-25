"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ServiceCategory } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/rbac";
import { archiveService, createService, updateService } from "@/lib/db/services";

const upsertSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "Только строчные латинские буквы, цифры, дефис"),
  title: z.string().min(2).max(120),
  shortDescription: z.string().min(2).max(500),
  fullDescription: z.string().max(5000).optional(),
  category: z.nativeEnum(ServiceCategory),
  durationMinutes: z.number().int().min(5).max(2880),
  basePrice: z.number().int().min(0).max(10_000_000),
  iconName: z.string().optional(),
  isFlagship: z.boolean().optional(),
  isExclusive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function createServiceAction(input: z.infer<typeof upsertSchema>) {
  await requireAdmin();
  const parsed = upsertSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Проверьте поля", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  try {
    const created = await createService(parsed.data);
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/");
    return { ok: true as const, id: created.id };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function updateServiceAction(id: string, input: Partial<z.infer<typeof upsertSchema>>) {
  await requireAdmin();
  try {
    await updateService(id, input);
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    revalidatePath("/services");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function archiveServiceAction(id: string) {
  await requireAdmin();
  try {
    await archiveService(id);
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}
