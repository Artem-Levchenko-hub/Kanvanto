import type { Metadata } from "next";
import { BranchesMapSection } from "@/components/marketing/BranchesMapSection";
import { Container, Section, Eyebrow } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Сеть филиалов в Краснодаре",
  description: "4 филиала Канавто по Краснодару. Карта, адреса, часы работы, специализация по маркам.",
};

export default function LocationsPage() {
  return (
    <>
      <Section className="pt-12 lg:pt-16">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Сеть филиалов</Eyebrow>
            <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
              4 филиала в Краснодаре
            </h1>
            <p className="mt-6 text-body-lg text-graphite-200 text-pretty">
              Каждый специализируется на разных марках и видах работ. Выберите ближайший к дому.
            </p>
          </div>
        </Container>
      </Section>
      <BranchesMapSection />
    </>
  );
}
