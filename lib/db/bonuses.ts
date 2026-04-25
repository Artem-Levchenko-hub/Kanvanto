import { prisma } from "@/lib/db/client";
import type { BonusLevel } from "@prisma/client";

export const BONUS_THRESHOLDS: Record<BonusLevel, { min: number; discount: number; label: string }> = {
  BRONZE: { min: 0, discount: 0, label: "Bronze" },
  SILVER: { min: 10000, discount: 3, label: "Silver" },
  GOLD: { min: 25000, discount: 5, label: "Gold" },
  PLATINUM: { min: 50000, discount: 10, label: "Platinum" },
};

export const BONUS_LEVEL_ORDER: BonusLevel[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

export async function getBonusOverview(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { bonusBalance: true, bonusLevel: true, totalSpent: true },
  });

  if (!user) throw new Error("Пользователь не найден");

  const currentIdx = BONUS_LEVEL_ORDER.indexOf(user.bonusLevel);
  const nextLevel = BONUS_LEVEL_ORDER[currentIdx + 1] ?? null;
  const nextThreshold = nextLevel ? BONUS_THRESHOLDS[nextLevel].min : null;
  const remaining = nextThreshold ? Math.max(nextThreshold - user.totalSpent, 0) : 0;

  return {
    balance: user.bonusBalance,
    level: user.bonusLevel,
    levelLabel: BONUS_THRESHOLDS[user.bonusLevel].label,
    discount: BONUS_THRESHOLDS[user.bonusLevel].discount,
    totalSpent: user.totalSpent,
    nextLevel,
    nextLevelLabel: nextLevel ? BONUS_THRESHOLDS[nextLevel].label : null,
    nextThreshold,
    remainingToNext: remaining,
  };
}

export async function getBonusTransactions(userId: string, limit = 50) {
  return prisma.bonusTransaction.findMany({
    where: { userId },
    include: {
      order: { select: { number: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
