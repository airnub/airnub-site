import type { MetadataRoute } from "next";
import { AIRNUB_BASE_URL, airnubRoutes } from "../lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return airnubRoutes.map((route) => ({
    url: `${AIRNUB_BASE_URL}${route}`,
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
