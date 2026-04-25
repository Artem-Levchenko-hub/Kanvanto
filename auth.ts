import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { authConfig } from "@/auth.config";
import { findOrCreateUserByPhone, normalizePhone } from "@/lib/db/users";
import { verifyOtp } from "@/lib/auth/sms";
import { sendEmail } from "@/lib/email/resend";
import { magicLinkEmail } from "@/lib/email/templates";

const phoneOtpSchema = z.object({
  phone: z.string().min(10),
  code: z.string().length(4),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    // Phone OTP (custom Credentials)
    Credentials({
      id: "phone-otp",
      name: "Телефон",
      credentials: {
        phone: { label: "Телефон", type: "tel" },
        code: { label: "Код", type: "text" },
      },
      async authorize(rawCredentials) {
        const parsed = phoneOtpSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { phone, code } = parsed.data;
        const isValid = await verifyOtp(phone, code);
        if (!isValid) return null;

        const user = await findOrCreateUserByPhone(phone);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        } as unknown as { id: string };
      },
    }),
    // Email magic link (через Resend, без зависимости от nodemailer)
    {
      id: "email",
      name: "Email magic link",
      type: "email",
      maxAge: 24 * 60 * 60, // 24 часа
      async sendVerificationRequest({ identifier: email, url }: { identifier: string; url: string; provider?: unknown }) {
        const { host } = new URL(url);
        const template = magicLinkEmail({ url, host });
        const result = await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
        if (!result) {
          throw new Error("Не удалось отправить письмо. Проверьте настройки Resend.");
        }
      },
      options: {},
    } as never,
  ],
});
