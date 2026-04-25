"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

/**
 * Variant B Hero для A/B-теста.
 * Альтернативный заголовок и порядок CTA: фокус на гарантии вместо цен.
 */
export function HeroVariantB() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite-900 via-obsidian to-obsidian" aria-hidden />
      <div className="absolute -top-40 right-0 -z-10 h-[600px] w-[600px] bg-red-glow blur-3xl opacity-60" aria-hidden />
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(192,192,200,1)_1px,transparent_1px),linear-gradient(90deg,rgba(192,192,200,1)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <Badge variant="accent" className="text-[11px]">
                <Award className="size-3" />
                Премия 2ГИС за качество
              </Badge>
              <Badge variant="chrome" className="text-[11px]">71 000 клиентов</Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.1 }}
              className="font-display text-display-xl text-graphite-50 text-balance leading-[0.95]"
            >
              Гарантия как у дилера.
              <br />
              <span className="text-red-primary">Цены — на 30% ниже.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="mt-6 text-body-lg text-graphite-200 text-pretty max-w-xl"
            >
              Дилерское оборудование (ICOM, XENTRY, PIWIS), оригинальные запчасти, 12 месяцев гарантии
              на работы. Специализация на BMW, Mercedes, Audi, Porsche.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Button asChild size="xl">
                <Link href="/booking">
                  Получить расчёт
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="#live-price">
                  Посмотреть прайс
                  <ChevronDown className="size-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: prefersReducedMotion ? 0 : 0.5 }}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-body-sm text-graphite-300"
            >
              <Stat value="30" label="лет опыта" />
              <Stat value="4" label="филиала" />
              <Stat value="50" label="постов" />
              <Stat value="71 000" label="клиентов" />
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="relative aspect-[5/4] rounded-xl border border-graphite-500/40 bg-gradient-to-br from-graphite-800 to-graphite-900 overflow-hidden shadow-e-3"
            >
              <svg viewBox="0 0 600 480" className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id="carBodyB" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#52525C" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#2A2A32" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0A0A0B" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <ellipse cx="300" cy="430" rx="240" ry="14" fill="#000" opacity="0.4" />
                <path
                  d="M 80 380 L 110 320 Q 130 280 180 270 L 250 240 Q 300 220 360 240 L 460 280 Q 510 290 530 330 L 530 380 Q 530 400 510 400 L 100 400 Q 80 400 80 380 Z"
                  fill="url(#carBodyB)"
                  stroke="#52525C"
                  strokeWidth="0.5"
                />
                <circle cx="170" cy="395" r="38" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="2" />
                <circle cx="430" cy="395" r="38" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="2" />
              </svg>

              <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded border border-success/30 bg-graphite-900/60 backdrop-blur-sm">
                <Award className="size-4 text-success" />
                <span className="font-display text-body-sm text-graphite-50">12 месяцев гарантии</span>
              </div>

              <div className="absolute bottom-0 inset-x-0 hairline" />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono tabular-nums text-graphite-50 font-semibold">{value}</span>
      <span>{label}</span>
    </div>
  );
}
