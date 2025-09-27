import type { MetadataRoute } from "next";
import { AIRNUB_BASE_URL } from "../lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${AIRNUB_BASE_URL}/sitemap.xml`,
  };
}
