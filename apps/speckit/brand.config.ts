import type { BrandConfig } from "@airnub/brand";

export const speckitBrand: BrandConfig = {
  name: "Speckit",
  domain: "speckit.airnub.io",
  description: "Speckit automates specification management for product and engineering teams.",
  colors: {
    primary: "#a855f7",
    secondary: "#2563eb",
    accent: "#1e1b4b",
    background: "#ffffff",
    foreground: "#111827",
  },
  logos: {
    light: "/brand/speckit-wordmark-light.svg",
    dark: "/brand/speckit-wordmark-dark.svg",
    mark: "/brand/speckit-mark.svg",
  },
  social: {
    github: "https://github.com/airnub/speckit",
    x: "https://x.com/airnub",
    linkedin: "https://www.linkedin.com/company/airnub",
  },
};

export default speckitBrand;
