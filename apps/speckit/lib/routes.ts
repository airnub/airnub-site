export const SPECKIT_BASE_URL = "https://speckit.airnub.io" as const;

export const speckitRoutes = [
  "",
  "/product",
  "/quickstart",
  "/how-it-works",
  "/solutions",
  "/solutions/ciso",
  "/solutions/devsecops",
  "/template",
  "/pricing",
  "/contact",
  "/trust",
] as const;

export type SpeckitRoute = (typeof speckitRoutes)[number];
