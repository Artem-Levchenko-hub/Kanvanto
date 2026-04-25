import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, ArrowLeft } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRANCHES } from "@/lib/constants";

export function generateStaticParams() {
  return BRANCHES.map((b) => ({ slug: b.slug }));
}

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = BRANCHES.find((b) => b.slug === slug);
  if (!branch) notFound();

  return (
    <>
      <div className="border-b border-graphite-500/30 bg-graphite-900/60 sticky top-16 lg:top-20 z-30 backdrop-blur-sm">
        <Container>
          <Link href="/locations" className="inline-flex items-center gap-2 py-3 text-caption text-graphite-300 hover:text-red-primary">
            <ArrowLeft className="size-3.5" /> Все филиалы
          </Link>
        </Container>
      </div>

      <Section size="lg">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <Eyebrow>Филиал</Eyebrow>
              <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
                {branch.name}
              </h1>
              {branch.isHQ && <Badge variant="accent" className="mt-4">Главный офис</Badge>}

              <div className="mt-10 space-y-5 max-w-md">
                <InfoRow icon={MapPin} label="Адрес" value={branch.address} />
                <InfoRow icon={Clock} label="Часы работы" value={branch.hours} />
                <InfoRow icon={Phone} label="Телефон" value={branch.phone} href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`} />
              </div>

              <div className="mt-8">
                <p className="text-label uppercase tracking-[0.18em] text-chrome mb-3">Специализация</p>
                <div className="flex flex-wrap gap-2">
                  {branch.brands.map((b) => (
                    <Badge key={b} variant="chrome">{b}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href={`/booking?branch=${branch.slug}`}>Записаться сюда</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`https://yandex.ru/maps/?text=${encodeURIComponent(branch.address + " " + branch.city)}`} target="_blank" rel="noopener noreferrer">
                    <Navigation className="size-5" />
                    Маршрут
                  </a>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/5] rounded-xl border border-graphite-500/40 bg-gradient-to-br from-graphite-700 to-graphite-900 grid place-items-center">
                <div className="text-center px-8">
                  <MapPin className="size-12 mx-auto text-chrome opacity-50" />
                  <p className="mt-4 text-body-sm text-graphite-300">
                    Фото фасада и интерьера филиала<br />подключаются на этапе 1
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-16 border-t border-graphite-500/30">
            <p className="text-body-base text-graphite-200 max-w-2xl">
              Детальная страница филиала включает: фото фасада 21:9, фото интерьера и оборудования,
              команду мастеров, отзывы по этому филиалу, карту с точкой и услугами, доступными именно здесь.
              Расширяется на этапе 1 после сбора фото-материалов.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

function InfoRow({ icon: Icon, label, value, href }: { icon: typeof MapPin; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex gap-4">
      <div className="size-10 shrink-0 rounded-md bg-graphite-700 border border-graphite-500/40 grid place-items-center">
        <Icon className="size-5 text-chrome" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-caption text-chrome uppercase tracking-wider">{label}</p>
        <p className="mt-0.5 text-body-base text-graphite-50">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:text-red-primary transition-colors">{content}</a> : content;
}
