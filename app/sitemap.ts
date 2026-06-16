import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getProperties } from "@/lib/data/properties";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const staticRoutes = ["", "/properties", "/plans", "/services", "/about", "/contact"].map(
    (p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    })
  );

  const properties = await getProperties();
  const propertyRoutes = properties
    .filter((p) => p.status !== "sold")
    .map((p) => ({
      url: `${base}/properties/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...propertyRoutes];
}
