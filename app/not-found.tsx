import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span className="font-display text-xl font-bold text-forest-900">
          miestate
        </span>
      </Link>
      <p className="mono text-5xl font-bold text-forest-800">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-gray-900">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-2 max-w-sm text-gray-600">
        It may have moved, or the property is no longer listed. Let&apos;s get
        you back on track.
      </p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/properties" variant="accent">
          See verified properties
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
