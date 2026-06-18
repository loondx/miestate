import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import {
  SITE,
  CONTACT,
  SERVICES,
} from "@/lib/config";
import { whatsappLink, WA } from "@/lib/whatsapp";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { AREA_GUIDES } from "@/lib/data/areas";

export function Footer() {
  return (
    <footer className="mt-8 bg-hero-teal text-gray-100">
      <div className="bg-dots">
        <div className="container-content grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="MI Estate"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/15"
              />
              <span className="font-display text-xl font-bold text-white">MI Estate</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              A trusted Bengaluru real estate consultancy for buying, selling,
              renting, resale and investment, with verified listings, legal
              support and end-to-end guidance.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gold-400">
              <ShieldCheck className="h-3.5 w-3.5" /> RERA-verified, advisory-first
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="font-display text-sm font-semibold text-white">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/services" className="transition-colors hover:text-gold-400">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="font-display text-sm font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li><Link href="/properties" className="transition-colors hover:text-gold-400">Properties</Link></li>
              <li><Link href="/areas" className="transition-colors hover:text-gold-400">Bangalore area guides</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-gold-400">About</Link></li>
              <li><a href={calendlyLink({ event: CALENDLY_EVENT.consultation })} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-400">Schedule consultation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="font-display text-sm font-semibold text-white">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <a href={`tel:${CONTACT.phoneHref}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-400">
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappLink(WA.consultation)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-400">
                  <MessageCircle className="h-4 w-4 shrink-0 text-gold-400" /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-400">
                  <Mail className="h-4 w-4 shrink-0 text-gold-400" /> {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2.5 transition-colors hover:text-gold-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {CONTACT.address}
                </a>
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {AREA_GUIDES.map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${a.slug}`}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-content flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
            <p>© {new Date().getFullYear()} {SITE.name}. {CONTACT.address}.</p>
            <p className="text-center sm:text-right">
              Property details are indicative and advisory. Always verify directly
              with the developer and your advocate before registration.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
