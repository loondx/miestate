import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { create, newId, FILES } from "@/lib/store";
import { sendMail } from "@/lib/mailer";
import {
  LEAD_REQUIREMENT_LABEL,
  LEAD_SOURCE_LABEL,
  LEAD_INTENT_LABEL,
  type Lead,
} from "@/types/lead";

export async function POST(req: Request) {
  const parsed = leadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 }
    );
  }
  const {
    name,
    phone,
    budget,
    intent,
    requirement,
    source,
    propertyInterest,
    message,
  } = parsed.data;

  const now = new Date().toISOString();
  const lead: Lead = {
    id: newId("lead"),
    name,
    phone,
    requirement,
    intent,
    source,
    budget,
    status: "new",
    notes: message,
    propertyInterest,
    createdAt: now,
    updatedAt: now,
  };

  // Persist first so a lead is never lost even if mail fails.
  await create<Lead>(FILES.leads, lead).catch((e) =>
    console.error("[contact] store failed", e)
  );

  await sendMail({
    subject: `New MI Estate lead: ${name} · ${LEAD_REQUIREMENT_LABEL[requirement]}`,
    text: [
      `Name: ${name}`,
      `Phone: ${phone}`,
      intent ? `Looking to: ${LEAD_INTENT_LABEL[intent]}` : null,
      `Requirement: ${LEAD_REQUIREMENT_LABEL[requirement]}`,
      `Source: ${LEAD_SOURCE_LABEL[source]}`,
      budget ? `Budget: ${budget}` : null,
      propertyInterest ? `Property: ${propertyInterest}` : null,
      message ? `\nMessage:\n${message}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  }).catch((e) => console.error("[contact] mail failed", e));

  return NextResponse.json({ success: true });
}
