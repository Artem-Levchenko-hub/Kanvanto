import { prisma } from "@/lib/db/client";
import type { Booking, BookingStatus, Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";

const ACTIVE_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS"];

export async function getActiveBookingsForBranchAndDate(branchId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.booking.findMany({
    where: {
      branchId,
      scheduledAt: { gte: start, lte: end },
      status: { in: ACTIVE_STATUSES },
    },
    select: { scheduledAt: true, durationMinutes: true },
    orderBy: { scheduledAt: "asc" },
  });
}

export async function getActiveBookingsForBranchInRange(branchId: string, from: Date, to: Date) {
  return prisma.booking.findMany({
    where: {
      branchId,
      scheduledAt: { gte: from, lte: to },
      status: { in: ACTIVE_STATUSES },
    },
    select: { scheduledAt: true, durationMinutes: true },
    orderBy: { scheduledAt: "asc" },
  });
}

export async function listBookingsForAdmin(filters: {
  status?: BookingStatus[];
  branchId?: string;
  search?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}) {
  const where: Prisma.BookingWhereInput = {};
  if (filters.status?.length) where.status = { in: filters.status };
  if (filters.branchId) where.branchId = filters.branchId;
  if (filters.from || filters.to) {
    where.scheduledAt = {};
    if (filters.from) where.scheduledAt.gte = filters.from;
    if (filters.to) where.scheduledAt.lte = filters.to;
  }
  if (filters.search) {
    where.OR = [
      { guestName: { contains: filters.search, mode: "insensitive" } },
      { guestPhone: { contains: filters.search } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
      { user: { phone: { contains: filters.search } } },
    ];
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;

  const [items, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true, email: true } },
        car: { select: { brand: true, model: true, year: true } },
        service: { select: { title: true, slug: true } },
        branch: { select: { name: true, slug: true } },
      },
      orderBy: { scheduledAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      car: true,
      service: true,
      branch: true,
    },
  });
}

export async function createBookingTx(args: {
  userId: string | null;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  carId: string | null;
  guestCarBrand: string | null;
  guestCarModel: string | null;
  guestCarYear: number | null;
  serviceId: string;
  branchId: string;
  scheduledAt: Date;
  durationMinutes: number;
  estimatedPrice: number | null;
  notes: string | null;
}): Promise<Booking> {
  return prisma.$transaction(async (tx) => {
    // Capacity check внутри транзакции
    const branch = await tx.branch.findUnique({ where: { id: args.branchId } });
    if (!branch) throw new Error("Филиал не найден");

    const slotEnd = addMinutes(args.scheduledAt, args.durationMinutes);
    const overlapping = await tx.booking.count({
      where: {
        branchId: args.branchId,
        status: { in: ACTIVE_STATUSES },
        AND: [
          { scheduledAt: { lt: slotEnd } },
          {
            OR: [
              // Booking overlaps with our slot if it started before our end
              // and its end is after our start. Approximation via duration.
              { scheduledAt: { gte: addMinutes(args.scheduledAt, -480) } },
            ],
          },
        ],
      },
    });

    if (overlapping >= branch.capacity) {
      throw new Error("К сожалению, выбранный слот уже занят. Выберите другое время.");
    }

    return tx.booking.create({
      data: {
        userId: args.userId,
        guestName: args.guestName,
        guestPhone: args.guestPhone,
        guestEmail: args.guestEmail,
        carId: args.carId,
        guestCarBrand: args.guestCarBrand as never,
        guestCarModel: args.guestCarModel,
        guestCarYear: args.guestCarYear,
        serviceId: args.serviceId,
        branchId: args.branchId,
        scheduledAt: args.scheduledAt,
        durationMinutes: args.durationMinutes,
        estimatedPrice: args.estimatedPrice,
        notes: args.notes,
        status: "PENDING",
        source: "WEB",
      },
    });
  });
}
