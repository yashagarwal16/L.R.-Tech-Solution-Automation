import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lrtechsolutions.com";
  const routes = ["/", "/services", "/about", "/insights", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/insights" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/contact" || route === "/services" ? .9 : .6,
  }));
}
