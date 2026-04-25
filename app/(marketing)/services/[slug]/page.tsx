import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/format";
import { PHONE_DISPLAY, PHONE_LINK } from "@/lib/constants";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <div className="border-b border-graphite-500/30 bg-graphite-900/60 sticky top-16 lg:top-20 z-30 backdrop-blur-sm">
        <Container>
          <nav className="flex items-center gap-2 text-caption text-graphite-300 py-3">
            <Link href="/" className="hover:text-red-primary">Главная</Link>
            <span aria-hidden>/</span>
            <Link href="/services" className="hover:text-red-primary">Услуги</Link>
            <span aria-hidden>/</span>
            <span className="text-graphite-100">{service.title}</span>
          </nav>
        </Container>
      </div>

      <Section size="lg">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Услуга</Eyebrow>
            <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
              {service.title}
            </h1>
            <p className="mt-6 text-body-lg text-graphite-200 text-pretty">{service.shortDescription}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {service.isFlagship && <Badge variant="accent">Флагман</Badge>}
              {service.isExclusive && <Badge variant="chrome">Exclusive</Badge>}
              <Badge variant="default">от {formatPrice(service.basePrice)}</Badge>
              <Badge variant="default">~{Math.round(service.durationMinutes / 60 * 10) / 10} ч</Badge>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="xl">
                <Link href={`/booking?service=${service.slug}`}>
                  Записаться
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

            <p className="mt-12 text-body-base text-graphite-300">
              Детальная страница для услуги «{service.title}» дополняется на этапе 1 после сбора прайса
              по маркам и фотографий процесса. Шаблон унифицирован: Hero → подкатегории → прайс →
              что входит/не входит → оборудование → процесс → гарантия → отзывы → cross-sell → FAQ.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
