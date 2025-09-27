import type { MetadataRoute } from "next";
import { SPECKIT_BASE_URL, speckitRoutes } from "../lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return speckitRoutes.map((route) => ({
    url: `${SPECKIT_BASE_URL}${route}`,
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
