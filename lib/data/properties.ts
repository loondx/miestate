import { getAll, FILES } from "@/lib/store";
import type { Property } from "@/types/property";

export function getProperties() {
  return getAll<Property>(FILES.properties);
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | undefined> {
  const all = await getProperties();
  return all.find((p) => p.slug === slug);
}

export async function getPublicProperties(): Promise<Property[]> {
  const all = await getProperties();
  // Featured first, then most recently updated.
  return [...all].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

/** Mid-point ₹/sqft, handy for sorting and rough comparisons. */
export function midPricePerSqft(p: Property): number {
  return Math.round((p.pricePerSqftMin + p.pricePerSqftMax) / 2);
}
