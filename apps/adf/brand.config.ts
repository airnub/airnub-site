import type { BrandConfig } from "@airnub/brand";

export const adfBrand: BrandConfig = {
  name: "Agentic Delivery Framework",
  domain: "adf.airnub.io",
  description:
    "The Agentic Delivery Framework (ADF) codifies supervised AI delivery with evidence, guardrails, and fast feedback loops.",
  colors: {
    primary: "#0ea5e9",
    secondary: "#1e293b",
    accent: "#7c3aed",
    background: "#ffffff",
    foreground: "#0f172a",
  },
  logos: {
    light: "/brand/logo.svg",
    dark: "/brand/logo-dark.svg",
    mark: "/brand/logo-mark.svg",
  },
  favicon: "/brand/favicon.svg",
  og: "/opengraph-image",
  social: {
    github: "https://github.com/airnub/agentic-delivery-framework",
    x: "https://x.com/airnub",
    linkedin: "https://www.linkedin.com/company/airnub",
  },
  contact: {
    general: "hello@airnub.io",
    support: "support@airnub.io",
    security: "security@airnub.io",
    partnerships: "partnerships@airnub.io",
  },
};

export default adfBrand;
