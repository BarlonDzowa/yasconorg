import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";
import { getSessionUserByToken, getPrismaClient } from "@/lib/cms/auth";
import { ensureCmsSchema } from "@/lib/cms/db";

export async function GET(req: NextRequest) {
  try {
    await ensureCmsSchema();
    
    const cookieStore = await cookies();
    const token = cookieStore.get(CMS_SESSION_COOKIE)?.value;
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await getSessionUserByToken(token);
    
    if (!user) {
      // Cleanup expired session cookie
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.delete(CMS_SESSION_COOKIE);
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[CMS_SESSION] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

