import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import {
  CMS_REGIONS,
  CMS_ROLES,
  type CmsRegion,
  type CmsRole,
  type CmsUserRecord,
} from "@/lib/cms/constants";
import { ensureCmsSchema, getPrismaClient } from "@/lib/cms/db";
import { canManageUsers, canReadUserRecord } from "@/lib/cms/permissions";
import { hashPassword } from "@/lib/cms/security";

export async function GET(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureCmsSchema();
  const client = getPrismaClient();

  const result = await client.cmsUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  const items = result.filter((row: any) =>
    canReadUserRecord(user, { role: row.role, region: row.region })
  );
  
  return NextResponse.json({
    items: items.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      region: u.region,
      created_at: u.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageUsers(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await ensureCmsSchema();
  const client = getPrismaClient();

  const body = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
    role?: CmsRole;
    region?: CmsRegion;
  };

  const name = body.name?.trim();
  const email = body.email?.toLowerCase().trim();
  const password = body.password;
  const role = body.role;
  const region = body.region;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required." },
      { status: 400 }
    );
  }
  if (!role || !CMS_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  if (!region || !CMS_REGIONS.includes(region)) {
    return NextResponse.json({ error: "Invalid region." }, { status: 400 });
  }
  if (role === "super_admin" && region !== "national") {
    return NextResponse.json(
      { error: "Super admin must be national." },
      { status: 400 }
    );
  }

  try {
    const newUser = await client.cmsUser.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role,
        region,
      },
    });

    return NextResponse.json(
      {
        item: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          region: newUser.region,
          created_at: newUser.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "User could not be created. Email may already exist." },
      { status: 400 }
    );
  }
}

