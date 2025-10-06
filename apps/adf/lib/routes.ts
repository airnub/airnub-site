export const ADF_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://adf.airnub.io";

export const adfRoutes = ["", "/quickstart"] as const;

export type AdfRoute = (typeof adfRoutes)[number];
