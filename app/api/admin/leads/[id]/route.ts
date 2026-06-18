import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/auth";
import { update, remove, FILES } from "@/lib/store";
import type { Lead } from "@/types/lead";

const patchSchema = z.object({
  status: z
    .enum(["new", "contacted", "site_visit", "negotiating", "closed", "lost"])
    .optional(),
  notes: z.string().max(1000).optional(),
  followUpDate: z.string().optional(),
  budget: z.string().max(40).optional(),
  propertyInterest: z.string().optional(),
});

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const denied = await guard();
  if (denied) return denied;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 422 });
  }
  const updated = await update<Lead>(FILES.leads, params.id, {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  });
  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ lead: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const denied = await guard();
  if (denied) return denied;
  const ok = await remove<Lead>(FILES.leads, params.id);
  return NextResponse.json({ ok });
}
