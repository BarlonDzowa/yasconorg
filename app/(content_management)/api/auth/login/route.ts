import { NextResponse } from "next/server";
import {
  attachSessionCookie,
  authenticateUser,
  createSession,
} from "@/lib/cms/auth";
import { ensureCmsSchema } from "@/lib/cms/db";

export async function POST(req: Request) {
  try {
    await ensureCmsSchema();

    const body = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await authenticateUser(body.email, body.password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const session = await createSession(user.id);
    const response = NextResponse.json({ user });
    attachSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to login." }, { status: 500 });
  }
}

