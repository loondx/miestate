import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  IndianRupee,
  Home,
  Train,
  Building2,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Check,
  AlertTriangle,
  Sparkles,
  Building,
} from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { LeadForm } from "@/components/shared/LeadForm";
import { whatsappLink } from "@/lib/whatsapp";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { AREA_GUIDES, getAreaGuide } from "@/lib/data/areas";
import { getPublicProperties } from "@/lib/data/properties";
import { SITE, CONTACT, CONSULTANT } from "@/lib/config";

export function generateStaticParams() {
  return AREA_GUIDES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = getAreaGuide(params.slug);
  if (!area) return {};
  const title = `${area.name} Property Guide | Buy, Rent & Resale in Bangalore`;
  const description = `${area.tagline} Pricing (${area.pricePerSqft}), connectivity, schools and honest advice on buying, renting and reselling in ${area.name}, Bangalore, from MI Estate.`;
  return {
    title,
    description,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: { title: `${area.name} Property Guide | MI Estate`, description },
  };
}

const FACTS = (area: ReturnType<typeof getAreaGuide>) =>
  area
    ? [
        { icon: IndianRupee, label: "Price", value: area.pricePerSqft },
        { icon: TrendingUp, label: "Appreciation", value: area.appreciation },
        { icon: Home, label: "Rent (2–3 BHK)", value: area.rentBand },
      ]
    : [];

export default async function AreaGuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const area = getAreaGuide(params.slug);
  if (!area) notFound();

  const listings = (await getPublicProperties())
    .filter((p) => p.corridor === area.corridor)
    .slice(0, 3);

  const waMsg = `Hi MI Estate, I'd like guidance on property in ${area.name}, Bangalore (buy / rent / resale).`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Area Guides", item: `${SITE.url}/areas` },
          {
            "@type": "ListItem",
            position: 3,
            name: area.name,
            item: `${SITE.url}/areas/${area.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: area.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="section">
      <div className="container-content max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-forest-700">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/areas" className="hover:text-forest-700">Area Guides</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-700">{area.name}</span>
        </nav>

        <header className="mt-5">
          <p className="eyebrow"><MapPin className="h-3.5 w-3.5" /> Bangalore</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
            Property in {area.name}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">{area.intro}</p>
        </header>

        {/* Quick facts */}
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FACTS(area).map((f) => (
            <div key={f.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <f.icon className="h-3.5 w-3.5 text-gold-500" /> {f.label}
              </p>
              <p className="mt-1 font-display text-base font-bold text-forest-800">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Buy / Rent / Resale */}
        <div className="mt-10 space-y-8">
          <Block title={`Buying in ${area.name}`} body={area.buying} />
          <Block title={`Renting in ${area.name}`} body={area.renting} />
          <Block title={`Resale in ${area.name}`} body={area.resale} />
          <Block title={`Market outlook for ${area.name}`} body={area.outlook} />
        </div>

        {/* Indicative price bands */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            {area.name} price guide
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Indicative all-in ranges for 2026. Actual pricing depends on the project,
            stage and exact location, ask us for a live, project-specific quote.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100 shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50/70 text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Configuration</th>
                  <th className="px-5 py-3 font-semibold">Indicative price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {area.priceBands.map((b) => (
                  <tr key={b.config}>
                    <td className="px-5 py-3 text-gray-700">{b.config}</td>
                    <td className="px-5 py-3 font-semibold text-forest-800">{b.range}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-5 py-3 text-gray-700">Rent (2–3 BHK)</td>
                  <td className="px-5 py-3 font-semibold text-forest-800">{area.rentBand}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Highlights */}
        <h2 className="mt-10 font-display text-2xl font-bold text-gray-900">Why buyers choose {area.name}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {area.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 rounded-xl bg-forest-50/60 p-4 text-sm text-gray-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" /> {h}
            </li>
          ))}
        </ul>

        {/* Honest pros & cons */}
        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <p className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
              <Check className="h-4 w-4 text-forest-600" /> The upside
            </p>
            <ul className="mt-4 space-y-2.5">
              {area.pros.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <p className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
              <AlertTriangle className="h-4 w-4 text-gold-600" /> Things to weigh
            </p>
            <ul className="mt-4 space-y-2.5">
              {area.cons.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Popular neighbourhoods + property types */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-gray-900">
              <MapPin className="h-4 w-4 text-forest-600" /> Popular neighbourhoods
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {area.microMarkets.map((m) => (
                <span key={m} className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-gray-900">
              <Building className="h-4 w-4 text-forest-600" /> Property types
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {area.propertyTypes.map((t) => (
                <span key={t} className="rounded-full bg-forest-50 px-3.5 py-1.5 text-sm font-medium text-forest-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Info columns */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoList icon={Train} title="Connectivity" items={area.connectivity} />
          <InfoList icon={Building2} title="Employment" items={area.employers} />
          <InfoList icon={GraduationCap} title="Schools" items={area.schools} />
          <InfoList icon={Sparkles} title="Lifestyle" items={area.lifestyle} />
        </div>

        {/* Live listings in this corridor */}
        {listings.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Verified projects in {area.name}
              </h2>
              <Link href="/properties" className="hidden shrink-0 text-sm font-semibold text-forest-700 hover:underline sm:block">
                View all
              </Link>
            </div>
            <div className="mt-6">
              <PropertyGrid properties={listings} />
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-gray-900">
            {area.name} property FAQs
          </h2>
          <div className="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-card">
            {area.faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-gray-900">
                  {f.q}
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Conversion CTA */}
        <section className="mt-12 grid gap-8 rounded-3xl bg-hero-teal p-6 text-white shadow-soft sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow-light"><span className="h-px w-6 bg-gold-400" /> Free, no obligation</p>
            <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
              Thinking about {area.name}? Talk to {CONSULTANT.name}.
            </h2>
            <p className="mt-3 text-white/75">
              Get a tailored shortlist, honest pricing and a site visit arranged in {area.name}.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600"
              >
                Call {CONTACT.phoneDisplay}
              </a>
              <a
                href={calendlyLink({
                  event: CALENDLY_EVENT.siteVisit,
                  context: `${area.name} (area guide)`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Book a site visit
              </a>
              <WhatsAppButton message={waMsg} label="WhatsApp" className="py-3.5" />
            </div>
          </div>
          <div className="rounded-2xl bg-white/95 p-6 text-gray-900 shadow-glow ring-1 ring-white/20">
            <p className="font-display text-lg font-bold">Quick enquiry</p>
            <p className="mt-1 text-sm text-gray-500">Name, phone and budget. {CONSULTANT.name} calls you back.</p>
            <div className="mt-4">
              <LeadForm
                source="lead-magnet"
                defaultRequirement="consultation"
                lockRequirement
                showIntent
                propertyInterest={`${area.name} (area guide)`}
                submitLabel="Request callback"
              />
            </div>
          </div>
        </section>

        {/* Related areas */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-gray-900">Explore other Bangalore areas</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {AREA_GUIDES.filter((a) => a.slug !== area.slug).map((a) => (
              <Link
                key={a.slug}
                href={`/areas/${a.slug}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-forest-600 hover:text-forest-700"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function InfoList({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <p className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
        <Icon className="h-4 w-4 text-forest-600" /> {title}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" /> {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
