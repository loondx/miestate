import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/auth";
import { update, FILES } from "@/lib/store";
import type { Report } from "@/types/report";

const patchSchema = z.object({
  reportStatus: z.enum(["pending", "in_progress", "delivered"]).optional(),
  reportPdfUrl: z.string().url().optional().or(z.literal("")),
  deliveredAt: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 422 });
  }
  const updated = await update<Report>(FILES.reports, params.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  return NextResponse.json({ report: updated });
}
