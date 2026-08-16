# syntax=docker/dockerfile:1

# ── Base ────────────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS base
WORKDIR /app

# ── Dev ─────────────────────────────────────────────────────────────────────────
# Local dev: compose bind-mounts src/public/config so HMR works; node_modules
# stays inside the image to avoid host/container native-binary drift.
FROM base AS dev
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["bun", "run", "dev"]

# ── Prod ────────────────────────────────────────────────────────────────────────
FROM base AS build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/next-env.d.ts ./next-env.d.ts
EXPOSE 3000
CMD ["bun", "run", "start"]
