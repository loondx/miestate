import Link from "next/link";
import {
  ShieldCheck,
  Gavel,
  IndianRupee,
  Building2,
  BadgeCheck,
  MapPinned,
  ScrollText,
  ArrowRight,
  Check,
  X,
  Plane,
  Home,
  Globe2,
} from "lucide-react";
import { TrustBar } from "@/components/shared/TrustBar";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";
import { getPublicProperties } from "@/lib/data/properties";

const STEPS = [
  { title: "Share the property", body: "Send the address and seller's name on WhatsApp. That's it." },
  { title: "We run every check", body: "Title, EC, RERA, builder record and fair price. All of it." },
  { title: "You decide, fully informed", body: "Clear report in 48 hours. Red flags called out plainly." },
];

const CHECKS = [
  { icon: ShieldCheck, label: "Legal title", body: "Who really owns it, and if it's clean to transfer." },
  { icon: Gavel, label: "Litigation", body: "Any active court cases, disputes or encumbrances." },
  { icon: IndianRupee, label: "Fair price", body: "Asking price vs real registered deals nearby." },
  { icon: Building2, label: "Builder record", body: "Projects delivered, delayed, and what buyers say." },
  { icon: BadgeCheck, label: "RERA status", body: "Registration that's current and matches reality." },
  { icon: MapPinned, label: "Locality", body: "Water, power, commute. What living there is really like." },
];

const AUDIENCE = [
  { icon: Plane, title: "Relocating", body: "Can't visit 15 times or read Kannada documents." },
  { icon: Home, title: "First-time buyer", body: "8 years of savings on the line. No room for error." },
  { icon: Globe2, title: "NRI investor", body: "Buying remotely. You need eyes on the ground." },
];

const PORTAL_CONS = [
  "Charge sellers for ads, not buyers for safety",
  "Often go silent the moment you pay",
  "Listings can be old, repeated or fake",
  "Nobody checks the property for you",
  "1.2 out of 5 average trust rating",
];

const MIE_PROS = [
  "We work for the buyer, never the builder",
  "We reply on WhatsApp, the same day",
  "Every listing is independently checked",
  "We verify before you pay the token",
  "Real results: 47 properties verified so far",
];

const TESTIMONIALS = [
  {
    quote: "I was ready to pay ₹2 lakh token in Whitefield. miestate found a pending court case in 48 hours. I walked away.",
    name: "Vikram S.",
    from: "Relocated from Delhi",
  },
  {
    quote: "Buying from Dubai, I couldn't visit. Concierge gave me someone I trusted on the ground. Closed with zero issues.",
    name: "Deepa R.",
    from: "NRI · Sarjapur Road",
  },
  {
    quote: "The report showed the builder had delayed 3 of their last 4 projects. I found a better flat the same week.",
    name: "Ankit M.",
    from: "Relocated from Mumbai",
  },
];

