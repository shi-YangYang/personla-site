import { getAllPosts } from "@/lib/blog";
import { getMessages } from "@/lib/messages";
import { resolveLocale } from "@/lib/locale";
import { BlogCard } from "@/components/blog-card";
import { FadeIn } from "@/components/fade-in";
import { SectionLabel } from "@/components/section-label";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { locales } from "@/lib/i18n";
import type { Metadata } from "next";

export function generateStaticParams() {
  const params: Array<{ lang: string; tag: string }> = [];
  for (const lang of locales) {
    const tags = new Set<string>();
    for (const post of getAllPosts(lang)) {
      post.tags.forEach((tag) => tags.add(tag));
    }
    for (const tag of tags) params.push({ lang, tag });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}): Promise<Metadata> {
  const { lang, tag } = await params;
  const locale = resolveLocale(lang);
  const messages = await getMessages(locale);
  return {
    title: `#${tag}`,
    description: `${messages.blog.title} · #${tag}`,
    openGraph: {
      title: `#${tag}`,
      description: `${messages.blog.title} · #${tag}`,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}) {
  const { lang, tag } = await params;
  const locale = resolveLocale(lang);
  const messages = await getMessages(locale);
  const posts = getAllPosts(locale).filter((p) => p.tags.includes(tag));
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <FadeIn>
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-brand transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {messages.blog.back}
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <SectionLabel>{messages.blog.label}</SectionLabel>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          #{tag}
        </h1>
        <p className="mt-3 text-text-secondary">
          {posts.length} {messages.blog.post_count}
        </p>
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={0.05 * i}>
            <BlogCard
              post={post}
              href={`/${locale}/blog/${post.slug}`}
              tagHrefBase={`/${locale}/blog/tags`}
              labels={{ tag: messages.blog.label, read: messages.blog.read }}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
