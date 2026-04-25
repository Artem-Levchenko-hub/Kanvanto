import Link from "next/link";
import { redirect } from "next/navigation";
import { Wrench, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";

export default async function MasterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/master");
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "MASTER" && role !== "ADMIN") {
    redirect("/account");
  }

  return (
    <div className="min-h-dvh bg-obsidian flex flex-col">
      <header className="border-b border-graphite-500/30 bg-graphite-900">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/master" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-red-primary grid place-items-center">
              <Wrench className="size-4 text-white" />
            </div>
            <div>
              <p className="font-display text-body-base text-graphite-50 leading-none">Kanavto</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-chrome mt-0.5">Master</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-caption text-graphite-300 hidden sm:block">
              {session.user.name || session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="size-10 rounded-md grid place-items-center text-graphite-100 hover:bg-graphite-700 hover:text-error transition-colors"
                aria-label="Выйти"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 mx-auto max-w-[1280px] w-full">{children}</main>
    </div>
  );
}
