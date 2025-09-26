import type { MetadataRoute } from "next";

const routes = [
  "",
  "/products",
  "/solutions",
  "/services",
  "/resources",
  "/company",
  "/contact",
  "/trust",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://airnub.io${route}`,
    changefreq: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
