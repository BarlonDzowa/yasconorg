import { NextRequest, NextResponse } from "next/server";
import { ensureCmsSchema } from "@/lib/cms/db";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { canCreateOrEditContent } from "@/lib/cms/permissions";
import { getMediaItemById, updateMediaItem, deleteMediaItem } from "@/lib/cms/service";
import type { ContentStatus } from "@/lib/cms/service";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureCmsSchema();
    const id = parseInt(params.id);
    const item = await getMediaItemById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media item" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureCmsSchema();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();
    const item = await getMediaItemById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await updateMediaItem(id, body, user.id);
    return NextResponse.json(updated);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update media item";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureCmsSchema();
    const user = await getSessionUserFromRequest(req);
    if (!user || !canCreateOrEditContent(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    await deleteMediaItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
  }
}

