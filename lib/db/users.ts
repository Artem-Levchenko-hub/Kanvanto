import { prisma } from "@/lib/db/client";
import type { Prisma, User, UserRole } from "@prisma/client";

export async function getUserByPhone(phone: string): Promise<User | null> {
  const normalized = normalizePhone(phone);
  return prisma.user.findUnique({ where: { phone: normalized } });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function findOrCreateUserByPhone(phone: string, name?: string): Promise<User> {
  const normalized = normalizePhone(phone);
  return prisma.user.upsert({
    where: { phone: normalized },
    update: {},
    create: { phone: normalized, name: name ?? null },
  });
}

export async function updateUserNotifications(
  userId: string,
  data: { notifyEmail?: boolean; notifySms?: boolean; notifyTelegram?: boolean; remindDaysBefore?: number[] }
): Promise<User> {
  return prisma.user.update({ where: { id: userId }, data });
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return "+7" + digits.slice(1);
  }
  if (digits.length === 10) return "+7" + digits;
  if (phone.startsWith("+")) return "+" + digits;
  return "+" + digits;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export interface ListUsersFilters {
  search?: string;
  role?: UserRole;
  page?: number;
  pageSize?: number;
}

export async function listUsersForAdmin(filters: ListUsersFilters = {}) {
  const where: Prisma.UserWhereInput = {};
  if (filters.role) where.role = filters.role;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        _count: { select: { cars: true, orders: true, bookings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getUserDetailForAdmin(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      cars: { where: { isActive: true } },
      orders: {
        orderBy: { startedAt: "desc" },
        take: 20,
        include: {
          car: { select: { brand: true, model: true } },
          branch: { select: { name: true } },
        },
      },
      bookings: {
        orderBy: { scheduledAt: "desc" },
        take: 20,
        include: {
          service: { select: { title: true } },
          branch: { select: { name: true } },
        },
      },
      _count: { select: { cars: true, orders: true, bookings: true, bonuses: true } },
    },
  });
}

export async function updateUserRole(userId: string, role: UserRole) {
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

/**
 * GDPR-friendly удаление: cascade удаляет связанные сущности
 * (благодаря onDelete: Cascade в Prisma schema).
 */
export async function deleteUserAccount(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.account.deleteMany({ where: { userId } });
  return prisma.user.delete({ where: { id: userId } });
}
