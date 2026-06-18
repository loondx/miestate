import type { Metadata } from "next";
import {
  Building2,
  KeyRound,
  FileCheck2,
  Landmark,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { SITE, CONTACT, CONSULTANT } from "@/lib/config";

export const metadata: Metadata = {
  title: "Services | Buy, Sell, Rent, Resale, Legal & Home Loans in Bangalore",
  description:
    "MI Estate's property services in Bangalore: buying & resale, selling & renting, legal verification, home loan assistance and investment advisory. Honest, end-to-end support from Rohit Kumar.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  {
    icon: Building2,
    title: "Buying & Resale",
    body: "Find and buy verified homes that fit your budget and goals, or resell what you own at the right price. We shortlist, compare and negotiate with you, not against you.",
    points: ["Curated, RERA-verified shortlists", "Honest price negotiation", "Resale listing & buyer matching"],
  },
  {
    icon: KeyRound,
    title: "Selling & Renting",
    body: "List, price and close sales or rentals with genuine, verified buyers and tenants, handled end to end so you avoid time-wasters and below-market deals.",
    points: ["Right pricing from real corridor data", "Verified buyer & tenant matching", "Paperwork and handover support"],
  },
  {
    icon: FileCheck2,
    title: "Legal Verification",
    body: "The step most buyers skip. We check RERA, title, plan sanctions, encumbrances and approvals before you pay any token money, so you never discover issues too late.",
    points: ["RERA & title checks", "Approvals & encumbrance review", "Document verification before token"],
  },
  {
    icon: Landmark,
    title: "Home Loan Assistance",
    body: "Bank tie-ups, eligibility checks and help securing the best rate, with the paperwork managed for you across leading lenders.",
    points: ["Eligibility assessment", "Best-rate bank tie-ups", "Loan paperwork handled"],
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    body: "Corridor-level price trends, appreciation potential and honest comparisons so your money goes into the right asset, not the highest-commission one.",
    points: ["Corridor & appreciation data", "Rental-yield guidance", "Honest, unbiased comparisons"],
  },
];

export default function ServicesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MI Estate property services in Bangalore",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.body,
        areaServed: "Bengaluru",
        provider: { "@type": "RealEstateAgent", name: SITE.name },
      },
    })),
  };

  return (
    <div className="section">
      <div className="container-content">
        <header className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
            End-to-end property services in Bangalore.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            From the first shortlist to the final registration, {CONSULTANT.name}{" "}
            and the MI Estate team handle every part of your property journey,
            buying, selling, renting, resale, legal checks, loans and investment
            advice, with one promise: honest, verified guidance.
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-gold-400 shadow-cta">
                <s.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold text-gray-900">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13px] text-gray-600">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 grid gap-6 rounded-3xl bg-hero-teal p-6 text-white shadow-soft sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow-light"><span className="h-px w-6 bg-gold-400" /> Free, no obligation</p>
            <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
              Not sure which service you need?
            </h2>
            <p className="mt-3 max-w-md text-white/75">
              Tell {CONSULTANT.firstName} what you&apos;re trying to do and he&apos;ll
              point you the right way, no pressure, no spam.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={calendlyLink({ event: CALENDLY_EVENT.consultation })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600"
            >
              Schedule consultation <ArrowRight className="h-4 w-4" />
            </a>
            <WhatsAppButton message={WA.consultation} label="WhatsApp us" className="py-3.5" />
            <a
              href={`tel:${CONTACT.phoneHref}`}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </div>
  );
}
