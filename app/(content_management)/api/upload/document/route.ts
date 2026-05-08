import { NextRequest, NextResponse } from "next/server";
import {uploadDocument} from "@/lib/cms/cloudinary";
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

    const documentUrl = await uploadDocument(
      Buffer.from(buffer),
      filename,
      "yascon_cms/documents"
    );

    return NextResponse.json({
      success: true,
      url: documentUrl,
      filename,
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
