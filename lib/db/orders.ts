import { prisma } from "@/lib/db/client";
import type { OrderStatus, OrderItemType, PartOrigin, Prisma } from "@prisma/client";

export async function getMyOrders(userId: string, filters?: { status?: OrderStatus[]; carId?: string }) {
  return prisma.order.findMany({
    where: {
      userId,
      ...(filters?.status?.length ? { status: { in: filters.status } } : {}),
      ...(filters?.carId ? { carId: filters.carId } : {}),
    },
    include: {
      car: { select: { brand: true, model: true, year: true } },
      branch: { select: { name: true, address: true } },
      items: true,
    },
    orderBy: { startedAt: "desc" },
  });
}

export async function getOrderById(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      car: true,
      branch: true,
      items: { orderBy: { type: "asc" } },
      bonusTransaction: true,
    },
  });
}

export async function getActiveOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId, status: { in: ["IN_PROGRESS"] } },
    include: {
      car: { select: { brand: true, model: true } },
      branch: { select: { name: true } },
      items: true,
    },
    orderBy: { startedAt: "desc" },
  });
}

export interface CompleteBookingInput {
  bookingId: string;
  masterName: string;
  totalAmount: number;
  laborAmount: number;
  partsAmount: number;
  discountAmount?: number;
  warrantyMonths?: number;
  warrantyKm?: number;
  mileageAtService: number;
  items: Array<{
    title: string;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    type: OrderItemType;
    partOrigin?: PartOrigin | null;
    partNumber?: string | null;
    serviceId?: string | null;
  }>;
}

/**
 * Конвертирует Booking в полноценный Order с items.
 * Используется в admin-панели после фактического выполнения работ.
 *
 * Транзакционно:
 *  1. Создаёт Order (status=COMPLETED)
 *  2. Создаёт OrderItem-ы
 *  3. Меняет Booking.status → COMPLETED
 *  4. Возвращает Order для дальнейшего accrual бонусов
 */
export async function completeBookingAsOrder(input: CompleteBookingInput) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: input.bookingId },
      include: { car: true, branch: true, service: true },
    });
    if (!booking) throw new Error("Запись не найдена");
    if (!booking.userId || !booking.carId) {
      throw new Error("Невозможно конвертировать гостевую запись без userId/carId. Сначала закрепите запись за клиентом.");
    }

    // Сгенерировать читаемый номер
    const yearPart = new Date().getFullYear();
    const counter = await tx.order.count({
      where: { number: { startsWith: `KAN-${yearPart}-` } },
    });
    const number = `KAN-${yearPart}-${String(counter + 1).padStart(6, "0")}`;

    const order = await tx.order.create({
      data: {
        number,
        bookingId: booking.id,
        userId: booking.userId,
        carId: booking.carId,
        branchId: booking.branchId,
        status: "COMPLETED",
        startedAt: booking.scheduledAt,
        completedAt: new Date(),
        totalAmount: input.totalAmount,
        laborAmount: input.laborAmount,
        partsAmount: input.partsAmount,
        discountAmount: input.discountAmount ?? 0,
        warrantyMonths: input.warrantyMonths ?? 12,
        warrantyKm: input.warrantyKm ?? 20000,
        warrantyStartDate: new Date(),
        masterName: input.masterName,
        mileageAtService: input.mileageAtService,
        items: {
          create: input.items.map((item) => ({
            title: item.title,
            description: item.description || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            type: item.type,
            partOrigin: item.partOrigin || null,
            partNumber: item.partNumber || null,
            serviceId: item.serviceId || null,
          })),
        },
      },
      include: { items: true },
    });

    await tx.booking.update({
      where: { id: booking.id },
      data: { status: "COMPLETED" },
    });

    return order;
  });
}

export async function listOrdersForAdmin(filters: { search?: string; status?: OrderStatus[]; page?: number; pageSize?: number } = {}) {
  const where: Prisma.OrderWhereInput = {};
  if (filters.status?.length) where.status = { in: filters.status };
  if (filters.search) {
    where.OR = [
      { number: { contains: filters.search, mode: "insensitive" } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
      { user: { phone: { contains: filters.search } } },
    ];
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true } },
        car: { select: { brand: true, model: true, year: true } },
        branch: { select: { name: true } },
        items: { take: 3 },
      },
      orderBy: { startedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getOrdersForMaster(masterName: string) {
  return prisma.order.findMany({
    where: {
      masterName,
      status: { in: ["IN_PROGRESS", "COMPLETED"] },
    },
    include: {
      car: { select: { brand: true, model: true, year: true } },
      branch: { select: { name: true } },
      user: { select: { name: true, phone: true } },
      items: { take: 5 },
    },
    orderBy: { startedAt: "desc" },
    take: 50,
  });
}
