import { NextResponse } from "next/server";
import { z } from "zod";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { create, newId, FILES } from "@/lib/store";
import { SERVICE_PRICES } from "@/lib/config";
import type { Report } from "@/types/report";

const schema = z.object({
  type: z.enum(["report", "concierge"]),
  propertySlug: z.string().optional(),
  propertyAddress: z.string().optional(),
  buyerName: z.string().min(2),
  buyerPhone: z.string().min(6),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }
  const { type, propertySlug, propertyAddress, buyerName, buyerPhone } =
    parsed.data;
  const amount = SERVICE_PRICES[type];

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online payment isn't set up yet. Please reach us on WhatsApp to pay.",
      },
      { status: 503 }
    );
  }

  try {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `mie_${type}_${Date.now()}`,
      notes: { type, buyerName, buyerPhone, property: propertyAddress || "" },
    });

    const now = new Date().toISOString();
    const report: Report = {
      id: newId("rep"),
      buyerName,
      buyerPhone,
      propertyAddress: propertyAddress || "Property (to confirm)",
      propertySlug,
      packageType: type,
      amount,
      paymentStatus: "pending",
      razorpayOrderId: order.id,
      reportStatus: "pending",
      createdAt: now,
    };
    await create<Report>(FILES.reports, report);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("[payment] order creation failed", e);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 }
    );
  }
}
