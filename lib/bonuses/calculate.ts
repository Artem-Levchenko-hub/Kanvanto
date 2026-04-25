import { prisma } from "@/lib/db/client";
import { BONUS_LEVEL_ORDER, BONUS_THRESHOLDS } from "@/lib/db/bonuses";
import type { BonusLevel } from "@prisma/client";

const EARN_RATE = 0.01; // 1% от totalAmount → бонусы

export function computeBonusLevel(totalSpent: number): BonusLevel {
  let level: BonusLevel = "BRONZE";
  for (const lvl of BONUS_LEVEL_ORDER) {
    if (totalSpent >= BONUS_THRESHOLDS[lvl].min) level = lvl;
  }
  return level;
}

/**
 * Начисляет бонусы за выполненный заказ (transactional).
 * Создаёт BonusTransaction (EARN) + обновляет User.bonusBalance/totalSpent/bonusLevel.
 *
 * Идемпотентно по `orderId`: если транзакция уже есть для заказа — не дублирует.
 */
export async function accrueBonusesForOrder(orderId: string): Promise<{
  earned: number;
  newBalance: number;
  newLevel: BonusLevel;
  levelUp: boolean;
} | null> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");
    if (order.status !== "COMPLETED") return null;

    // Идемпотентность: ищем существующую EARN-транзакцию по этому заказу
    const existing = await tx.bonusTransaction.findFirst({
      where: { orderId: order.id, type: "EARN" },
    });
    if (existing) return null;

    const earned = Math.floor(order.totalAmount * EARN_RATE);
    if (earned <= 0) return null;

    const user = await tx.user.findUnique({ where: { id: order.userId } });
    if (!user) throw new Error("User not found");

    const newBalance = user.bonusBalance + earned;
    const newTotalSpent = user.totalSpent + order.totalAmount;
    const newLevel = computeBonusLevel(newTotalSpent);
    const levelUp = newLevel !== user.bonusLevel;

    await tx.bonusTransaction.create({
      data: {
        userId: user.id,
        orderId: order.id,
        amount: earned,
        type: "EARN",
        description: `Заказ ${order.number}`,
        balanceAfter: newBalance,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        bonusBalance: newBalance,
        totalSpent: newTotalSpent,
        bonusLevel: newLevel,
      },
    });

    return { earned, newBalance, newLevel, levelUp };
  });
}
