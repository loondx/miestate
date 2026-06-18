import { z } from "zod";

/** Shared project validation, used by the admin create + update routes. */
export const propertySchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(2).max(120),
  developer: z.string().min(2).max(120),
  locality: z.string().min(1),
  corridor: z.string().min(1),
  status: z.enum([
    "pre-launch",
    "new-launch",
    "under-construction",
    "ready-to-move",
  ]),
  featured: z.boolean().default(false),
  verified: z.boolean().default(true),

  pricePerSqftMin: z.coerce.number().int().min(1000),
  pricePerSqftMax: z.coerce.number().int().min(1000),
  priceFromLabel: z.string().min(1).max(60),
  investmentSummary: z.string().min(1).max(300),

  landAcres: z.coerce.number().min(0).optional(),
  openSpacePct: z.coerce.number().int().min(0).max(100).optional(),
  totalUnits: z.coerce.number().int().min(0).optional(),
  floorsLabel: z.string().max(40).optional(),
  possession: z.string().min(1).max(200),

  configurations: z
    .array(
      z.object({
        label: z.string().min(1),
        phase: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .default([]),
  rera: z
    .array(
      z.object({
        phase: z.string().optional(),
        number: z.string().min(1),
      })
    )
    .default([]),

  description: z.string().max(4000).default(""),
  whyThisProperty: z.array(z.string()).default([]),
  idealFor: z.array(z.string()).default([]),
  locationAdvantages: z
    .array(
      z.object({
        category: z.string().min(1),
        items: z.array(z.string()).default([]),
      })
    )
    .default([]),
  amenities: z
    .array(
      z.object({
        group: z.string().min(1),
        items: z.array(z.string()).default([]),
      })
    )
    .default([]),
  specifications: z
    .array(z.object({ label: z.string().min(1), body: z.string().min(1) }))
    .default([]),
  legal: z
    .array(z.object({ label: z.string().min(1), body: z.string().min(1) }))
    .default([]),

  photos: z.array(z.string()).default([]),
  brochureUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
});

/** Lead capture validation, used by the public contact / consultation API. */
export const leadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid phone number"),
  budget: z.string().max(40).optional(),
  intent: z.enum(["buy", "rent", "sell", "resale", "invest"]).optional(),
  requirement: z
    .enum(["consultation", "site-visit", "brochure", "investment", "callback"])
    .default("consultation"),
  source: z
    .enum([
      "website",
      "whatsapp",
      "referral",
      "property-page",
      "lead-magnet",
      "brochure-gate",
    ])
    .default("website"),
  propertyInterest: z.string().max(160).optional(),
  message: z.string().max(1000).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
