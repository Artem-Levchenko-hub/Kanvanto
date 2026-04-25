import type { NextAuthConfig } from "next-auth";
import Yandex from "next-auth/providers/yandex";

/**
 * Edge-safe конфиг для middleware. БЕЗ Prisma (Edge runtime не поддерживает Node bindings).
 * Реальный auth.ts расширяет этот объект адаптером и Credentials/Resend провайдерами.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/login",
  },
  providers: [
    ...(process.env.YANDEX_CLIENT_ID && process.env.YANDEX_CLIENT_SECRET
      ? [
          Yandex({
            clientId: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Защищённые роуты
      const isOnAccount = path.startsWith("/account");
      const isOnAdmin = path.startsWith("/admin");
      const isOnAuth = ["/login", "/register", "/verify-request"].some((p) => path.startsWith(p));

      if (isOnAccount) {
        return isLoggedIn;
      }

      if (isOnAdmin) {
        return isLoggedIn && (auth?.user as { role?: string })?.role === "ADMIN";
      }

      // Если уже залогинен и пытается зайти на login/register — редирект в кабинет
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/account", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  trustHost: true,
} satisfies NextAuthConfig;
