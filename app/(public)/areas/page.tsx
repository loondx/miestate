import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, TrendingUp } from "lucide-react";
import { AREA_GUIDES } from "@/lib/data/areas";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Bangalore Area Guides | Buy, Rent & Resale by Locality",
  description:
    "In-depth guides to buying, renting and reselling property across Bangalore's top corridors: Sarjapur Road, Whitefield, KR Puram, ORR, Electronic City, North Bangalore and Bannerghatta. Prices, connectivity, schools and honest advice from MI Estate.",
  alternates: { canonical: "/areas" },
};

export default function AreasIndexPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bangalore Area Guides",
    itemListElement: AREA_GUIDES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${a.name} property guide`,
      url: `${SITE.url}/areas/${a.slug}`,
    })),
  };

  return (
    <div className="section">
      <div className="container-content">
        <header className="max-w-2xl">
          <p className="eyebrow">Bangalore property guides</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
            Know the area before you buy.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            Honest, locality-level guides to buying, renting and reselling across
            Bangalore&apos;s top corridors. Real pricing context, connectivity,
            schools and employment, so you can decide with confidence, not guesswork.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREA_GUIDES.map((a) => (
            <Link
              key={a.slug}
              href={`/areas/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-forest-100 hover:shadow-card-hover"
            >
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-forest-600">
                <MapPin className="h-3.5 w-3.5" /> Bangalore
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-gray-900 transition-colors group-hover:text-forest-700">
                {a.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {a.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm font-semibold text-forest-800">
                {a.pricePerSqft}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                  <TrendingUp className="h-3.5 w-3.5 text-gold-500" /> {a.appreciation}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 group-hover:gap-2">
                  Read guide <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </div>
  );
}
