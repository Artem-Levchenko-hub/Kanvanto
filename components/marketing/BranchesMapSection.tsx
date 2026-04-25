"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRANCHES } from "@/lib/constants";

const YA_DARK_MAP_URL =
  "https://yandex.ru/map-widget/v1/?ll=39.005%2C45.030&z=11&l=map&pt=" +
  BRANCHES.map((b) => `${b.lng},${b.lat},pm2dgl${b.isHQ ? "" : "m"}`).join("~");

export function BranchesMapSection() {
  const [activeBranch, setActiveBranch] = React.useState<string>(BRANCHES[0].id);
  const active = BRANCHES.find((b) => b.id === activeBranch) ?? BRANCHES[0];

  // Iframe для одной выбранной точки (фокус карты)
  const focusedMapUrl = `https://yandex.ru/map-widget/v1/?ll=${active.lng}%2C${active.lat}&z=15&l=map&pt=${active.lng},${active.lat},pm2rdm`;

  return (
    <Section className="relative">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <Eyebrow>4 филиала в Краснодаре</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
              Сеть, а не один гараж.
            </h2>
            <p className="mt-4 text-body-lg text-graphite-200 text-pretty">
              Каждый филиал имеет свою специализацию по маркам. Выберите ближайший — и приезжайте
              без записи на простую диагностику.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/locations">
              Все филиалы на карте
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Yandex Maps iframe */}
          <div className="lg:col-span-7 rounded-xl border border-graphite-500/30 bg-graphite-800 overflow-hidden shadow-e-2">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-[560px] relative bg-graphite-900">
              <iframe
                src={focusedMapUrl}
                title={`Карта ${active.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 size-full"
                loading="lazy"
              />
              <a
                href={`https://yandex.ru/maps/?text=${encodeURIComponent(active.address + " Краснодар")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-graphite-900/90 backdrop-blur-sm text-caption text-graphite-100 hover:bg-graphite-800 hover:text-red-primary border border-graphite-500/40 transition-colors"
              >
                Открыть в Яндекс Картах →
              </a>
            </div>
          </div>

          {/* Branch list */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {BRANCHES.map((branch) => {
              const isActive = branch.id === activeBranch;
              return (
                <button
                  type="button"
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={`group text-left rounded-lg border p-5 transition-all duration-base ${
                    isActive
                      ? "border-red-primary/50 bg-graphite-700 shadow-glow-red"
                      : "border-graphite-500/30 bg-graphite-800 hover:border-chrome/40 hover:bg-graphite-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display text-h5 text-graphite-50">{branch.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {isActive && <Badge variant="accent" className="text-[9px]">Выбран</Badge>}
                      {branch.isHQ && <Badge variant="chrome" className="text-[9px]">Главный</Badge>}
                    </div>
                  </div>
                  <div className="space-y-2 text-body-sm text-graphite-200">
                    <p className="flex items-start gap-2">
                      <MapPin className="size-4 mt-0.5 shrink-0 text-chrome" />
                      <span>{branch.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="size-4 shrink-0 text-chrome" />
                      <span>{branch.hours}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="size-4 shrink-0 text-chrome" />
                      <a
                        href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono tabular-nums hover:text-red-primary transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {branch.brands.map((brand) => (
                      <Badge key={brand} variant="chrome" className="text-[10px]">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-graphite-500/30 flex items-center justify-between">
                    <Link
                      href={`/locations/${branch.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors"
                    >
                      Подробнее →
                    </Link>
                    <a
                      href={`https://yandex.ru/maps/?text=${encodeURIComponent(branch.address + " Краснодар")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-body-sm text-red-primary hover:underline"
                    >
                      <Navigation className="size-4" />
                      Маршрут
                    </a>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
