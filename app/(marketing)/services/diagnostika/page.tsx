import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Clock,
  Wrench,
  FileText,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DIAGNOSTIC_TYPES,
  DIAGNOSTIC_INCLUDES,
  DIAGNOSTIC_NOT_INCLUDES,
  DIAGNOSTIC_STEPS,
} from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/format";
import { PHONE_DISPLAY, PHONE_LINK } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Диагностика автомобиля в Краснодаре от 2 500 ₽",
  description:
    "Полная компьютерная и инструментальная диагностика BMW, Mercedes, Audi, Porsche, Skoda, VW. Дилерское оборудование, гарантия 30 дней на диагноз. От 2 500 ₽.",
};

const FAQ_DIAGNOSTIKA = [
  {
    q: "В чём разница между компьютерной и комплексной диагностикой?",
    a: "Компьютерная (от 2 500 ₽, 30–45 мин) — это считывание ошибок ECU и параметров через дилерский сканер. Комплексная (от 4 500 ₽, 60–90 мин) дополнительно включает осмотр на подъёмнике, замер компрессии, эндоскопию, проверку тормозной системы и ходовой. Если не знаете, что выбрать — берите комплексную.",
  },
  {
    q: "Нужно ли мыть авто перед диагностикой?",
    a: "Не обязательно. Диагностика проводится с подключением к OBD-II разъёму внутри салона. Двигатель и подвеску мы осматриваем в любом состоянии. Если нужна эндоскопия — подкапотное пространство протрём сами.",
  },
  {
    q: "Можно ли диагностировать на работающем двигателе?",
    a: "Да. Часть параметров считывается только при работе двигателя — топливная коррекция, лямбда-регулирование, обороты, давление турбины. Это входит в стандартный протокол диагностики.",
  },
  {
    q: "Что я получаю по итогу диагностики?",
    a: "PDF-отчёт с диагнозом, скриншотами параметров, фото проблемных мест, списком рекомендованных работ с ориентировочной стоимостью. Отчёт остаётся в вашем личном кабинете и действует при обращении в любой сервис.",
  },
  {
    q: "Делаете ли вы диагностику перед покупкой авто?",
    a: "Да, отдельная услуга — 1.5–2 часа, от 6 500 ₽. Включает выезд к продавцу или приёмку у нас, полную диагностику, проверку юридической чистоты по VIN, фото-отчёт, экспертное заключение. Это страхует от покупки авто с скрытыми проблемами.",
  },
];

