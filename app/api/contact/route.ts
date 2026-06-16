import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[0-9+\-\s]{8,15}$/),
  requirement: z.string().min(1).max(60),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 }
    );
  }
  const { name, phone, requirement, message } = parsed.data;

  await sendMail({
    subject: `New miestate enquiry: ${name} (${requirement})`,
    text: `Name: ${name}\nPhone: ${phone}\nNeed: ${requirement}\n\n${message || ""}`,
  }).catch((e) => console.error("[contact] mail failed", e));

  return NextResponse.json({ success: true });
}
