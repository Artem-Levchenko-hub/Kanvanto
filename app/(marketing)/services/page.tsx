import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity, Wrench, Cog, GitBranch, DiscAlbum, ArrowDownUp,
  Zap, Cpu, KeyRound, Palette, CircleDot, Wind, ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Все услуги автосервиса",
  description: "Полный каталог услуг Канавто: диагностика, ТО, ремонт двигателя, КПП, тормозов, чип-тюнинг, кодирование BMW.",
};

const ICONS: Record<string, LucideIcon> = {
  Activity, Wrench, Cog, GitBranch, DiscAlbum, ArrowDownUp, Zap, Cpu, KeyRound, Palette, CircleDot, Wind,
};

export default function ServicesPage() {
  return (
    <Section size="lg">
      <Container>
        <div className="max-w-2xl mb-12">
          <Eyebrow>Каталог услуг</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
            Все услуги автосервиса
          </h1>
          <p className="mt-6 text-body-lg text-graphite-200 text-pretty">
            12 направлений работ для премиум-марок. Цены — открыто. Гарантия на всё.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.iconName] ?? Wrench;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col gap-4 p-6 rounded-lg border border-graphite-500/30 bg-graphite-800 hover:bg-graphite-700 hover:border-chrome/30 transition-all duration-base"
              >
                <div className="flex items-start justify-between">
                  <div className="size-12 rounded-md bg-graphite-700 grid place-items-center text-chrome">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  {s.isFlagship && <Badge variant="accent">Флагман</Badge>}
                  {s.isExclusive && <Badge variant="chrome">Exclusive</Badge>}
                </div>
                <div>
                  <h3 className="font-display text-h5 text-graphite-50">{s.title}</h3>
                  <p className="mt-2 text-body-sm text-graphite-200 text-pretty">{s.shortDescription}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-graphite-500/30 flex items-end justify-between">
                  <div>
                    <p className="text-caption text-chrome">от</p>
                    <p className="font-mono tabular-nums text-h6 text-graphite-50 font-semibold">
                      {formatPrice(s.basePrice)}
                    </p>
                  </div>
                  <ArrowUpRight className="size-5 text-graphite-300 group-hover:text-red-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
