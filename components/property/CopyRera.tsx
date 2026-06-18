"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyRera({ rera }: { rera: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(rera).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={copy}
      className="inline-flex max-w-full items-start gap-1.5 rounded-md bg-gray-50 px-3 py-2 text-left"
      aria-label="Copy RERA number"
    >
      <span className="mono min-w-0 break-words text-xs text-gray-700">{rera}</span>
      {copied ? (
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" />
      ) : (
        <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
      )}
    </button>
  );
}
