import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { update, remove, FILES } from "@/lib/store";
import { slugify } from "@/lib/utils";
import { propertySchema } from "@/lib/schemas";
import type { Property } from "@/types/property";

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
  const parsed = propertySchema.partial().safeParse(
    await req.json().catch(() => null)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 422 });
  }
  const patch: Partial<Property> = {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  if (parsed.data.slug) patch.slug = slugify(parsed.data.slug);
  const updated = await update<Property>(FILES.properties, params.id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
  return NextResponse.json({ property: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const denied = await guard();
  if (denied) return denied;
  const ok = await remove<Property>(FILES.properties, params.id);
  return NextResponse.json({ ok });
}
