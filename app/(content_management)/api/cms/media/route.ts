import { NextRequest, NextResponse } from "next/server";
import { initCms } from "@/lib/cms/init";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { canCreateOrEditContent } from "@/lib/cms/permissions";
import { getMediaItems, createMediaItem } from "@/lib/cms/service";
import { generateSlug } from "@/lib/cms/utils";
import type { ContentRegion, ContentStatus } from "@/lib/cms/service";
import type { CmsMediaType } from "@/lib/cms/constants";

export async function GET(req: NextRequest) {
  try {
    await initCms();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") as ContentRegion | null;
    const type = searchParams.get("type") as CmsMediaType | "all" | null;
    const status = (searchParams.get("status") || "published") as ContentStatus | "all";
    const limit = Number(searchParams.get("limit")) || 50;

    const media = await getMediaItems({ 
      region: region ?? undefined, 
      type: type ?? undefined, 
      status, 
      limit 
    });
    return NextResponse.json(media, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
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
    if (!body.title || !body.fileUrl || !body.mediaType || !body.region) {
      return NextResponse.json({ error: "title, fileUrl, mediaType, region are required" }, { status: 400 });
    }

    const slug = generateSlug(body.title);
    const item = await createMediaItem({
      title: body.title,
      slug,
      description: body.description || null,
      mediaType: body.mediaType,
      fileUrl: body.fileUrl,
      coverImage: typeof body.coverImage === "string" ? body.coverImage : null,
      region: body.region,
      status: body.status ?? "draft",
      createdById: user.id,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create media item";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

