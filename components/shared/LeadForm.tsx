"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FieldError } from "@/components/ui/Input";
import type { LeadIntent, LeadRequirement, LeadSource } from "@/types/lead";

export const BUDGET_OPTIONS = [
  "Under ₹75 L",
  "₹75 L – ₹1 Cr",
  "₹1 – ₹1.5 Cr",
  "₹1.5 – ₹2 Cr",
  "₹2 Cr+",
] as const;

const INTENT_OPTIONS: { value: LeadIntent; label: string }[] = [
  { value: "buy", label: "Buy a property" },
  { value: "rent", label: "Rent a property" },
  { value: "sell", label: "Sell my property" },
  { value: "resale", label: "Resale / resell" },
  { value: "invest", label: "Invest" },
];

const REQUIREMENT_OPTIONS: { value: LeadRequirement; label: string }[] = [
  { value: "consultation", label: "Free consultation" },
  { value: "site-visit", label: "Schedule a site visit" },
  { value: "brochure", label: "Brochure & cost sheet" },
  { value: "investment", label: "Investment advice" },
  { value: "callback", label: "Request a callback" },
];

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  phone: z.string().regex(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number."),
  budget: z.string().optional(),
  intent: z.enum(["buy", "rent", "sell", "resale", "invest"]).optional(),
  requirement: z.enum([
    "consultation",
    "site-visit",
    "brochure",
    "investment",
    "callback",
  ]),
});

type FormValues = z.infer<typeof schema>;

export function LeadForm({
  source,
  defaultRequirement = "consultation",
  lockRequirement = false,
  showIntent = false,
  minimal = false,
  propertyInterest,
  submitLabel = "Request consultation",
  successTitle = "Thank you, we've got it.",
  successBody = "Rohit Kumar will reach out within 2 hours (9am–8pm IST). For anything urgent, message us on WhatsApp.",
  onSuccess,
  compact = false,
}: {
  source: LeadSource;
  defaultRequirement?: LeadRequirement;
  lockRequirement?: boolean;
  /** Show the "I'm looking to… (buy/rent/sell/resale)" select. */
  showIntent?: boolean;
  /** Capture only name + phone, the lowest-friction "leave your number" form. */
  minimal?: boolean;
  propertyInterest?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  /** Called after a successful submit, e.g. to reveal a brochure link. */
  onSuccess?: (values: FormValues) => void;
  compact?: boolean;
}) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      requirement: defaultRequirement,
      ...(showIntent ? { intent: "buy" as LeadIntent } : {}),
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source, propertyInterest }),
      });
      if (!res.ok) throw new Error("Could not send. Please try WhatsApp instead.");
      setDone(true);
      onSuccess?.(values);
    } catch (e: any) {
      setServerError(e.message);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-forest-100 bg-forest-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-forest-600" />
        <p className="mt-3 text-base font-semibold text-gray-900">{successTitle}</p>
        <p className="mt-1 text-sm text-gray-600">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
      {showIntent && (
        <div>
          {!compact && <Label htmlFor="lf-intent">I&apos;m looking to</Label>}
          <Select id="lf-intent" {...register("intent")}>
            {INTENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div>
        {!compact && <Label htmlFor="lf-name">Your name</Label>}
        <Input
          id="lf-name"
          placeholder="Your name"
          autoComplete="name"
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        {!compact && <Label htmlFor="lf-phone">Phone</Label>}
        <Input
          id="lf-phone"
          placeholder="Phone number"
          inputMode="tel"
          autoComplete="tel"
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>
      {!minimal && (
        <div>
          {!compact && <Label htmlFor="lf-budget">Budget</Label>}
          <Select id="lf-budget" defaultValue="" {...register("budget")}>
            <option value="">Budget (optional)</option>
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
      )}
      {!lockRequirement && (
        <div>
          {!compact && <Label htmlFor="lf-req">What do you need?</Label>}
          <Select id="lf-req" {...register("requirement")}>
            {REQUIREMENT_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.requirement?.message} />
        </div>
      )}

      {serverError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          submitLabel
        )}
      </Button>
      <p className="text-center text-[11px] text-gray-400">
        No spam. Your details stay private and are used only to assist your search.
      </p>
    </form>
  );
}
