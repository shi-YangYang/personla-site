import { getPersonalData } from "@/content/data";
import { getMessages } from "@/lib/messages";
import { resolveLocale } from "@/lib/locale";
import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { ArrowRight, ArrowDown } from "lucide-react";
import Link from "next/link";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { LinksSection } from "@/components/sections/links";
import { ContactSection } from "@/components/sections/contact";
import { TypingText } from "@/components/typing-text";
import { SectionIndicator } from "@/components/section-indicator";
import { Hero3D } from "@/components/hero-3d";
import { HeroParallax } from "@/components/hero-parallax";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const messages = await getMessages(locale);
  return {
    title: messages.hero.title,
    description: messages.hero.subtitle,
    openGraph: {
      title: messages.hero.title,
      description: messages.hero.subtitle,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const data = await getPersonalData(locale);
  const messages = await getMessages(locale);

  const typeLines = messages.hero.type_lines;

  const indicators = [
    { id: "home", label: messages.nav.home },
    { id: "about", label: messages.nav.about },
    { id: "experience", label: messages.nav.experience },
    { id: "skills", label: messages.nav.skills },
    { id: "projects", label: messages.nav.projects },
    { id: "links", label: messages.nav.links },
    { id: "contact", label: messages.nav.contact },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <SectionIndicator items={indicators} />

      {/* HERO */}
      <section
        id="home"
        className="snap-section relative flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-glow-radial" />
        <Hero3D />
        <HeroParallax className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center px-6 max-w-3xl mx-auto py-24">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-text-brand text-xs font-mono">
              <span className="size-1.5 rounded-full bg-brand-glow animate-pulse" />
              <TypingText texts={typeLines} speed={45} hold={2000} delay={300} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-depth">
              {data.name}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-2xl md:text-4xl font-semibold text-gradient mb-6">
              {data.tagline}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {data.bio}
            </p>
          </FadeIn>
          <FadeIn delay={0.4} className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="#projects"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-bg-base font-medium hover:glow transition-all"
            >
              {messages.hero.cta_primary}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-primary/30 text-text-primary hover:border-brand-primary/60 hover:bg-brand-primary/5 transition-all"
            >
              {messages.hero.cta_secondary}
            </Link>
          </FadeIn>
          </div>
        </HeroParallax>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-muted animate-bounce">
          <ArrowDown size={18} />
        </div>
      </section>

      <AboutSection data={data} />
      <ExperienceSection data={data} />
      <SkillsSection data={data} />
      <ProjectsSection data={data} />
      <LinksSection data={data} />
      <ContactSection email={data.email} />
    </div>
  );
}
