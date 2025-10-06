export const AIRNUB_BASE_URL = "https://airnub.io" as const;

export const airnubRoutes = ["", "/work", "/projects", "/about", "/contact"] as const;

export type AirnubRoute = (typeof airnubRoutes)[number];
