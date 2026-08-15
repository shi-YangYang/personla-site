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
- 🔐 **在线发博**：`/admin` 后台（`ADMIN_PASSWORD` 保护），支持中英双语、Markdown 表情短代码
- 😀 **表情支持**：文章里可写 `:rocket:` 等短代码，后台编辑器内置表情选择器
- 👤 **在线编辑个人信息**：后台可直接修改姓名、技能、经历、项目、友链等全站个人数据
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

# 2. 启动开发服务器
pnpm dev
# 打开 http://localhost:3000/zh（或 /en）
```

搞定。个人信息默认显示 `personal.zh.ts` / `personal.en.ts` 中的占位内容，可登录后台 `/admin`（需配置 `ADMIN_PASSWORD`）在线修改全部个人数据。

---

## 🔒 隐私架构（发布到 GitHub 前必读）

### 会提交到公共仓库的内容

| 路径 | 内容 |
|------|------|
| `content/data/personal.zh.ts` | 仅占位数据（示例公司、示例项目、通用简介） |
| `content/data/personal.en.ts` | 仅占位数据 |
| `content/blog/*/hello-world.mdx` | 示例博客文章 |
| `.env.example` | 仅变量名 |
| `messages/*.json` | UI 文案（导航、按钮等）——只有语言，不含个人信息 |

### 只留在本地（已 gitignore）

| 路径 | 内容 |
|------|------|
| `data/personal.local.json` | **你的真实信息**：后台在线编辑后生成 |
| `data/views.json` | 阅读量统计 |
| `content/blog/**/_local/` | **你的真实博客文章**（如使用此目录约定） |
| `content/blog/**/_drafts/` | 草稿文章 |
| `.env.local` / `.env` | 环境变量（含管理密码） |

### 工作原理

个人信息通过后台 `/admin` 在线编辑，保存到 `data/personal.local.json`（被 `.gitignore` 忽略）。读取时三级回退：JSON 数据 > 占位数据（`personal.zh.ts` / `personal.en.ts`）。

别人克隆你的仓库后：
1. 只能得到占位数据
2. 启动后配置 `ADMIN_PASSWORD`，登录 `/admin` 填写自己的信息
3. 网站就变成 TA 的了

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
│  │  └─ index.ts                # 数据读取（JSON 优先，占位回退）
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

登录 `/admin` 后台（需配置 `ADMIN_PASSWORD`），在「个人信息」标签页在线修改：姓名、简介、社交链接、技能、经历、项目、友链等全部字段，中英双语分开维护。保存后写入 `data/personal.local.json` 并即时生效。

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

### 6. 在线发布博客（后台）

设置 `ADMIN_PASSWORD` 后即可访问 `http://localhost:3000/admin`（或服务器对应地址）：

```bash
ADMIN_PASSWORD=your-strong-password
```

- 后台支持中英双语发布（可勾选生成语言版本），一次写入 `content/blog/{zh|en}/*.mdx`
- 支持 Markdown 表情短代码（如 `:rocket:`、`:smile:`），编辑器内置表情选择器
- 发布后通过 `revalidatePath` 即时刷新前台页面
- 未配置 `ADMIN_PASSWORD` 时后台自动禁用

### 7. 在线修改个人信息

后台「个人信息」标签页可以修改全站个人数据：基本信息、社交链接、技能、工作经历、项目、友链，中英双语分开维护。

- 数据保存在 `data/personal.local.json`（已被 `.gitignore` 忽略，不会进 git）
- 首次编辑时加载当前占位数据，之后以 JSON 为准
- 保存后通过 `revalidatePath` 即时刷新首页与项目详情页

> 注意：在 Docker / 自托管场景下请确保 `content/` 目录通过 volume 持久化，否则重启容器后发布的文章会丢失。

### 8. 联系表单邮件通知

访客在首页「联系」区块提交的留言，可通过 SMTP 邮件发送到你的邮箱。在 `.env.local`（本地）或 `.env`（服务器）中配置：

```bash
SMTP_HOST=smtp.qq.com          # QQ 邮箱；163: smtp.163.com；企业微信: smtp.exmail.qq.com
SMTP_PORT=465                  # SSL 端口，一般为 465
SMTP_SECURE=true               # 465 用 true，587 用 false
SMTP_USER=your@qq.com          # 发件邮箱（需在邮箱设置里开启 SMTP 服务）
SMTP_PASS=your-smtp-auth-code  # 授权码（非登录密码）
SMTP_TO=your@qq.com            # 收件邮箱（默认同 SMTP_USER，可留空）
```

> QQ 邮箱：设置 → 账号 → 开启「SMTP 服务」，会生成一个 16 位授权码，填到 `SMTP_PASS`。未配置时留言仍会记录到容器日志，不影响表单正常提交。

---

## 🐳 部署

### Docker（自托管）

**第 1 步：在服务器上准备环境变量**

在项目根目录创建 `.env`（已被 `.gitignore` 忽略，绝不会进 git）：

```bash
# 管理后台密码（必填，否则 /admin 禁用）
ADMIN_PASSWORD=your-strong-password

# 站点正式域名（构建时内联进页面）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# giscus 评论（可选，留空则评论隐藏）
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

**第 2 步：构建并启动**

```bash
docker compose up -d --build

# 查看日志
docker compose logs -f

# 停止
docker compose down
```

站点将运行在 `http://your-server:3000`。访问 `/admin` 用第 1 步设置的密码在线发布博客、编辑个人信息。

**持久化说明**

`docker-compose.yml` 已用两个命名 volume 挂载 `content/`（博客文章）和 `data/`（个人信息 JSON + 阅读量），容器重启、重建都不丢数据：

- `site-content` → `/app/content`
- `site-data` → `/app/data`

> ⚠️ **隐私提醒**：已通过 `.dockerignore` 排除 `.env*`，密码不会进镜像。个人信息与博客数据都存在命名 volume 中，不会打进镜像，可安全地在本地/服务器构建。

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
