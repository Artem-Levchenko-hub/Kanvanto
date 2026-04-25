"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { CarBrand } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/rbac";
import { archiveBranch, createBranch, updateBranch } from "@/lib/db/branches";

const upsertSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(80).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().min(5).max(50),
  email: z.string().email().optional().or(z.literal("")),
  openHours: z.record(z.string(), z.string()),
  brandsSupported: z.array(z.nativeEnum(CarBrand)),
  capacity: z.number().int().min(1).max(100),
  isHQ: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function createBranchAction(input: z.infer<typeof upsertSchema>) {
  await requireAdmin();
  const parsed = upsertSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Проверьте поля", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  try {
    const created = await createBranch({ ...parsed.data, email: parsed.data.email || null });
    revalidatePath("/admin/branches");
    revalidatePath("/locations");
    revalidatePath("/");
    return { ok: true as const, id: created.id };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function updateBranchAction(id: string, input: Partial<z.infer<typeof upsertSchema>>) {
  await requireAdmin();
  try {
    await updateBranch(id, { ...input, email: input.email || null });
    revalidatePath("/admin/branches");
    revalidatePath(`/admin/branches/${id}`);
    revalidatePath("/locations");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export async function archiveBranchAction(id: string) {
  await requireAdmin();
  try {
    await archiveBranch(id);
    revalidatePath("/admin/branches");
    revalidatePath("/locations");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Ошибка" };
  }
}
