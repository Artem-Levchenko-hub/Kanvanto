"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Apple-style Hero: огромный thin display, generous whitespace,
 * минимум декора, один primary CTA, subtle scroll-driven parallax.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -120]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.08]);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Subtle ambient gradients */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite-900 via-obsidian to-obsidian"
        aria-hidden
      />
      <div
        className="absolute -top-60 right-1/3 -z-10 h-[700px] w-[700px] rounded-full bg-red-glow blur-3xl opacity-50"
        aria-hidden
      />

      <Container>
        <div className="pt-20 pb-32 lg:pt-32 lg:pb-44 text-center max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
            className="text-caption uppercase tracking-[0.32em] text-chrome mb-8"
          >
            Kanavto · est. 1995
          </motion.p>

          <motion.h1
            style={{ y: titleY, opacity: titleOpacity }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.2, 0, 0, 1] }}
            className="font-display text-display-2xl text-graphite-50 text-balance leading-[0.9] tracking-tight"
          >
            Сервис<br />
            <span className="font-display font-medium">уровня дилера.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, delay: prefersReducedMotion ? 0 : 0.3 }}
            className="mt-10 text-body-xl text-graphite-200 max-w-3xl mx-auto text-balance font-light leading-relaxed"
          >
            BMW, Mercedes-Benz, Audi, Porsche, Škoda, Volkswagen.
            Открытые цены. Дилерское оборудование. 30 лет в Краснодаре.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, delay: prefersReducedMotion ? 0 : 0.5 }}
            className="mt-14 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button asChild size="xl">
              <Link href="/booking">
                Записаться онлайн
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="ghost">
              <Link href="#live-price">Открытый прайс</Link>
            </Button>
          </motion.div>
        </div>
      </Container>

      {/* Full-bleed visual — parallax car silhouette */}
      <motion.div
        style={{ y: visualY, scale: visualScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 1.2, delay: prefersReducedMotion ? 0 : 0.4 }}
        className="relative max-w-[1600px] mx-auto px-4 lg:px-8"
      >
        <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-graphite-500/30 bg-gradient-to-b from-graphite-900 to-graphite-800 shadow-e-4">
          <svg
            viewBox="0 0 1600 700"
            className="absolute inset-0 w-full h-full"
            aria-hidden
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="bgFade" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0A0A0B" stopOpacity="0" />
                <stop offset="60%" stopColor="#0A0A0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0A0A0B" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="carBodyHero" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#52525C" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#2A2A32" stopOpacity="1" />
                <stop offset="100%" stopColor="#0A0A0B" stopOpacity="1" />
              </linearGradient>
              <radialGradient id="redLightHero" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="800" cy="450" rx="600" ry="200" fill="url(#ambientGlow)" />

            <ellipse cx="800" cy="640" rx="600" ry="22" fill="#000" opacity="0.5" />
            <path
              d="M 200 580 L 260 460 Q 300 410 380 400 L 540 350 Q 660 320 800 340 L 1020 360 Q 1180 380 1300 420 L 1380 470 Q 1410 510 1410 580 Q 1410 615 1380 615 L 240 615 Q 200 615 200 580 Z"
              fill="url(#carBodyHero)"
              stroke="#52525C"
              strokeWidth="0.8"
            />
            <path
              d="M 380 400 L 540 355 Q 660 325 800 345 L 1020 365 L 1180 405 L 1140 425 Q 800 365 410 425 Z"
              fill="#C0C0C8"
              opacity="0.08"
            />
            <path
              d="M 380 400 L 540 355 Q 660 325 800 345 L 1020 365 L 1180 405"
              fill="none"
              stroke="#C0C0C8"
              strokeWidth="1"
              strokeOpacity="0.4"
            />

            <circle cx="400" cy="600" r="58" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="2.5" />
            <circle cx="400" cy="600" r="32" fill="#1F1F25" stroke="#52525C" strokeWidth="1.5" />
            <circle cx="400" cy="600" r="14" fill="#3A3A44" />
            <circle cx="1200" cy="600" r="58" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="2.5" />
            <circle cx="1200" cy="600" r="32" fill="#1F1F25" stroke="#52525C" strokeWidth="1.5" />
            <circle cx="1200" cy="600" r="14" fill="#3A3A44" />

            <circle cx="240" cy="500" r="80" fill="url(#redLightHero)" />
            <rect x="210" y="495" width="30" height="14" rx="3" fill="#DC2626" opacity="0.85" />

            <rect x="1370" y="490" width="22" height="10" rx="2" fill="#C0C0C8" opacity="0.85" />

            <rect width="1600" height="700" fill="url(#bgFade)" />
          </svg>

          <div className="absolute top-8 left-8 lg:top-12 lg:left-12 max-w-md">
            <p className="text-caption uppercase tracking-[0.25em] text-chrome opacity-80">Specialised in</p>
            <p className="mt-2 font-display text-h4 text-graphite-50 font-light">
              BMW · Mercedes · Audi · Porsche
            </p>
          </div>

          <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 text-right">
            <p className="text-caption uppercase tracking-[0.25em] text-chrome opacity-80">Сеть</p>
            <p className="mt-2 font-display text-h4 text-graphite-50 font-light tabular-nums">
              4 филиала · Краснодар
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
