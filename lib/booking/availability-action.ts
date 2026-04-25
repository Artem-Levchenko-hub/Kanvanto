"use server";

import { prisma } from "@/lib/db/client";
import { computeSlots } from "@/lib/booking/availability";

export async function fetchAvailability(args: {
  branchSlug: string;
  serviceId: string;
  dateISO: string;
}): Promise<{ slots: Array<{ start: string; end: string; available: boolean }> }> {
  const [branch, service] = await Promise.all([
    prisma.branch.findUnique({ where: { slug: args.branchSlug } }),
    prisma.service.findUnique({ where: { id: args.serviceId } }),
  ]);

  if (!branch || !service) return { slots: [] };

  const date = new Date(args.dateISO);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.booking.findMany({
    where: {
      branchId: branch.id,
      scheduledAt: { gte: startOfDay, lte: endOfDay },
      status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS"] },
    },
    select: { scheduledAt: true, durationMinutes: true },
  });

  const slots = computeSlots({
    openHours: branch.openHours as Record<string, string>,
    durationMinutes: service.durationMinutes,
    capacity: branch.capacity,
    existingBookings: existing,
    date,
  });

  return {
    slots: slots.map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
      available: s.available,
    })),
  };
}
