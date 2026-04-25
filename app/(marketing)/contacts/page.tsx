import Link from "next/link";
import { Phone, Mail, Send, MessageCircle, Map } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { BRANCHES, PHONE_DISPLAY, PHONE_LINK, SOCIAL_LINKS } from "@/lib/constants";

export const metadata = {
  title: "Контакты",
  description: "Контакты Канавто: телефон, email, 4 филиала в Краснодаре, мессенджеры.",
};

const ICONS = { Send, MessageCircle, Map } as const;

export default function ContactsPage() {
  return (
    <Section size="lg">
      <Container>
        <div className="max-w-2xl mb-12">
          <Eyebrow>Контакты</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl text-graphite-50 text-balance">
            Связаться с нами
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Quick contact */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card>
              <CardContent className="pt-6">
                <a
                  href={`tel:${PHONE_LINK}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="size-12 rounded-md bg-red-primary/15 grid place-items-center">
                    <Phone className="size-6 text-red-primary" />
                  </div>
                  <div>
                    <p className="text-caption text-chrome">Звонок (Пн–Вс 8:00–19:00)</p>
                    <p className="font-mono tabular-nums text-h4 text-graphite-50 group-hover:text-red-primary transition-colors">
                      {PHONE_DISPLAY}
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <a href="mailto:company@kanavto.com" className="flex items-center gap-4 group">
                  <div className="size-12 rounded-md bg-graphite-700 border border-graphite-500/40 grid place-items-center">
                    <Mail className="size-6 text-chrome" />
                  </div>
                  <div>
                    <p className="text-caption text-chrome">Email (общие вопросы)</p>
                    <p className="text-body-base text-graphite-50 group-hover:text-red-primary transition-colors">
                      company@kanavto.com
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-caption text-chrome uppercase tracking-wider mb-4">Мессенджеры</p>
                <div className="flex flex-col gap-2">
                  {SOCIAL_LINKS.map((s) => {
                    const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Send;
                    return (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-graphite-700 text-graphite-100 hover:text-red-primary transition-colors"
                      >
                        <Icon className="size-5" />
                        <span className="text-body-sm">{s.label}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branches */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {BRANCHES.map((b) => (
              <Card key={b.id}>
                <CardContent className="pt-6">
                  <p className="font-display text-h5 text-graphite-50">{b.name}</p>
                  <p className="mt-2 text-body-sm text-graphite-200">{b.address}</p>
                  <p className="mt-1 text-caption text-chrome font-mono tabular-nums">{b.hours}</p>
                  <a
                    href={`tel:${b.phone.replace(/[^+\d]/g, "")}`}
                    className="mt-3 block font-mono tabular-nums text-body-sm text-graphite-100 hover:text-red-primary transition-colors"
                  >
                    {b.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="mt-16 pt-8 border-t border-graphite-500/30 text-caption text-graphite-300 space-y-1 font-mono tabular-nums">
          <p>ООО «Канавто»</p>
          <p>ИНН: 2310123456 · ОГРН: 1052310987654</p>
          <p>Юр. адрес: 350001, г. Краснодар, ул. Будённого, 356</p>
        </div>
      </Container>
    </Section>
  );
}
