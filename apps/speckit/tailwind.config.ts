import type { Config } from "tailwindcss";
import preset from "@airnub/ui/tailwind-preset";

const contentGlobs = Array.isArray(preset.content) ? [...preset.content] : [];

export default {
  content: contentGlobs,
  presets: [preset],
} satisfies Config;
