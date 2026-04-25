import { Container, Section, Eyebrow } from "@/components/ui/container";
import { LivePriceSection } from "@/components/marketing/LivePriceSection";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";

export const metadata = {
  title: "Прайс-лист",
  description: "Открытые цены Канавто: диагностика, ТО, ремонт. Без \"оставьте заявку\".",
};

export default function PricingPage() {
  return (
    <>
      <Section className="pt-12 lg:pt-16 pb-0">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Прайс-лист</Eyebrow>
            <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
              Цены, которые мы не прячем
            </h1>
            <p className="mt-6 text-body-lg text-graphite-200 text-pretty">
              Открытые цены — это часть нашего стандарта. Никаких «оставьте заявку — обсудим».
              Стоимость фиксируется в заказ-наряде до начала работ.
            </p>
          </div>
        </Container>
      </Section>
      <LivePriceSection />
      <ServicesGrid />
    </>
  );
}
