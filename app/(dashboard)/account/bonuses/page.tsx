import { Sparkles, Gift } from "lucide-react";
import { auth } from "@/auth";
import { getBonusOverview, getBonusTransactions } from "@/lib/db/bonuses";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BonusLadder } from "@/components/dashboard/BonusLadder";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { BonusTransactionType } from "@prisma/client";

export const metadata = { title: "Бонусы" };

const TX_LABELS: Record<BonusTransactionType, string> = {
  EARN: "Начислено",
  REDEEM: "Списано",
  EXPIRE: "Сгорело",
  ADJUST: "Корректировка",
  WELCOME: "Welcome-бонус",
  REFERRAL: "Реферальный бонус",
};

const REWARDS = [
  { title: "Бесплатная диагностика", price: 2500, icon: "🔍" },
  { title: "Замена масла со скидкой 50%", price: 4000, icon: "🛢️" },
  { title: "Бесплатный шиномонтаж", price: 3500, icon: "⚙️" },
  { title: "Развал-схождение в подарок", price: 3500, icon: "🎯" },
];

export default async function BonusesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [overview, transactions] = await Promise.all([
    getBonusOverview(userId),
    getBonusTransactions(userId),
  ]);

  return (
    <Container className="py-6 lg:py-10">
      <div className="mb-6">
        <h1 className="font-display text-h1 text-graphite-50">Бонусы</h1>
        <p className="mt-2 text-body-base text-graphite-200">
          1% от каждого заказа возвращается баллами. Чем больше оборот — тем выше уровень и постоянная скидка.
        </p>
      </div>

      {/* Hero balance */}
      <div className="rounded-xl border border-graphite-500/40 bg-gradient-to-br from-graphite-800 to-graphite-900 p-6 lg:p-10 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 bg-red-glow blur-3xl opacity-30 pointer-events-none" />
        <div className="relative">
          <p className="text-caption uppercase tracking-wider text-chrome">Текущий баланс</p>
          <p className="mt-3 font-display text-display-xl text-chrome leading-[0.95] font-mono tabular-nums">
            {formatPrice(overview.balance)}
          </p>
          <p className="mt-3 text-body-base text-graphite-200">
            1 балл = 1 рубль · списываются автоматически при оплате
          </p>
        </div>
      </div>

      {/* Ladder */}
      <div className="mb-6">
        <BonusLadder
          currentLevel={overview.level}
          totalSpent={overview.totalSpent}
          remainingToNext={overview.remainingToNext}
          nextLevel={overview.nextLevel}
        />
      </div>

      {/* Transactions */}
      {transactions.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-caption uppercase tracking-wider text-chrome mb-4">История начислений</p>
            <div className="divide-y divide-graphite-500/30">
              {transactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-body-sm text-graphite-50">
                      {TX_LABELS[tx.type]}{tx.order ? ` · ${tx.order.number}` : ""}
                    </p>
                    <p className="text-caption text-chrome mt-0.5">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono tabular-nums text-body-base font-semibold ${
                        tx.amount > 0 ? "text-success" : "text-graphite-200"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatPrice(tx.amount)}
                    </p>
                    <p className="text-caption text-chrome">баланс: {formatPrice(tx.balanceAfter)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards */}
      <div className="mb-6">
        <h2 className="font-display text-h3 text-graphite-50 mb-4 flex items-center gap-2">
          <Gift className="size-5 text-red-primary" />
          На что можно потратить
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {REWARDS.map((r) => (
            <Card key={r.title}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-h6 text-graphite-50">{r.title}</p>
                    <p className="mt-1 text-caption text-chrome font-mono tabular-nums">
                      {formatPrice(r.price)}
                    </p>
                  </div>
                  {overview.balance >= r.price ? (
                    <Badge variant="success">Доступно</Badge>
                  ) : (
                    <Badge variant="default" className="text-[10px]">
                      ещё {formatPrice(r.price - overview.balance)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
