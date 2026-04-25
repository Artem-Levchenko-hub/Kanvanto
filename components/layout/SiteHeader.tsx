"use client";

import * as React from "react";
import Link from "next/link";
import { Phone, Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_LINK, BRANCHES, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-base ease-standard",
          scrolled
            ? "border-b border-graphite-500/40 bg-graphite-900/85 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-9 w-9 rounded-md bg-red-primary grid place-items-center">
                <span className="font-display text-h5 font-bold text-white leading-none">K</span>
                <span className="absolute -inset-1 rounded-lg bg-red-glow opacity-0 group-hover:opacity-100 transition-opacity duration-base" />
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-h5 font-semibold leading-none text-graphite-50">
                  {SITE_NAME}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-chrome mt-1">
                  Premium Auto Service
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-body-sm font-medium text-graphite-100 rounded-md hover:text-graphite-50 hover:bg-graphite-700/60 transition-colors duration-fast"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right CTA */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${PHONE_LINK}`}
                className="hidden md:flex items-center gap-2 text-body-sm font-medium text-graphite-100 hover:text-red-primary transition-colors"
              >
                <Phone className="size-4" />
                <span className="font-mono">{PHONE_DISPLAY}</span>
              </a>
              <Button asChild size="default" className="hidden sm:inline-flex">
                <Link href="/booking">Записаться</Link>
              </Button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-graphite-100 hover:bg-graphite-700"
                aria-label="Открыть меню"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-graphite-900 border-l border-graphite-500/40 shadow-e-4 animate-fade-in-up">
            <div className="flex h-16 items-center justify-between px-6 border-b border-graphite-500/30">
              <span className="font-display text-h5 text-graphite-50">Меню</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-graphite-100 hover:bg-graphite-700"
                aria-label="Закрыть меню"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-body-base font-medium text-graphite-50 rounded-md hover:bg-graphite-700"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-graphite-500/30" />
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-body-base font-medium text-graphite-100 rounded-md hover:bg-graphite-700"
              >
                Личный кабинет
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-body-base font-medium text-graphite-100 rounded-md hover:bg-graphite-700"
              >
                Войти
              </Link>
            </nav>

            <div className="px-6 pb-6">
              <Button asChild size="lg" className="w-full">
                <Link href="/booking" onClick={() => setMobileOpen(false)}>
                  Записаться онлайн
                </Link>
              </Button>
              <a
                href={`tel:${PHONE_LINK}`}
                className="mt-4 flex items-center justify-center gap-2 text-body-sm text-graphite-100 hover:text-red-primary"
              >
                <Phone className="size-4" />
                <span className="font-mono">{PHONE_DISPLAY}</span>
              </a>
              <div className="mt-6 flex flex-col gap-2">
                {BRANCHES.slice(0, 2).map((b) => (
                  <div key={b.id} className="flex items-start gap-3 text-body-sm">
                    <MapPin className="size-4 mt-0.5 text-chrome shrink-0" />
                    <div className="text-graphite-200">
                      <p className="text-graphite-100">{b.address}</p>
                      <p className="text-caption text-chrome">{b.hours}</p>
                    </div>
                  </div>
                ))}
                <Link
                  href="/locations"
                  onClick={() => setMobileOpen(false)}
                  className="text-caption text-red-primary hover:underline ml-7"
                >
                  Все 4 филиала →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
