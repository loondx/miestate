import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getProperties } from "@/lib/data/properties";
import { AREA_GUIDES } from "@/lib/data/areas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const staticRoutes = ["", "/properties", "/services", "/areas", "/about", "/contact"].map(
    (p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    })
  );

  const areaRoutes = AREA_GUIDES.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const properties = await getProperties();
  const propertyRoutes = properties.map((p) => ({
      url: `${base}/properties/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...areaRoutes, ...propertyRoutes];
}
