import { NextRequest, NextResponse } from "next/server";
import { initCms } from "@/lib/cms/init";
import { getContentBySlug } from "@/lib/cms/service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await initCms();
    const { slug } = await params;

    const item = await getContentBySlug(slug);
    if (!item) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Slug content fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}