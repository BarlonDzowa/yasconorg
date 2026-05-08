import { NextRequest, NextResponse } from "next/server";
import { ensureCmsSchema } from "@/lib/cms/db";
import { getSessionUserFromRequest } from "@/lib/cms/auth";
import { isSuperAdmin } from "@/lib/cms/permissions";
import { getHeroSlides, saveHeroSlides } from "@/lib/cms/service";

export async function GET() {
  try {
    await ensureCmsSchema();
    const slides = await getHeroSlides();
    return NextResponse.json(slides, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCmsSchema();
    const user = await getSessionUserFromRequest(req);
    if (!user || !isSuperAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const slides = await req.json();
    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: "Expected array of slides" }, { status: 400 });
    }
    await saveHeroSlides(slides, user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
