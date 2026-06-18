"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { calendlyLink, CALENDLY_EVENT } from "@/lib/calendly";
import { PHONE_NUMBER } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Desktop floating WhatsApp button (lg+ only). On mobile we use the richer
 * MobileCTADock below instead, so the two never compete for the same corner.
 */
export function WhatsAppFloat({ message }: { message: string }) {
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
 * App-style persistent action dock for mobile (hidden on lg+). Appears after the
 * user scrolls past the hero, giving every page a single obvious next step:
 * Schedule a consultation, with sticky Call and WhatsApp always one tap away.
 */
export function MobileCTADock({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-md transition-transform duration-300 lg:hidden",
        "shadow-[0_-8px_28px_-10px_rgba(6,53,64,0.25)]",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-2.5 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href={calendlyLink({ event: CALENDLY_EVENT.consultation })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-forest-700 text-sm font-semibold text-white shadow-cta active:scale-[0.98]"
        >
          Schedule consultation
        </a>
        <a
          href={`tel:${PHONE_NUMBER}`}
          aria-label="Call us"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700 ring-1 ring-forest-100 active:scale-95"
        >
          <Phone size={20} />
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
