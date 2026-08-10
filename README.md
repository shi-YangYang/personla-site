# Personal Site

一个现代、快速、**中英双语**的个人作品集 + 博客模板，基于 **Next.js 16 + React 19 + Tailwind CSS 4**。

暗色赛博绿风格：毛玻璃、平滑滚动、MDX 博客、3D 特效、完整 SEO 支持、Docker 一键自部署。

> 设计目标：**可以安全地开源**——你的真实个人信息永远只存在于本地，不会提交到仓库。

---

## ✨ 特性

- ⚡ **Next.js 16 App Router** + React 19 Server Components
- 🎨 **Tailwind CSS 4** 设计令牌（绿色 / 赛博主题），支持**亮暗主题切换**
- 🌐 **中英双语**——每一处文案、每一段内容都有双语版本
- 📝 **MDX 博客**：语法高亮（Shiki）、阅读时长、文章目录（TOC）、标签聚合页
- 💬 **评论 + 阅读量**：giscus（GitHub Discussions）评论，文章浏览量统计
- 🧱 **数据驱动**——改一个文件即可更新全站内容
- 🔒 **隐私优先**——个人信息存放在被 gitignore 的本地文件中
- ✨ **3D 特效**：透视网格地面、霓虹 3D 代码、鼠标视差、卡片 3D 倾斜、粒子、光标辉光
- 📱 **完全响应式**，移动端菜单，深色主题
- ♿ **无障碍**——语义化 HTML、ARIA 标签、键盘友好
- 🚀 **SEO 完整**：每页元数据、sitemap.xml、robots.txt
- 🐳 **Docker 就绪**——多阶段构建，镜像约 150 MB

---

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 配置个人信息
cp content/data/personal.local.example.ts content/data/personal.local.ts
# 编辑 personal.local.ts 填入你的真实信息

# 3. 启动开发服务器
pnpm dev
# 打开 http://localhost:3000/zh（或 /en）
```

搞定。网站会优先使用 `personal.local.ts` 中的数据，未覆盖的部分回退到 `personal.zh.ts` / `personal.en.ts` 中的占位内容。

---

## 🔒 隐私架构（发布到 GitHub 前必读）

### 会提交到公共仓库的内容

| 路径 | 内容 |
|------|------|
| `content/data/personal.zh.ts` | 仅占位数据（示例公司、示例项目、通用简介） |
| `content/data/personal.en.ts` | 仅占位数据 |
| `content/data/personal.local.example.ts` | 模板，展示数据结构 |
| `content/blog/*/getting-started.mdx` | 示例博客文章 |
| `.env.example` | 仅变量名 |
| `messages/*.json` | UI 文案（导航、按钮等）——只有语言，不含个人信息 |

### 只留在本地（已 gitignore）

| 路径 | 内容 |
|------|------|
| `content/data/personal.local.ts` | **你的真实信息**：姓名、邮箱、社交链接、项目描述、技能 |
| `content/blog/**/_local/` | **你的真实博客文章**（如使用此目录约定） |
| `content/blog/**/_drafts/` | 草稿文章 |
| `.env.local` | 环境特定配置 |

### 工作原理

```
.gitignore:
  content/data/personal.local.ts    ← 永远不提交

content/data/index.ts:
  try {
    personalLocal = await import("./personal.local");
  } catch {
    // 文件不存在 —— 回退到占位数据
  }
