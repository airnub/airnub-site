import type { MetadataRoute } from "next";
import { AIRNUB_BASE_URL, AIRNUB_SITEMAP_PATHS } from "../lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return AIRNUB_SITEMAP_PATHS.map((route) => ({
    url: `${AIRNUB_BASE_URL}${route}`,
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
