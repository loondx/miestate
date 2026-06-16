import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, MapPin, ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { getPropertyBySlug, pricePerSqft } from "@/lib/data/properties";
import { assessFairPrice } from "@/lib/data/localities";
import { VerifiedBadge } from "@/components/property/VerifiedBadge";
import { LocalitySentiment } from "@/components/property/LocalitySentiment";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { CopyRera } from "@/components/property/CopyRera";
import { Badge } from "@/components/ui/Badge";
import { PaymentButton } from "@/components/services/PaymentButton";
import { whatsappLink, msgForProperty } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getPropertyBySlug(params.slug);
  if (!p) return { title: "Property not found" };
  const title = `${p.name} · ${p.bhk} BHK in ${p.locality} · ${formatINR(p.price)}`;
  const desc = `${p.bhk} BHK · ${p.sqftSuperBuiltUp} sqft · ${formatINR(p.price)} in ${p.locality}, Bangalore. ${p.description}`;
  return {
    title: `${title} | miestate`,
    description: desc,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title, description: desc, images: p.photos[0] ? [{ url: p.photos[0] }] : undefined },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = await getPropertyBySlug(params.slug);
  if (!p) notFound();

  const ppsf = pricePerSqft(p);
  const fair = assessFairPrice(p.locality, ppsf);
  const isVerified = p.verificationStatus === "verified";

  const checklist: { label: string; done: boolean }[] = [
    { label: "Title deed verified", done: p.tags.includes("Clear Title") },
    {
      label: "Encumbrance certificate checked (15 years)",
      done: isVerified || p.tags.includes("Clear Title"),
    },
    { label: "No active litigation", done: p.tags.includes("No Litigation") },
    {
      label: "RERA registered",
      done: p.tags.includes("RERA Registered") || Boolean(p.rera),
    },
    {
      label: fair.benchmark
        ? `Fair market price: ${formatINR(ppsf)}/sqft vs locality avg ${formatINR(fair.benchmark)}/sqft`
        : "Fair market price analysed",
      done:
        p.tags.includes("Fair Price") ||
        fair.verdict === "fair" ||
        fair.verdict === "below-market",
    },
    { label: "Builder reputation reviewed", done: isVerified },
  ];

  const ageLabel = p.ageYears === "new" ? "New" : `${p.ageYears} yr`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: p.name,
    description: p.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.locality,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    image: p.photos,
  };

  return (
    <div className="section pb-24 lg:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-content">
        <Link href="/properties" className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700">
          <ArrowLeft className="h-4 w-4" /> All verified properties
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left */}
          <div>
            <PropertyGallery images={p.photos} alt={p.name} />

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <VerifiedBadge status={p.verificationStatus} />
                {p.readyToMove ? (
                  <Badge tone="forest">Ready to move</Badge>
                ) : (
                  <Badge tone="neutral">Under construction</Badge>
                )}
                {p.status !== "available" && (
                  <Badge tone={p.status === "sold" ? "danger" : "warning"} className="capitalize">
                    {p.status === "negotiating" ? "Under negotiation" : "Sold"}
                  </Badge>
                )}
              </div>

              <h1 className="mt-3 font-display text-[28px] font-semibold text-gray-900">
                {p.name}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-gray-600">
                <MapPin className="h-4 w-4" /> {p.locality}, Bangalore
              </p>

              <p className="text-forest-700 mt-4 text-3xl font-medium">
                {formatINR(p.price)}
              </p>

              {/* Key stats */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Stat label="Config" value={`${p.bhk} BHK`} />
                <Stat label="Area" value={`${p.sqftSuperBuiltUp.toLocaleString("en-IN")} sqft`} />
                <Stat label="Floor" value={`${p.floor} / ${p.totalFloors}`} />
                <Stat label="Facing" value={p.facing} />
                <Stat label="Age" value={ageLabel} />
              </div>

              <p className="mt-6 leading-relaxed text-gray-700">{p.description}</p>

              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500">RERA number</p>
                <div className="mt-1">
                  <CopyRera rera={p.rera} />
                </div>
              </div>
            </div>

            {/* Verification checklist */}
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                <ShieldCheck className="h-5 w-5 text-gold-500" /> What miestate checked
              </h2>
              <ul className="mt-4 space-y-3">
                {checklist.map((row) => (
                  <li key={row.label} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                        (row.done ? "bg-gold-50 text-gold-600" : "bg-gray-100 text-gray-400")
                      }
                    >
                      {row.done ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </span>
                    <span className={row.done ? "text-gray-800" : "text-gray-400"}>{row.label}</span>
                  </li>
                ))}
              </ul>
              {fair.verdict === "above-market" && (
                <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                  Asking is {fair.deltaPct}% above the {p.locality} benchmark, so it&apos;s worth negotiating.
                </p>
              )}
            </div>
          </div>

          {/* Right */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
              <p className="text-sm text-gray-500">Get the full risk report for this property</p>
              <p className="text-forest-700 mt-1 text-2xl font-medium">₹4,999</p>
              <p className="mt-1 text-xs text-gray-500">
                Title, EC, litigation, builder and fair price, all in 48 hours.
              </p>
              <div className="mt-4">
                <PaymentButton
                  type="report"
                  propertySlug={p.slug}
                  propertyAddress={`${p.name}, ${p.locality}`}
                  className="w-full"
                />
              </div>
              <a
                href={whatsappLink(msgForProperty(p.name, p.locality))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#1ebe5b]"
              >
                <MessageCircle size={16} /> Ask about this property
              </a>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                Full refund if we can&apos;t complete it. No questions.
              </p>
            </div>

            <LocalitySentiment sentiment={p.locality_sentiment} />
          </aside>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-gray-200 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_-8px_rgba(6,53,64,0.18)] backdrop-blur lg:hidden">
        <div className="flex-1">
          <PaymentButton
            type="report"
            propertySlug={p.slug}
            propertyAddress={`${p.name}, ${p.locality}`}
            className="w-full"
          />
        </div>
        <a
          href={whatsappLink(msgForProperty(p.name, p.locality))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-11 w-12 items-center justify-center rounded-md bg-[#25D366] text-white"
        >
          <MessageCircle size={18} />
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5 text-center">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
