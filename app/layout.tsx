import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NextAuthSessionProvider } from "@/components/providers/SessionProvider";
import { YandexMetrica } from "@/components/analytics/YandexMetrica";
import { PWARegister } from "@/components/PWARegister";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

// Apple-style: Inter с очень тонкими весами для display, обычные для body.
// Используется одна семья шрифта, но с разной тонкостью — это даёт
// крупный, почти прозрачный display и читаемый body.
const display = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Сервис уровня дилера в Краснодаре`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kanavto.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <NextAuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              theme="dark"
              toastOptions={{
                classNames: {
                  toast: "bg-graphite-700 border-graphite-500 text-graphite-50",
                },
              }}
            />
          </ThemeProvider>
        </NextAuthSessionProvider>
        <YandexMetrica />
        <PWARegister />
      </body>
    </html>
  );
}
