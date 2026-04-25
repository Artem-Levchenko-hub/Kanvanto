import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PHONE_DISPLAY, PHONE_LINK } from "@/lib/constants";

export function BookingCta() {
  return (
    <Section size="lg" className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian via-graphite-900 to-obsidian"
        aria-hidden
      />
      {/* Red glow */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 h-[400px] mx-auto max-w-4xl bg-red-glow blur-3xl opacity-50"
        aria-hidden
      />

      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-display-xl text-graphite-50 text-balance leading-[0.95]">
            Записаться занимает
            <br />
            <span className="text-red-primary">90 секунд.</span>
          </h2>
          <p className="mt-6 text-body-lg text-graphite-200 max-w-2xl mx-auto text-pretty">
            Без звонков. Без «оставьте заявку — перезвоним». Выберите услугу, филиал и время —
            и подтверждение придёт мгновенно.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="xl">
              <Link href="/booking">
                Записаться онлайн
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href={`tel:${PHONE_LINK}`}>
                <Phone className="size-5" />
                <span className="font-mono tabular-nums">{PHONE_DISPLAY}</span>
              </a>
            </Button>
          </div>

          <p className="mt-8 text-caption text-graphite-300">
            Работаем Пн–Вс с 8:00 до 19:00 · Перезваниваем в течение 5 минут в рабочее время
          </p>
        </div>
      </Container>
    </Section>
  );
}
