import { NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyCheckoutSignature,
  verifyWebhookSignature,
} from "@/lib/razorpay";
import { getAll, update, create, newId, FILES } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";
import { sendMail } from "@/lib/mailer";
import { SERVICES } from "@/lib/config";
import { formatINR } from "@/lib/utils";
import type { Report, Transaction } from "@/types/report";

const schema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(req: Request) {
  const raw = await req.text();
  const webhookSig = req.headers.get("x-razorpay-signature");

  // ── Webhook (server-to-server) ──
  if (webhookSig) {
    if (!verifyWebhookSignature(raw, webhookSig)) {
      return NextResponse.json({ error: "Bad signature" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  // ── Checkout handler (browser) ──
  const parsed = schema.safeParse(JSON.parse(raw || "{}"));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }
  const d = parsed.data;

  const valid = verifyCheckoutSignature({
    orderId: d.razorpayOrderId,
    paymentId: d.razorpayPaymentId,
    signature: d.razorpaySignature,
  });
  if (!valid) {
    return NextResponse.json(
      { error: "Payment could not be verified." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const reports = await getAll<Report>(FILES.reports);
  const report = reports.find((r) => r.razorpayOrderId === d.razorpayOrderId);

  if (report) {
    await update<Report>(FILES.reports, report.id, {
      paymentStatus: "paid",
      reportStatus: "in_progress",
      razorpayPaymentId: d.razorpayPaymentId,
      paidAt: now,
    });

    const txn: Transaction = {
      id: newId("txn"),
      type: report.packageType,
      amount: report.amount,
      name: report.buyerName,
      property: report.propertyAddress,
      date: now,
      status: "received",
      createdAt: now,
    };
    await create<Transaction>(FILES.transactions, txn);

    // Notify the team so the report can be started right away.
    // Non-blocking: a mail failure must never fail a confirmed payment.
    const serviceName = SERVICES[report.packageType].name;
    await sendMail({
      subject: `Payment received: ${serviceName} (${formatINR(report.amount)}) from ${report.buyerName}`,
      text: [
        `A payment has just been confirmed.`,
        ``,
        `Package:  ${serviceName}`,
        `Amount:   ${formatINR(report.amount)}`,
        `Buyer:    ${report.buyerName}`,
        `Phone:    ${report.buyerPhone}`,
        `Property: ${report.propertyAddress}`,
        report.propertySlug ? `Listing:  /properties/${report.propertySlug}` : ``,
        ``,
        `Payment ID: ${d.razorpayPaymentId}`,
        `Order ID:   ${d.razorpayOrderId}`,
        ``,
        `Start the report and reach the buyer on WhatsApp within 48 hours.`,
      ]
        .filter(Boolean)
        .join("\n"),
    }).catch((e) => console.error("[payment] notify mail failed", e));
  }

  const firstName = report?.buyerName.split(" ")[0] || "there";
  const whatsappUrl = whatsappLink(
    `Hi miestate, this is ${firstName}. I've just paid for the ${
      report?.packageType === "concierge" ? "Concierge package" : "Property Risk Report"
    }. Payment id ${d.razorpayPaymentId}.`
  );

  return NextResponse.json({ success: true, whatsappUrl });
}
