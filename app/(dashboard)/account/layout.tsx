import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { AccountSidebar } from "@/components/dashboard/AccountSidebar";
import { AccountBottomNav } from "@/components/dashboard/AccountBottomNav";
import { AccountTopBar } from "@/components/dashboard/AccountTopBar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, bonusLevel: true },
  });

  if (!user) redirect("/login");

  // Кол-во активных напоминаний для бейджа в top-bar
  const pendingCount = await prisma.maintenanceReminder.count({
    where: {
      car: { userId: session.user.id, isActive: true },
      status: { in: ["DUE", "OVERDUE"] },
    },
  });

  return (
    <div className="min-h-dvh bg-obsidian flex">
      <AccountSidebar user={user} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AccountTopBar pendingReminders={pendingCount} />
        <main className="flex-1 pb-20 lg:pb-8">{children}</main>
        <AccountBottomNav />
      </div>
    </div>
  );
}
