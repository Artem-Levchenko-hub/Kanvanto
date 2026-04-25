import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRANCHES } from "@/lib/constants";

export function BranchesMapSection() {
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
          {/* Map placeholder */}
          <div className="lg:col-span-7 rounded-xl border border-graphite-500/30 bg-graphite-800 overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[520px] relative">
            <MapPlaceholder />
          </div>

          {/* Branch list */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {BRANCHES.map((branch) => (
              <article
                key={branch.id}
                className="group rounded-lg border border-graphite-500/30 bg-graphite-800 p-5 hover:border-red-primary/40 hover:bg-graphite-700 transition-all duration-base"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-h5 text-graphite-50">{branch.name}</h3>
                  {branch.isHQ && <Badge variant="accent">Главный</Badge>}
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
                    <a href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`} className="font-mono tabular-nums hover:text-red-primary transition-colors">
                      {branch.phone}
                    </a>
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {branch.brands.map((brand) => (
                    <Badge key={brand} variant="chrome" className="text-[10px]">{brand}</Badge>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-graphite-500/30 flex items-center justify-between">
                  <Link
                    href={`/locations/${branch.slug}`}
                    className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors"
                  >
                    Подробнее →
                  </Link>
                  <a
                    href={`https://yandex.ru/maps/?text=${encodeURIComponent(branch.address + " Краснодар")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-body-sm text-red-primary hover:underline"
                  >
                    <Navigation className="size-4" />
                    Маршрут
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function MapPlaceholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-graphite-900 to-graphite-700">
      {/* Stylized map grid */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3A3A44" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          <radialGradient id="riverGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1F1F25" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0A0A0B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Stylized river (Кубань) */}
        <path
          d="M -50 380 Q 200 350 400 400 T 850 380"
          fill="none"
          stroke="#2A4A5C"
          strokeWidth="40"
          opacity="0.5"
        />
        <path
          d="M -50 380 Q 200 350 400 400 T 850 380"
          fill="none"
          stroke="#3A6A82"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Roads */}
        <path d="M 0 250 L 800 280" stroke="#52525C" strokeWidth="2" opacity="0.6" />
        <path d="M 0 150 L 800 180" stroke="#52525C" strokeWidth="1.5" opacity="0.4" />
        <path d="M 200 0 L 220 600" stroke="#52525C" strokeWidth="1.5" opacity="0.4" />
        <path d="M 500 0 L 520 600" stroke="#52525C" strokeWidth="1.5" opacity="0.4" />

        {/* Branch markers — chrome pin with red dot */}
        <BranchMarker x={180} y={230} label="Будённого" />
        <BranchMarker x={420} y={210} label="Северная" />
        <BranchMarker x={350} y={300} label="Морская" />
        <BranchMarker x={580} y={280} label="Мачуги" />
      </svg>

      {/* Overlay note */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-caption text-chrome bg-graphite-900/80 backdrop-blur-sm rounded px-3 py-1.5 inline-block">
          Yandex Maps интегрируется при подключении API-ключа
        </p>
      </div>
    </div>
  );
}

function BranchMarker({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      {/* Pulse */}
      <circle cx={x} cy={y} r="20" fill="#DC2626" opacity="0.15">
        <animate attributeName="r" values="14;28;14" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Pin */}
      <circle cx={x} cy={y} r="14" fill="#C0C0C8" stroke="#0A0A0B" strokeWidth="1.5" />
      <circle cx={x} cy={y} r="6" fill="#DC2626" />
      {/* Label */}
      <text x={x} y={y + 32} textAnchor="middle" fill="#C0C0C8" fontSize="11" fontFamily="Jost, sans-serif" fontWeight="600">
        {label}
      </text>
    </g>
  );
}
