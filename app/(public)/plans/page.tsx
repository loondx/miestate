import type { Metadata } from "next";
import {
  Home,
  KeyRound,
  TrendingUp,
  Building2,
  Check,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { PLANS, ASSURED, type PlanIcon, type PlanOption } from "@/lib/data/plans";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Plans & pricing — buyers, tenants, sellers & landlords | miestate",
  description:
    "Transparent prepaid and pay-on-success plans for buyers, tenants, resale sellers and landlords in Bangalore. Zero hidden commission. Pay only when it works.",
  alternates: { canonical: "/plans" },
};

const ICONS: Record<PlanIcon, typeof Home> = {
  buyer: Home,
  tenant: KeyRound,
  seller: TrendingUp,
  landlord: Building2,
};

export default function PlansPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-teal text-white">
        <div className="bg-dots">
          <div className="container-content py-16 sm:py-20">
            <p className="eyebrow-light">
              <span className="h-px w-6 bg-gold-400" /> Transparent pricing
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-display text-3xl font-bold leading-tight sm:text-5xl">
              A plan for exactly where you stand.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              Whether you&apos;re buying, renting, selling or letting, you get a clear
              choice: a flat fee upfront, or pay only when it actually works. No
              hidden commission, ever.
            </p>

            {/* Anchor nav */}
            <div className="mt-8 flex flex-wrap gap-2">
              {PLANS.map((p) => {
                const Icon = ICONS[p.icon];
                return (
                  <a
                    key={p.slug}
                    href={`#${p.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-white/20"
                  >
                    <Icon className="h-4 w-4 text-gold-400" /> {p.audience}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Audience sections */}
      {PLANS.map((p, i) => {
        const Icon = ICONS[p.icon];
        return (
          <section
            key={p.slug}
            id={p.slug}
            className={"section scroll-mt-24 " + (i % 2 ? "bg-white" : "bg-forest-50/60")}
          >
            <div className="container-content">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700 text-white shadow-cta">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
                    {p.audience}
                  </h2>
                  <p className="text-sm text-gray-500">{p.who}</p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {p.options.map((opt) => (
                  <PlanCard key={opt.kind} opt={opt} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* miestate Assured */}
      <section className="section bg-forest-900 text-white">
        <div className="bg-dots">
          <div className="container-content">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white/5 p-7 ring-1 ring-white/10 sm:p-9">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-400">
                <ShieldCheck className="h-4 w-4" /> {ASSURED.name}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-bold">{ASSURED.fee}</span>
                <span className="text-sm text-white/60">
                  one-time verification charge
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                {ASSURED.blurb}
              </p>
              <p className="mt-3 text-xs text-white/45">{ASSURED.fineprint}</p>
              <a
                href={whatsappLink(ASSURED.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-gold-600 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" /> Activate Assured
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Note about verification report */}
      <section className="bg-white">
        <div className="container-content py-12 text-center">
          <p className="mx-auto max-w-xl text-gray-600">
            Just want a one-off check before paying a token?{" "}
            <a href="/services#report" className="font-semibold text-forest-700 hover:underline">
              Get a Property Risk Report for ₹4,999
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function PlanCard({ opt }: { opt: PlanOption }) {
  const featured = opt.highlight;
  return (
    <div
      className={
        "relative flex h-full flex-col rounded-2xl bg-white p-6 transition-all duration-300 sm:p-7 " +
        (featured
          ? "shadow-card-hover ring-2 ring-forest-700"
          : "border border-gray-100 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover")
      }
    >
      <div className="flex items-center justify-between">
        <span
          className={
            "rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide " +
            (featured ? "bg-forest-700 text-white" : "bg-gray-100 text-gray-500")
          }
        >
          {opt.kind}
        </span>
        {featured && (
          <span className="text-[11px] font-semibold text-gold-600">
            Pay on success
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl font-bold text-gray-900">{opt.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{opt.tagline}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-forest-800">
          {opt.price}
        </span>
        <span className="text-sm text-gray-500">{opt.priceSub}</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {opt.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={whatsappLink(opt.message)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          "mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-cta transition-all hover:-translate-y-0.5 active:scale-[0.98] " +
          (featured
            ? "bg-forest-700 text-white hover:bg-forest-800"
            : "bg-[#25D366] text-white hover:bg-[#1ebe5b]")
        }
      >
        <MessageCircle className="h-4 w-4" /> Talk to us on WhatsApp
      </a>
    </div>
  );
}
