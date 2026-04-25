import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Home, ClipboardList, Users, Wrench, MapPin, LogOut, Shield } from "lucide-react";
import { signOut } from "@/auth";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: Home },
  { href: "/admin/bookings", label: "Записи", icon: ClipboardList },
  { href: "/admin/customers", label: "Клиенты", icon: Users },
  { href: "/admin/services", label: "Услуги", icon: Wrench },
  { href: "/admin/branches", label: "Филиалы", icon: MapPin },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-dvh bg-obsidian flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-graphite-500/30 bg-graphite-900">
        <div className="px-6 py-5 border-b border-graphite-500/30">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-red-primary grid place-items-center">
              <span className="font-display text-h6 font-bold text-white">K</span>
            </div>
            <div>
              <p className="font-display text-body-base text-graphite-50 leading-none">Kanavto</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-chrome mt-1">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-sm text-graphite-100 hover:bg-graphite-700 hover:text-graphite-50 transition-colors"
              >
                <Icon className="size-4 text-chrome" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-graphite-500/30">
          <div className="px-3 py-2 mb-2">
            <p className="text-caption text-chrome uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="size-3" />
              Админ
            </p>
            <p className="text-body-sm text-graphite-50 truncate mt-1">
              {session.user.name || session.user.email || (session.user as { phone?: string }).phone}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body-sm text-graphite-200 hover:bg-graphite-700 hover:text-error transition-colors"
            >
              <LogOut className="size-4" />
              Выйти
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden border-b border-graphite-500/30 bg-graphite-900 px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-red-primary grid place-items-center">
              <span className="font-display text-body-sm font-bold text-white">K</span>
            </div>
            <span className="font-display text-body-base text-graphite-50">Admin</span>
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="p-2 text-graphite-100 hover:text-error">
              <LogOut className="size-5" />
            </button>
          </form>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
