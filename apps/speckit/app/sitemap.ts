import type { MetadataRoute } from "next";
import { SPECKIT_BASE_URL, SPECKIT_SITEMAP_PATHS } from "../lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return SPECKIT_SITEMAP_PATHS.map((route) => ({
    url: `${SPECKIT_BASE_URL}${route}`,
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
