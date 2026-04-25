"use client";

import { Container, Section, Eyebrow } from "@/components/ui/container";
import { CountUp } from "@/components/animations/CountUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

const ITEMS = [
  {
    value: 30,
    suffix: "",
    label: "лет опыта",
    description: "Работаем с 1995 года. Знаем каждую модель немецких марок до винтика.",
  },
  {
    value: 4,
    suffix: "",
    label: "филиала",
    description: "По всему Краснодару. Выбирайте ближайший к дому или работе.",
  },
  {
    value: 50,
    suffix: "",
    label: "постов",
    description: "Одновременное обслуживание. Без долгих очередей и переноса записи.",
  },
  {
    value: 71000,
    suffix: "+",
    label: "клиентов",
    description: "Доверяют нам свои авто. Премия 2ГИС за высокие оценки пользователей.",
  },
];

export function UspStats() {
  return (
    <Section className="relative">
      <Container>
        <div className="max-w-2xl mb-12 lg:mb-16">
          <Eyebrow>Цифры, за которыми стоит работа</Eyebrow>
          <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
            Мы давно перестали быть гаражным сервисом.
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {ITEMS.map((item) => (
            <StaggerItem key={item.label}>
              <div className="relative h-full p-6 lg:p-8 rounded-lg border border-graphite-500/30 bg-graphite-800 hover:bg-graphite-700 hover:border-chrome/30 transition-all duration-base group">
                <div className="font-display text-[clamp(3.5rem,8vw,6rem)] font-semibold leading-none text-chrome group-hover:text-red-primary transition-colors">
                  <CountUp
                    to={item.value}
                    format={(v) => Math.round(v).toLocaleString("ru-RU")}
                  />
                  {item.suffix && <span>{item.suffix}</span>}
                </div>
                <p className="mt-4 text-label uppercase tracking-[0.18em] text-graphite-50 font-semibold">
                  {item.label}
                </p>
                <p className="mt-3 text-body-sm text-graphite-200 text-pretty">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
