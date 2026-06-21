# 🌱 Sprout — Plant Tracker

A mobile-first PWA for tracking houseplants: identify species with your phone camera, and get
reminders when each plant needs watering, fertilising or repotting.

## Features

- **📷 Camera identification** — snap a leaf or flower; species recognition via the
  [PlantNet API](https://my.plantnet.org) with ranked matches and confidence scores. Without an
  API key the app runs in a clearly-labelled demo mode.
- **🗓 Care engine** — per-plant water / fertilise / repot schedules. Identified species
  auto-fill sensible defaults (a snake plant waters every 18 days, a fern every 4).
- **🔔 Reminders** — notifications when care is due (at most one per task per day), checked on
  app open, on focus, hourly while open, and via periodic background sync on installed
  Chromium/Android PWAs.
- **📱 Installable PWA** — offline shell caching, home-screen icon, standalone display.
- **🔒 Local-first** — all data (including photos) lives on-device in IndexedDB. No backend.

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

To use it on your phone, serve `dist/` over HTTPS (camera and notifications require a secure
context), open it in the browser, and **Add to Home Screen**.

## Setup

- **Real plant recognition**: create a free account at [my.plantnet.org](https://my.plantnet.org),
  copy your API key, paste it in **Settings → Plant recognition**.
- **Notifications**: enable in **Settings → Care reminders**. On iOS (16.4+) you must install the
  app to the home screen first; web push in Safari only works from installed web apps.
- **Try it quickly**: **Settings → Sample data** adds three example plants with staggered
  schedules so the Care tab and badges have something to show.

## Architecture

| Piece | Where | Notes |
|---|---|---|
| Data model | `src/types.ts` | `Plant` with `care` intervals + `lastCare` timestamps |
| Storage | `src/db.ts` | Thin IndexedDB wrapper; photos stored as Blobs in the record |
| Care engine | `src/care.ts` | Due-date math, species → default schedule lookup |
| Identification | `src/identify.ts` | PlantNet client + demo fallback |
| Notifications | `src/notifications.ts` | Permission, de-duplicated due-task notifications, watcher |
| Service worker | `public/sw.js` | Offline cache, notification click, periodic sync hook |
| UI | `src/components/` | My Plants / Identify / Care / Detail / Settings screens |

Known limitation: this is a serverless PWA, so reminders fire when the app is open, focused, or
(on Chromium/Android installed PWAs) via periodic background sync. Fully reliable push while the
app is closed — especially on iOS — would need a small push server (Web Push/VAPID); the service
worker is already structured to accept that.
