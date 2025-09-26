import type { MetadataRoute } from "next";

const routes = [
  "",
  "/product",
  "/how-it-works",
  "/solutions",
  "/solutions/ciso",
  "/solutions/devsecops",
  "/template",
  "/pricing",
  "/contact",
  "/trust",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://speckit.airnub.io${route}`,
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
