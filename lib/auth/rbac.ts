import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { UserRole } from "@prisma/client";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function requireRole(role: UserRole) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== role && session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session.user;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
