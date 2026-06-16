"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Renders next/image for hosted URLs and a plain img for base64 data URLs. */
function Photo({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  if (src.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />;
  }
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />;
}

export function PropertyGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const safe = images.length ? images : ["/placeholder.jpg"];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
        <Photo
          src={safe[active]}
          alt={`${alt}, photo ${active + 1}`}
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>
      {safe.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {safe.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2",
                i === active ? "border-forest-600" : "border-transparent"
              )}
            >
              <Photo src={src} alt="" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
