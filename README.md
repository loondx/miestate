# miestate

**Know before you pay the token.** Bangalore property trust platform.

miestate helps buyers verify a property's legal status, fair price, and builder
reputation **before** paying the token amount. Buyers can pay for a Property
Risk Report (₹4,999) or a Concierge Package (₹14,999); Rohit runs leads,
listings, reports and revenue from a mobile-first admin.

## Stack

- **Next.js 14** App Router · **TypeScript** (strict)
- **Tailwind CSS** with custom `forest` / `gold` design tokens (flat design — no shadows, no gradients)
- **Razorpay** payments · **Nodemailer** contact email · **Zod** + **React Hook Form** forms
- **jose** edge-compatible admin auth (middleware-protected)
- Data: **JSON files** in `lib/data/` (no database for MVP)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

`.env.local` ships with safe local defaults. Without Razorpay keys, payment
falls back to a clear "pay over WhatsApp" message; without SMTP, the contact
form logs instead of sending — nothing crashes on a missing secret.

**Admin:** visit `/admin` → redirected to `/admin/login`. Local password:
`miestate2026` (`ADMIN_PASSWORD`).

## Environment variables

```
ADMIN_PASSWORD            ADMIN_SESSION_SECRET
RAZORPAY_KEY_ID           RAZORPAY_KEY_SECRET        RAZORPAY_WEBHOOK_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
SMTP_HOST  SMTP_PORT  SMTP_USER  SMTP_PASS  CONTACT_EMAIL
NEXT_PUBLIC_WHATSAPP_NUMBER   NEXT_PUBLIC_APP_URL
```

## Routes

**Public** — `/` · `/properties` · `/properties/[slug]` · `/services` · `/about` · `/contact`
**Admin** (password-protected) — `/admin` · `/admin/leads` · `/admin/properties` · `/admin/properties/new` · `/admin/properties/[id]/edit` · `/admin/reports` · `/admin/revenue`
**API** — `/api/contact` · `/api/payment/{create-order,verify}` · `/api/admin/auth` · `/api/admin/{leads,properties,reports,revenue}` (+ `[id]` for leads/properties/reports)

## Money path

1. Buyer clicks **Get my report** / **Start my search** → enters name + phone.
2. `POST /api/payment/create-order` creates the Razorpay order + a pending `Report` record.
3. Razorpay Checkout → on success calls `POST /api/payment/verify`, which validates the
   HMAC signature, marks the report `paid` / `in_progress`, logs a `Transaction`, and returns a
   WhatsApp confirmation deep link. Webhooks hit the same endpoint (detected via `x-razorpay-signature`).
4. Rohit delivers the PDF and updates status from `/admin/reports`.

## Design system

- Tokens: `forest` (trust) + `gold` (reserved for the verified badge & concierge CTA).
- Fonts: Playfair Display (headlines), Inter (body/UI), JetBrains Mono (RERA/prices/IDs).
- Rules enforced: flat surfaces (no gradients/shadows/blur), radius ≤ 8px (modals 12px), sentence case, price always visible, WhatsApp on every public page, mobile-first.

## Security

- `middleware.ts` protects `/admin` and all sub-routes; admin API routes re-check the session via `isAdminRequest()`.
- Payment signatures verified with `crypto.timingSafeEqual`.

## Phase 2 (designed for, not built)

Swap `lib/store.ts` JSON functions for Supabase (same signatures); Supabase Auth for buyer
accounts; R2/S3 for photos & report PDFs; WhatsApp Business API automation.

> ⚠️ On Vercel's serverless filesystem, JSON writes are **ephemeral**. Move to a
> database before relying on admin writes in production. Property photos are
> stored as base64 in JSON for the MVP — also move to object storage in Phase 2.
