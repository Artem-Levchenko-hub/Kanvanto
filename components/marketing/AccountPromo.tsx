"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bell, ClipboardList, Sparkles, FileText } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: ClipboardList, title: "История всех работ", description: "Все заказы, запчасти, мастера и фото — в одном месте, по каждому авто." },
  { icon: Bell, title: "Напоминания о ТО", description: "За 30, 14 и 3 дня до плановой замены масла, ГРМ, антифриза. Email, SMS, Telegram." },
  { icon: Sparkles, title: "Бонусная программа", description: "Bronze → Silver → Gold → Platinum. До 10% постоянной скидки и приоритетная запись." },
  { icon: FileText, title: "Заказ-наряды и гарантии", description: "Электронные документы. Скачать PDF — в один клик." },
];

export function AccountPromo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section size="lg" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-graphite-900 via-obsidian to-graphite-900" aria-hidden />
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-red-glow blur-3xl opacity-25" aria-hidden />

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: text */}
          <div className="lg:col-span-6">
            <Eyebrow>Личный кабинет</Eyebrow>
            <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance leading-[1.05]">
              Не помните, когда меняли масло?
              <br />
              <span className="text-red-primary">Мы помним.</span>
            </h2>
            <p className="mt-6 text-body-lg text-graphite-200 max-w-md text-pretty">
              Создайте аккаунт за 90 секунд — и больше никогда не пропустите ТО. Все данные о вашем
              авто сохраняются после каждого визита.
            </p>

            <div className="mt-10 space-y-5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-4">
                    <div className="size-11 shrink-0 rounded-md bg-red-primary/15 border border-red-primary/30 grid place-items-center text-red-primary">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-body-base font-semibold text-graphite-50">{f.title}</p>
                      <p className="mt-1 text-body-sm text-graphite-300 text-pretty">{f.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Создать кабинет
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/login">Уже есть аккаунт — войти</Link>
              </Button>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.7 }}
              className="relative rounded-xl border border-graphite-500/40 bg-graphite-900 overflow-hidden shadow-e-4"
            >
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-graphite-500/30 bg-graphite-800">
                <span className="size-3 rounded-full bg-error/50" />
                <span className="size-3 rounded-full bg-warning/50" />
                <span className="size-3 rounded-full bg-success/50" />
                <span className="ml-3 px-3 py-1 rounded text-caption text-graphite-200 bg-graphite-900 font-mono tabular-nums">
                  kanavto.com/account
                </span>
              </div>

              {/* Mock dashboard */}
              <div className="p-5 lg:p-6 space-y-4">
                {/* Greeting card */}
                <div className="rounded-lg bg-gradient-to-br from-graphite-800 to-graphite-700 border border-graphite-500/30 p-5">
                  <p className="text-caption text-chrome">С возвращением,</p>
                  <p className="font-display text-h4 text-graphite-50 mt-1">Дмитрий</p>
                  <p className="text-body-sm text-graphite-200 mt-2">
                    Ваш BMW X5 G05 готов к ТО через <span className="text-warning font-semibold">1 200 км</span>
                  </p>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard icon="🚗" label="Пробег" value="84 320 км" />
                  <MetricCard icon="⏱️" label="До ТО" value="18 дней" tone="warning" />
                  <MetricCard icon="✨" label="Бонусы" value="12 480 ₽" tone="success" />
                  <MetricCard icon="🔧" label="В работе" value="60%" />
                </div>

                {/* Reminder alert */}
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="size-5 text-warning shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-body-sm font-semibold text-graphite-50">
                        Регламентное ТО · BMW X5 G05
                      </p>
                      <p className="text-caption text-graphite-300 mt-1">
                        ~24 500 ₽ · масло, фильтры, тормозная жидкость
                      </p>
                    </div>
                    <span className="font-display text-h6 text-warning font-semibold">18д</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: string;
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const valueColor =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-graphite-50";
  return (
    <div className="rounded-md border border-graphite-500/30 bg-graphite-800 p-4">
      <div className="flex items-center gap-2 text-caption text-chrome uppercase tracking-wider">
        <span aria-hidden>{icon}</span>
        {label}
      </div>
      <p className={`mt-2 font-display text-h6 font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}