export default async function HomePage() {
  const properties = (await getPublicProperties()).slice(0, 3);

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-hero-teal text-white">
        <div className="bg-dots">
          <div className="container-content grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="animate-fade-up">
              <p className="eyebrow-light">
                <span className="h-px w-6 bg-gold-400" /> Bangalore · Verified before you buy
              </p>
              <h1 className="mt-5 max-w-xl text-balance font-display text-[34px] font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                Know before you pay the token.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                We check the legal title, fair price and builder reputation of
                any Bangalore property, before you commit a single rupee.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services#report"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600 active:scale-[0.98]"
                >
                  Get my risk report · ₹4,999
                </Link>
                <WhatsAppButton message={WA.home} className="py-3.5" />
              </div>
              <p className="mt-3 text-xs text-white/55">
                Full refund if we can&apos;t complete it. No login, no paperwork.
              </p>

              <div className="mt-10 border-t border-white/10 pt-7">
                <TrustBar />
              </div>
            </div>

            {/* Sample report card — the product, made tangible */}
            <div className="relative animate-fade-up lg:justify-self-end">
              <div className="absolute -right-6 -top-8 h-40 w-40 rounded-full bg-gold-500/25 blur-3xl" />
              <div className="absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-forest-500/30 blur-3xl" />
              <div className="relative w-full max-w-sm rounded-2xl bg-white/95 p-6 text-gray-900 shadow-glow ring-1 ring-white/20 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Risk report
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-bold">
                  Sobha Dream Acres, Whitefield
                </p>
                <p className="text-sm text-gray-500">3 BHK · 1,450 sqft</p>
                <div className="mt-5 space-y-3">
                  {[
                    "Legal title: clear and transferable",
                    "Encumbrance: no dues in 15 years",
                    "Litigation: no active cases",
                    "RERA: registered and current",
                  ].map((r) => (
                    <div key={r} className="flex items-center gap-2.5 text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {r}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-forest-50 p-3 text-sm">
                  <p className="font-semibold text-forest-800">
                    ₹6,138/sqft
                    <span className="ml-2 font-medium text-gold-600">56% below market</span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">Locality avg ₹14,000/sqft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── The problem (the hook) ───────── */}
      <section className="bg-white">
        <div className="container-content py-16 text-center sm:py-20">
          <p className="mx-auto max-w-2xl text-balance font-display text-2xl font-semibold leading-snug text-forest-900 sm:text-[30px]">
            Most buyers discover legal problems{" "}
            <span className="text-gold-600">after</span> they&apos;ve paid the token.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            Getting that money back is the second nightmare. We exist so it never
            happens to you.
          </p>
          {/* who it's for — compact */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {AUDIENCE.map((a) => (
              <div key={a.title} className="rounded-xl border border-gray-100 bg-white p-4 text-left shadow-card">
                <a.icon className="h-5 w-5 text-forest-700" />
                <p className="mt-2 font-semibold text-gray-900">{a.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Not another portal (the differentiator) ───────── */}
      <section className="section bg-forest-50/60">
        <div className="container-content">
          <p className="eyebrow">The difference</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Not another listing portal.
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
            The big portals charge sellers to be seen, then go quiet. We charge
            buyers to stay safe, and we stay with you until the deal is done.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
              <p className="text-sm font-semibold text-gray-400">
                Typical property portals
              </p>
              <ul className="mt-5 space-y-3.5">
                {PORTAL_CONS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <X className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-hero-teal p-6 text-white shadow-soft sm:p-7">
              <div className="bg-dots absolute inset-0 opacity-60" />
              <div className="relative">
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-400">
                  <ShieldCheck className="h-4 w-4" /> miestate
                </p>
                <ul className="mt-5 space-y-3.5">
                  {MIE_PROS.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-white/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── What we check ───────── */}
      <section className="section bg-white">
        <div className="container-content">
          <p className="eyebrow">The risk report</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything the builder won&apos;t tell you.
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-card sm:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map((c) => (
              <div key={c.label} className="flex gap-3.5 bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-gray-900">{c.label}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/services#report"
              className="inline-flex items-center gap-2 rounded-lg bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-forest-800 active:scale-[0.98]"
            >
              Get the full report · ₹4,999 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="section bg-forest-50/60">
        <div className="container-content">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Three steps. 48 hours. One clear answer.
          </h2>
          <div className="relative mt-10 grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-forest-100 to-transparent md:block" />
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 font-display text-base font-bold text-white shadow-cta ring-4 ring-white">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Verified properties ───────── */}
      <section className="section bg-white">
        <div className="container-content">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Already checked</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Verified properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-forest-700 hover:gap-2 hover:underline sm:flex"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8">
            <PropertyGrid properties={properties} />
          </div>
        </div>
      </section>

      {/* ───────── Proof + why us ───────── */}
      <section className="section bg-forest-50/60">
        <div className="container-content grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow">Why miestate</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              The portals work for sellers. We work for you.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              When you pay us ₹4,999, we work for you. Not the seller, not the
              builder, not the listing portal. That&apos;s the whole point.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "We check before the token, not after.",
                "We charge buyers for certainty, not sellers for ads.",
                "Specific, verifiable claims. Not “trusted by thousands.”",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-gray-700">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-gray-700">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 border-t border-gray-100 pt-3">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{t.from}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="bg-hero-teal text-white">
        <div className="bg-dots">
          <div className="container-content flex flex-col items-center gap-5 py-16 text-center sm:py-20">
            <ScrollText className="h-9 w-9 text-gold-400" />
            <h2 className="max-w-xl text-balance font-display text-3xl font-bold sm:text-4xl">
              Your next step takes 2 minutes.
            </h2>
            <p className="max-w-md text-white/70">
              Send us a property address. We&apos;ll tell you if it&apos;s safe to
              buy. All on WhatsApp, no paperwork.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services#report"
                className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600 active:scale-[0.98]"
              >
                Get my risk report · ₹4,999
              </Link>
              <WhatsAppButton message={WA.home} className="py-3.5" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
