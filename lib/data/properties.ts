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
  return all.filter((p) => p.status !== "sold");
}

/** Super-built-up ₹/sqft, used in the fair-price comparison. */
export function pricePerSqft(p: Property): number {
  return Math.round(p.price / p.sqftSuperBuiltUp);
}
