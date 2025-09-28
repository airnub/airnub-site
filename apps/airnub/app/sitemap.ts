import type { MetadataRoute } from "next";
import { AIRNUB_BASE_URL, airnubRoutes } from "../lib/routes";
import { locales } from "../i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    airnubRoutes.map((route) => ({
      url: `${AIRNUB_BASE_URL}/${locale}${route}`,
      changefreq: "weekly",
      priority: route === "" ? 1 : 0.7,
    }))
  );
}
