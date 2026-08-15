import { NextResponse } from "next/server";
import { sendContactMail } from "@/lib/mail";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const payload = {
    name: String(body.name),
    email: String(body.email),
    message: String(body.message),
  };

  try {
    await sendContactMail(payload);
  } catch (err) {
    console.error("[contact] mail send failed:", err);
  }

  console.log("[contact]", { ...payload, at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
