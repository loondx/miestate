import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/auth";
import { getAll, create, newId, FILES } from "@/lib/store";
import type { Transaction } from "@/types/report";

const schema = z.object({
  type: z.enum(["report", "concierge", "commission"]),
  amount: z.coerce.number().int().min(1),
  name: z.string().min(1).max(120),
  property: z.string().max(160).optional(),
  status: z.enum(["received", "expected"]),
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
  const transactions = await getAll<Transaction>(FILES.transactions);
  return NextResponse.json({ transactions });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid transaction" }, { status: 422 });
  }
  const now = new Date().toISOString();
  const transaction: Transaction = {
    id: newId("txn"),
    ...parsed.data,
    date: now,
    createdAt: now,
  };
  await create<Transaction>(FILES.transactions, transaction);
  return NextResponse.json({ transaction }, { status: 201 });
}
