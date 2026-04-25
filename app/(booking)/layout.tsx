import Link from "next/link";
import { X, Phone, ShieldCheck } from "lucide-react";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-obsidian flex flex-col">
      <header className="sticky top-0 z-30 bg-graphite-900/90 backdrop-blur-md border-b border-graphite-500/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-md bg-red-primary grid place-items-center">
              <span className="font-display text-h6 font-bold text-white leading-none">K</span>
            </div>
            <div>
              <span className="font-display text-h6 text-graphite-50 leading-none block">Kanavto</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-chrome mt-0.5 block">
                Онлайн-запись
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="tel:+79054051111"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md text-body-sm text-graphite-100 hover:text-red-primary hover:bg-graphite-700/60 transition-colors"
            >
              <Phone className="size-4" />
              <span className="font-mono tabular-nums">+7 (905) 405-11-11</span>
            </a>
            <Link
              href="/"
              className="size-10 rounded-md grid place-items-center text-graphite-100 hover:bg-graphite-700 hover:text-graphite-50"
              aria-label="Закрыть"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-graphite-500/30 bg-graphite-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-center gap-2 text-caption text-graphite-300">
          <ShieldCheck className="size-3.5 text-success" />
          <span>Защищённое соединение · Данные не передаются третьим лицам</span>
        </div>
      </footer>
    </div>
  );
}
