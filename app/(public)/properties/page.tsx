import type { Metadata } from "next";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { getPublicProperties } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verified flats in Bangalore | miestate",
  description:
    "Browse independently verified flats across Whitefield, Sarjapur, Hebbal and more. Title, EC, RERA and fair price checked by miestate.",
};

export default async function PropertiesPage() {
  const properties = await getPublicProperties();

  return (
    <div className="section">
      <div className="container-content">
        <header className="mb-10 max-w-2xl">
          <p className="eyebrow">Bangalore · independently checked</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
            Verified flats in Bangalore
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            Every property here has been checked by miestate for title, EC, RERA
            and fair price. The green <strong className="font-semibold text-gold-600">Verified</strong> badge
            means we&apos;ve done the homework, so you don&apos;t pay a token on a guess.
          </p>
        </header>

        <PropertyFilters properties={properties} />
      </div>
    </div>
  );
}
