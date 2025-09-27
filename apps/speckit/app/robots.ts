import type { MetadataRoute } from "next";
import { SPECKIT_BASE_URL } from "../lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SPECKIT_BASE_URL}/sitemap.xml`,
  };
}
