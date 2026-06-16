import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getAll, create, newId, FILES } from "@/lib/store";
import { slugify } from "@/lib/utils";
import { propertySchema } from "@/lib/schemas";
import type { Property } from "@/types/property";

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const properties = await getAll<Property>(FILES.properties);
  return NextResponse.json({ properties });
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const parsed = propertySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid property data", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const now = new Date().toISOString();
  const existing = await getAll<Property>(FILES.properties);
  let slug = parsed.data.slug || slugify(`${parsed.data.name}-${parsed.data.locality}`);
  if (existing.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }
  const { slug: _ignore, ...rest } = parsed.data;
  const property: Property = {
    id: newId("prop"),
    slug,
    ...rest,
    createdAt: now,
    updatedAt: now,
  };
  await create<Property>(FILES.properties, property);
  return NextResponse.json({ property }, { status: 201 });
}
