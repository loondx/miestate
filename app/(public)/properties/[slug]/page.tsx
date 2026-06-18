import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Building2,
  CalendarClock,
  Layers,
  Trees,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronDown,
  Phone,
  CalendarCheck,
} from "lucide-react";
import { getPropertyBySlug, getProperties } from "@/lib/data/properties";
import { getCorridorContext } from "@/lib/data/localities";
import { VerifiedBadge } from "@/components/property/VerifiedBadge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { CopyRera } from "@/components/property/CopyRera";
import { BrochureGate } from "@/components/property/BrochureGate";
import { ShareButton } from "@/components/property/ShareButton";
import { LeadForm } from "@/components/shared/LeadForm";
import { Badge } from "@/components/ui/Badge";
import { whatsappLink, msgForProperty } from "@/lib/whatsapp";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { PHONE_NUMBER, CONSULTANT, SITE } from "@/lib/config";
import { PROJECT_STATUS_LABEL, type Property } from "@/types/property";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getPropertyBySlug(params.slug);
  if (!p) return { title: "Project not found" };
  const title = `${p.name}, ${p.locality}`;
  const desc = `${p.name} by ${p.developer} in ${p.locality}, Bangalore. ${p.priceFromLabel}. ${p.investmentSummary}`;
  return {
    title: `${title} | MI Estate`,
    description: desc,
    keywords: [p.name, p.developer, p.locality, p.corridor, "Bangalore", "RERA"],
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: {
      title,
      description: desc,
      images: p.photos[0] ? [{ url: p.photos[0] }] : undefined,
    },
  };
}

