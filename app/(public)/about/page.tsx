import type { Metadata } from "next";
import Link from "next/link";
import { Quote } from "lucide-react";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About: why we built miestate",
  description:
    "miestate was started by Rohit (ex-NoBroker broker) and Pankaj (technology) to give buyers verified property intelligence before they pay the token.",
};

const TEAM = [
  {
    name: "Rohit",
    role: "Business & Operations",
    bio: "An active Bangalore broker. Years inside the industry, including time at NoBroker, showed him how often buyers discover legal problems only after paying the token.",
  },
  {
    name: "Pankaj",
    role: "Technology",
    bio: "Builds the platform and the verification workflow, turning scattered checks into a clear, repeatable report every buyer can rely on.",
  },
];

const NUMBERS = [
  "5 crore+ in deals closed",
  "47 properties verified",
  "Bangalore's first pre-token verification service",
];

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container-content max-w-3xl">
        <p className="eyebrow">Why we built this</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
          We saw buyers lose money to things they couldn&apos;t see.
        </h1>

        <figure className="my-8 rounded-2xl border-l-4 border-gold-500 bg-forest-50/70 p-6 shadow-card">
          <Quote className="h-7 w-7 text-gold-500" />
          <blockquote className="mt-3 font-display text-lg leading-relaxed text-gray-800">
            I spent 2 years at NoBroker closing deals. The problem I saw every
            day: buyers paid token money and discovered legal problems too late.
            Getting refunds was a second nightmare. I left to fix this.
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-gray-600">
            Rohit, Founder
          </figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold text-gray-900">
          Our mission
        </h2>
        <p className="mt-3 text-gray-700">
          Make every property transaction in India transparent before money
          changes hands. We work for the buyer, never the builder, and we put
          everything in writing.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {NUMBERS.map((n) => (
            <span key={n} className="rounded-md bg-forest-50 px-3 py-1.5 text-sm text-forest-800">
              {n}
            </span>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-gray-900">
          The team
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {TEAM.map((m) => (
            <div key={m.name} className="card-premium p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 font-display text-xl font-bold text-white shadow-cta">
                {m.name[0]}
              </div>
              <p className="mt-3 text-lg font-semibold text-gray-900">{m.name}</p>
              <p className="text-sm font-medium text-forest-700">{m.role}</p>
              <p className="mt-2 text-sm text-gray-600">{m.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
          <Link
            href="/services#report"
            className="rounded-lg bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-forest-800"
          >
            Get a risk report
          </Link>
          <WhatsAppButton message={WA.home} />
        </div>
      </div>
    </div>
  );
}
