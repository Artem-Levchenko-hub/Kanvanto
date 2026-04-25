import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { DIAGNOSTIC_TYPES } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/format";

export function LivePriceSection() {
  return (
    <Section size="lg" className="relative overflow-hidden" id="live-price">
      {/* Dark red gradient background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-graphite-900 via-[#1A0808] to-graphite-900"
        aria-hidden
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-[1000px] bg-red-glow blur-3xl opacity-30"
        aria-hidden
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] [background-image:linear-gradient(rgba(192,192,200,1)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden
      />

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: heading */}
          <div className="lg:col-span-5">
            <Badge variant="accent" className="mb-6">
              <Lock className="size-3" />
              Цены не закрыты
            </Badge>
            <h2 className="font-display text-h1 text-graphite-50 text-balance leading-[1.05]">
              Цены, которые мы&nbsp;
              <span className="text-red-primary">не прячем</span>.
            </h2>
            <p className="mt-6 text-body-lg text-graphite-200 max-w-md text-pretty">
              Никаких «оставьте заявку — обсудим». Стоимость диагностики фиксируется до начала работ.
            </p>

            <div className="mt-10 space-y-5 max-w-md">
              <FeatureLine
                icon={ShieldCheck}
                title="Гарантия 30 дней на диагноз"
                description="Если диагноз неверен — повторная диагностика бесплатно."
              />
              <FeatureLine
                icon={Lock}
                title="Цена фиксируется на месте"
                description="Не вырастет после начала работ. Это часть нашего стандарта."
              />
            </div>

            <div className="mt-10 hidden lg:block">
              <Button asChild size="lg">
                <Link href="/booking?service=diagnostika">
                  Записаться на диагностику
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: price table */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-graphite-500/40 bg-graphite-900/85 backdrop-blur-sm overflow-hidden shadow-e-3">
              <div className="px-6 py-4 lg:px-8 lg:py-5 border-b border-graphite-500/30 flex items-center justify-between">
                <span className="text-label uppercase tracking-[0.18em] text-chrome">
                  Прайс на диагностику
                </span>
                <span className="text-caption text-graphite-300 font-mono tabular-nums">
                  обновлено 25.04.2026
                </span>
              </div>
              <div className="divide-y divide-graphite-500/30">
                {DIAGNOSTIC_TYPES.map((type) => (
                  <div
                    key={type.slug}
                    className="px-6 lg:px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-graphite-800/60 transition-colors"
                  >
                    <div className="col-span-12 sm:col-span-7">
                      <p className="text-body-base text-graphite-50 font-medium">{type.title}</p>
                      <p className="mt-1 text-body-sm text-graphite-300 text-pretty hidden md:block">
                        {type.description}
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-2 text-body-sm text-graphite-200">
                      <span className="text-caption text-chrome block sm:hidden">Время</span>
                      {type.duration}
                    </div>
                    <div className="col-span-6 sm:col-span-3 text-right">
                      <span className="text-caption text-chrome block sm:hidden">Цена от</span>
                      <span className="font-mono tabular-nums text-h6 lg:text-h5 text-chrome font-semibold whitespace-nowrap">
                        {formatPrice(type.priceFrom)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 lg:px-8 py-4 bg-graphite-900/60 border-t border-graphite-500/30">
                <p className="text-caption text-graphite-300">
                  * Цена «от» — для популярных моделей. Для редких или сложных случаев — фиксируется
                  на приёмке после первичного осмотра.
                </p>
              </div>
            </div>

            <div className="mt-6 lg:hidden">
              <Button asChild size="lg" className="w-full">
                <Link href="/booking?service=diagnostika">
                  Записаться на диагностику
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function FeatureLine({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="size-10 shrink-0 rounded-md bg-graphite-700 border border-graphite-500/40 grid place-items-center">
        <Icon className="size-5 text-chrome" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-body-base font-semibold text-graphite-50">{title}</p>
        <p className="mt-1 text-body-sm text-graphite-300 text-pretty">{description}</p>
      </div>
    </div>
  );
}
