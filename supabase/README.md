# IVORY backend setup (Supabase)

One-time setup so the storefront and admin portal (`/admin`) share a live database.
No server to install or maintain — everything below happens in the Supabase dashboard
(free tier, no credit card).

## 1. Create the project

1. Go to https://supabase.com → sign up / sign in → **New project**.
2. Pick any name/region, set a database password (save it somewhere safe), create.
3. Wait ~1–2 minutes for the project to finish provisioning.

## 2. Run the schema

1. In the project, open **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/schema.sql`, click **Run**.
3. New query again → paste the entire contents of `supabase/seed.sql`, click **Run**.
   This fills every table with the site's current copy (products, header/footer text,
   About/Terms/Privacy pages, FAQs, settings) so the storefront looks unchanged.

## 3. Get your API keys

**Project Settings → API.** Copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

Put both in `.env.local` in the project root (create the file if it doesn't exist):

```
VITE_SUPABASE_URL="https://xxxxxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="ey..."
```

Restart `npm run dev` after adding these.

## 4. Create your first admin login

The admin portal uses regular Supabase email/password accounts. Every new account
defaults to the `editor` role — you promote the first one to `admin` manually:

1. **Authentication → Users → Add user** (top right). Enter an email + password
   for yourself (email confirmation can be left off for internal staff accounts).
2. Back in **SQL Editor**, run (swap in the email you just used):
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Go to `/admin` on the running site and sign in with that email/password.

Once you're an admin, use the **Staff** section in the portal to promote/demote
other accounts. To add a new staff member: create their login the same way (step 1
above — Authentication → Add user), then set their role from the **Staff** screen.
(A self-service "invite" button isn't possible from a pure frontend without exposing
a secret key to the browser, so new logins are created here, once, per person.)

## 5. Confirm image uploads work

Schema.sql already created a public `media` storage bucket with the right policies —
nothing more to do. Product/site images uploaded from the admin portal land there
automatically.

## What's editable vs. what isn't

Everything in the **Products, Categories & Activities, Home hero, Promo tiles,
Header, Footer, About/Terms/Privacy pages, FAQs, Settings (WhatsApp number, bank
details, shipping, tax, promo codes), Orders, and Staff** sections is stored in
Supabase and editable from `/admin`. A few homepage marketing sections (the mid
banners, the triple-CTA row, the secondary video banner) and the Contact page's
store-locator list are still hardcoded in `src/pages/Home.tsx` / `StaticPages.tsx` —
they weren't part of the agreed admin scope, but can be moved into the CMS later
the same way the rest was.
