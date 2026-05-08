import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { initCms } from "@/lib/cms/init";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { canCreateOrEditContent } from "@/lib/cms/permissions";
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from "@/lib/cms/service";
import type { ContentStatus } from "@/lib/cms/service";

// Pages that display team data — revalidated after every write
const TEAM_PAGES = [
  "/about/management",
  "/impact/national/board",
];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initCms();
    const { id } = await params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const item = await getTeamMemberById(numericId);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Team GET error:", error);
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initCms();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const item = await getTeamMemberById(numericId);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await updateTeamMember(numericId, body, user.id);

    // Bust Next.js page cache so the public site reflects changes immediately
    TEAM_PAGES.forEach((p) => revalidatePath(p));

    return NextResponse.json(updated);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update team member";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initCms();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await deleteTeamMember(numericId);

    // Bust Next.js page cache
    TEAM_PAGES.forEach((p) => revalidatePath(p));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}