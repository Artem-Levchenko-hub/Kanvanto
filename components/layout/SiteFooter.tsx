import Link from "next/link";
import { Send, MessageCircle, Map, Instagram, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import {
  BRANCHES,
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_LINK,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";

const SOCIAL_ICONS = {
  Send,
  MessageCircle,
  Map,
  Instagram,
} as const;

export function SiteFooter() {
  return (
    <footer className="relative bg-graphite-900 border-t border-graphite-500/40 mt-24">
      <Container>
        <div className="py-16 lg:py-24">
          {/* Top: brand + columns */}
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-red-primary grid place-items-center">
                  <span className="font-display text-h5 font-bold text-white leading-none">K</span>
                </div>
                <div>
                  <p className="font-display text-h4 font-semibold leading-none text-graphite-50">
                    {SITE_NAME}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-chrome mt-1">
                    Premium Auto Service
                  </p>
                </div>
              </Link>
              <p className="mt-6 text-body-base text-graphite-200 max-w-md">
                Сервис уровня дилера в Краснодаре с 1995 года. BMW, Mercedes, Audi, Porsche, Skoda,
                Volkswagen.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon as keyof typeof SOCIAL_ICONS] ?? Send;
                  return (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-graphite-500/40 text-graphite-100 hover:text-red-primary hover:border-red-primary/40 transition-colors duration-fast"
                    >
                      <Icon className="size-4" />
                      <span className="text-body-sm">{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-2">
              <p className="text-label uppercase tracking-[0.2em] text-chrome mb-5">Навигация</p>
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div className="lg:col-span-2">
              <p className="text-label uppercase tracking-[0.2em] text-chrome mb-5">Кабинет</p>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/login" className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors">
                    Войти
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors">
                    Регистрация
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors">
                    Мои авто
                  </Link>
                </li>
                <li>
                  <Link href="/account/maintenance" className="text-body-sm text-graphite-100 hover:text-red-primary transition-colors">
                    Напоминания о ТО
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="text-body-sm text-red-primary hover:underline">
                    Записаться →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacts */}
            <div className="lg:col-span-4">
              <p className="text-label uppercase tracking-[0.2em] text-chrome mb-5">Контакты</p>
              <a
                href={`tel:${PHONE_LINK}`}
                className="flex items-center gap-3 text-graphite-50 hover:text-red-primary transition-colors group"
              >
                <Phone className="size-5 text-red-primary" />
                <span className="font-display text-h4 font-mono tabular-nums">{PHONE_DISPLAY}</span>
              </a>
              <a
                href="mailto:company@kanavto.com"
                className="mt-3 flex items-center gap-3 text-body-sm text-graphite-200 hover:text-red-primary transition-colors"
              >
                <Mail className="size-4" />
                <span>company@kanavto.com</span>
              </a>

              <p className="text-label uppercase tracking-[0.2em] text-chrome mt-8 mb-4">
                4 филиала в Краснодаре
              </p>
              <ul className="space-y-3">
                {BRANCHES.map((b) => (
                  <li key={b.id} className="text-body-sm">
                    <Link
                      href={`/locations/${b.slug}`}
                      className="flex flex-col gap-0.5 group hover:text-red-primary transition-colors"
                    >
                      <span className="text-graphite-100 group-hover:text-red-primary">{b.address}</span>
                      <span className="text-caption text-chrome">{b.hours}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Bottom: legal */}
          <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-caption text-graphite-300">
              <p>© {new Date().getFullYear()} {SITE_NAME}. Все права защищены.</p>
              <p className="mt-1 font-mono tabular-nums">ИНН: 2310123456 · ОГРН: 1052310987654</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className="text-caption text-graphite-300 hover:text-graphite-50">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-caption text-graphite-300 hover:text-graphite-50">
                Договор-оферта
              </Link>
              <Link href="/warranty" className="text-caption text-graphite-300 hover:text-graphite-50">
                Гарантии
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
