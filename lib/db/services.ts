import { prisma } from "@/lib/db/client";
import type { Service, ServiceCategory } from "@prisma/client";

export async function listServicesForAdmin() {
  return prisma.service.findMany({
    orderBy: [{ isFlagship: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export interface CreateServiceInput {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string | null;
  category: ServiceCategory;
  durationMinutes: number;
  basePrice: number;
  priceByBrand?: Record<string, number> | null;
  iconName?: string | null;
  isFlagship?: boolean;
  isExclusive?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createService(input: CreateServiceInput): Promise<Service> {
  return prisma.service.create({
    data: {
      slug: input.slug,
      title: input.title,
      shortDescription: input.shortDescription,
      fullDescription: input.fullDescription || null,
      category: input.category,
      durationMinutes: input.durationMinutes,
      basePrice: input.basePrice,
      priceByBrand: input.priceByBrand ?? undefined,
      iconName: input.iconName || null,
      isFlagship: !!input.isFlagship,
      isExclusive: !!input.isExclusive,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive !== false,
    },
  });
}

export async function updateService(id: string, input: Partial<CreateServiceInput>): Promise<Service> {
  return prisma.service.update({
    where: { id },
    data: {
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.shortDescription !== undefined && { shortDescription: input.shortDescription }),
      ...(input.fullDescription !== undefined && { fullDescription: input.fullDescription || null }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.durationMinutes !== undefined && { durationMinutes: input.durationMinutes }),
      ...(input.basePrice !== undefined && { basePrice: input.basePrice }),
      ...(input.priceByBrand !== undefined && { priceByBrand: input.priceByBrand ?? undefined }),
      ...(input.iconName !== undefined && { iconName: input.iconName || null }),
      ...(input.isFlagship !== undefined && { isFlagship: input.isFlagship }),
      ...(input.isExclusive !== undefined && { isExclusive: input.isExclusive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
  });
}

export async function archiveService(id: string): Promise<Service> {
  return prisma.service.update({ where: { id }, data: { isActive: false } });
}
