"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite-900 via-obsidian to-obsidian"
        aria-hidden
      />
      <div
        className="absolute -top-40 right-0 -z-10 h-[600px] w-[600px] bg-red-glow blur-3xl opacity-60"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-20 -z-10 h-[400px] w-[400px] bg-red-glow blur-3xl opacity-30"
        aria-hidden
      />

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
              <Badge variant="chrome" className="text-[11px]">30 лет в Краснодаре</Badge>
              <Badge variant="accent" className="text-[11px]">
                <ShieldCheck className="size-3" />
                Гарантия на работы
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.1 }}
              className="font-display text-display-xl text-graphite-50 text-balance leading-[0.95]"
            >
              Сервис уровня дилера.
              <br />
              <span className="text-red-primary">Цены — открыто.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="mt-6 text-body-lg text-graphite-200 text-pretty max-w-xl"
            >
              BMW, Mercedes-Benz, Audi, Porsche, Škoda, Volkswagen.
              {" "}
              4 филиала, 50 постов одновременного обслуживания, 71&nbsp;000 клиентов с 1995 года.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Button asChild size="xl">
                <Link href="/booking">
                  Записаться онлайн
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="#live-price">
                  Прайс на диагностику
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
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-graphite-50 font-semibold">30</span>
                <span>лет опыта</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-graphite-50 font-semibold">4</span>
                <span>филиала</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-graphite-50 font-semibold">50</span>
                <span>постов</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-graphite-50 font-semibold">71 000</span>
                <span>клиентов</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="relative aspect-[5/4] rounded-xl border border-graphite-500/40 bg-gradient-to-br from-graphite-800 to-graphite-900 overflow-hidden shadow-e-3"
            >
              <svg
                viewBox="0 0 600 480"
                className="absolute inset-0 w-full h-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="carBody" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#52525C" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#2A2A32" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0A0A0B" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C0C0C8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0A0A0B" stopOpacity="0.4" />
                  </linearGradient>
                  <radialGradient id="redLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="300" cy="430" rx="240" ry="14" fill="#000" opacity="0.4" />
                <path
                  d="M 80 380 L 110 320 Q 130 280 180 270 L 250 240 Q 300 220 360 240 L 460 280 Q 510 290 530 330 L 530 380 Q 530 400 510 400 L 100 400 Q 80 400 80 380 Z"
                  fill="url(#carBody)"
                  stroke="#52525C"
                  strokeWidth="0.5"
                />
                <path
                  d="M 180 270 L 250 245 Q 300 230 360 245 L 440 280 L 415 295 Q 300 270 200 295 Z"
                  fill="url(#windowGrad)"
                />
                <path
                  d="M 180 270 L 250 245 Q 300 230 360 245 L 440 280"
                  fill="none"
                  stroke="#C0C0C8"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <circle cx="170" cy="395" r="38" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="2" />
                <circle cx="170" cy="395" r="20" fill="#1F1F25" stroke="#52525C" strokeWidth="1" />
                <circle cx="430" cy="395" r="38" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="2" />
                <circle cx="430" cy="395" r="20" fill="#1F1F25" stroke="#52525C" strokeWidth="1" />
                <circle cx="100" cy="345" r="40" fill="url(#redLight)" />
                <rect x="80" y="340" width="20" height="10" rx="2" fill="#DC2626" opacity="0.8" />
                <rect x="510" y="335" width="18" height="8" rx="2" fill="#C0C0C8" opacity="0.7" />
              </svg>

              <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded border border-chrome/30 bg-graphite-900/60 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.2em] text-chrome">Specialised in</span>
                <span className="font-display text-h6 text-graphite-50">BMW · MB · Porsche</span>
              </div>

              <div className="absolute bottom-0 inset-x-0 hairline" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, delay: prefersReducedMotion ? 0 : 0.6 }}
              className="absolute -bottom-6 -left-6 lg:-left-12 hidden md:flex items-center gap-3 px-4 py-3 rounded-lg border border-graphite-500/40 bg-graphite-800/95 backdrop-blur-sm shadow-e-3"
            >
              <div className="size-10 rounded-md bg-success/10 grid place-items-center">
                <ShieldCheck className="size-5 text-success" />
              </div>
              <div>
                <p className="text-caption text-chrome">Гарантия 30 дней</p>
                <p className="text-body-sm font-semibold text-graphite-50">на корректность диагноза</p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
