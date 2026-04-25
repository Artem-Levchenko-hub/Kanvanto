import { cookies } from "next/headers";
import { Hero } from "./Hero";
import { HeroVariantB } from "./HeroVariantB";
import { ABExposureTracker } from "@/components/analytics/ABExposureTracker";

/**
 * Контейнер для A/B-теста Hero-секции.
 *
 * Cookie `ab_hero_headline` (a|b) выставляется в middleware при первом визите.
 * Если эксперимент выключен (env), всегда показываем variant a.
 */
export async function HeroAB() {
  const enabled = process.env.AB_HERO_HEADLINE_ENABLED === "true";
  const cookieStore = await cookies();
  const variant = enabled
    ? cookieStore.get("ab_hero_headline")?.value === "b"
      ? "b"
      : "a"
    : "a";

  return (
    <>
      {enabled && <ABExposureTracker experiment="hero_headline" variant={variant} />}
      {variant === "b" ? <HeroVariantB /> : <Hero />}
    </>
  );
}
