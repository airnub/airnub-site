import { join } from "path";
import type { Config } from "tailwindcss";
import tailwindTypography from "@tailwindcss/typography";
import tailwindAnimate from "tailwindcss-animate";

const preset = {
  darkMode: ["class"],
  content: [
    join(__dirname, "./app/**/*.{ts,tsx,js,jsx,mdx}"),
    join(__dirname, "./components/**/*.{ts,tsx,js,jsx,mdx}"),
    join(__dirname, "./src/**/*.{ts,tsx,js,jsx,mdx}"),
    join(__dirname, "../../packages/*/app/**/*.{ts,tsx,js,jsx,mdx}"),
    join(__dirname, "../../packages/*/components/**/*.{ts,tsx,js,jsx,mdx}"),
    join(__dirname, "../../packages/*/providers/**/*.{ts,tsx,js,jsx,mdx}"),
    join(__dirname, "../../packages/*/src/**/*.{ts,tsx,js,jsx,mdx}"),
  ],
  theme: {
    container: { center: true, padding: "2rem" },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--brand-background))",
        foreground: "hsl(var(--brand-foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--brand-primary))",
          foreground: "hsl(var(--brand-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--brand-accent))",
          foreground: "hsl(var(--brand-accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.05)",
      },
    },
  },
  plugins: [tailwindTypography, tailwindAnimate],
} satisfies Config;

export default preset;
