import { cn } from "@/lib/utils/cn";
import { BONUS_LEVEL_ORDER, BONUS_THRESHOLDS } from "@/lib/db/bonuses";
import { formatPrice } from "@/lib/utils/format";
import type { BonusLevel } from "@prisma/client";

interface Props {
  currentLevel: BonusLevel;
  totalSpent: number;
  remainingToNext: number;
  nextLevel: BonusLevel | null;
}

export function BonusLadder({ currentLevel, totalSpent, remainingToNext, nextLevel }: Props) {
  const currentIdx = BONUS_LEVEL_ORDER.indexOf(currentLevel);
  const nextIdx = nextLevel ? BONUS_LEVEL_ORDER.indexOf(nextLevel) : null;

  const progressBetween =
    nextIdx !== null
      ? Math.min(
          100,
          Math.max(
            0,
            ((totalSpent - BONUS_THRESHOLDS[currentLevel].min) /
              (BONUS_THRESHOLDS[BONUS_LEVEL_ORDER[nextIdx]].min - BONUS_THRESHOLDS[currentLevel].min)) *
              100
          )
        )
      : 100;

  return (
    <div className="rounded-lg border border-graphite-500/30 bg-graphite-800 p-6">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-caption uppercase tracking-wider text-chrome">Уровень</p>
          <p className="mt-1 font-display text-h2 text-graphite-50">
            {BONUS_THRESHOLDS[currentLevel].label}
          </p>
          <p className="text-body-sm text-graphite-200 mt-1">
            Скидка <span className="text-red-primary font-semibold">{BONUS_THRESHOLDS[currentLevel].discount}%</span>
          </p>
        </div>
        {nextLevel && (
          <div className="text-right">
            <p className="text-caption text-chrome">До {BONUS_THRESHOLDS[nextLevel].label}</p>
            <p className="font-mono tabular-nums text-h5 text-graphite-50 font-semibold mt-1">
              {formatPrice(remainingToNext)}
            </p>
          </div>
        )}
      </div>

      {/* Ladder */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 relative">
          {BONUS_LEVEL_ORDER.map((level, idx) => {
            const isPast = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={level} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                <div
                  className={cn(
                    "size-10 rounded-full grid place-items-center text-[10px] font-bold",
                    isPast && "bg-chrome text-graphite-900",
                    isCurrent && "bg-red-primary text-white shadow-glow-red",
                    !isPast && !isCurrent && "bg-graphite-700 text-graphite-300 border border-graphite-500"
                  )}
                >
                  {BONUS_THRESHOLDS[level].discount}%
                </div>
                <p
                  className={cn(
                    "text-caption text-center font-medium",
                    isCurrent ? "text-graphite-50" : "text-graphite-300"
                  )}
                >
                  {BONUS_THRESHOLDS[level].label}
                </p>
                <p className="text-[10px] text-graphite-400 font-mono tabular-nums">
                  {BONUS_THRESHOLDS[level].min === 0 ? "0" : formatPrice(BONUS_THRESHOLDS[level].min)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Connecting line */}
        <div className="absolute top-5 left-5 right-5 h-px bg-graphite-500" />
        <div
          className="absolute top-5 left-5 h-px bg-red-primary transition-all duration-slow ease-emphasized"
          style={{
            width:
              nextIdx !== null
                ? `calc(${(currentIdx / (BONUS_LEVEL_ORDER.length - 1)) * 100}% + ${
                    (progressBetween / 100) * (100 / (BONUS_LEVEL_ORDER.length - 1))
                  }%)`
                : "100%",
          }}
        />
      </div>
    </div>
  );
}
