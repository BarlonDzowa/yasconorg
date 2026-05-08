import { NextRequest, NextResponse } from "next/server";
import { initCms } from "@/lib/cms/init";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { canCreateOrEditContent } from "@/lib/cms/permissions";
import { 
  getContentById, 
  updateContent, 
  deleteContent 
} from "@/lib/cms/service";
import type { ContentStatus } from "@/lib/cms/service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initCms();
    const { id } = await params;
    const contentId = parseInt(id);
    
    if (isNaN(contentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const content = await getContentById(contentId);
    
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Content GET by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initCms();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const contentId = parseInt(id);
    
    if (isNaN(contentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const updatedContent = await updateContent(contentId, body, user.id);

    return NextResponse.json(updatedContent, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update content";
    console.error("Content PATCH error:", error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initCms();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const contentId = parseInt(id);
    
    if (isNaN(contentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await deleteContent(contentId);

    return NextResponse.json({ message: "Content deleted successfully" }, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete content";
    console.error("Content DELETE error:", error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

