export const AIRNUB_BASE_URL = "https://airnub.io" as const;

export const airnubRoutes = [
  "",
  "/products",
  "/solutions",
  "/services",
  "/resources",
  "/company",
  "/contact",
  "/trust",
] as const;

export type AirnubRoute = (typeof airnubRoutes)[number];
