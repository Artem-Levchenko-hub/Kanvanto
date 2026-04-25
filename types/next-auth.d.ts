import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "MASTER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "MASTER" | "ADMIN";
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "MASTER" | "ADMIN";
  }
}
