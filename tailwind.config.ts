import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          mid: "hsl(var(--primary-mid))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          light: "hsl(var(--destructive-light))",
          dark: "hsl(var(--destructive-dark))",
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
        "text-hint": "hsl(var(--text-hint))",
        toolbar: "hsl(var(--toolbar-bg))",
        eng: {
          bg: "hsl(var(--eng-bg))",
          tx: "hsl(var(--eng-tx))",
        },
        mgmt: {
          bg: "hsl(var(--mgmt-bg))",
          tx: "hsl(var(--mgmt-tx))",
        },
        law: {
          bg: "hsl(var(--law-bg))",
          tx: "hsl(var(--law-tx))",
        },
        tier1: {
          bg: "hsl(var(--tier1-bg))",
          tx: "hsl(var(--tier1-tx))",
        },
        tier2: {
          bg: "hsl(var(--tier2-bg))",
          tx: "hsl(var(--tier2-tx))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "var(--radius-sm)",
      },
      maxWidth: {
        main: "1280px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
