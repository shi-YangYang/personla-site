import { NextResponse } from "next/server";
import { hasValidSession, isAdminConfigured } from "@/lib/admin";
import { writePost, revalidateBlogPaths, type DraftPost } from "@/lib/blog-writer";
import { locales, type Locale } from "@/lib/i18n";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured on the server" },
      { status: 503 },
    );
  }
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const languages = (Array.isArray(body?.languages) ? body.languages : []).filter(
    (lang: unknown): lang is Locale => locales.includes(lang as Locale),
  );
  if (languages.length === 0) {
    return NextResponse.json({ error: "Pick at least one language" }, { status: 400 });
  }

  const draft: DraftPost = {
    slug: String(body?.slug ?? "").trim(),
    title: String(body?.title ?? "").trim(),
    description: String(body?.description ?? "").trim(),
    date: String(body?.date ?? "").trim(),
    tags: (Array.isArray(body?.tags) ? body.tags : [])
      .map((t: unknown): string => String(t))
      .map((t: string): string => t.trim())
      .filter((t: string): boolean => t.length > 0),
    content: String(body?.content ?? ""),
    languages,
  };

  if (!draft.slug || !draft.title || !draft.date) {
    return NextResponse.json(
      { error: "slug, title and date are required" },
      { status: 400 },
    );
  }

  try {
    const { paths } = writePost(draft);
    revalidateBlogPaths(languages, paths, draft.tags);
    return NextResponse.json({ ok: true, slug: draft.slug, languages });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to write post" },
      { status: 400 },
    );
  }
}
