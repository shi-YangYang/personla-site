import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { locales, type Locale } from "./i18n";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type DraftPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  languages: Locale[];
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && !slug.includes("..") && !slug.includes("/") && !slug.includes("\\");
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function serializeFrontmatter(post: DraftPost): string {
  const tags = post.tags.map((t) => JSON.stringify(t)).join(", ");
  return [
    "---",
    `title: ${yamlString(post.title)}`,
    `description: ${yamlString(post.description)}`,
    `date: ${yamlString(post.date)}`,
    post.tags.length > 0 ? `tags: [${tags}]` : "tags: []",
    "---",
    "",
  ].join("\n");
}

export function writePost(post: DraftPost): { written: Locale[]; paths: string[] } {
  if (!validateSlug(post.slug)) {
    throw new Error("Invalid slug: use lowercase letters, numbers and hyphens");
  }

  const written: Locale[] = [];
  const paths: string[] = [];

  for (const locale of locales) {
    if (!post.languages.includes(locale)) continue;
    const dir = path.join(CONTENT_DIR, locale);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${post.slug}.mdx`);
    const body = [
      serializeFrontmatter(post),
      post.content.trim(),
      "",
    ].join("\n");
    fs.writeFileSync(filePath, body, "utf8");
    written.push(locale);
    paths.push(`/${locale}/blog/${post.slug}`);
  }

  return { written, paths };
}

export function revalidateBlogPaths(localesToRevalidate: Locale[], paths: string[], tags: string[] = []): void {
  for (const locale of localesToRevalidate) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}`);
    for (const tag of tags) {
      revalidatePath(`/${locale}/blog/tags/${encodeURIComponent(tag)}`);
    }
  }
  for (const p of paths) {
    revalidatePath(p);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/zh/blog");
  revalidatePath("/en/blog");
}
