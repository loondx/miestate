"use client";

import { useState } from "react";
import { Share2, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Share control for a property page. On mobile it opens the native share sheet
 * (WhatsApp, Messages, etc.); on desktop it copies the link. A dedicated
 * WhatsApp button is always shown because that's how the team and clients
 * actually pass a property around.
 */
export function ShareButton({
  url,
  title,
  text,
  className,
}: {
  url: string;
  title: string;
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* user dismissed, fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked, ignore */
    }
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:border-forest-300 hover:text-forest-700 focus-ring"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-forest-600" /> Link copied
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" /> Share
          </>
        )}
      </button>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366] text-white transition-transform hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
    </div>
  );
}
