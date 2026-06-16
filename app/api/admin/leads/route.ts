import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/auth";
import { getAll, create, newId, FILES } from "@/lib/store";
import type { Lead } from "@/types/lead";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(20),
  requirement: z.enum(["buy", "rent", "report", "concierge", "sell"]),
  source: z.enum(["whatsapp", "referral", "website", "reddit", "other"]),
  budget: z.coerce.number().optional(),
  locality: z.string().optional(),
  notes: z.string().max(1000).optional(),
  propertyInterest: z.string().optional(),
});

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const leads = await getAll<Lead>(FILES.leads);
  return NextResponse.json({ leads });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead data" }, { status: 422 });
  }
  const now = new Date().toISOString();
  const lead: Lead = {
    id: newId("lead"),
    status: "new",
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  };
  await create<Lead>(FILES.leads, lead);
  return NextResponse.json({ lead }, { status: 201 });
}
