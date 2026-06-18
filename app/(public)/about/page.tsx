import type { Metadata } from "next";
import Image from "next/image";
import { Quote, ShieldCheck, Search, MapPinned, Handshake, FileCheck2 } from "lucide-react";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { CONSULTANT, TRUST_STATS } from "@/lib/config";

export const metadata: Metadata = {
  title: "About MI Estate | Your Property Advisory & Investment Partner",
  description:
    "MI Estate is a Bangalore property advisory firm. We verify projects, research the market and guide buyers end-to-end, with verification, negotiation and registration support.",
};

const PILLARS = [
  { icon: FileCheck2, title: "Verification process", body: "We check RERA, title, plan sanctions and bank approvals before any project makes our shortlist." },
  { icon: Search, title: "Market research", body: "Corridor-level price trends, appreciation potential and honest comparisons, not sales spin." },
  { icon: MapPinned, title: "Local expertise", body: "On-ground knowledge of Sarjapur, Whitefield, KR Puram and East Bengaluru's growth corridors." },
  { icon: Handshake, title: "End-to-end assistance", body: "Shortlisting, site visits, price negotiation, banking tie-ups and registration, all handled." },
];

const NUMBERS = [
  { value: `${TRUST_STATS.propertiesEvaluated}+`, label: "Properties evaluated" },
  { value: `${TRUST_STATS.consultations}+`, label: "Client consultations" },
  { value: `${TRUST_STATS.transactionsClosed}+`, label: "Successful transactions" },
  { value: `${TRUST_STATS.corridorsCovered}`, label: "Corridors covered" },
];

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container-content max-w-3xl">
        <div className="relative mb-8 aspect-[2.35/1] w-full overflow-hidden rounded-2xl shadow-card ring-1 ring-gray-100">
          <Image
            src="/about-office.jpg"
            alt={`${CONSULTANT.name}, ${CONSULTANT.role} at MI Estate, presenting a verified Bangalore project`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
        <p className="eyebrow">Property Advisory & Investment Partner</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
          We help you buy with confidence, not guesswork.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
          MI Estate is a trusted Bengaluru real estate consultancy, based in
          Sarjapura, specialising in buying, selling, renting, resale and
          investment. We provide verified listings, legal verification support,
          home-loan assistance and end-to-end transaction guidance, with a
          customer-first approach that helps you make safe, transparent and
          profitable decisions. We don&apos;t chase volume; we protect your
          decision.
        </p>

        <figure className="my-8 rounded-2xl border-l-4 border-gold-500 bg-forest-50/70 p-6 shadow-card">
          <Quote className="h-7 w-7 text-gold-500" />
          <blockquote className="mt-3 font-display text-lg leading-relaxed text-gray-800">
            I spent years helping buyers and sellers close real estate deals. The
            problem I saw every day was simple: people paid token money before
            understanding the legal risks. Many discovered issues too late and
            struggled to recover their money. That&apos;s why I started MI Estate,
            to bring transparency and confidence to every property transaction.
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-gray-600">
            {CONSULTANT.name}, {CONSULTANT.role}
          </figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold text-gray-900">How we&apos;re different</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="card-premium p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <p.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-gray-900">{p.title}</p>
              <p className="mt-1 text-sm text-gray-600">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label} className="text-center">
              <p className="font-display text-2xl font-bold text-forest-700 sm:text-3xl">{n.value}</p>
              <p className="mt-1 text-[11px] font-medium text-gray-500">{n.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl bg-forest-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold-500" />
            <div>
              <p className="font-semibold text-gray-900">Ready to find the right property?</p>
              <p className="text-sm text-gray-600">Free consultation. Verified projects only.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={calendlyLink({ event: CALENDLY_EVENT.consultation })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-forest-700 px-6 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-forest-800"
            >
              Schedule consultation
            </a>
            <WhatsAppButton message={WA.consultation} />
          </div>
        </div>
      </div>
    </div>
  );
}
