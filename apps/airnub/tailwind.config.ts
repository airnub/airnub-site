import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}", "../../packages/brand/src/**/*.{ts,tsx}", "../../packages/seo/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: "#0ea5e9",
          midnight: "#0f172a",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
