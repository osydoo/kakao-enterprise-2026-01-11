# syntax=docker/dockerfile:1.6

# Base Stage
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Deps Stage
FROM base AS deps

RUN corepack enable pnpm
RUN pnpm config set store-dir ~/.pnpm-store
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store \
    pnpm install --frozen-lockfile

# Builder Stage
FROM base AS builder

RUN corepack enable pnpm
RUN pnpm config set store-dir ~/.pnpm-store

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store \
    pnpm run build

# Runner Stage
FROM alpine AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
