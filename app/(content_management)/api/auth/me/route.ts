import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/cms/auth";

export async function GET(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}

