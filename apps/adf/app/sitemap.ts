import type { MetadataRoute } from "next";
import { ADF_BASE_URL, adfRoutes } from "../lib/routes";
import { locales } from "./i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    adfRoutes.map((route) => {
      const path = route === "" ? "" : route;
      const pathname = `/${locale}${path}`;
      return {
        url: new URL(pathname || "/", ADF_BASE_URL).toString(),
        changefreq: "weekly",
        priority: route === "" ? 1 : 0.6,
      };
    }),
  );
}
