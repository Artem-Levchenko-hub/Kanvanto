"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Warm luxury Hero — Apple/Hermès/Aesop эстетика.
 * Cream background, тонкая серифная типографика, italic-акцент,
 * generous whitespace, минимум декора.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Subtle warm glow — еле заметный */}
      <div
        className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] bg-red-glow blur-3xl opacity-50"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-20 -z-10 h-[400px] w-[400px] bg-red-glow blur-3xl opacity-30"
        aria-hidden
      />

      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-center pt-16 pb-24 lg:pt-32 lg:pb-40">
          {/* Left: editorial text block */}
          <div className="lg:col-span-7 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
              className="text-label uppercase tracking-[0.25em] text-chrome-deep mb-8 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-chrome-warm" aria-hidden />
              Основано в 1995
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, delay: prefersReducedMotion ? 0 : 0.1 }}
              className="font-display text-display-xl text-foreground text-balance leading-[0.98]"
            >
              Сервис уровня дилера.
              <br />
              <span className="font-display italic text-red-primary font-normal">Прозрачно.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.25 }}
              className="mt-8 text-body-lg text-graphite-200 text-pretty max-w-xl leading-relaxed"
            >
              Премиум-обслуживание BMW, Mercedes-Benz, Audi, Porsche, Škoda и Volkswagen
              в Краснодаре. Открытые цены, оригинальные запчасти, дилерское оборудование —
              в сети из четырёх филиалов.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.4 }}
              className="mt-12 flex flex-col sm:flex-row gap-3"
            >
              <Button asChild size="xl">
                <Link href="/booking">
                  Записаться
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost">
                <Link href="#live-price">
                  Открытый прайс
                  <ChevronDown className="size-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Inline stats — тонкая хром-полоска */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: prefersReducedMotion ? 0 : 0.6 }}
              className="mt-16 pt-8 border-t border-border flex flex-wrap gap-x-12 gap-y-4 text-body-sm"
            >
              <Stat number="30" label="лет опыта" />
              <Stat number="4" label="филиала" />
              <Stat number="50" label="постов" />
              <Stat number="71 000" label="клиентов" />
            </motion.div>
          </div>

          {/* Right: editorial visual — silhouette in warm tones */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-e-3"
            >
              {/* Cream-toned automotive silhouette */}
              <svg
                viewBox="0 0 600 750"
                className="absolute inset-0 w-full h-full"
                aria-hidden
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="creamFade" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F8F2E7" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ECE4D5" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="carShape" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5C5247" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#1A1612" stopOpacity="0.32" />
                  </linearGradient>
                </defs>
                <rect width="600" height="750" fill="url(#creamFade)" />

                <g transform="translate(0, 380)">
                  <ellipse cx="300" cy="240" rx="240" ry="10" fill="#1A1612" opacity="0.15" />
                  <path
                    d="M 60 180 L 100 110 Q 130 70 190 60 L 280 35 Q 340 22 410 38 L 500 70 Q 540 85 555 130 L 555 195 Q 555 215 535 215 L 75 215 Q 60 215 60 180 Z"
                    fill="url(#carShape)"
                    stroke="#8A8275"
                    strokeWidth="0.5"
                    opacity="0.7"
                  />
                  <path
                    d="M 190 60 L 280 38 Q 340 25 410 40 L 480 70 L 460 85 Q 340 65 210 90 Z"
                    fill="#FAF7F2"
                    opacity="0.4"
                  />
                  <circle cx="170" cy="210" r="32" fill="#1A1612" opacity="0.85" />
                  <circle cx="170" cy="210" r="14" fill="#5C5247" opacity="0.7" />
                  <circle cx="430" cy="210" r="32" fill="#1A1612" opacity="0.85" />
                  <circle cx="430" cy="210" r="14" fill="#5C5247" opacity="0.7" />
                  <rect x="65" y="155" width="14" height="6" rx="2" fill="#8B2635" opacity="0.5" />
                </g>

                <text
                  x="40"
                  y="50"
                  fontFamily="Playfair Display, serif"
                  fontSize="14"
                  fill="#A89072"
                  letterSpacing="3"
                  opacity="0.85"
                >
                  KANAVTO · ESTABLISHED MCMXCV
                </text>
                <text
                  x="40"
                  y="700"
                  fontFamily="Playfair Display, serif"
                  fontSize="16"
                  fontStyle="italic"
                  fill="#5C5247"
                  opacity="0.75"
                >
                  «Сервис — это форма уважения»
                </text>
              </svg>

              {/* Warm gold hairline */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-chrome-warm/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display tabular-nums text-foreground text-h6 font-semibold">{number}</span>
      <span className="text-graphite-200 text-body-sm">{label}</span>
    </div>
  );
}
