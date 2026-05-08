import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cms/cloudinary";
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

    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;

    const imageUrl = await uploadImage(
      Buffer.from(buffer),
      filename,
      "yascon_cms/images"
    );

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
