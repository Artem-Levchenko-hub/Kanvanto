"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home, Car, Bell, ClipboardList, Sparkles, FileText, Settings, LogOut,
  CalendarPlus, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/account", label: "Главная", icon: Home },
  { href: "/account/cars", label: "Мои авто", icon: Car },
  { href: "/account/maintenance", label: "Напоминания о ТО", icon: Bell },
  { href: "/account/orders", label: "История заказов", icon: ClipboardList },
  { href: "/account/bonuses", label: "Бонусы", icon: Sparkles },
  { href: "/account/documents", label: "Документы", icon: FileText },
  { href: "/account/settings", label: "Настройки", icon: Settings },
];

interface Props {
  user: { name: string | null; email: string | null; phone: string | null; bonusLevel: string };
}

export function AccountSidebar({ user }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col shrink-0 border-r border-graphite-500/30 bg-graphite-900 transition-[width] duration-base",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="px-4 py-5 border-b border-graphite-500/30 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 shrink-0 rounded-md bg-red-primary grid place-items-center">
            <span className="font-display text-h6 font-bold text-white">K</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display text-body-base text-graphite-50 leading-none">Kanavto</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-chrome mt-1">Кабинет</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/account" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-body-sm transition-colors group",
                isActive
                  ? "bg-red-primary/10 text-red-primary"
                  : "text-graphite-100 hover:bg-graphite-700 hover:text-graphite-50"
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-red-primary" : "text-chrome")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-graphite-500/30 space-y-2">
        <Button asChild size={collapsed ? "icon" : "default"} className="w-full">
          <Link href="/booking" title={collapsed ? "Записаться" : undefined}>
            <CalendarPlus className="size-4" />
            {!collapsed && "Записаться"}
          </Link>
        </Button>

        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-caption text-chrome uppercase tracking-wider">{user.bonusLevel}</p>
            <p className="text-body-sm text-graphite-50 truncate mt-1">
              {user.name || user.email || user.phone || "Клиент"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-body-sm text-graphite-200 hover:bg-graphite-700 hover:text-error transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-caption text-graphite-300 hover:bg-graphite-700 transition-colors"
          aria-label={collapsed ? "Развернуть" : "Свернуть"}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </div>
    </aside>
  );
}
