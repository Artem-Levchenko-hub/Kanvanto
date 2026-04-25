"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Cpu, Gauge, Wrench, ScanLine, Crosshair, Camera } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const EQUIPMENT = [
  {
    name: "BMW ICOM Next",
    category: "Дилерский сканер",
    icon: ScanLine,
    description: "Оригинальный диагностический комплекс BMW. Кодирование, программирование ECU, считывание скрытых ошибок.",
    brands: ["BMW"],
  },
  {
    name: "Mercedes Star Diagnosis (XENTRY)",
    category: "Дилерский сканер",
    icon: Cpu,
    description: "Полная диагностика и кодирование Mercedes-Benz всех модельных лет. Доступ к закрытым параметрам.",
    brands: ["Mercedes-Benz"],
  },
  {
    name: "Porsche PIWIS Tester III",
    category: "Дилерский сканер",
    icon: Gauge,
    description: "Заводское ПО Porsche для всех моделей с 1995 года. Уникальный инструмент в Краснодаре.",
    brands: ["Porsche"],
  },
  {
    name: "Bosch KTS 590",
    category: "Универсальный сканер",
    icon: Wrench,
    description: "Профессиональный мульти-марочный сканер для глубокой диагностики европейских авто.",
    brands: ["Audi", "VW", "Skoda"],
  },
  {
    name: "Стенд развал-схождения 3D",
    category: "Геометрия",
    icon: Crosshair,
    description: "Hunter HawkEye Elite — точность до 0.01°. Подходит для жёсткой подвески спортивных авто.",
    brands: ["Все марки"],
  },
  {
    name: "Эндоскоп Olympus IPLEX",
    category: "Визуальный осмотр",
    icon: Camera,
    description: "Промышленный эндоскоп для осмотра камер сгорания, цилиндров, мехатроников без разборки.",
    brands: ["Все марки"],
  },
];

export function EquipmentCarousel() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.85;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <Section className="relative">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Eyebrow>Оборудование уровня дилера</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
              У нас не гаражный сервис.
            </h2>
            <p className="mt-4 text-body-lg text-graphite-200 text-pretty max-w-lg">
              Используем заводское дилерское ПО и оборудование. Это даёт доступ к параметрам,
              которые универсальные сканеры не видят.
            </p>
          </div>
          <div className="hidden lg:flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="size-12 rounded-md border border-graphite-500/40 text-graphite-100 hover:bg-graphite-700 hover:text-graphite-50 transition-colors"
              aria-label="Прокрутить влево"
            >
              <ChevronLeft className="size-5 mx-auto" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="size-12 rounded-md border border-graphite-500/40 text-graphite-100 hover:bg-graphite-700 hover:text-graphite-50 transition-colors"
              aria-label="Прокрутить вправо"
            >
              <ChevronRight className="size-5 mx-auto" />
            </button>
          </div>
        </div>
      </Container>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 scrollbar-none px-4 sm:px-6 lg:px-[calc((100vw-1280px)/2+2rem)]"
        style={{ scrollbarWidth: "none" }}
      >
        {EQUIPMENT.map((item, idx) => {
          const Icon = item.icon;
          return (
            <article
              key={item.name}
              className="snap-start shrink-0 w-[88%] sm:w-[60%] md:w-[42%] lg:w-[32%] xl:w-[28%] rounded-lg border border-graphite-500/30 bg-graphite-800 p-6 lg:p-8 hover:border-chrome/30 transition-all duration-base group"
            >
              <div className="aspect-[4/3] -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 mb-6 bg-gradient-to-br from-graphite-700 via-graphite-800 to-graphite-900 grid place-items-center rounded-t-lg overflow-hidden border-b border-graphite-500/30">
                <Icon className="size-20 text-chrome group-hover:text-red-primary transition-colors" strokeWidth={1.2} />
              </div>
              <Badge variant="chrome" className="mb-3">{item.category}</Badge>
              <h3 className="font-display text-h5 text-graphite-50">{item.name}</h3>
              <p className="mt-3 text-body-sm text-graphite-200 text-pretty">{item.description}</p>
              <div className="mt-5 pt-5 border-t border-graphite-500/30">
                <p className="text-caption uppercase tracking-wider text-chrome">Используем для</p>
                <p className="mt-1 text-body-sm text-graphite-100 font-medium">{item.brands.join(" · ")}</p>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
