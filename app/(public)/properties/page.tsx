import type { Metadata } from "next";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { getPublicProperties } from "@/lib/data/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Handpicked premium projects in Bangalore | MI Estate",
  description:
    "A curated, RERA-verified collection of premium new-launch projects from Godrej, Sobha and Mana across Sarjapur Road, Whitefield and East Bengaluru, with expert advisory and end-to-end assistance.",
};

export default async function PropertiesPage() {
  const properties = await getPublicProperties();

  return (
    <div className="section">
      <div className="container-content">
        <header className="mb-10 max-w-2xl">
          <p className="eyebrow">Bangalore · independently checked</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
            A handpicked, verified collection.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            We don&apos;t list everything. We shortlist only premium projects from
            trusted developers, verify their RERA, title and approvals, and stay
            with you from site visit to registration. The gold{" "}
            <strong className="font-semibold text-gold-600">Verified</strong> badge
            means we&apos;ve done the homework.
          </p>
        </header>

        <PropertyFilters properties={properties} />
      </div>
    </div>
  );
}
