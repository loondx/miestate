"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";

const REQUIREMENTS = [
  "Buy",
  "Rent",
  "Risk Report",
  "Concierge",
  "Sell my property",
  "Other",
];

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  phone: z.string().regex(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number."),
  requirement: z.string().min(1, "Please pick what you need."),
  message: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Could not send. Try WhatsApp instead.");
      setDone(true);
    } catch (e: any) {
      setServerError(e.message);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-forest-100 bg-forest-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
        <p className="mt-3 text-lg font-semibold text-gray-900">
          Thank you. We&apos;ve got it.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          We typically respond within 2 hours during 9am–8pm IST.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input id="name" autoComplete="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" inputMode="tel" autoComplete="tel" {...register("phone")} />
        <FieldError message={errors.phone?.message} />
      </div>
      <div>
        <Label htmlFor="requirement">What do you need?</Label>
        <Select id="requirement" defaultValue="" {...register("requirement")}>
          <option value="" disabled>
            Select…
          </option>
          {REQUIREMENTS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <FieldError message={errors.requirement?.message} />
      </div>
      <div>
        <Label htmlFor="message">Anything else? (optional)</Label>
        <Textarea
          id="message"
          placeholder="Property you're considering, locality, budget…"
          {...register("message")}
        />
      </div>

      {serverError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send enquiry"
        )}
      </Button>
    </form>
  );
}
