# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

IVORY (ivory.lk) — a React storefront for a minimalist black & white activewear/streetwear brand, originally built as a Google AI Studio app, now backed by a real Firebase project (Firestore + Auth + Storage). It has two independent apps sharing one Vite build: the public storefront (browse, cart, checkout, simulated LankaPay/bank-transfer payment) and an `/admin` CMS portal (products, content, orders, staff) that both read/write the same Firestore database. `src/data/products.ts` and `src/data/fallbackContent.ts` are the offline fallback dataset (also the source data for `firebase/seed.ts`), not the source of truth at runtime — see Architecture below.

## Commands

```
npm install        # install dependencies
npm run dev         # start Vite dev server on port 3000 (0.0.0.0)
npm run build        # production build (vite build)
npm run preview       # preview the production build
npm run lint         # typecheck only — tsc --noEmit (no ESLint configured)
npm run clean         # rm -rf dist server.js
```

There is no test runner/framework configured in this repo. `npm run lint` (`tsc --noEmit`) is the only automated check — run it after making changes.

Firebase is configured via `VITE_FIREBASE_*` vars in `.env.local` (see `firebase/README.md` for one-time project setup: create the project, deploy `firestore.rules`/`storage.rules`, run `npm run seed` against a service-account key, then promote your first account to `admin` via the Firestore console). Without these env vars the app still runs, silently falling back to bundled static data (see Architecture).

## Architecture

