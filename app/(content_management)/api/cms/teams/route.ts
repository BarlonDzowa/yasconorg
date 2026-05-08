import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { initCms } from "@/lib/cms/init";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { canCreateOrEditContent } from "@/lib/cms/permissions";
import { getTeamMembers, createTeamMember } from "@/lib/cms/service";
import { generateSlug } from "@/lib/cms/utils";
import type { ContentRegion, ContentStatus } from "@/lib/cms/service";

// Pages that display team data — revalidated after every write
const TEAM_PAGES = [
  "/about/management",
  "/impact/national/board",
];

export async function GET(req: NextRequest) {
  try {
    await initCms();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") as ContentRegion | null;
    const type = searchParams.get("type") as "management" | "board" | "all" | null;
    const status = (searchParams.get("status") || "published") as ContentStatus | "all";
    const limit = Number(searchParams.get("limit")) || 50;

    const teams = await getTeamMembers({
      region: region ?? undefined,
      type: type ?? undefined,
      status,
      limit,
    });

    return NextResponse.json(teams, {
      // No s-maxage caching on this API endpoint — always serve fresh data
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Teams GET error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initCms();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.role || !body.focus || !body.teamType || !body.region) {
      return NextResponse.json(
        { error: "name, role, focus, teamType and region are required" },
        { status: 400 }
      );
    }

    const baseSlug = generateSlug(body.name);
    const slug = `${baseSlug}-${Date.now()}`;

    const item = await createTeamMember({
      name: body.name,
      slug,
      role: body.role,
      joined: body.joined || null,
      avatar: typeof body.avatar === "string" && body.avatar ? body.avatar : null,
      focus: body.focus,
      teamType: body.teamType,
      region: body.region,
      status: body.status ?? "draft",
      createdById: user.id,
    });

    TEAM_PAGES.forEach((p) => revalidatePath(p));

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create team member";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}