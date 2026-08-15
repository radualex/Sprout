# 🌱 Sprout — Plant Tracker

A mobile-first PWA for tracking houseplants: identify species with your phone camera, and get
reminders when each plant needs watering, fertilising or repotting.

## Features

- **📷 Camera identification** — snap a leaf or flower; species recognition via the
  [PlantNet API](https://my.plantnet.org) with ranked matches and confidence scores.
- **🗓 Care engine** — per-plant water / fertilise / repot schedules. Identified species
  auto-fill sensible defaults (a snake plant waters every 18 days, a fern every 4).
- **🔔 Reminders** — notifications when care is due (at most one per task per day), checked on
  app open, on focus, hourly while open, and via periodic background sync on installed
  Chromium/Android PWAs.
- **📱 Installable PWA** — offline shell caching, home-screen icon, standalone display.
- **🔒 Local-first** — all data (including photos) lives on-device in IndexedDB. No backend.

## Run it

```sh
bun install
bun run dev      # http://localhost:3000
bun run build    # production build in build/
```

To use it on your phone, serve `build/` over HTTPS (camera and notifications require a secure
context), open it in the browser, and **Add to Home Screen**.

## Setup

- **Real plant recognition**: create a free account at [my.plantnet.org](https://my.plantnet.org),
  copy your API key, paste it in **Settings → Plant recognition**.
- **Notifications**: enable in **Settings → Care reminders**. On iOS (16.4+) you must install the
  app to the home screen first; web push in Safari only works from installed web apps.

## Architecture

| Piece          | Where                              | Notes                                                        |
| -------------- | ---------------------------------- | ------------------------------------------------------------ |
| Data model     | `src/types.ts`                   | `Plant` with `care` intervals + `lastCare` timestamps  |
| Storage        | `src/js/services/db/`            | Thin IndexedDB wrapper; photos stored as Blobs in the record |
| Care engine    | `src/js/helpers/care/`           | Due-date math, species → default schedule lookup            |
| Identification | `src/js/services/identify/`      | PlantNet client                                              |
| Notifications  | `src/js/services/notifications/` | Permission, de-duplicated due-task notifications, watcher    |
| Service worker | `public/sw.js`                   | Offline cache, notification click, periodic sync hook        |
| UI             | `src/js/containers/`             | My Plants / Identify / Care / Detail / Settings screens      |

Known limitation: this is a serverless PWA, so reminders fire when the app is open, focused, or
(on Chromium/Android installed PWAs) via periodic background sync. Fully reliable push while the
app is closed — especially on iOS — would need a small push server (Web Push/VAPID); the service
worker is already structured to accept that.
