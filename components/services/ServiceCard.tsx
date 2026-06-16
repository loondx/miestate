import { Check, ShieldCheck } from "lucide-react";
import { PaymentButton } from "./PaymentButton";
import { SERVICES, type ServiceType } from "@/lib/config";

export function ServiceCard({ type }: { type: ServiceType }) {
  const s = SERVICES[type];
  const featured = type === "report";

  return (
    <div
      id={type}
      className={
        "relative flex h-full scroll-mt-28 flex-col rounded-2xl bg-white p-7 transition-all duration-300 " +
        (featured
          ? "shadow-card-hover ring-2 ring-forest-700"
          : "border border-gray-100 shadow-card hover:-translate-y-0.5 hover:shadow-card-hover")
      }
    >
      {featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-forest-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-cta">
          {s.tag}
        </span>
      )}
      {!featured && (
        <span className="mb-3 w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {s.tag}
        </span>
      )}

      <h3 className="font-display text-2xl font-bold text-gray-900">{s.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{s.sub}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {s.includes.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-7 border-t border-gray-100 pt-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-forest-800">
            {s.priceLabel}
          </span>
          <span className="text-sm text-gray-500">· {s.priceNote}</span>
        </div>
        <div className="mt-4">
          <PaymentButton type={type} className="w-full" />
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
          Full refund if we can&apos;t complete your report. No questions.
        </p>
      </div>
    </div>
  );
}
