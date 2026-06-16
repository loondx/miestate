"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function isDetailPage(pathname: string | null) {
  return /^\/properties\/[^/]+$/.test(pathname || "");
}

/**
 * Desktop floating WhatsApp button (lg+ only). On mobile we use the richer
 * MobileCTADock below instead, so the two never compete for the same corner.
 * Hidden on property detail pages, which carry their own sticky CTA.
 */
export function WhatsAppFloat({ message }: { message: string }) {
  const pathname = usePathname();
  if (isDetailPage(pathname)) return null;

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Talk to us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 hidden items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3 pr-5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] ring-4 ring-[#25D366]/15 transition-all hover:-translate-y-0.5 lg:flex"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <MessageCircle size={20} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-white">
          <span className="absolute inset-0.5 rounded-full bg-emerald-400" />
        </span>
      </span>
      Chat with us
    </a>
  );
}

/**
 * App-style persistent action dock for mobile (hidden on lg+). Appears after
 * the user scrolls past the hero. Gives every page a single, obvious next step
 * the way native apps do — the pattern serious products use, not a broker site.
 */
export function MobileCTADock({ message }: { message: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detail pages have their own sticky bar.
  if (isDetailPage(pathname)) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-md transition-transform duration-300 lg:hidden",
        "shadow-[0_-8px_28px_-10px_rgba(6,53,64,0.25)]",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-2.5 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Link
          href="/services#report"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-forest-700 text-sm font-semibold text-white shadow-cta active:scale-[0.98]"
        >
          <ShieldCheck className="h-4 w-4" /> Get report · ₹4,999
        </Link>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Talk to us on WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-cta active:scale-95"
        >
          <MessageCircle size={20} />
        </a>
      </div>
    </div>
  );
}

/** Inline WhatsApp button/link for use inside page content. */
export function WhatsAppButton({
  message,
  label = "Talk to us on WhatsApp",
  className,
}: {
  message: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b] active:translate-y-0 focus-ring",
        className
      )}
    >
      <MessageCircle size={18} /> {label}
    </a>
  );
}
