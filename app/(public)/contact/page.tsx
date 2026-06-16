import type { Metadata } from "next";
import { MessageCircle, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/shared/ContactForm";
import { WhatsAppButton } from "@/components/layout/WhatsAppFloat";
import { WA } from "@/lib/whatsapp";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact | miestate",
  description:
    "Reach miestate on WhatsApp or send an enquiry. Bangalore-based property verification and buyer concierge.",
};

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container-content grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">We answer fast</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-5xl">
            Talk to a real person.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            Most buyers reach us on WhatsApp. It&apos;s the fastest way to get a
            straight answer. Prefer a callback? Send the form and we&apos;ll ring
            you.
          </p>

          <div className="mt-6">
            <WhatsAppButton message={WA.contact} label="Or just message us directly" />
          </div>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 text-forest-600" />
              <div>
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-gray-600">Fastest response. Share a property and we&apos;ll tell you what to check.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-forest-600" />
              <div>
                <p className="font-medium text-gray-900">Based in</p>
                <p className="text-gray-600">{SITE.city}, Karnataka</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-forest-600" />
              <div>
                <p className="font-medium text-gray-900">Response time</p>
                <p className="text-gray-600">We typically respond within 2 hours during 9am–8pm IST.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-bold text-gray-900">Send an enquiry</h2>
          <p className="mb-5 mt-1 text-sm text-gray-500">
            Tell us what you need and we&apos;ll call you back.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
