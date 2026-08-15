import { NextResponse } from "next/server";
import { verifyPassword, createSession, sessionCookieName } from "@/lib/admin";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const session = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieName(), session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expires,
  });
  return res;
}
