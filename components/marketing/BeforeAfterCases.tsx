"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";

const CASES = [
  {
    id: "bmw-n54",
    brand: "BMW 335i (E92, N54)",
    title: "Капитальный ремонт двигателя",
    description: "Замена прокладок, ВКГ, цепи ГРМ, тестирование под нагрузкой",
    duration: "5 дней",
    price: 145000,
  },
  {
    id: "porsche-cayenne",
    brand: "Porsche Cayenne 4.8 V8",
    title: "Замена цепей ГРМ",
    description: "Цепи, башмаки, натяжители, успокоители — обе ГБЦ",
    duration: "4 дня",
    price: 220000,
  },
  {
    id: "mb-w212",
    brand: "Mercedes-Benz E350 (W212)",
    title: "Восстановление пневмоподвески",
    description: "Замена пневмостоек, ремонт компрессора, калибровка",
    duration: "2 дня",
    price: 88000,
  },
];

export function BeforeAfterCases() {
  return (
    <Section className="relative">
      <Container>
        <div className="max-w-2xl mb-12 lg:mb-16">
          <Eyebrow>Реальные кейсы</Eyebrow>
          <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
            До и после — без фотошопа.
          </h2>
          <p className="mt-4 text-body-lg text-graphite-200 text-pretty">
            Двигайте слайдер, чтобы увидеть реальные результаты работ. Это машины наших клиентов.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASES.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CaseCard({ item }: { item: (typeof CASES)[number] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [width, setWidth] = React.useState(0);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize at 50%
  React.useEffect(() => {
    if (width > 0) x.set(width / 2);
  }, [width, x]);

  const clipPath = useTransform(x, (v) => `inset(0 ${Math.max(0, width - v)}px 0 0)`);
  const handleX = useTransform(x, (v) => `${v}px`);

  return (
    <div className="group rounded-lg border border-graphite-500/30 bg-graphite-800 overflow-hidden hover:border-chrome/30 transition-all duration-base">
      {/* Slider area */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden cursor-ew-resize select-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(Math.max(0, Math.min(rect.width, e.clientX - rect.left)));
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(Math.max(0, Math.min(rect.width, e.clientX - rect.left)));
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        {/* "After" — clean state — graphite gradient with subtle car silhouette */}
        <div className="absolute inset-0 bg-gradient-to-br from-graphite-700 to-graphite-900">
          <PlaceholderImage label="После" tone="clean" />
        </div>
        {/* "Before" — dirty state — clip-path controlled by slider */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#3A2A1A] to-[#1A1308]"
          style={{ clipPath }}
        >
          <PlaceholderImage label="До" tone="dirty" />
        </motion.div>

        {/* Slider handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-px bg-chrome pointer-events-none"
          style={{ left: handleX }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full bg-graphite-50 border-2 border-chrome shadow-e-2 grid place-items-center text-graphite-900">
            <span className="text-xs font-bold">↔</span>
          </div>
        </motion.div>

        {/* Labels */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#1A1308]/85 text-[#D4A574] text-caption uppercase tracking-wider font-semibold">
          До
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-sm bg-graphite-900/85 text-chrome text-caption uppercase tracking-wider font-semibold">
          После
        </span>
      </div>

      {/* Info */}
      <div className="p-6">
        <p className="text-caption text-chrome uppercase tracking-wider">{item.brand}</p>
        <h3 className="mt-2 font-display text-h5 text-graphite-50">{item.title}</h3>
        <p className="mt-2 text-body-sm text-graphite-200 text-pretty">{item.description}</p>
        <div className="mt-4 pt-4 border-t border-graphite-500/30 flex items-center justify-between">
          <span className="text-body-sm text-graphite-300">{item.duration}</span>
          <span className="font-mono tabular-nums text-body-base font-semibold text-graphite-50">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlaceholderImage({ label, tone }: { label: string; tone: "clean" | "dirty" }) {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" aria-label={label}>
      <defs>
        <linearGradient id={`grad-${tone}`} x1="0%" y1="0%" x2="0%" y2="100%">
          {tone === "clean" ? (
            <>
              <stop offset="0%" stopColor="#52525C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0A0A0B" stopOpacity="1" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#5C4A2C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1A1308" stopOpacity="1" />
            </>
          )}
        </linearGradient>
      </defs>
      {/* Car body silhouette (engine bay style) */}
      <rect x="40" y="80" width="320" height="180" rx="8" fill={`url(#grad-${tone})`} />
      {/* Components */}
      <circle cx="120" cy="170" r="40" fill="none" stroke={tone === "clean" ? "#C0C0C8" : "#8B6F47"} strokeWidth="3" opacity="0.6" />
      <rect x="180" y="120" width="100" height="80" rx="4" fill="none" stroke={tone === "clean" ? "#C0C0C8" : "#8B6F47"} strokeWidth="2" opacity="0.5" />
      <line x1="60" y1="120" x2="340" y2="120" stroke={tone === "clean" ? "#C0C0C8" : "#8B6F47"} strokeWidth="1" opacity="0.4" />
      {/* Dirt overlay */}
      {tone === "dirty" && (
        <g opacity="0.5">
          <circle cx="200" cy="180" r="60" fill="#3D2817" />
          <circle cx="280" cy="220" r="40" fill="#2D1F12" />
          <circle cx="80" cy="200" r="30" fill="#3D2817" />
        </g>
      )}
    </svg>
  );
}
