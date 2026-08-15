import { NextResponse } from "next/server";
import { hasValidSession, isAdminConfigured } from "@/lib/admin";
import {
  readMailConfig,
  writeMailConfig,
  type MailConfig,
} from "@/lib/mail-config";

function sanitize(input: unknown): MailConfig {
  const obj = (input ?? {}) as Record<string, unknown>;
  const cfg = readMailConfig();
  return {
    enabled: obj.enabled === true,
    host: typeof obj.host === "string" ? obj.host.trim() : cfg.host,
    port: Number(obj.port) || 465,
    secure: obj.secure !== false,
    user: typeof obj.user === "string" ? obj.user.trim() : cfg.user,
    pass: typeof obj.pass === "string" ? obj.pass : cfg.pass,
    to: typeof obj.to === "string" ? obj.to.trim() : cfg.to,
    subjectPrefix:
      typeof obj.subjectPrefix === "string" ? obj.subjectPrefix : cfg.subjectPrefix,
  };
}

function mask(cfg: MailConfig): MailConfig & { passSet: boolean } {
  return {
    ...cfg,
    pass: "",
    passSet: Boolean(cfg.pass),
  };
}

export async function GET() {
  if (!isAdminConfigured() || !(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(mask(readMailConfig()));
}

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 503 },
    );
  }
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const config = sanitize(body);

  if (config.enabled && (!config.host || !config.user || !config.pass)) {
    return NextResponse.json(
      { error: "启用时需填写 SMTP 服务器、邮箱和授权码" },
      { status: 400 },
    );
  }

  writeMailConfig(config);
  return NextResponse.json({ ok: true });
}
