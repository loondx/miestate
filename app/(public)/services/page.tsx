import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";

export const metadata: Metadata = {
  title: "Services: risk report and concierge | miestate",
  description:
    "Property risk report (₹4,999, 48 hours) and concierge package (₹14,999). Transparent pricing, independent verification for Bangalore buyers.",
};

const FAQ = [
  {
    q: "What documents do you need from me?",
    a: "Just the property address and the seller's name. We do the rest.",
  },
  {
    q: "How is the report delivered?",
    a: "As a PDF over WhatsApp and email within 48 hours.",
  },
  {
    q: "What if the property has issues?",
    a: "We tell you exactly what the issues are and explain your options.",
  },
  {
    q: "Is this available outside Bangalore?",
    a: "Currently Bangalore only. Other cities coming soon.",
  },
  {
    q: "Can I get a refund?",
    a: "If we cannot complete the report due to document unavailability, full refund in 3–5 business days.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-hero-teal text-white">
        <div className="bg-dots">
          <div className="container-content py-16 sm:py-20">
            <p className="eyebrow-light">
              <span className="h-px w-6 bg-gold-400" /> Transparent pricing
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-display text-3xl font-bold leading-tight sm:text-5xl">
              What we check before you pay.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              Two ways to work with us. Both start with one WhatsApp message.
              Prices are flat and shown upfront. No hidden fees, no commission
              from your pocket. We earn from the builder, so you pay only the flat fee.
            </p>
          </div>
        </div>
      </section>

      <div className="section">
      <div className="container-content">
        <div className="grid gap-7 md:grid-cols-2">
          <ServiceCard type="report" />
          <ServiceCard type="concierge" />
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900">
            Frequently asked
          </h2>
          <div className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-gray-900">
                  {item.q}
                  <Plus className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-2 text-sm text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
