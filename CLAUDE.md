# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

IVORY (ivory.lk) — a single-page React storefront demo for a minimalist black & white activewear/streetwear brand, built as a Google AI Studio app. It's a fully client-side e-commerce UI (browse, cart, checkout) with a simulated Sri Lankan payment gateway (LankaPay). There is no backend: all "APIs" (payment, OTP, order placement) are frontend timeouts/`Math.random()` simulations, and product data is a static in-memory array.

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

## Architecture

**Everything is client-side state in `App.tsx`.** There is no router (no react-router) — `App.tsx` holds an `activePage: ActivePage` string (`'home' | 'collection' | 'product' | 'cart' | 'checkout' | 'static' | 'search'`, see `src/types.ts`) and conditionally renders one page component. Navigation is done by calling `setActivePage(...)` (plus manual `window.scrollTo`) rather than URL changes — there are no real routes/deep links.

**All app state lives in `App.tsx` and is prop-drilled down** — cart items, discount code/rate, selected product, search query, and page/category/activity filters are all `useState` in `App.tsx` and passed as props through `Header`, `Footer`, `CartDrawer`, and every page component. There is no context provider or state management library. When adding a feature that needs cross-page state, add it here and thread it through props like the existing state.

**Cart and promo state persist to `localStorage`** under fixed keys (`ivory_cart`, `ivory_discount_rate`, `ivory_discount_code`), synced via `useEffect` in `App.tsx`. Cart items are keyed by `` `${product.id}-${size}-${color.name}` `` so the same product in a different size/color is a distinct line item (see `handleAddToCart` in `src/App.tsx`).

**Product catalog is static data, not an API.** `src/data/products.ts` exports `PRODUCTS`, `CATEGORIES`, `ACTIVITIES`, `PROMO_TILES`, and `FAQS` as hardcoded arrays (Unsplash image URLs). Filtering/search pages (`Collection.tsx`, `SearchPage.tsx`) filter this array client-side — there's no fetch layer to extend, just array operations.

**Checkout is a 3-step wizard** (`information` → `shipping` → `payment`) implemented as local state (`currentStep`) inside `src/pages/Checkout.tsx`, which computes subtotal/shipping/tax/total itself. Order placement (`executeOrderPlacement`) builds an `Order` object client-side and never sends it anywhere — "success" just sets local state and clears the cart.

**LankaPay is a fully simulated payment gateway**, not a real integration. `src/components/LankaPayModal.tsx` implements its own internal step machine (`details → otp → processing → success/failed`) with a fake generated OTP (bypassable with `123456`), `setTimeout`-based "processing," and a `Math.random() > 0.05` chance of simulated failure. When touching payment flows, preserve this sandbox/demo framing (banners explicitly say "SANDBOX") rather than treating it as a real payment integration.

**Styling is Tailwind v4** (`@tailwindcss/vite` plugin, `@import "tailwindcss"` in `src/index.css`, no `tailwind.config.js`) with a strict black/white/mono design system — `font-sans` (Inter) for body text, `font-mono` (JetBrains Mono) for uppercase labels/tags, and `rounded-none` used pervasively to keep hard edges. Follow this convention (uppercase tracked mono micro-labels + hard-edged black/white blocks) rather than introducing rounded corners or color accents.

`@/*` resolves to the repo root (see `tsconfig.json` paths and `vite.config.ts` alias), not to `src/` — e.g. `@/src/data/products`.

The `express`/`dotenv`/`tsx` dependencies and `GEMINI_API_KEY`/`APP_URL` env vars (`.env.example`) are AI Studio platform scaffolding; no server code currently exists in the repo (`npm run clean` references a `server.js` that isn't present) and no `@google/genai` calls exist in `src/` yet.
