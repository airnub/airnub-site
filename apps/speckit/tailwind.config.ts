import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}", "../../packages/brand/src/**/*.{ts,tsx}", "../../packages/seo/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        speckit: {
          indigo: "#6366f1",
          violet: "#8b5cf6",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
