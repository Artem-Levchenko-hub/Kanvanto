import { Container, Section, Eyebrow } from "@/components/ui/container";
import { UspStats } from "@/components/marketing/UspStats";

export const metadata = {
  title: "О компании",
  description: "Канавто — премиум-автосервис в Краснодаре с 1995 года. История, команда, оборудование.",
};

export default function AboutPage() {
  return (
    <>
      <Section size="lg">
        <Container size="narrow">
          <Eyebrow>О компании</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
            30 лет уважения к немецкому инжинирингу.
          </h1>
          <p className="mt-8 text-body-lg text-graphite-200 text-pretty">
            Канавто открылся в 1995 году как небольшой бокс с одним подъёмником на улице Будённого.
            За 30 лет мы выросли в сеть из 4 филиалов, 50 постов, и команду из 60+ мастеров.
            Через нас прошло более 71&nbsp;000 автомобилей. Среди наших постоянных клиентов —
            владельцы редких Porsche 911 GT3 RS, M-серий BMW и AMG-моделей Mercedes.
          </p>
          <p className="mt-6 text-body-lg text-graphite-200 text-pretty">
            Что нас отличает — это инвестиции в дилерское оборудование и обучение мастеров.
            Только за последние 5 лет мы вложили более 25&nbsp;млн ₽ в ICOM, XENTRY, PIWIS Tester,
            стенды развал-схождения Hunter и эндоскопы Olympus. Это позволяет нам делать работы,
            которые недоступны 90% сервисов в регионе.
          </p>
        </Container>
      </Section>
      <UspStats />
    </>
  );
}
