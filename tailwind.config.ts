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

        // Warm cream "обсидиан" — теперь это ivory, основной background
        obsidian: "#FAF7F2",
        // graphite сохранил название, но это инвертированная warm-light шкала
        // от cream (50) до deep ink (900)
        graphite: {
          50: "#1A1612",   // deep ink (was lightest, теперь darkest text)
          100: "#3F3A33",  // body text
          200: "#5C5247",  // secondary text
          300: "#6B6359",  // muted text
          400: "#8A8275",  // tertiary text
          500: "#C2B8A8",  // medium border (warm)
          600: "#E0D7C8",  // soft border / hover bg
          700: "#ECE4D5",  // light cream surface (was darkest, теперь lightest cream)
          800: "#F4EDE0",  // very light cream
          900: "#F8F2E7",  // almost ivory
        },

        // Wine accent (вместо красного — более изысканный oxblood)
        red: {
          primary: "#8B2635",
          hover: "#A8395A",
          pressed: "#691E2A",
          glow: "rgba(139, 38, 53, 0.15)",
          tint: "rgba(139, 38, 53, 0.06)",
        },

        // Warm gold — заменяет chrome
        chrome: {
          DEFAULT: "#A89072",   // muted warm gold
          warm: "#C19A6B",      // warmer gold
          deep: "#6B5D44",      // deeper bronze
        },

        // Status — приглушённые luxury-варианты
        success: {
          DEFAULT: "#5C8A6B",
          dark: "#3F6B4E",
        },
        warning: {
          DEFAULT: "#B8851A",
          dark: "#8C6611",
        },
        error: {
          DEFAULT: "#A8395A",
          dark: "#8B2635",
        },
        info: {
          DEFAULT: "#5479A8",
          dark: "#3F5C82",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "var(--font-jost)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Mobile / desktop типография — slightly increased for editorial feel
        "display-xl": ["clamp(3rem, 6vw + 1rem, 6.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "500" }],
        "h1": ["clamp(2.25rem, 3.5vw + 1rem, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "500" }],
        "h2": ["clamp(1.75rem, 2.5vw + 0.5rem, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" }],
        "h3": ["clamp(1.5rem, 1.5vw + 0.5rem, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "500" }],
        "h4": ["clamp(1.25rem, 1vw + 0.5rem, 1.625rem)", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" }],
        "h5": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.005em", fontWeight: "500" }],
        "h6": ["1.125rem", { lineHeight: "1.4", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-base": ["1rem", { lineHeight: "1.65", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.18em", fontWeight: "500" }],
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
        sm: "2px",
        DEFAULT: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
      },
      boxShadow: {
        // Soft Apple-style shadows
        "e-1": "0 1px 2px rgba(26, 22, 18, 0.04), 0 0 0 1px rgba(26, 22, 18, 0.04)",
        "e-2": "0 4px 16px rgba(26, 22, 18, 0.06), 0 0 0 1px rgba(26, 22, 18, 0.04)",
        "e-3": "0 12px 36px rgba(26, 22, 18, 0.08), 0 0 0 1px rgba(26, 22, 18, 0.04)",
        "e-4": "0 24px 72px rgba(26, 22, 18, 0.12), 0 0 0 1px rgba(26, 22, 18, 0.05)",
        // Glow
        "glow-red": "0 0 0 4px rgba(139, 38, 53, 0.12)",
        "glow-chrome": "0 0 0 1px rgba(168, 144, 114, 0.16)",
        "inner-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
        grand: "600ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        entrance: "cubic-bezier(0.0, 0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1)",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139, 38, 53, 0.3)" },
          "50%": { boxShadow: "0 0 0 8px rgba(139, 38, 53, 0)" },
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
        // Cream warm gradient (заменяет graphite-fade)
        "graphite-fade": "linear-gradient(180deg, #FAF7F2 0%, #F4EDE0 100%)",
        // Soft warm glow (заменяет red-glow)
        "red-glow": "radial-gradient(circle at center, rgba(193, 154, 107, 0.18) 0%, transparent 70%)",
        // Hairline gold
        "chrome-line": "linear-gradient(90deg, transparent 0%, #C19A6B 50%, transparent 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
