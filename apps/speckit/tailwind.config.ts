import type { Config } from "tailwindcss";
import preset from "../../packages/tailwind-config/tailwind.config";

export default {
  presets: [preset],
} satisfies Partial<Config>;

