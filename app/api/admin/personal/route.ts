import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasValidSession, isAdminConfigured } from "@/lib/admin";
import {
  writePersonalJson,
  type PersonalJson,
  type PersonalDataRecord,
} from "@/lib/personal";
import { getPersonalData } from "@/content/data";
import { locales } from "@/lib/i18n";

const REQUIRED_STRINGS = [
  "name",
  "initials",
  "role",
  "tagline",
  "bio",
  "location",
  "email",
  "siteTitle",
] as const;

function sanitizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sanitizeRecord(input: unknown): PersonalDataRecord | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;

  const base = {} as PersonalDataRecord;
  for (const key of REQUIRED_STRINGS) {
    base[key] = sanitizeString(obj[key]);
  }

  const socialsRaw = obj.socials as Record<string, unknown> | undefined;
  base.socials = {
    github: sanitizeString(socialsRaw?.github),
    linkedin: sanitizeString(socialsRaw?.linkedin),
    twitter: sanitizeString(socialsRaw?.twitter),
    wechat: sanitizeString(socialsRaw?.wechat),
  };

  base.skills = Array.isArray(obj.skills)
    ? obj.skills
        .map((g) => {
          const group = g as Record<string, unknown>;
          if (!group || typeof group !== "object") return null;
          return {
            category: sanitizeString(group.category),
            label: sanitizeString(group.label),
            items: Array.isArray(group.items)
              ? group.items
                  .map((it) => {
                    const item = it as Record<string, unknown>;
                    if (!item || typeof item !== "object") return null;
                    const level = Number(item.level);
                    return {
                      name: sanitizeString(item.name),
                      level: Number.isFinite(level) ? level : 0,
                    };
                  })
                  .filter(Boolean) as { name: string; level: number }[]
              : [],
          };
        })
        .filter(Boolean) as PersonalDataRecord["skills"]
    : [];

  base.experience = Array.isArray(obj.experience)
    ? obj.experience
        .map((e) => {
          const exp = e as Record<string, unknown>;
          if (!exp || typeof exp !== "object") return null;
          return {
            company: sanitizeString(exp.company),
            role: sanitizeString(exp.role),
            period: sanitizeString(exp.period),
            location: sanitizeString(exp.location),
            description: sanitizeString(exp.description),
            tags: Array.isArray(exp.tags)
              ? exp.tags.map(sanitizeString).filter(Boolean)
              : [],
          };
        })
        .filter(Boolean) as PersonalDataRecord["experience"]
    : [];

  base.projects = Array.isArray(obj.projects)
    ? obj.projects
        .map((p) => {
          const project = p as Record<string, unknown>;
          if (!project || typeof project !== "object") return null;
          const links = project.links as Record<string, unknown> | undefined;
          return {
            slug: sanitizeString(project.slug),
            title: sanitizeString(project.title),
            description: sanitizeString(project.description),
            longDescription: sanitizeString(project.longDescription),
            year: sanitizeString(project.year),
            highlights: Array.isArray(project.highlights)
              ? project.highlights.map(sanitizeString).filter(Boolean)
              : [],
            tags: Array.isArray(project.tags)
              ? project.tags.map(sanitizeString).filter(Boolean)
              : [],
            size: project.size === "large" ? "large" : "small",
            links: {
              demo: sanitizeString(links?.demo),
              code: sanitizeString(links?.code),
            },
          };
        })
        .filter(Boolean) as PersonalDataRecord["projects"]
    : [];

  base.friendLinks = Array.isArray(obj.friendLinks)
    ? obj.friendLinks
        .map((l) => {
          const link = l as Record<string, unknown>;
          if (!link || typeof link !== "object") return null;
          return {
            name: sanitizeString(link.name),
            url: sanitizeString(link.url),
            description: sanitizeString(link.description),
          };
        })
        .filter(Boolean) as PersonalDataRecord["friendLinks"]
    : [];

  return base;
}

export async function GET() {
  if (!isAdminConfigured() || !(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result: PersonalJson = {};
  for (const locale of locales) {
    const data = await getPersonalData(locale);
    result[locale] = data as unknown as PersonalDataRecord;
  }
  return NextResponse.json(result);
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
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const next: PersonalJson = {};
  for (const locale of locales) {
    const sanitized = sanitizeRecord((body as Record<string, unknown>)[locale]);
    if (!sanitized || !sanitized.name.trim()) {
      return NextResponse.json(
        { error: `Invalid data for locale: ${locale}` },
        { status: 400 },
      );
    }
    next[locale] = sanitized;
  }

  writePersonalJson(next);

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/blog`);
  }
  for (const locale of locales) {
    const data = await getPersonalData(locale);
    for (const project of data.projects) {
      revalidatePath(`/${locale}/projects/${project.slug}`);
    }
  }
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true });
}
