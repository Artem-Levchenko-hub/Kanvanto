import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const AB_COOKIE_TTL = 60 * 60 * 24 * 30; // 30 дней

function pickRandomVariant(): "a" | "b" {
  return Math.random() < 0.5 ? "a" : "b";
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cron — отдельная защита через CRON_SECRET в Authorization header
  if (pathname.startsWith("/api/cron")) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.next();
  }

  // /account, /admin, /master — проверка через NextAuth
  if (pathname.startsWith("/account") || pathname.startsWith("/admin") || pathname.startsWith("/master")) {
    const session = await auth();
    if (!session?.user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    const role = (session.user as { role?: string }).role;
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/master") && role !== "MASTER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    return NextResponse.next();
  }

  // A/B cookies для маркетингa: первое посещение / без cookie → выдаём вариант
  // Действует только на публичных страницах
  const response = NextResponse.next();
  if (process.env.AB_HERO_HEADLINE_ENABLED === "true") {
    if (!request.cookies.has("ab_hero_headline")) {
      response.cookies.set("ab_hero_headline", pickRandomVariant(), {
        path: "/",
        maxAge: AB_COOKIE_TTL,
        sameSite: "lax",
      });
    }
  }
  if (process.env.AB_CTA_TEXT_ENABLED === "true") {
    if (!request.cookies.has("ab_cta_text")) {
      response.cookies.set("ab_cta_text", pickRandomVariant(), {
        path: "/",
        maxAge: AB_COOKIE_TTL,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/master/:path*",
    "/api/cron/:path*",
    // Главная и страница диагностики — для A/B
    "/",
    "/services/diagnostika",
  ],
};
