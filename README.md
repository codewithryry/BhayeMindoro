# Bhaye Mindoro

**A trusted, offline-first fare and route guide for Mindoro, Philippines, built on verified data.**

Android-first transportation and fare guide for Mindoro. It runs as a website (installable PWA)
and as an Android app via Capacitor, from the same codebase.

> **Project status: paused.** The foundation is done: app shell, guest and login, database
> schema with Row Level Security, fare calculation, and offline cache layer. No real fare data
> has been added yet. See [VISION.md](VISION.md) for the goals and roadmap.

The MVP will help commuters:

- Find routes between places in Mindoro and the transport modes available (van, jeep, bus, tricycle, ferry)
- See estimated fares and travel times
- Check tricycle fares by municipality
- Apply the 20% student / senior citizen / PWD discount
- Find transport terminals
- See each fare's source, last-updated date, and effective date
- Report possible overcharging (anonymous, no account)
- Use the app offline with cached fare data

> Gabay lamang ang fare. Sundin ang official na taripa ng LGU o transport operator.

## Data rules

Only **verified** data goes in. Do not add made-up fares, ordinances, terminals, schedules,
operators, GPS coordinates, travel times, or source documents. Screens show empty states until
verified data exists.

Every fare shown to users must have a **source**, a **last updated** date, and an **effective date**.
The schema enforces this: `source_id` and `effective_date` are `NOT NULL` on `fares` and
`tricycle_fares`.

