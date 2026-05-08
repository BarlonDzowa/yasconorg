import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import {
  CMS_REGIONS,
  CMS_ROLES,
  type CmsRegion,
  type CmsRole,
} from "@/lib/cms/constants";
import { ensureCmsSchema, getPrismaClient } from "@/lib/cms/db";
import { canManageUsers } from "@/lib/cms/permissions";
import { hashPassword } from "@/lib/cms/security";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const actor = await getSessionUserFromRequest(req);
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageUsers(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await ensureCmsSchema();
  const client = getPrismaClient();

  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const existing = await client.cmsUser.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = (await req.json()) as {
    name?: string;
    role?: CmsRole;
    region?: CmsRegion;
    password?: string;
  };

  const name = body.name?.trim() || existing.name;
  const role = (body.role ?? existing.role) as CmsRole;
  const region = (body.region ?? existing.region) as CmsRegion;

  if (!CMS_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  if (!CMS_REGIONS.includes(region)) {
    return NextResponse.json({ error: "Invalid region." }, { status: 400 });
  }
  if (role === "super_admin" && region !== "national") {
    return NextResponse.json(
      { error: "Super admin must be national." },
      { status: 400 }
    );
  }

  const updateData: any = { name, role, region };
  if (body.password?.trim()) {
    updateData.passwordHash = hashPassword(body.password);
  }

  const updated = await client.cmsUser.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    item: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      region: updated.region,
      created_at: updated.createdAt.toISOString(),
    },
  });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const actor = await getSessionUserFromRequest(req);
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageUsers(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await ensureCmsSchema();
  const client = getPrismaClient();

  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  if (id === actor.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  await client.cmsUser.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

