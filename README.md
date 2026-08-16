# 🌱 Sprout — Plant Tracker

A mobile-first PWA for tracking houseplants: identify species with your phone camera, and get
reminders when each plant needs watering, fertilising or repotting.

## Features

- **👤 Accounts** — sign in with Google or email/password. Your plants are synced to your account
  and available across devices.
- **📷 Camera identification** — snap a leaf or flower; species recognition via the
  [PlantNet API](https://my.plantnet.org) with ranked matches and confidence scores.
- **🗓 Care engine** — per-plant water / fertilise / repot schedules. Identified species
  auto-fill sensible defaults (a snake plant waters every 18 days, a fern every 4).
- **🔔 Reminders** — notifications when care is due (at most one per task per day), checked on
  app open, on focus, hourly while open, and via periodic background sync on installed
  Chromium/Android PWAs.
- **📱 Installable PWA** — home-screen icon, standalone display, notification click handling.

## Run it

```sh
bun install
cp .env.example .env.local   # then fill in secrets (see below)
bun run db:up                # start Postgres (Docker)
bun run db:migrate           # create tables
bun run dev                  # http://localhost:3000
```

Full dockerized dev (app + db in two containers) is also available:

```sh
docker compose up -d --build # builds the dev image, starts db + next dev
bun run build                # production build (inside the container: docker compose run app bun run build)
```

To use it on your phone, run the app over HTTPS (camera and notifications require a secure
context), open it in the browser, and **Add to Home Screen**.

## Setup

Copy `.env.example` to `.env.local` and set:

| Variable | What for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. The default matches the `db` compose service. |
| `BETTER_AUTH_SECRET` | Signs session cookies. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | Base URL (`http://localhost:3000` in dev). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth ([console.cloud.google.com](https://console.cloud.google.com/apis/credentials)). Redirect URI: `http://localhost:3000/api/auth/callback/google`. |
| `PLANTNET_API_KEY` | Optional shared key for plant recognition. If empty, each user adds their own key in **Settings → Plant recognition**. |

- **Real plant recognition**: create a free account at [my.plantnet.org](https://my.plantnet.org),
  copy your API key, paste it in **Settings → Plant recognition**.
- **Notifications**: enable in **Settings → Care reminders**. On iOS (16.4+) you must install the
  app to the home screen first; web push in Safari only works from installed web apps.

## Architecture

| Piece | Where | Notes |
| --- | --- | --- |
| Framework | `src/app/` | Next.js 16 App Router (RSC + server actions); pages + API routes in one deployable |
| Data model | `src/js/types.ts` | `Plant` with `care` intervals + `lastCare` timestamps |
| Database | `src/js/lib/db/` | Postgres via Drizzle ORM; photos stored as `bytea` |
| Auth | `src/js/lib/auth.ts` | Better Auth (Google OAuth + email/password) with Drizzle adapter |
| Care engine | `src/js/helpers/care/` | Due-date math, species → default schedule lookup |
| Identification | `src/app/api/identify/` | Server-side PlantNet proxy (key stays out of the browser) |
| Notifications | `src/js/services/notifications/` | Permission, de-duplicated due-task notifications, watcher |
| Service worker | `public/sw.js` | Cache-first for static assets only; never caches documents |
| UI | `src/js/containers/` | My Plants / Identify / Care / Detail / Settings screens |
| Local dev | `docker-compose.yml` | `db` (Postgres) + `app` (Next dev) containers |

Known limitation: this is a serverless PWA, so reminders fire when the app is open, focused, or
(on Chromium/Android installed PWAs) via periodic background sync. Fully reliable push while the
app is closed — especially on iOS — would need Web Push/VAPID; the service worker is already
structured to accept that.

---

## Architecture Decision Records

Numbered records of the significant architectural decisions, written as they were made. Each entry
follows [Michael Nygard's ADR format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions):
*Context*, *Decision*, *Consequences*, plus the rationale and alternatives considered. Records are
immutable; when a decision is revisited, a new record supersedes it.

### ADR-0001 — Next.js full-stack over a separate backend or BaaS

**Status:** Accepted

**Context:** Sprout began as a Vite + React PWA with IndexedDB and no backend. The goal of adding a
backend was persistence, sync across devices, and (eventually) multi-user accounts. The team wanted
to *learn Next.js* as part of this work, and to keep the project as lean as possible.

**Decision:** Migrate the existing PWA in place to Next.js 16 (App Router) and serve pages, API
routes, server actions, and auth from a single Next.js application.

**Rationale & alternatives considered:**
- *Spring Boot* — would add a second language, a second build pipeline, and a second deployable for
  what is essentially plant CRUD. The opposite of lean.
- *Supabase* — objectively the leanest shipping path (hosted Postgres + auth + RLS, zero server
  code), but it removes exactly the backend layer we set out to learn.
- *Next.js* — one language (TypeScript) end-to-end, the smallest step from the existing React PWA,
  and the requested learning goal.

**Consequences:** Frontend, backend, and auth live in one process (FE + BE + auth are not separate
containers). Route handlers exist only for non-HTML concerns (auth, PlantNet proxy, photo bytes,
the notification watcher's feed). Data fetching follows the RSC/server-action model rather than
client-side `useState` + `refresh()`.

### ADR-0002 — Postgres with Drizzle ORM

**Status:** Accepted

**Context:** The app needs a relational store for plants and auth tables, with per-user data
isolation. A hosted serverless Postgres (Neon) is the planned production target; the app is not yet
deployed.

**Decision:** Use Postgres with the [Drizzle](https://orm.drizzle.team) ORM. For local development,
run Postgres 16 in Docker (see ADR-0008); production will use Neon with a one-file driver swap
(`pg` → `@neondatabase/serverless`).

**Rationale & alternatives considered:**
- *Neon* — serverless Postgres, no server to manage, free tier; chosen as the eventual host, not the
  dev environment.
- *Prisma* — heavier codegen and runtime layer with more magic than we want.
- *SQLite* — no network access from a serverless host and a poor multi-device story.
- *Drizzle* — thin, SQL-shaped TypeScript with a first-party Better Auth adapter, and schema that
  composes cleanly with the generated auth tables.

**Consequences:** Migrations via `drizzle-kit` (`db:generate` / `db:migrate`). The `bytea` photo
column needs a small custom type because Drizzle's pg driver has no built-in binary column
(see ADR-0004). Queries are per-user scoped from day one.

### ADR-0003 — Better Auth for authentication

**Status:** Accepted

**Context:** Multi-user accounts are required, with Google sign-in and email/password both
requested. Auth must be self-hosted (no proprietary cloud), free, and understandable — not a black
box.

**Decision:** Use [Better Auth](https://better-auth.com) with the Drizzle adapter and the Next.js
`nextCookies` plugin. Sign-in methods: Google OAuth and email/password. Session validation is
enforced in server components and server actions (`requireUser`); the Next proxy layer only does an
optimistic cookie check for redirects.

**Rationale & alternatives considered:**
- *Auth.js v5* — in perpetual beta with rougher DX.
- *Clerk* — paid, and hides the auth fundamentals we wanted to learn.
- *Hand-rolled sessions* — a security rabbit hole beyond the learning goal.
- *Better Auth* — TypeScript-first, self-hosted, free, official App Router + Drizzle support, and it
  exposes the mechanics (tables, cookies, callbacks) so they stay learnable.

**Consequences:** Auth tables (`user`, `session`, `account`, `verification`) are generated by
`bunx @better-auth/cli generate` into `src/js/lib/db/auth-schema.ts` and are not hand-edited. The
proxy (`src/proxy.ts`) performs cookie-only checks (no DB queries — a static matcher constant is
required by Turbopack); the real session check lives in `requireUser()` inside every protected
component/action/route.

### ADR-0004 — Photos stored as Postgres `bytea`

**Status:** Accepted

**Context:** Each plant has at most one photo, captured by the phone camera. Previously photos were
Blobs inside IndexedDB records. With a server database, the photo needs a storage home that is
account-scoped and backed up with the rest of the data.

**Decision:** Store photo bytes in the `plants.photo` column as Postgres `bytea`, served through the
authenticated route `/plants/[id]/photo`.

**Rationale & alternatives considered:**
- *Object storage (S3/Vercel Blob)* — a second system to secure, bill, and integrate; overkill at
  one small photo per plant.
- *bytea* — one system to secure and back up; the schema can later swap the photo route's source to
  object storage without touching the data model.

**Consequences:** Photo payloads travel inside server actions; the action body limit is raised to
5 MB (`experimental.serverActions.bodySizeLimit`). Drizzle's pg driver has no binary column, so
`schema.ts` defines a tiny `customType` mapping `bytea` ↔ `Buffer` (node-postgres converts natively).

### ADR-0005 — Server Components + Server Actions over client fetching

**Status:** Accepted

**Context:** The old SPA kept a `plants` array in state and re-fetched IndexedDB after every change.
With a server DB and per-user scoping, every mutation needed to re-sync client and server state.

**Decision:** Fetch data in Server Components (per-user queries) and mutate via Server Actions
(`createPlant`, `updatePlant`, `markCareDone`, `deletePlant`) with `revalidatePath` to refresh the
cache. Client components receive data as props and call actions directly.

**Rationale & alternatives considered:**
- *REST API + client fetching* — doubles the code (endpoints + client state sync) for no benefit in
  a same-origin app.
- *RSC + actions* — data is fetched where it is rendered; mutations revalidate the UI for free; the
  old `useState` + `refresh()` boilerplate disappears.

**Consequences:** Server components re-validate sessions on every request; the notification watcher
reads plants through the session-scoped `GET /api/plants` route handler (a plain fetch from the
service worker context). Editing state (form fields) stays client-side; persistence is server-side.

### ADR-0006 — Auth-aware service worker caching

**Status:** Accepted

**Context:** The original service worker used a network-first, cache-everything strategy for all
same-origin GETs. Once the app has authenticated pages, that would persist per-user HTML and API
responses into the cache and leak them across sessions.

**Decision:** The service worker (`public/sw.js`, cache `sprout-v2`) caches **only** a static
allowlist of assets (icons, manifest) cache-first. Navigation/document requests are never cached;
API responses are never cached.

**Rationale & alternatives considered:**
- *Cache everything* (original) — leaks user-specific data; rejected.
- *Static allowlist only* — offline coverage is reduced to shell assets, which is the correct
  trade-off for an authenticated app.

**Consequences:** The app is no longer fully offline-capable. Notification click handling and
periodic background sync behaviour are unchanged.

### ADR-0007 — Drop IndexedDB; start fresh

**Status:** Accepted

**Context:** IndexedDB held all plant data locally. Introducing accounts and a server database makes
the server the source of truth; the old data was personal/test data owned by no account.

**Decision:** Delete the IndexedDB layer and start with an empty database. No data-import tooling.

**Rationale & alternatives considered:**
- *One-off import* — costs real effort to match legacy Blob photos and `lastCare` state to accounts,
  for data that was never meaningful to preserve.
- *Start fresh* — the cheapest path, and the DB schema is clean from day one.

**Consequences:** Existing test data is gone. Offline-first sync is consciously deferred; the PWA
requires a connection for data.

### ADR-0008 — Dockerized local development

**Status:** Accepted

**Context:** The dev environment previously required a hand-installed toolchain (Node, Bun,
Postgres). Teams and machines drift.

**Decision:** Run local development in Docker Compose with two services: `db` (Postgres 16) and
`app` (Next dev with hot reload via bind mounts). The Dockerfile is multi-stage with `dev` and
`prod` targets, so the same file serves local dev and a future deploy.

**Rationale & alternatives considered:**
- *Native local installs* — environment drift between machines; rejected.
- *One container per concern* — the app, auth, and backend are one Next.js process (ADR-0001), so
  four containers would be needless orchestration overhead.
- *Docker Compose (chosen)* — one-command reproducible environment; `db` is reachable from the app
  by the compose service name, not `localhost`.

**Consequences:** macOS volume-mount hot reload can be slower than native dev. `DATABASE_URL` inside
compose points at `postgres://sprout:sprout@db:5432/sprout`, while local `bun run dev` uses
`localhost`. Seeded values for local-only credentials live in `docker-compose.yml`.
