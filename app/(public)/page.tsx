import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Handshake,
  LifeBuoy,
  Phone,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import { TrustBar } from "@/components/shared/TrustBar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { LeadForm } from "@/components/shared/LeadForm";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { getPublicProperties } from "@/lib/data/properties";
import { CONSULTANT, CONTACT } from "@/lib/config";

export const metadata: Metadata = {
  title: "Find Your Ideal Home in Bangalore | Buy, Rent & Resale Property",
  description:
    "MI Estate helps you buy, rent and resell verified property in Bangalore across Sarjapur Road, Whitefield, KR Puram, ORR, Electronic City and North Bangalore. Free consultation, honest advice and site visits arranged. Call or WhatsApp Rohit Kumar today.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MI Estate",
    title: "Find Your Ideal Home in Bangalore | MI Estate",
    description:
      "Verified projects, honest advice and end-to-end support to buy, rent or resell property in Bangalore. Book a free consultation and site visit.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Ideal Home in Bangalore | MI Estate",
    description:
      "Verified projects, honest advice and end-to-end support to buy, rent or resell property in Bangalore.",
    images: ["/opengraph-image"],
  },
};

const WHY = [
  {
    icon: ShieldCheck,
    title: "Verified Projects",
    body: "Every project is RERA-checked, title, approvals and developer track record confirmed before you ever visit.",
  },
  {
    icon: Handshake,
    title: "Honest Advice",
    body: "No commission games. We recommend only what fits your budget and goals, with real corridor data behind it.",
  },
  {
    icon: LifeBuoy,
    title: "End-to-End Support",
    body: "Shortlisting, site visits, pricing, home loans and paperwork, handled with you right up to the booking.",
  },
];

export default async function HomePage() {
  const properties = (await getPublicProperties()).slice(0, 12);

  return (
    <>
      {/* ───────── 1 · Hero ───────── */}
      <section className="relative overflow-hidden bg-hero-teal text-white">
        <div className="bg-dots">
          <div className="container-content flex flex-col items-center py-20 text-center sm:py-28">
            <p className="eyebrow-light justify-center">
              <span className="h-px w-6 bg-gold-400" /> Bangalore Property Advisory
            </p>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-[36px] font-bold leading-[1.08] sm:text-5xl lg:text-[58px]">
              Find Your Ideal Home in{" "}
              <span className="text-gold-400">Bangalore</span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-white/75 sm:text-base">
              Verified projects to <strong className="font-semibold text-white">buy</strong>,{" "}
              <strong className="font-semibold text-white">rent</strong> or{" "}
              <strong className="font-semibold text-white">resell</strong>, with honest
              advice and end-to-end support from your first call to the keys in your hand.
            </p>

            <div className="mt-9 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600 active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a
                href={calendlyLink({ event: CALENDLY_EVENT.siteVisit })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <CalendarCheck className="h-4 w-4" /> Schedule Site Visit
              </a>
            </div>
            <p className="mt-4 text-xs text-white/55">
              Free, no-obligation consultation · Call{" "}
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="font-semibold text-gold-400 hover:underline"
              >
                {CONTACT.phoneDisplay}
              </a>
            </p>

            <div className="mt-12 w-full max-w-4xl border-t border-white/10 pt-8">
              <TrustBar />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 2 · Featured Projects ───────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Handpicked &amp; verified</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Featured projects
              </h2>
            </div>
            <Link
              href="/properties"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-forest-700 hover:gap-2 hover:underline sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8">
            <PropertyGrid properties={properties} />
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:underline"
            >
              View all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── 3 · Why Choose Us ───────── */}
      <section className="section bg-forest-50/60">
        <div className="container-content">
          <div className="text-center">
            <p className="eyebrow justify-center">The MI Estate difference</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Why choose us
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-gold-400 shadow-cta">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-gray-900">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 4 · Meet Rohit ───────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="grid items-center gap-10 rounded-3xl border border-gray-100 bg-forest-50/40 p-6 shadow-card sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative mx-auto w-full max-w-xs">
              <div className="absolute -inset-3 rounded-3xl bg-gold-500/15 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest-100 ring-1 ring-forest-100">
                <Image
                  src={CONSULTANT.photo}
                  alt={`${CONSULTANT.name}, ${CONSULTANT.role}`}
                  fill
                  sizes="(max-width: 1024px) 80vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="eyebrow">Meet your advisor</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                {CONSULTANT.name}
              </h2>
              <p className="mt-1 text-sm font-semibold text-forest-700">
                {CONSULTANT.role}
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-gray-600">
                {CONSULTANT.bio}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${CONSULTANT.phoneHref}`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-forest-800"
                >
                  <Phone className="h-4 w-4" /> Call {CONSULTANT.firstName} · {CONSULTANT.phoneDisplay}
                </a>
                <a
                  href={calendlyLink({ event: CALENDLY_EVENT.consultation })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600"
                >
                  <CalendarCheck className="h-4 w-4" /> Book a meeting
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 5 · Quick Enquiry Form ───────── */}
      <section id="enquiry" className="scroll-mt-24 bg-hero-teal text-white">
        <div className="bg-dots">
          <div className="container-content grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="eyebrow-light">
                <span className="h-px w-6 bg-gold-400" /> Free &amp; no obligation
              </p>
              <h2 className="mt-4 max-w-lg text-balance font-display text-3xl font-bold sm:text-4xl">
                Tell us what you&apos;re looking for
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                Tell us whether you want to buy, rent, sell or resell, and{" "}
                {CONSULTANT.firstName} will call you back with a shortlist that fits,
                and arrange your site visit.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-white/80">
                {[
                  "Personal callback within working hours",
                  "Only RERA-verified projects",
                  "Site visits and paperwork handled for you",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-gold-400" /> {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/95 p-6 text-gray-900 shadow-glow ring-1 ring-white/20">
              <p className="font-display text-lg font-bold">Quick enquiry</p>
              <p className="mt-1 text-sm text-gray-500">
                What you want, your name, phone and budget, that&apos;s all we need to start.
              </p>
              <div className="mt-4">
                <LeadForm
                  source="lead-magnet"
                  defaultRequirement="consultation"
                  lockRequirement
                  showIntent
                  submitLabel="Request callback"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
