"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ScanLine, Wrench, ShieldCheck, FileCheck } from "lucide-react";
import { Container } from "@/components/ui/container";

const STEPS = [
  {
    icon: ScanLine,
    label: "Шаг 1",
    title: "Дилерская диагностика",
    description:
      "ICOM Next, XENTRY, PIWIS Tester — те же инструменты, что у официальных дилеров. Считываем все ECU без исключений.",
    accent: "BMW · MB · Porsche",
  },
  {
    icon: FileCheck,
    label: "Шаг 2",
    title: "Прозрачный диагноз",
    description:
      "PDF-отчёт с фото и данными ECU. Согласовываем стоимость и сроки до начала работ. Цена в чеке = цена в наряде.",
    accent: "Гарантия на диагноз 30 дней",
  },
  {
    icon: Wrench,
    label: "Шаг 3",
    title: "Оригинальные запчасти",
    description:
      "Только OEM или премиум-аналоги от производителей оригинала: LuK, Sachs, Bosch, Mahle, Hella. Артикул в наряде.",
    accent: "12 000 SKU в наличии",
  },
  {
    icon: ShieldCheck,
    label: "Шаг 4",
    title: "Гарантия как у дилера",
    description:
      "12 месяцев или 20 000 км на работы. На запчасти — гарантия производителя. Talon в личном кабинете.",
    accent: "Без скрытых условий",
  },
];

export function StickyShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Активный индекс — на основе scroll progress по контейнеру
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
      setActiveIdx(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const visualScale = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.05]);

  return (
    <section ref={containerRef} className="relative bg-obsidian">
      {/* Section eyebrow + heading */}
      <Container>
        <div className="pt-24 lg:pt-32 pb-12 lg:pb-16 text-center max-w-3xl mx-auto">
          <p className="text-caption uppercase tracking-[0.32em] text-chrome">Как мы работаем</p>
          <h2 className="mt-6 font-display text-display-xl text-graphite-50 text-balance leading-[0.95] font-light">
            Прозрачно.
            <br />
            <span className="font-medium">От приёмки до выдачи.</span>
          </h2>
        </div>
      </Container>

      {/* Sticky scroll narrative — высота = 4 viewports */}
      <div className="relative" style={{ height: prefersReducedMotion ? "auto" : `${STEPS.length * 90}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <Container>
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left: sticky visual */}
              <motion.div
                style={{ scale: visualScale }}
                className="lg:col-span-7 relative aspect-[5/4] rounded-2xl overflow-hidden border border-graphite-500/30 bg-graphite-900"
              >
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === activeIdx;
                  return (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.96,
                      }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, ease: [0.2, 0, 0, 1] }}
                      className="absolute inset-0 grid place-items-center"
                    >
                      {/* Background gradient per step */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          idx === 0 ? "from-graphite-800 via-info/15 to-graphite-900" :
                          idx === 1 ? "from-graphite-800 via-warning/10 to-graphite-900" :
                          idx === 2 ? "from-graphite-800 via-red-primary/12 to-graphite-900" :
                          "from-graphite-800 via-success/10 to-graphite-900"
                        }`}
                      />

                      <div className="relative z-10 text-center px-8">
                        <div className="mx-auto size-32 rounded-full bg-graphite-900/60 backdrop-blur-sm border border-chrome/30 grid place-items-center mb-8">
                          <Icon className="size-14 text-chrome" strokeWidth={1.2} />
                        </div>
                        <p className="text-caption uppercase tracking-[0.3em] text-chrome">
                          {step.label}
                        </p>
                        <p className="mt-4 font-display text-h2 text-graphite-50 font-light text-balance">
                          {step.title}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Step indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-slow ${
                        idx === activeIdx
                          ? "w-12 bg-red-primary"
                          : idx < activeIdx
                            ? "w-6 bg-chrome/50"
                            : "w-6 bg-graphite-500/40"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Right: sticky text per step */}
              <div className="lg:col-span-5">
                {STEPS.map((step, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 12,
                      }}
                      transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, ease: [0.2, 0, 0, 1] }}
                      className={`absolute lg:relative ${isActive ? "" : "pointer-events-none lg:invisible"}`}
                      style={{
                        position: isActive ? "relative" : (typeof window !== "undefined" && window.innerWidth >= 1024 ? "absolute" : "absolute"),
                        ...(isActive ? {} : { display: prefersReducedMotion ? "block" : undefined }),
                      }}
                    >
                      <p className="text-caption uppercase tracking-[0.25em] text-red-primary mb-4">
                        {step.label} из {STEPS.length}
                      </p>
                      <h3 className="font-display text-h2 text-graphite-50 text-balance leading-[1.05] font-light">
                        {step.title}
                      </h3>
                      <p className="mt-6 text-body-xl text-graphite-200 leading-relaxed font-light">
                        {step.description}
                      </p>
                      <p className="mt-8 inline-flex items-center gap-2 text-caption uppercase tracking-[0.18em] text-chrome border-t border-graphite-500/40 pt-4 w-full">
                        <span className="h-px w-4 bg-chrome" />
                        {step.accent}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Spacer below — to ensure last step is reachable */}
      {!prefersReducedMotion && <div className="h-screen" aria-hidden />}
    </section>
  );
}
