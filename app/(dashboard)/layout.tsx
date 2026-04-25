import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-obsidian">
      <header className="border-b border-graphite-500/30 bg-graphite-900">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-red-primary grid place-items-center">
              <span className="font-display text-h6 font-bold text-white">K</span>
            </div>
            <span className="font-display text-h6 text-graphite-50">Личный кабинет</span>
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
