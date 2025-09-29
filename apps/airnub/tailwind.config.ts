import type { Config } from "tailwindcss";
import preset from "@airnub/ui/tailwind-preset";

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  presets: [preset],
} satisfies Config;
