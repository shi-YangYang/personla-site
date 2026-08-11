import type { Locale } from "@/lib/i18n";
import { personalZh } from "./personal.zh";
import { personalEn } from "./personal.en";

/**
 * Personal data override — REPLACE WITH YOUR REAL INFO
 *
 * This file is gitignored. Copy it to `personal.local.ts` and fill in your data.
 * Anything you don't set here falls back to the placeholder data in personal.zh.ts / personal.en.ts.
 *
 * Steps:
 *   1. Copy this file: `cp personal.local.example.ts personal.local.ts`
 *   2. Edit personal.local.ts with your real info
 *   3. Restart `pnpm dev`
 *
 * Anything you don't override here will use the placeholder defaults.
 */

const override = {
  zh: {
    ...personalZh,
    name: "你的真实名字",
    initials: "姓名首字母",
    role: "你的职位",
    tagline: "你的一句话标语",
    bio: "你的一段自我介绍,2-3 句话。",
    location: "你的城市",
    email: "your.real@email.com",
    socials: {
      github: "https://github.com/你的用户名",
      linkedin: "https://linkedin.com/in/你的用户名",
      twitter: "https://twitter.com/你的用户名",
      wechat: "你的微信号",
    },
    // skills / experience / projects 也都可以整段覆盖,或保持默认示例
    //
    // projects 每项需要一个唯一的 slug(用于详情页 URL),可选 year / highlights / longDescription:
    // projects: [
    //   {
    //     slug: "my-project",
    //     title: "我的项目",
    //     description: "一句话简介。",
    //     longDescription: "详细的背景与实现介绍。",
    //     year: "2025",
    //     highlights: ["亮点一", "亮点二"],
    //     tags: ["Next.js", "TypeScript"],
    //     size: "small",
    //     links: { demo: "https://...", code: "https://github.com/..." },
    //   },
    // ],
    //
    // 友链同理,可以整段覆盖:
    // friendLinks: [
    //   { name: "朋友网站", url: "https://example.com", description: "一句话介绍 TA 的网站。" },
    // ],
  },
  en: {
    ...personalEn,
    name: "Your Real Name",
    initials: "Initials",
    role: "Your Real Title",
    tagline: "Your one-line tagline",
    bio: "Your real bio, 2-3 sentences.",
    location: "Your City",
    email: "your.real@email.com",
    socials: {
      github: "https://github.com/your-username",
      linkedin: "https://linkedin.com/in/your-username",
      twitter: "https://twitter.com/your-username",
      wechat: "your_wechat_id",
    },
    // skills / experience / projects can also be overridden wholesale, or keep the defaults.
  },
} as const;

export const personalLocal: Record<Locale, typeof personalZh> = override;
