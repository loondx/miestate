import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getAll, FILES } from "@/lib/store";
import type { Report } from "@/types/report";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reports = await getAll<Report>(FILES.reports);
  return NextResponse.json({ reports });
}
