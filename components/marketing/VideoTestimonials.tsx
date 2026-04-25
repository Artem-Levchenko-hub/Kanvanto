"use client";

import * as React from "react";
import { Play, Star, X } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const TESTIMONIALS = [
  {
    name: "Андрей",
    car: "BMW M5 F90",
    rating: 5,
    quote: "После 4 разных сервисов наконец-то сделали как у дилера. Теперь только сюда.",
    duration: "1:42",
  },
  {
    name: "Виктория",
    car: "Mercedes GLE Coupé",
    rating: 5,
    quote: "Прозрачно объяснили, что делают и почему. Цена не выросла после начала работ.",
    duration: "2:18",
  },
  {
    name: "Сергей",
    car: "Porsche Cayenne Turbo",
    rating: 5,
    quote: "Уникальный сервис в Краснодаре, у которого есть оригинальный PIWIS Tester.",
    duration: "1:55",
  },
];

export function VideoTestimonials() {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <Section className="relative">
      <Container>
        <div className="max-w-2xl mb-12 lg:mb-16">
          <Eyebrow>Отзывы</Eyebrow>
          <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
            Голос клиента важнее текста.
          </h2>
          <p className="mt-4 text-body-lg text-graphite-200 text-pretty">
            71 000 клиентов с 1995 года. Премия 2ГИС за высокие оценки. Это реальные владельцы своих авто.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setOpen(idx)}
              className="group text-left rounded-lg overflow-hidden border border-graphite-500/30 bg-graphite-800 hover:border-chrome/30 transition-all duration-base"
            >
              {/* Video thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-graphite-700 to-graphite-900 grid place-items-center overflow-hidden">
                {/* Subtle pattern */}
                <div
                  className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.3),transparent_50%)]"
                  aria-hidden
                />
                {/* Play button */}
                <div className="relative size-16 rounded-full bg-graphite-900/70 backdrop-blur-sm border border-chrome/40 grid place-items-center group-hover:scale-110 group-hover:bg-red-primary group-hover:border-red-primary transition-all duration-base">
                  <Play className="size-7 text-graphite-50 ml-1" fill="currentColor" />
                </div>
                {/* Duration badge */}
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-graphite-900/85 text-caption text-graphite-50 font-mono tabular-nums">
                  {t.duration}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-h6 text-graphite-50">{t.name}</p>
                    <p className="text-caption text-chrome">{t.car}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 text-warning fill-warning" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-body-sm text-graphite-200 italic text-pretty">«{t.quote}»</p>
              </div>
            </button>
          ))}
        </div>

        {/* Modal stub */}
        {open !== null && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl rounded-xl bg-graphite-900 border border-graphite-500/40 shadow-e-4 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute top-3 right-3 size-10 rounded-md bg-graphite-800 hover:bg-graphite-700 grid place-items-center text-graphite-100"
                aria-label="Закрыть"
              >
                <X className="size-5" />
              </button>
              <div className="aspect-video bg-graphite-800 grid place-items-center">
                <p className="text-graphite-300 text-caption">Видео-плеер подключается на этапе 1</p>
              </div>
              <div className="p-6">
                <p className="font-display text-h5 text-graphite-50">{TESTIMONIALS[open].name}</p>
                <p className="text-caption text-chrome">{TESTIMONIALS[open].car}</p>
                <p className="mt-3 text-body-base text-graphite-200">«{TESTIMONIALS[open].quote}»</p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
