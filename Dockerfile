# syntax=docker/dockerfile:1

# ---------- 依赖安装 ----------
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- 构建 ----------
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* 变量在构建时内联，需通过 --build-arg 传入
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_GISCUS_REPO=
ARG NEXT_PUBLIC_GISCUS_REPO_ID=
ARG NEXT_PUBLIC_GISCUS_CATEGORY=
ARG NEXT_PUBLIC_GISCUS_CATEGORY_ID=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GISCUS_REPO=$NEXT_PUBLIC_GISCUS_REPO
ENV NEXT_PUBLIC_GISCUS_REPO_ID=$NEXT_PUBLIC_GISCUS_REPO_ID
ENV NEXT_PUBLIC_GISCUS_CATEGORY=$NEXT_PUBLIC_GISCUS_CATEGORY
ENV NEXT_PUBLIC_GISCUS_CATEGORY_ID=$NEXT_PUBLIC_GISCUS_CATEGORY_ID
ENV NEXT_TELEMETRY_DISABLED=1
# 限制构建并发与内存，避免小内存服务器 OOM
ENV NEXT_BUILD_WORKERS=2
ENV NODE_OPTIONS=--max-old-space-size=1024

RUN pnpm build

# ---------- 运行 ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# standalone 服务端
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 静态资源（standalone 不包含，需手动拷贝）
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# content 由 volume 挂载，这里保留一个可写的初始副本（含个人占位数据与博客文章）
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
# data 由 volume 挂载（运行时写入 personal.local.json / views.json），无需打进镜像，
# 但必须显式创建并赋权给 nextjs，否则命名卷首次挂载时目录属主是 root，会导致写入失败
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
