"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShieldCheck, Phone } from "lucide-react";
import { CONTACT } from "@/lib/config";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";

const NAV = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Area Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showStrip, setShowStrip] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Trust strip */}
      {showStrip && (
        <div className="bg-forest-900 text-white">
          <div className="container-content flex h-9 items-center justify-between gap-3 text-[12px]">
            <p className="flex items-center gap-2 truncate">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400 ring-2 ring-gold-400/30" />
              <span className="truncate text-white/85">
                <strong className="font-semibold text-white">RERA-verified</strong>{" "}
                listings · Legal & home-loan support · Sarjapura, Bengaluru
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="hidden items-center gap-1.5 font-medium text-white/85 hover:text-gold-400 sm:inline-flex"
              >
                <Phone className="h-3.5 w-3.5" /> {CONTACT.phoneDisplay}
              </a>
              <button
                onClick={() => setShowStrip(false)}
                aria-label="Dismiss"
                className="rounded p-1 text-white/50 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          "border-b transition-all duration-300 " +
          (scrolled
            ? "border-gray-200/80 bg-white/85 shadow-card backdrop-blur-md"
            : "border-transparent bg-white")
        }
      >
        <nav className="container-content flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Image
              src="/logo.jpeg"
              alt="MI Estate"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-lg object-cover ring-1 ring-gray-100"
            />
            <span className="font-display text-[22px] font-bold tracking-tight text-forest-900">
              MI Estate
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-forest-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={calendlyLink({ event: CALENDLY_EVENT.consultation })}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-forest-700 px-5 py-2.5 text-[13px] font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-forest-800"
            >
              Schedule consultation
            </a>
          </div>

          <button
            className="-mr-2 rounded-md p-2 text-gray-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <div className="container-content flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-gray-100 px-1 py-4 text-base font-medium text-gray-800 hover:text-forest-700"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2.5 px-1 pb-2">
                <a
                  href={calendlyLink({ event: CALENDLY_EVENT.consultation })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-forest-700 px-5 py-3 text-sm font-semibold text-white shadow-cta"
                >
                  <ShieldCheck className="h-4 w-4" /> Schedule consultation
                </a>
                <a
                  href={`tel:${CONTACT.phoneHref}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-forest-100 px-5 py-3 text-sm font-semibold text-forest-700"
                >
                  <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
