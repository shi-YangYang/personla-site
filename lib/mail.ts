import nodemailer from "nodemailer";
import { readMailConfig } from "./mail-config";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

type EffectiveConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  subjectPrefix: string;
};

function resolveConfig(): EffectiveConfig | null {
  const json = readMailConfig();

  // 后台 JSON 配置优先
  if (json.enabled && json.host && json.user && json.pass) {
    return {
      host: json.host,
      port: json.port || 465,
      secure: json.secure,
      user: json.user,
      pass: json.pass,
      to: json.to || json.user,
      subjectPrefix: json.subjectPrefix || "【个人站留言】",
    };
  }

  // 回退到环境变量
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: process.env.SMTP_SECURE !== "false",
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      to: process.env.SMTP_TO ?? process.env.SMTP_USER,
      subjectPrefix: process.env.SMTP_SUBJECT_PREFIX ?? "【个人站留言】",
    };
  }

  return null;
}

function buildHtml(payload: ContactPayload): string {
  const { name, email, message } = payload;
  const escaped = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const body = escaped(message).replace(/\n/g, "<br/>");
  return [
    '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0f0a;color:#e5e7eb;border-radius:12px;border:1px solid #10b98133">',
    '  <div style="font-size:13px;color:#34d399;margin-bottom:16px;letter-spacing:0.05em">▸ 新的联系表单留言</div>',
    '  <table style="width:100%;border-collapse:collapse;font-size:14px">',
    `    <tr><td style="padding:8px 0;color:#71717a;width:80px;vertical-align:top">姓名</td><td style="padding:8px 0;color:#fafafa">${escaped(name)}</td></tr>`,
    `    <tr><td style="padding:8px 0;color:#71717a;width:80px;vertical-align:top">邮箱</td><td style="padding:8px 0;color:#fafafa"><a href="mailto:${escaped(email)}" style="color:#34d399">${escaped(email)}</a></td></tr>`,
    `    <tr><td style="padding:8px 0;color:#71717a;width:80px;vertical-align:top">留言</td><td style="padding:8px 0;color:#e5e7eb;line-height:1.6">${body}</td></tr>`,
    '  </table>',
    '  <div style="margin-top:20px;padding-top:16px;border-top:1px solid #ffffff14;font-size:12px;color:#71717a">来自 feng-qingyang.top 联系表单</div>',
    "</div>",
  ].join("");
}

export async function sendContactMail(payload: ContactPayload): Promise<boolean> {
  const config = resolveConfig();
  if (!config) {
    console.log("[contact] SMTP not configured, skipped mail:", payload);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: `"联系表单" <${config.user}>`,
    to: config.to,
    subject: `${config.subjectPrefix} ${payload.name}`,
    text: `姓名: ${payload.name}\n邮箱: ${payload.email}\n留言:\n${payload.message}`,
    html: buildHtml(payload),
  });

  return true;
}
