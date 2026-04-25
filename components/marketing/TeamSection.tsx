"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const TEAM = [
  {
    name: "Алексей М.",
    role: "Старший мастер-приёмщик BMW",
    experience: 18,
    initials: "АМ",
    specs: ["Кодирование BMW", "N54/N55", "ZF 8HP"],
  },
  {
    name: "Дмитрий К.",
    role: "Мастер-приёмщик Mercedes",
    experience: 14,
    initials: "ДК",
    specs: ["AMG", "M278/M276", "7G-Tronic"],
  },
  {
    name: "Сергей В.",
    role: "Мастер Porsche / Audi",
    experience: 22,
    initials: "СВ",
    specs: ["Porsche 911", "RS4/RS6", "DSG/PDK"],
  },
  {
    name: "Иван П.",
    role: "Мастер VW / Škoda",
    experience: 11,
    initials: "ИП",
    specs: ["TFSI/TSI", "DSG", "Гарантийное обслуживание"],
  },
];

export function TeamSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section className="relative">
      <Container>
        <div className="max-w-2xl mb-12 lg:mb-16">
          <Eyebrow>Команда</Eyebrow>
          <h2 className="mt-4 font-display text-h1 text-graphite-50 text-balance">
            Живые люди. Не безликий персонал.
          </h2>
          <p className="mt-4 text-body-lg text-graphite-200 text-pretty">
            Каждый мастер специализируется на конкретных марках и видах работ. Опыт от 11 до 22 лет.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {TEAM.map((member, idx) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.5,
                delay: prefersReducedMotion ? 0 : idx * 0.08,
              }}
              className="group relative rounded-lg overflow-hidden border border-graphite-500/30 bg-graphite-800 hover:border-chrome/30 hover:-translate-y-1 transition-all duration-base"
            >
              {/* Portrait area */}
              <div className="aspect-[3/4] bg-gradient-to-br from-graphite-700 to-graphite-900 grid place-items-center relative overflow-hidden">
                {/* Subtle inner highlight */}
                <span className="absolute inset-0 bg-gradient-to-t from-transparent to-graphite-50/[0.02]" aria-hidden />
                {/* Initials avatar */}
                <span className="font-display text-[6rem] font-semibold text-chrome/40 group-hover:text-chrome/60 transition-colors">
                  {member.initials}
                </span>
                {/* Bottom red line on hover */}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
              </div>

              {/* Info */}
              <div className="p-5 lg:p-6">
                <h3 className="font-display text-h5 text-graphite-50">{member.name}</h3>
                <p className="mt-1 text-body-sm text-graphite-200">{member.role}</p>
                <p className="mt-2 text-caption text-chrome font-mono tabular-nums">
                  {member.experience} лет в Канавто
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {member.specs.map((spec) => (
                    <Badge key={spec} variant="default" className="text-[10px]">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
