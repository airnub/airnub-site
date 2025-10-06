import type { MetadataRoute } from "next";
import { ADF_BASE_URL } from "../lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", ADF_BASE_URL).toString(),
  };
}