```

别人克隆你的仓库后：
1. 只能得到占位数据
2. 复制 `personal.local.example.ts` → `personal.local.ts`
3. 填入自己的信息
4. 网站就变成 TA 的了

**你可以放心 `git add .` 和 `git commit`**——你的真实信息永远不会被提交。

---

## 📁 项目结构

```
personal-site/
├─ app/
│  ├─ [lang]/                    # zh / en 路由
│  │  ├─ page.tsx                # 首页（Hero / 关于 / 经历 / 技能 / 项目 / 联系）
│  │  └─ blog/
│  │     ├─ page.tsx             # 博客列表
│  │     ├─ [slug]/page.tsx      # 文章页（含目录、阅读量、评论）
│  │     └─ tags/[tag]/page.tsx  # 标签聚合页
│  │  └─ projects/[slug]/page.tsx # 项目详情页
│  ├─ api/contact/route.ts       # 联系表单接口
│  ├─ api/views/[slug]/route.ts  # 阅读量统计接口
│  ├─ layout.tsx                 # 根布局（字体、主题）
│  ├─ globals.css                # 设计系统 + 3D 特效样式
│  ├─ sitemap.ts                 # SEO 站点地图
│  └─ robots.ts                  # SEO 爬虫规则
├─ components/
│  ├─ sections/                  # 首页各区块（about / experience / skills / projects / contact）
│  ├─ boot-loader.tsx            # 开机动画（段子形式）
│  ├─ hero-3d.tsx                # 首页 3D 场景（透视网格 + 3D 代码）
│  ├─ code-3d.tsx                # 3D 霓虹代码组件（各区块背景）
│  ├─ hero-parallax.tsx          # 鼠标 3D 视差
│  ├─ tilt-card.tsx              # 3D 倾斜卡片
│  ├─ border-beam.tsx            # 卡片流光边框
│  ├─ theme-provider.tsx         # 主题（亮/暗）
│  ├─ giscus.tsx                 # 评论组件
│  ├─ view-counter.tsx           # 阅读量组件
│  └─ ...                        # 粒子、光标辉光、导航、页脚等
├─ content/
│  ├─ data/
│  │  ├─ personal.zh.ts          # 提交的占位数据
│  │  ├─ personal.en.ts          # 提交的占位数据
│  │  ├─ personal.local.example.ts  # 模板
│  │  └─ personal.local.ts       # gitignore，你的真实数据
│  └─ blog/
│     ├─ zh/                     # 提交的中文示例文章
│     └─ en/                     # 提交的英文示例文章
├─ lib/
│  ├─ blog.ts                    # 博客解析（含目录提取）
│  ├─ views.ts                   # 阅读量读写
│  ├─ mdx.ts                     # MDX 编译（懒加载 + 缓存）
│  ├─ i18n.ts / messages.ts      # 国际化
│  ├─ locale.ts                  # 语言校验
│  └─ utils.ts
├─ messages/
│  ├─ zh.json                    # 中文 UI 文案
│  └─ en.json                    # 英文 UI 文案
├─ public/                       # 静态资源
├─ Dockerfile                    # 多阶段构建
├─ docker-compose.yml            # 一键部署
├─ next.config.ts
├─ tsconfig.json
└─ LICENSE
```

---

## ✏️ 自定义

### 1. 个人信息（最常见）

编辑 `content/data/personal.local.ts`。没设置的部分会回退到占位数据。

```ts
{
  zh: {
    name: "你的真实名字",
    email: "your.real@email.com",
    socials: { github: "...", linkedin: "...", ... },
    // skills / experience / projects 也可以覆盖
    // projects 每项需要一个唯一 slug（详情页 URL），可带 year / highlights / longDescription
  },
  en: { ... },
}
```

### 2. UI 文案

编辑 `messages/zh.json` 和 `messages/en.json`，用于导航、按钮、表单标签等。

### 3. 添加一篇博客

在 `content/blog/zh/` 和 `content/blog/en/` 下各创建一个 `.mdx` 文件（slug 需一致）：

```mdx
---
title: "我的文章标题"
description: "用于 SEO 和摘要"
date: "2026-08-02"
tags: ["tag1", "tag2"]
---

文章内容。支持 **Markdown**、GFM 表格，以及带语法高亮的代码块：

    ```ts
    const greeting = "hello";
    ```
```

### 4. 主题 / 特效

在 `app/globals.css` 中修改 `:root`（暗色）和 `.light`（亮色）的 CSS 变量：

```css
--brand-primary: #10b981;     /* 主色 */
--brand-glow: #34d399;        /* 辉光 / 高亮 */
--gradient-brand: linear-gradient(135deg, #10b981 0%, #22d3ee 100%);
```

想换配色？试试：
- 紫蓝 `#8b5cf6` / `#3b82f6`
- 橙粉 `#f59e0b` / `#ec4899`
- 黑白灰（只用 `--text-*` 变量）

### 5. 开启评论（giscus）

在 GitHub 仓库启用 Discussions，然后到 [giscus.app](https://giscus.app) 生成配置，填入 `.env.local`：

```bash
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

未配置时评论组件自动隐藏。

---

## 🐳 部署

### Docker（自托管）

```bash
# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f

# 停止
docker compose down
```

站点将运行在 `http://your-server:3000`。

### 推荐：反向代理（Nginx / Caddy）

在 Caddy 前加一层反代以启用 HTTPS。最小 Caddyfile：

```caddy
your-domain.com {
    reverse_proxy localhost:3000
    encode gzip
}
```

### Vercel / Netlify

开箱即用，直接推送 Git 仓库即可导入。

> 部署前记得把 `NEXT_PUBLIC_SITE_URL` 改成你的正式域名。

---

## 🛠 技术栈

| 层 | 选择 |
|----|------|
| 框架 | Next.js 16（App Router、RSC） |
| UI | React 19、Tailwind CSS 4 |
| 动画 | Framer Motion + 原生 CSS 3D |
| 内容 | MDX（next-mdx-remote）+ gray-matter + Shiki |
| 图标 | Lucide React + React Icons |
| 评论 | giscus |
| 部署 | Docker（standalone 输出） |

---

## 📜 License

[MIT](./LICENSE) — 自由 fork、自定义、发布。
