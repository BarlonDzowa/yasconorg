import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { initCms } from "@/lib/cms/init";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { canCreateOrEditContent } from "@/lib/cms/permissions";
import { getContent, createContent } from "@/lib/cms/service";
import { generateSlug } from "@/lib/cms/utils";
import type { ContentRegion, ContentStatus, CmsContentType } from "@/lib/cms/service";

// All public pages that display unified content
const CONTENT_PAGES = [
  "/news",
  "/",
  "/about/our-story",
];

export async function GET(req: NextRequest) {
  try {
    await initCms();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") as ContentRegion | null;
    const status = (searchParams.get("status") || "published") as ContentStatus | "all";
    const contentType = searchParams.get("contentType") as CmsContentType | null;
    const limit = Number(searchParams.get("limit")) || 50;

    const items = await getContent({
      region: region ?? undefined,
      status,
      contentType: contentType ?? undefined,
      limit,
    });

    return NextResponse.json(items, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
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

    if (!body.title || !body.contentType || !body.region) {
      return NextResponse.json(
        { error: "title, contentType and region are required" },
        { status: 400 }
      );
    }

    // Generate unique slug (title + timestamp to avoid collisions)
    const baseSlug = generateSlug(body.title);
    const slug = `${baseSlug}-${Date.now()}`;

    const item = await createContent({
      title: body.title,
      slug,
      excerpt: body.excerpt || "",
      richContent: body.richContent || "",
      coverImage: body.coverImage || null,
      videoUrl: body.videoUrl || null,
      videoDuration: body.videoDuration ?? null,
      contentType: body.contentType as CmsContentType,
      region: body.region as ContentRegion,
      level: body.level || "national",
      status: (body.status as ContentStatus) ?? "draft",
      createdById: user.id,
    });

    // Bust relevant public pages
    CONTENT_PAGES.forEach((p) => revalidatePath(p));

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create content";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}