**Two apps, one router split.** `src/main.tsx` wraps everything in `SiteContentProvider` and a single `react-router-dom` `BrowserRouter` with exactly two routes: `/admin/*` → `AdminApp`, `/*` → `App` (the storefront). `react-router-dom` is *only* used for this top-level split and for routing between admin sections (`src/admin/AdminApp.tsx`'s nested `<Routes>`) — the storefront itself has no real routes.

**Storefront navigation is client-side state, not routing.** Inside `App` (`src/App.tsx`), an `activePage: ActivePage` string (`'home' | 'collection' | 'product' | 'cart' | 'checkout' | 'static' | 'search'`, see `src/types.ts`) is conditionally rendered as one page component. Navigation is done by calling `setActivePage(...)` (plus manual `window.scrollTo`), not URL changes — there are no deep links into storefront pages. **All storefront page state lives in `App.tsx` and is prop-drilled down** — cart items, discount code/rate, selected product, search query, and page/category/activity filters are all `useState` in `App.tsx`, passed as props through `Header`, `Footer`, `CartDrawer`, and every page component. There is no state management library for this layer.

**Site content is fetched from Firestore and provided via context, with a static fallback.** `SiteContentContext` (`src/context/SiteContentContext.tsx`) wraps both the storefront and admin apps. On mount it calls `fetchSiteContent()` (`src/lib/api.ts`), which fires one parallel batch of Firestore reads (products, categories, activities, promo tiles, FAQs, static pages, header/footer/home-hero content, settings, promo codes) and exposes the result via `useSiteContent()`. If the `VITE_FIREBASE_*` vars are unset (`isFirebaseConfigured` in `src/lib/firebase.ts` is false) or the fetch throws, it falls back to the bundled static data in `src/data/products.ts` + `src/data/fallbackContent.ts` so the storefront still renders. Every mutation made from the admin portal is followed by calling `refresh()` from this context so the change is reflected immediately without a page reload.

**`src/lib/api.ts` is the entire data layer** — one file exporting a CRUD function per collection for both the read side (`fetchSiteContent`) and every admin-portal write (`createProduct`, `updateSettings`, `upsertPromoCode`, `uploadImage`, etc.). Firestore stores plain camelCase JSON, so unlike a SQL row there's almost no field mapping — docs are mostly spread directly into/out of the app types, keyed by `sortOrder` for ordered collections. There's no fetch/API abstraction beyond this file — add new backend operations here.

**Admin portal (`src/admin/`) is a role-gated CMS.** `AdminAuthContext` (`src/admin/AdminAuthContext.tsx`) wraps Firebase Auth (email/password) and loads the signed-in user's `profiles/{uid}` document for their `role` (`'admin' | 'editor'`, see `src/types.ts`). The first time a user signs in, `ensureProfile()` (`src/lib/api.ts`) creates that doc for them defaulted to `editor` — Firestore rules only allow a user to create their *own* profile doc, and only with role `editor`, so this can't be used to self-promote. `AdminApp.tsx` gates all `/admin/*` routes behind `RequireAuth` (any signed-in staff) except the `staff` section, which is further gated behind `RequireAdmin` (role must be `admin`). New staff logins are created manually in the Firebase console (no self-service signup); promotion to `admin` happens by hand in the Firestore console or via the Staff section once at least one admin exists. `firestore.rules` mirrors this at the database level: public read + any-authenticated-user write on content collections, public insert on `orders` (read/manage requires auth), and `profiles` writes gated by the `isAdmin()` rule helper.

**Not everything is CMS-editable.** A few homepage marketing sections (mid banners, triple-CTA row, secondary video banner) and the Contact page's store-locator list are still hardcoded in `src/pages/Home.tsx` / `src/pages/StaticPages.tsx` — see `firebase/README.md` ("What's editable vs. what isn't") before assuming a piece of homepage copy lives in Firestore.

**Cart and promo state persist to `localStorage`** (client-only, unrelated to Firebase) under fixed keys (`ivory_cart`, `ivory_discount_rate`, `ivory_discount_code`), synced via `useEffect` in `App.tsx`. Cart items are keyed by `` `${product.id}-${size}-${color.name}` `` so the same product in a different size/color is a distinct line item (see `handleAddToCart` in `src/App.tsx`).

**Checkout is a 3-step wizard** (`information` → `shipping` → `payment`) implemented as local state (`currentStep`) inside `src/pages/Checkout.tsx`, which computes subtotal/shipping/tax/total itself. On placement it calls `insertOrder()` (`src/lib/api.ts`) so the order is genuinely persisted to the Firestore `orders` collection (visible in the admin Orders section) — but the *payment itself* is still fully simulated (see next point); nothing charges a real card or sends a real bank transfer.

**LankaPay is a fully simulated payment gateway**, not a real integration. `src/components/LankaPayModal.tsx` implements its own internal step machine (`details → otp → processing → success/failed`) with a fake generated OTP (bypassable with `123456`), `setTimeout`-based "processing," and a `Math.random() > 0.05` chance of simulated failure. When touching payment flows, preserve this sandbox/demo framing (banners explicitly say "SANDBOX") rather than treating it as a real payment integration.

**Styling is Tailwind v4** (`@tailwindcss/vite` plugin, `@import "tailwindcss"` in `src/index.css`, no `tailwind.config.js`) with a strict black/white/mono design system — `font-sans` (Inter) for body text, `font-mono` (JetBrains Mono) for uppercase labels/tags, and `rounded-none` used pervasively to keep hard edges. Follow this convention (uppercase tracked mono micro-labels + hard-edged black/white blocks) rather than introducing rounded corners or color accents. Both the storefront and the admin portal share this same design system.

`@/*` resolves to the repo root (see `tsconfig.json` paths and `vite.config.ts` alias), not to `src/` — e.g. `@/src/data/products`.

The `express`/`dotenv` dependencies and `GEMINI_API_KEY`/`APP_URL` env vars (`.env.example`) are leftover AI Studio platform scaffolding; no server code currently exists in the repo (`npm run clean` references a `server.js` that isn't present) and no `@google/genai` calls exist in `src/` yet despite the dependency being installed. `tsx` is used for real, though: `npm run seed` runs `firebase/seed.ts` (a Node script using `firebase-admin`, separate from the browser-side `firebase` SDK used everywhere else) to populate Firestore from `src/data/products.ts` + `src/data/fallbackContent.ts`.
