import { prisma } from "@/lib/db/client";
import type { Branch, CarBrand } from "@prisma/client";

export async function listBranchesForAdmin() {
  return prisma.branch.findMany({
    orderBy: [{ isHQ: "desc" }, { sortOrder: "asc" }],
  });
}

export async function getBranchById(id: string) {
  return prisma.branch.findUnique({ where: { id } });
}

export interface CreateBranchInput {
  slug: string;
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string | null;
  openHours: Record<string, string>;
  brandsSupported: CarBrand[];
  capacity: number;
  isHQ?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export async function createBranch(input: CreateBranchInput): Promise<Branch> {
  return prisma.branch.create({
    data: {
      slug: input.slug,
      name: input.name,
      address: input.address,
      city: input.city || "Краснодар",
      latitude: input.latitude,
      longitude: input.longitude,
      phone: input.phone,
      email: input.email || null,
      openHours: input.openHours,
      brandsSupported: input.brandsSupported,
      capacity: input.capacity,
      isHQ: !!input.isHQ,
      isActive: input.isActive !== false,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function updateBranch(id: string, input: Partial<CreateBranchInput>): Promise<Branch> {
  return prisma.branch.update({
    where: { id },
    data: {
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.latitude !== undefined && { latitude: input.latitude }),
      ...(input.longitude !== undefined && { longitude: input.longitude }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.email !== undefined && { email: input.email || null }),
      ...(input.openHours !== undefined && { openHours: input.openHours }),
      ...(input.brandsSupported !== undefined && { brandsSupported: input.brandsSupported }),
      ...(input.capacity !== undefined && { capacity: input.capacity }),
      ...(input.isHQ !== undefined && { isHQ: input.isHQ }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

export async function archiveBranch(id: string): Promise<Branch> {
  return prisma.branch.update({ where: { id }, data: { isActive: false } });
}
