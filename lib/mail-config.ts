import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const MAIL_FILE = path.join(DATA_DIR, "mail.json");

export type MailConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  subjectPrefix: string;
};

const DEFAULT_CONFIG: MailConfig = {
  enabled: false,
  host: "",
  port: 465,
  secure: true,
  user: "",
  pass: "",
  to: "",
  subjectPrefix: "【个人站留言】",
};

let cachedMtimeMs = 0;
let cachedConfig: MailConfig | null = null;

export function readMailConfig(): MailConfig {
  try {
    if (!fs.existsSync(MAIL_FILE)) return { ...DEFAULT_CONFIG };
    const stat = fs.statSync(MAIL_FILE);
    if (stat.mtimeMs === cachedMtimeMs && cachedConfig) return cachedConfig;
    const raw = fs.readFileSync(MAIL_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<MailConfig>;
    const merged: MailConfig = {
      ...DEFAULT_CONFIG,
      ...parsed,
    };
    cachedMtimeMs = stat.mtimeMs;
    cachedConfig = merged;
    return merged;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function writeMailConfig(config: MailConfig): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(MAIL_FILE, JSON.stringify(config, null, 2), "utf8");
  try {
    cachedMtimeMs = fs.statSync(MAIL_FILE).mtimeMs;
  } catch {
    cachedMtimeMs = 0;
  }
  cachedConfig = config;
}

export function mailConfigPath(): string {
  return MAIL_FILE;
}