const STATUS_TONE: Record<Property["status"], "forest" | "success" | "warning"> = {
  "ready-to-move": "success",
  "under-construction": "forest",
  "new-launch": "warning",
  "pre-launch": "warning",
};

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = await getPropertyBySlug(params.slug);
  if (!p) notFound();

  const corridor = getCorridorContext(p.corridor);
  const waMsg = msgForProperty(p.name, p.locality);
  const shareUrl = `${SITE.url.replace(/\/$/, "")}/properties/${p.slug}`;
  const shareText = `${p.name} by ${p.developer}, ${p.locality}, Bangalore (${p.priceFromLabel}). Via MI Estate:`;

  const facts = [
    { icon: Building2, label: "Developer", value: p.developer },
    { icon: Layers, label: "Configurations", value: configSummary(p) },
    { icon: CalendarClock, label: "Possession", value: p.possession },
    p.floorsLabel && { icon: Layers, label: "Structure", value: p.floorsLabel },
    p.landAcres && { icon: Trees, label: "Land area", value: `${p.landAcres} acres` },
    p.openSpacePct && { icon: Trees, label: "Open space", value: `${p.openSpacePct}%` },
    p.totalUnits && { icon: Users, label: "Total units", value: `${p.totalUnits}` },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: p.name,
    description: p.description,
    brand: { "@type": "Organization", name: p.developer },
    address: {
      "@type": "PostalAddress",
      addressLocality: p.locality,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    image: p.photos,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: p.pricePerSqftMin,
      highPrice: p.pricePerSqftMax,
      description: "Indicative ₹ per sq.ft.",
    },
  };

  return (
    <div className="section pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-content">
        <Link
          href="/properties"
          className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          {/* ───────── Left ───────── */}
          <div className="min-w-0">
            <PropertyGallery images={p.photos} alt={p.name} />

            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <VerifiedBadge verified={p.verified} />
                  <Badge tone={STATUS_TONE[p.status]}>
                    {PROJECT_STATUS_LABEL[p.status]}
                  </Badge>
                </div>
                <ShareButton url={shareUrl} title={p.name} text={shareText} />
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-forest-600">
                <Building2 className="h-3.5 w-3.5" /> {p.developer}
              </p>
              <h1 className="mt-1 font-display text-[26px] font-bold leading-tight text-gray-900 sm:text-4xl">
                {p.name}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600 sm:text-base">
                <MapPin className="h-4 w-4 shrink-0" /> {p.locality}, Bangalore
              </p>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-display text-2xl font-bold text-forest-700">
                  {p.priceFromLabel}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{p.pricePerSqftMin.toLocaleString("en-IN")} – ₹
                  {p.pricePerSqftMax.toLocaleString("en-IN")} / sq.ft.
                </p>
              </div>

              {/* Trust chips */}
              {p.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-700 ring-1 ring-forest-100"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold-500" />
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-5 leading-relaxed text-gray-700">{p.description}</p>

              {/* Mobile CTA row */}
              <div className="mt-5 grid grid-cols-2 gap-2 lg:hidden">
                <a
                  href={calendlyLink({
                    event: CALENDLY_EVENT.siteVisit,
                    context: `${p.name}, ${p.locality}`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-forest-700 px-4 py-3 text-sm font-semibold text-white shadow-cta active:scale-[0.99]"
                >
                  <CalendarCheck className="h-4 w-4" /> Book a site visit, free
                </a>
                {/* <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-forest-100 px-4 py-3 text-sm font-semibold text-forest-700 active:scale-[0.99]"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <div className="col-span-2">
                  <BrochureGate
                    propertyName={p.name}
                    brochureUrl={p.brochureUrl}
                    className="w-full"
                  />
                </div> */}
              </div>
            </div>

            {/* Quick facts */}
            <Section title="Quick facts" icon={Layers}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-3.5"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {f.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Configurations */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-900">Configurations</p>
                <div className="mt-2 overflow-hidden rounded-xl border border-gray-100">
                  {p.configurations.map((c, i) => (
                    <div
                      key={`${c.label}-${i}`}
                      className="flex items-start gap-3 border-b border-gray-100 bg-white p-3 last:border-0"
                    >
                      <span className="shrink-0 rounded-md bg-forest-50 px-2.5 py-1 text-xs font-bold text-forest-700">
                        {c.label}
                      </span>
                      <div className="text-sm text-gray-600">
                        {c.phase && (
                          <span className="font-medium text-gray-800">{c.phase} · </span>
                        )}
                        {c.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RERA */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-900">RERA</p>
                <div className="mt-2 flex flex-col gap-2">
                  {p.rera.map((r, i) => (
                    <div key={i} className="flex min-w-0 flex-col gap-1">
                      {r.phase && (
                        <span className="text-[11px] font-medium text-gray-500">
                          {r.phase}
                        </span>
                      )}
                      <CopyRera rera={r.number} />
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Why this property */}
            <Section title="Why this property" icon={Sparkles}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {p.whyThisProperty.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {w}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Location advantages */}
            <Section title="Location advantages" icon={MapPin}>
              <div className="grid gap-4 sm:grid-cols-2">
                {p.locationAdvantages.map((g) => (
                  <div
                    key={g.category}
                    className="rounded-xl border border-gray-100 bg-white p-4"
                  >
                    <p className="text-sm font-bold text-gray-900">{g.category}</p>
                    <ul className="mt-2 space-y-1.5">
                      {g.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest-400" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* Investment analysis */}
            <Section title="Investment analysis" icon={ShieldCheck}>
              <div className="rounded-2xl bg-forest-50/70 p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Who is this project ideal for?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.idealFor.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-forest-700 ring-1 ring-forest-100"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                {corridor && (
                  <div className="mt-5 border-t border-forest-100 pt-4">
                    <p className="text-sm text-gray-700">
                      <strong className="font-semibold">{p.corridor}</strong> is a
                      high-demand corridor with an indicative average of{" "}
                      <strong className="font-semibold">
                        ₹{corridor.avgPricePerSqft.toLocaleString("en-IN")}/sq.ft.
                      </strong>{" "}
                      and roughly{" "}
                      <strong className="font-semibold text-gold-600">
                        {corridor.appreciationBand} annual appreciation potential
                      </strong>
                      . {corridor.driver}
                    </p>
                    <p className="mt-2 text-[11px] text-gray-400">
                      Indicative 2026 market context for advisory purposes, not a
                      valuation of this unit.
                    </p>
                  </div>
                )}
              </div>
            </Section>

            {/* Amenities */}
            <Section title="Amenities & ecosystem" icon={Sparkles}>
              <div className="grid gap-4 sm:grid-cols-2">
                {p.amenities.map((g) => (
                  <div key={g.group} className="rounded-xl border border-gray-100 bg-white p-4">
                    <p className="text-sm font-bold text-gray-900">{g.group}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((it) => (
                        <span
                          key={it}
                          className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Specifications */}
            <Section title="Specifications & build quality" icon={Building2}>
              <div className="space-y-3">
                {p.specifications.map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4">
                    <p className="text-sm font-bold text-gray-900">{s.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.body}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Legal & due diligence (accordion) */}
            <Section title="Legal & due-diligence report" icon={ShieldCheck}>
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                {p.legal.map((l, i) => (
                  <details
                    key={l.label}
                    className="group border-b border-gray-100 last:border-0"
                    open={i === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white p-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      {l.label}
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="bg-white px-4 pb-4 text-sm leading-relaxed text-gray-600">
                      {l.body}
                    </p>
                  </details>
                ))}
              </div>
            </Section>

            <p className="mt-8 rounded-xl bg-gray-50 p-4 text-[11px] leading-relaxed text-gray-400">
              <strong className="font-semibold text-gray-500">Disclaimer:</strong>{" "}
              The information on this page is for informational purposes only.
              Project specifications, pricing, availability, layouts and possession
              timelines may change without prior notice. Interested buyers are
              advised to verify all details directly with the developer before
              making any purchase decision.
            </p>
          </div>

          {/* ───────── Right (sticky consultation) ───────── */}
          <aside
            id="consult"
            className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:h-fit"
          >
            <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
              <p className="font-display text-lg font-bold text-gray-900">
                Interested in {p.name}?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Talk to {CONSULTANT.name} directly, verified details, honest advice,
                no pressure.
              </p>

              {/* Primary: book a slot */}
              <a
                href={calendlyLink({
                  event: CALENDLY_EVENT.siteVisit,
                  context: `${p.name}, ${p.locality}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-700 px-4 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-forest-800"
              >
                <CalendarCheck className="h-4 w-4" /> Book a site visit, free
              </a>

              {/* Direct contact */}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-forest-100 px-3 py-3 text-sm font-semibold text-forest-700 hover:bg-forest-50"
                >
                  <Phone size={16} /> Call now
                </a>
                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5b]"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>

              {/* Low-friction fallback: just a number for a callback */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-900">Prefer we call you?</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Leave your number, {CONSULTANT.firstName} will call you back.
                </p>
                <div className="mt-3">
                  <LeadForm
                    source="property-page"
                    defaultRequirement="site-visit"
                    propertyInterest={p.name}
                    lockRequirement
                    minimal
                    compact
                    submitLabel="Request a callback"
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <BrochureGate
                propertyName={p.name}
                brochureUrl={p.brochureUrl}
                className="w-full"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-gray-100 pt-8">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-gray-900">
        <Icon className="h-5 w-5 text-gold-500" /> {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function configSummary(p: Property): string {
  return Array.from(new Set(p.configurations.map((c) => c.label))).join(", ");
}
