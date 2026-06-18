import type { Metadata } from "next";
import { MessageCircle, MapPin, Clock, Phone, Mail, ArrowUpRight } from "lucide-react";
import { LeadForm } from "@/components/shared/LeadForm";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";
import { CONSULTANT, CONTACT, SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Schedule a consultation | MI Estate",
  description:
    "Book a free, no-obligation property consultation with MI Estate, a trusted Bengaluru real estate consultancy in Sarjapura. Verified listings, legal verification, home-loan assistance and end-to-end guidance.",
};

const CHANNELS = [
  {
    icon: Phone,
    label: "Call us",
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneHref}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT.phoneDisplay,
    href: undefined,
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: CONTACT.address,
    href: CONTACT.mapsUrl,
  },
];

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p className="eyebrow">Free · no obligation</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
              Let&apos;s find your right property.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Tell us your budget and goals. {CONSULTANT.name}, our{" "}
              {CONSULTANT.role}, will personally shortlist verified options,
              arrange site visits and guide you through legal checks, home loans
              and registration.
            </p>


            {/* Contact channels */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CHANNELS.map((c) => {
                const inner = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {c.label}
                      </p>
                      <p className="truncate text-sm font-medium text-gray-900">{c.value}</p>
                    </div>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-card transition-colors hover:border-forest-100"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-card">
                    {inner}
                  </div>
                );
              })}
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 text-forest-600" /> We typically respond
              within 2 hours · 9am–8pm IST
            </p>

            {/* Map */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 shadow-card">
              <iframe
                title={`${SITE.name}, Sarjapura, Bengaluru`}
                src="https://www.google.com/maps?q=Sarjapura%2C%20Bengaluru%2C%20Karnataka%20562125&output=embed"
                className="h-56 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 bg-white px-4 py-3 text-sm font-medium text-forest-700 hover:bg-forest-50"
              >
                {CONTACT.address}
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* Right, form */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-xl font-bold text-gray-900">
                Request your free consultation
              </h2>
              <p className="mb-5 mt-1 text-sm text-gray-500">
                Share a few details and we&apos;ll call you back.
              </p>
              <LeadForm source="website" defaultRequirement="consultation" submitLabel="Request consultation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