## Tech stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [Capacitor](https://capacitorjs.com) for the Android app (`com.bhaye.mindoro`)
- [Supabase](https://supabase.com) (Postgres + Row Level Security) as the source of truth
- [React Router](https://reactrouter.com) (`HashRouter`) and [Lucide](https://lucide.dev) icons
- IndexedDB as the local offline cache (works in browsers and the Android WebView)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) for the offline web app shell
- oxlint + Prettier

## Project structure

```text
index.html              Web entry (+ last-resort startup error fallback)
src/
  main.tsx              React root, ErrorBoundary, PWA registration (web only)
  App.tsx               Routes + guest/login gate
  index.css             Styles (mobile-first; tablet ≥640px, desktop sidebar ≥1024px)
  screens/              Welcome, Login, Dashboard, RouteSearch, Tricycle, Terminals,
                        Report, Account
  components/           AppLayout (sidebar / top bar / bottom bar), navigation.ts,
                        ui.tsx (shared UI), ErrorBoundary, ErrorFallback
  hooks/                useMunicipalities, useCacheStats
  lib/
    auth.tsx            AuthProvider: guest mode + Supabase email/password login
    supabase.ts         Safe, lazy Supabase client (null when not configured)
    reports.ts          Insert-only anonymous report submission
    fare/               Fare calculation (no UI code)
    cache/              Local cache: CacheStore interface, IndexedDB store, queries, pull
  types/                Database row types, fare/route/terminal types
  constants/            colors.ts, config.ts
public/                 Static files (favicon, PWA icon)
assets/                 Source icon images
android/                Capacitor Android project (committed)
capacitor.config.ts     appId, appName, webDir = dist
supabase/migrations/    Postgres schema, RLS, initial municipalities
```

## Routes and accounts

| Route         | Screen                                                      |
| ------------- | ----------------------------------------------------------- |
| `#/welcome`   | First launch: Mag-login or Magpatuloy bilang Guest          |
| `#/login`     | Login / Sign up (`?mode=signup`), Supabase email + password |
| `#/`          | Dashboard                                                   |
| `#/ruta`      | Hanap Ruta (`?from=&to=` from the dashboard quick search)   |
| `#/tricycle`  | Tricycle Calculator                                         |
| `#/terminals` | Mga Terminal                                                |
| `#/report`    | Report Fare Concern (anonymous, guests included)            |
| `#/account`   | Account, login, logout                                      |

- **Guest mode** gives access to every public feature. The choice is remembered on the device.
- **Login** is optional. It uses Supabase Auth (email + password) and the session persists
  across app launches. If Supabase isn't configured, login is disabled with a message and
  guest mode still works.
- In Supabase, enable the **Email** provider (Authentication → Providers). With "Confirm email"
  on, new users must confirm before logging in; the app tells them so.
- Accounts don't unlock extra features yet. Reports stay anonymous for everyone.

## Local development

Requirements: Node.js LTS and npm. For Android: Android Studio (includes the Android SDK) and JDK 21.

```sh
npm install
cp .env.example .env.local   # optional at first; fill in your Supabase values
npm run dev                  # http://localhost:5173
```

The app renders without Supabase configured. Features that need it (report submission) show a
friendly message instead.

## Commands

| Command               | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Vite dev server at http://localhost:5173      |
| `npm run build`       | Type-check and build to `dist/`               |
| `npm run preview`     | Serve the production build locally            |
| `npm run typecheck`   | TypeScript only                               |
| `npm run lint`        | oxlint                                        |
| `npm run format`      | Prettier                                      |
| `npm run cap:sync`    | `npm run build` then `npx cap sync`           |
| `npm run cap:android` | `npx cap open android` (opens Android Studio) |

## Android (Capacitor)

```sh
npm run build        # always build first; Capacitor copies dist/
npx cap sync         # copies dist/ into android/app/src/main/assets/public
npx cap open android # opens Android Studio, then press Run
```

Run `npm run build && npx cap sync` after every web change, or the Android app will show the
old build. From the command line (with the Android SDK installed):

```sh
cd android
./gradlew assembleDebug   # APK in android/app/build/outputs/apk/debug/
```

If Android Studio is installed in a non-default location, set `CAPACITOR_ANDROID_STUDIO_PATH`.

## Environment variables

Defined in `.env.local` (git-ignored). See [.env.example](.env.example).

| Variable                 | Description                                   |
| ------------------------ | --------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL                          |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon / publishable key, safe to ship |

`VITE_*` values are bundled into the app and visible to anyone. **Never** put the Supabase
`service_role` / secret key in the frontend or in this repository. Rebuild after changing them;
for Android, also run `npx cap sync`.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the project URL and anon key into `.env.local`.
3. Apply the migrations.

Migrations live in [supabase/migrations/](supabase/migrations/):

| File                                     | Contents                                                       |
| ---------------------------------------- | -------------------------------------------------------------- |
| `20261001000000_initial_schema.sql`      | Enums, tables, indexes, `updated_at` triggers, RLS policies    |
| `20261001000100_seed_municipalities.sql` | Calapan, Naujan, Pinamalayan, Puerto Galera (Oriental Mindoro) |

```sh
npx supabase init          # first time only; creates supabase/config.toml
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or paste each file, in order, into the Supabase SQL editor.

### Tables

`municipalities`, `routes`, `fares`, `tricycle_fares`, `terminals`, `fare_sources`, `reports`.

- `fares.discounted_fare` is **optional**. Leave it `NULL` and the app calculates the 20% discount
  from `regular_fare`. Fill it in only when the official source publishes its own discounted fare.
- `routes.estimated_travel_time` is in minutes and nullable until verified.
- `terminals.latitude/longitude` are nullable. Store them only when verified.

### Security (Row Level Security)

- **Public read:** `municipalities`, `fare_sources`, `terminals`, `tricycle_fares`, active
  `routes`, and `fares` of active routes.
- **No public writes** to transportation data. Manage data with the service role (Supabase
  dashboard or a server you control) until admin auth exists.
- **Reports:** anyone can insert, but only with `status = 'pending'`. Public clients cannot read,
  update, or delete reports.
- No user authentication yet. No rate limiting on anonymous reports yet.

## Fare calculation

[src/lib/fare/calculate.ts](src/lib/fare/calculate.ts) holds the fare logic, kept separate from
the UI. It calculates in whole centavos and rounds half-up to the nearest centavo.

```ts
calculateDiscountedFare(100, 'regular'); // 100
calculateDiscountedFare(100, 'student'); // 80  (same for 'senior' and 'pwd')
resolvePayableFare(regular, officialDiscountedFareOrNull, discountType);
formatPeso(80); // "₱80.00"
```

## Offline architecture

```text
Supabase  →  local cache (CacheStore)  →  UI
```

- Screens read only through `CacheStore` (`src/lib/cache`), never from Supabase directly.
- `indexedDbStore.ts` implements it with IndexedDB, for both web and the Android WebView.
- To use Capacitor SQLite on Android later, add a SQLite `CacheStore` and return it from
  `getCacheStore()` when `Capacitor.isNativePlatform()` is true. The UI does not change.
- `pull.ts` replaces each cached table with a fresh copy from Supabase atomically. It is
  **not wired into the app yet**, so the municipality pickers stay empty until it is.
- On the website, a service worker (vite-plugin-pwa, production builds only) caches the app
  shell. Inside Capacitor the files are already bundled in the APK, so it is not registered there.

## Error handling

- `ErrorBoundary` catches render errors and shows "May problema sa pag-load ng app." with a
  retry button. Details go to the console only.
- `index.html` has a last-resort fallback for errors before React mounts (for example a failed
  bundle load), so the app never shows an unexplained white screen.

## Current scope

Done (foundation):

- Website and Capacitor Android project from one Vite + React codebase
- Responsive app shell: bottom bar on mobile, sidebar on desktop
- Welcome, login/sign-up, guest mode, dashboard, route search, tricycle calculator, terminals,
  report form, and account (empty states,
  no made-up data)
- Supabase schema, RLS, and the initial municipalities
- Fare calculation with the 20% discount
- Local cache layer (IndexedDB) and the Supabase pull function
- Anonymous report submission

Not yet built:

- Running the Supabase → cache sync (scheduling, delta sync, connectivity handling)
- Route search against cached data
- Terminal listing and map
- Verified fare data entry and an admin workflow
- Report spam protection
- Custom app icon and splash screen (the current icons are placeholders)
