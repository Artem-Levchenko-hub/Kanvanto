import Link from "next/link";
import { Bell } from "lucide-react";

interface Props {
  title?: string;
  pendingReminders?: number;
}

export function AccountTopBar({ title, pendingReminders = 0 }: Props) {
  return (
    <header className="lg:hidden sticky top-0 z-20 bg-graphite-900/85 backdrop-blur-md border-b border-graphite-500/30">
      <div className="h-14 px-4 flex items-center justify-between">
        <Link href="/account" className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-red-primary grid place-items-center">
            <span className="font-display text-body-sm font-bold text-white">K</span>
          </div>
          <span className="font-display text-body-base text-graphite-50">
            {title ?? "Кабинет"}
          </span>
        </Link>
        <Link
          href="/account/maintenance"
          className="relative size-10 rounded-md grid place-items-center text-graphite-100 hover:bg-graphite-700"
          aria-label="Напоминания"
        >
          <Bell className="size-5" />
          {pendingReminders > 0 && (
            <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-red-primary grid place-items-center text-[9px] font-bold text-white">
              {pendingReminders > 9 ? "9+" : pendingReminders}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
