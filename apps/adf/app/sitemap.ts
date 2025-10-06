import type { MetadataRoute } from "next";
import { ADF_BASE_URL, adfRoutes } from "../lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return adfRoutes.map((route) => ({
    url: new URL(route || "/", ADF_BASE_URL).toString(),
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
}
