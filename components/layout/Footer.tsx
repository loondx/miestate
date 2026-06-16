import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/config";

const COVERAGE = [
  "Whitefield",
  "Sarjapur Road",
  "HSR Layout",
  "Electronic City",
  "Hebbal",
  "Bellandur",
  "Yelahanka",
];

export function Footer() {
  return (
    <footer className="mt-8 bg-hero-teal text-gray-100">
      <div className="bg-dots">
        <div className="container-content grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="miestate"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="font-display text-xl font-bold text-white">
                miestate
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Know before you pay the token. Independent verification of title,
              EC, RERA and fair pricing. We work for the buyer, never the
              builder.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gold-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Bangalore · 47 properties verified
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li><Link href="/properties" className="transition-colors hover:text-gold-400">Verified properties</Link></li>
              <li><Link href="/services#report" className="transition-colors hover:text-gold-400">Risk report · ₹4,999</Link></li>
              <li><Link href="/services#concierge" className="transition-colors hover:text-gold-400">Concierge · ₹14,999</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li><Link href="/about" className="transition-colors hover:text-gold-400">About</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-gold-400">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-sm font-semibold text-white">We cover</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {COVERAGE.map((c) => (
                <Link
                  key={c}
                  href="/properties"
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-content flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
            <p>© {new Date().getFullYear()} {SITE.name}. Based in {SITE.city}.</p>
            <p className="text-center sm:text-right">
              Verification is advisory, based on documents available at report
              time. Always consult your advocate before registration.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
