import Link from "next/link";
import { X } from "lucide-react";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-obsidian">
      <header className="sticky top-0 z-30 bg-graphite-900/85 backdrop-blur-md border-b border-graphite-500/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-red-primary grid place-items-center">
              <span className="font-display text-h6 font-bold text-white">K</span>
            </div>
            <span className="font-display text-h6 text-graphite-50">Kanavto</span>
          </Link>
          <Link
            href="/"
            className="size-10 rounded-md grid place-items-center text-graphite-100 hover:bg-graphite-700"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