export default function DiagnostikaPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b border-graphite-500/30 bg-graphite-900/60 backdrop-blur-sm sticky top-16 lg:top-20 z-30">
        <Container>
          <nav className="flex items-center gap-2 text-caption text-graphite-300 py-3" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-red-primary">Главная</Link>
            <span aria-hidden>/</span>
            <Link href="/services" className="hover:text-red-primary">Услуги</Link>
            <span aria-hidden>/</span>
            <span className="text-graphite-100">Диагностика автомобиля</span>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite-900 via-obsidian to-obsidian" aria-hidden />
        <div className="absolute -top-20 right-0 -z-10 h-[400px] w-[400px] bg-red-glow blur-3xl opacity-40" aria-hidden />

        <Container>
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Eyebrow>Услуга</Eyebrow>
              <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance leading-[0.95]">
                Диагностика автомобиля
              </h1>
              <p className="mt-6 text-body-lg text-graphite-200 max-w-2xl text-pretty">
                От <span className="font-mono tabular-nums text-graphite-50 font-semibold">2&nbsp;500&nbsp;₽</span>.
                Любая марка. Дилерское оборудование. Результат на руки в течение часа.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Badge variant="accent">
                  <ShieldCheck className="size-3" />
                  Гарантия 30 дней на диагноз
                </Badge>
                <Badge variant="chrome">
                  <Clock className="size-3" />
                  30–90 минут
                </Badge>
                <Badge variant="default">BMW · MB · Audi · Porsche · VW · Škoda</Badge>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button asChild size="xl">
                  <Link href="/booking?service=diagnostika">
                    Записаться на диагностику
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <a href={`tel:${PHONE_LINK}`}>
                    <Phone className="size-5" />
                    <span className="font-mono">{PHONE_DISPLAY}</span>
                  </a>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative aspect-square rounded-xl border border-graphite-500/40 bg-graphite-800 grid place-items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-graphite-700 via-graphite-800 to-graphite-900" />
                <svg viewBox="0 0 200 200" className="relative size-2/3 text-red-primary">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                  <circle cx="100" cy="100" r="6" fill="currentColor" />
                  {/* Pulse */}
                  <circle cx="100" cy="100" r="6" fill="currentColor">
                    <animate attributeName="r" values="6;90;6" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Tick marks */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    const x1 = 100 + Math.cos(a) * 88;
                    const y1 = 100 + Math.sin(a) * 88;
                    const x2 = 100 + Math.cos(a) * 95;
                    const y2 = 100 + Math.sin(a) * 95;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C0C0C8" strokeWidth="1" opacity="0.4" />;
                  })}
                </svg>
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <p className="text-caption text-chrome uppercase tracking-wider">Сканируем</p>
                  <p className="font-display text-h5 text-graphite-50 mt-1">12 систем авто</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Price types tabs */}
      <Section className="relative bg-graphite-900/50">
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Виды диагностики</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">Выберите нужный тип.</h2>
            <p className="mt-4 text-body-lg text-graphite-200 text-pretty">
              Цены — открыто. Если не уверены, какой тип нужен — позвоните, поможем выбрать.
            </p>
          </div>

          <div className="rounded-xl border border-graphite-500/40 bg-graphite-800 overflow-hidden">
            <div className="px-6 py-4 lg:px-8 border-b border-graphite-500/30 grid grid-cols-12 gap-4 text-caption uppercase tracking-wider text-chrome">
              <div className="col-span-12 sm:col-span-7">Услуга</div>
              <div className="hidden sm:block col-span-2">Время</div>
              <div className="hidden sm:block col-span-3 text-right">Цена</div>
            </div>
            <div className="divide-y divide-graphite-500/30">
              {DIAGNOSTIC_TYPES.map((type) => (
                <Link
                  key={type.slug}
                  href={`/booking?service=diagnostika&type=${type.slug}`}
                  className="block px-6 lg:px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-graphite-700 transition-colors group"
                >
                  <div className="col-span-12 sm:col-span-7">
                    <p className="text-body-base text-graphite-50 font-medium group-hover:text-red-primary transition-colors">
                      {type.title}
                    </p>
                    <p className="mt-1 text-body-sm text-graphite-300 text-pretty">{type.description}</p>
                  </div>
                  <div className="col-span-6 sm:col-span-2 text-body-sm text-graphite-200">
                    <span className="text-caption text-chrome block sm:hidden">Время</span>
                    {type.duration}
                  </div>
                  <div className="col-span-6 sm:col-span-3 text-right">
                    <span className="text-caption text-chrome block sm:hidden">Цена от</span>
                    <span className="font-mono tabular-nums text-h6 text-graphite-50 font-semibold whitespace-nowrap">
                      {formatPrice(type.priceFrom)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Includes / Not includes */}
      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="rounded-xl border border-success/30 bg-graphite-800 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-md bg-success/15 grid place-items-center">
                  <Check className="size-5 text-success" />
                </div>
                <h3 className="font-display text-h4 text-graphite-50">Что входит</h3>
              </div>
              <ul className="space-y-3">
                {DIAGNOSTIC_INCLUDES.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-base text-graphite-100">
                    <Check className="size-5 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-graphite-500/30 bg-graphite-800 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-md bg-graphite-700 grid place-items-center">
                  <X className="size-5 text-graphite-300" />
                </div>
                <h3 className="font-display text-h4 text-graphite-50">Что не входит</h3>
              </div>
              <ul className="space-y-3">
                {DIAGNOSTIC_NOT_INCLUDES.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-base text-graphite-300">
                    <X className="size-5 text-graphite-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 pt-6 border-t border-graphite-500/30 text-caption text-graphite-300">
                Дополнительные работы — после согласования с клиентом и фиксации в заказ-наряде.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="bg-graphite-900/50">
        <Container>
          <div className="max-w-2xl mb-12">
            <Eyebrow>Как проходит</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">5 шагов от приёмки до отчёта.</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4 lg:gap-3">
            {DIAGNOSTIC_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="relative rounded-lg border border-graphite-500/30 bg-graphite-800 p-5 lg:p-6 hover:border-red-primary/40 transition-all duration-base"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-h2 font-semibold text-red-primary">{step.step}</span>
                  <span className="text-caption text-chrome font-mono tabular-nums">{step.duration}</span>
                </div>
                <h3 className="mt-3 font-display text-h5 text-graphite-50">{step.title}</h3>
                <p className="mt-2 text-body-sm text-graphite-200 text-pretty">{step.description}</p>
                {/* Arrow connector */}
                {idx < DIAGNOSTIC_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                    <ArrowRight className="size-4 text-chrome/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Warranty */}
      <Section>
        <Container>
          <div className="rounded-xl border border-chrome/30 bg-graphite-800 p-8 lg:p-12 text-center max-w-3xl mx-auto">
            <div className="size-14 mx-auto rounded-md bg-red-primary/15 grid place-items-center">
              <ShieldCheck className="size-7 text-red-primary" />
            </div>
            <h3 className="mt-6 font-display text-h2 text-graphite-50">Гарантия 30 дней на корректность диагноза</h3>
            <p className="mt-4 text-body-lg text-graphite-200 text-pretty">
              Если в течение 30 дней выяснится, что диагноз был неверен — мы делаем повторную диагностику бесплатно.
              Это часть нашего стандарта работы и закреплено в договоре-оферте.
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-graphite-900/50">
        <Container size="narrow">
          <div className="text-center mb-12">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
              Вопросы про диагностику
            </h2>
          </div>
          <Accordion type="single" collapsible className="rounded-lg border border-graphite-500/30 bg-graphite-800 px-6 lg:px-8">
            {FAQ_DIAGNOSTIKA.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section size="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite-900 via-obsidian to-obsidian" aria-hidden />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 h-[300px] mx-auto max-w-2xl bg-red-glow blur-3xl opacity-50" aria-hidden />
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-h1 text-graphite-50 text-balance">
              Готовы записаться на диагностику?
            </h2>
            <p className="mt-4 text-body-lg text-graphite-200">
              Выберите удобное время и филиал. Цена фиксируется до начала работ.
            </p>
            <Button asChild size="xl" className="mt-8">
              <Link href="/booking?service=diagnostika">
                Записаться онлайн
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 px-4 py-3 bg-graphite-900/95 backdrop-blur-md border-t border-graphite-500/40 safe-area-inset-bottom">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-caption text-chrome">от</p>
            <p className="font-mono tabular-nums text-h5 text-graphite-50 font-semibold leading-none">2 500 ₽</p>
          </div>
          <Button asChild size="default" className="flex-1 max-w-[200px]">
            <Link href="/booking?service=diagnostika">
              Записаться
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
