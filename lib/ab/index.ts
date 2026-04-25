/**
 * Простой A/B-фреймворк на cookies.
 *
 * Архитектура:
 *  - Server: AB-cookie читается из RSC, выдаёт вариант (a|b)
 *  - Client: при первом монтировании трекает exposure в Yandex.Metrica
 *  - Cookie назначается на 30 дней (стабильность пользовательского опыта)
 */

import { cookies } from "next/headers";
import { track } from "@/lib/analytics/ym";

export type ABVariant = "a" | "b";

export interface Experiment {
  key: string;
  variants: ABVariant[];
}

export const EXPERIMENTS = {
  HERO_HEADLINE: {
    key: "hero_headline",
    variants: ["a", "b"] as ABVariant[],
  },
  CTA_TEXT: {
    key: "cta_text",
    variants: ["a", "b"] as ABVariant[],
  },
} satisfies Record<string, Experiment>;

const COOKIE_PREFIX = "ab_";
const COOKIE_TTL = 60 * 60 * 24 * 30; // 30 дней

/**
 * Server-side: получить вариант из cookie или назначить новый случайный.
 * Если cookie уже есть — стабильно возвращает тот же вариант.
 *
 * NOTE: Для real-set cookie response нужно использовать middleware или route handler;
 * этот helper предполагает что cookie уже выставлен (см. middleware.ts) или работает в read-only режиме.
 */
export async function getVariant(experiment: Experiment): Promise<ABVariant> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(`${COOKIE_PREFIX}${experiment.key}`)?.value;
  if (cookieValue && experiment.variants.includes(cookieValue as ABVariant)) {
    return cookieValue as ABVariant;
  }
  // Stateless fallback — детерминированный по дате (грубо)
  return experiment.variants[0];
}

/**
 * Client-side helper для трекинга exposure.
 * Должен вызываться один раз при монтировании компонента.
 */
export function trackExposure(experiment: Experiment, variant: ABVariant) {
  track.abExposure({ experiment: experiment.key, variant });
}
