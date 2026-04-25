"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Bell, ClipboardList, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/account", label: "Главная", icon: Home, exact: true },
  { href: "/account/cars", label: "Авто", icon: Car },
  { href: "/account/maintenance", label: "ТО", icon: Bell },
  { href: "/account/orders", label: "Заказы", icon: ClipboardList },
  { href: "/account/settings", label: "Я", icon: User },
];

export function AccountBottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Floating Action Button "Записаться" */}
      <Link
        href="/booking"
        className="lg:hidden fixed bottom-20 right-4 z-30 size-14 rounded-full bg-red-primary text-white grid place-items-center shadow-glow-red hover:bg-red-hover active:scale-95 transition-transform"
        aria-label="Записаться"
      >
        <Plus className="size-6" />
      </Link>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-graphite-900/95 backdrop-blur-md border-t border-graphite-500/30 pb-safe">
        <ul className="grid grid-cols-5 gap-1 px-1 py-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md transition-colors",
                    isActive
                      ? "text-red-primary"
                      : "text-graphite-300 hover:text-graphite-50 active:bg-graphite-700"
                  )}
                >
                  <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.6} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
