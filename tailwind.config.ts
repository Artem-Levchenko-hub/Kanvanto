import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Базовые semantic-токены (через CSS-переменные)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Графитовая шкала (бренд)
        obsidian: "#0A0A0B",
        graphite: {
          900: "#111114",
          800: "#17171B",
          700: "#1F1F25",
          600: "#2A2A32",
          500: "#3A3A44",
          400: "#52525C",
          300: "#6E6E76",
          200: "#A8A8B0",
          100: "#D4D4DC",
          50: "#F5F5F7",
        },

        // Красный акцент
        red: {
          primary: "#DC2626",
          hover: "#EF4444",
          pressed: "#B91C1C",
          glow: "rgba(220, 38, 38, 0.18)",
          tint: "rgba(220, 38, 38, 0.08)",
        },

        // Хром
        chrome: {
          DEFAULT: "#C0C0C8",
          warm: "#D4D4DC",
          deep: "#7A7A82",
        },

        // Status (с иконкой, не цветом одним)
        success: {
          DEFAULT: "#34D399",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#FBBF24",
          dark: "#D97706",
        },
        error: {
          DEFAULT: "#F87171",
          dark: "#DC2626",
        },
        info: {
          DEFAULT: "#60A5FA",
          dark: "#2563EB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-jost)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Mobile / desktop типография
        "display-xl": ["clamp(3rem, 5vw + 1rem, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        "h1": ["clamp(2.25rem, 3vw + 1rem, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h2": ["clamp(1.75rem, 2.5vw + 0.5rem, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "500" }],
        "h3": ["clamp(1.5rem, 1.5vw + 0.5rem, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
        "h4": ["clamp(1.25rem, 1vw + 0.5rem, 1.5rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "h5": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "h6": ["1.125rem", { lineHeight: "1.45", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", fontWeight: "400" }],
        "body-base": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" }],
        "mono": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
        "32": "128px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        // Light theme — реальные тени
        "e-1": "0 1px 2px rgba(10, 10, 11, 0.06)",
        "e-2": "0 4px 12px rgba(10, 10, 11, 0.08)",
        "e-3": "0 12px 32px rgba(10, 10, 11, 0.12)",
        "e-4": "0 24px 64px rgba(10, 10, 11, 0.18)",
        // Glow
        "glow-red": "0 0 0 4px rgba(220, 38, 38, 0.18)",
        "glow-chrome": "0 0 0 1px rgba(192, 192, 200, 0.12)",
        "inner-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
        grand: "600ms",
      },
      transitionTimingFunction: {
        "standard": "cubic-bezier(0.4, 0, 0.2, 1)",
        "entrance": "cubic-bezier(0.0, 0, 0.2, 1)",
        "exit": "cubic-bezier(0.4, 0, 1, 1)",
        "emphasized": "cubic-bezier(0.2, 0, 0, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "shimmer": {
          "0%, 100%": { backgroundPosition: "200% 0" },
          "50%": { backgroundPosition: "-200% 0" },
        },
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(220, 38, 38, 0)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 250ms cubic-bezier(0.2, 0, 0, 1)",
        "accordion-up": "accordion-up 250ms cubic-bezier(0.4, 0, 1, 1)",
        "fade-in-up": "fade-in-up 600ms cubic-bezier(0.0, 0, 0.2, 1) both",
        "fade-in": "fade-in 400ms cubic-bezier(0.0, 0, 0.2, 1) both",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "pulse-red": "pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 30s linear infinite",
      },
      backgroundImage: {
        "graphite-fade": "linear-gradient(180deg, #0A0A0B 0%, #17171B 100%)",
        "red-glow": "radial-gradient(circle at center, rgba(220, 38, 38, 0.16) 0%, transparent 70%)",
        "chrome-line": "linear-gradient(90deg, transparent 0%, #C0C0C8 50%, transparent 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
