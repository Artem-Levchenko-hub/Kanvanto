import Link from "next/link";
import {
  Activity,
  Wrench,
  Cog,
  GitBranch,
  DiscAlbum,
  ArrowDownUp,
  Zap,
  Cpu,
  KeyRound,
  Palette,
  CircleDot,
  Wind,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<string, LucideIcon> = {
  Activity, Wrench, Cog, GitBranch, DiscAlbum, ArrowDownUp, Zap, Cpu, KeyRound, Palette, CircleDot, Wind,
};

export function ServicesGrid() {
  return (
    <Section className="relative">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <Eyebrow>Полный спектр работ</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
              Услуги под все системы вашего авто.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-body-base text-red-primary hover:underline"
          >
            Все услуги и прайс
            <ArrowUpRight className="size-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {SERVICES.map((service, idx) => {
            const Icon = ICONS[service.iconName] ?? Wrench;
            const isFlagship = service.isFlagship;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={cn(
                  "group relative flex flex-col gap-4 p-6 lg:p-8 rounded-lg border border-graphite-500/30 bg-graphite-800",
                  "hover:bg-graphite-700 hover:border-chrome/30 transition-all duration-base",
                  isFlagship && "lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-graphite-800 via-graphite-800 to-red-primary/5 border-red-primary/30"
                )}
              >
                {/* Top bar with icon and badges */}
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "size-12 rounded-md grid place-items-center",
                      isFlagship ? "bg-red-primary/15 text-red-primary" : "bg-graphite-700 text-chrome"
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.isFlagship && <Badge variant="accent">Флагман</Badge>}
                    {service.isExclusive && <Badge variant="chrome">Exclusive</Badge>}
                  </div>
                </div>

                <div>
                  <h3 className={cn(
                    "font-display text-h4 text-graphite-50 group-hover:text-graphite-50 transition-colors",
                    isFlagship && "lg:text-h3"
                  )}>
                    {service.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-graphite-200 text-pretty">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-graphite-500/30">
                  <div>
                    <p className="text-caption text-chrome">от</p>
                    <p className="font-mono tabular-nums text-h6 text-graphite-50 font-semibold">
                      {formatPrice(service.basePrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-body-sm text-graphite-200 group-hover:text-red-primary transition-colors">
                    <span>Подробнее</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom red accent on hover */}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-primary transition-all duration-base ease-standard group-hover:w-full"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
