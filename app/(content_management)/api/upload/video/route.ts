import { NextRequest, NextResponse } from "next/server";
import { uploadVideo } from "@/lib/cms/cloudinary";
import { getSessionUserFromRequest } from "@/lib/cms/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;

    const result = await uploadVideo(
      Buffer.from(buffer),
      filename,
      "yascon_cms/videos"
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
