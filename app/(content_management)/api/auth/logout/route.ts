import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  invalidateSession,
} from "@/lib/cms/auth";
import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(CMS_SESSION_COOKIE)?.value;
  if (token) {
    await invalidateSession(token);
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}

