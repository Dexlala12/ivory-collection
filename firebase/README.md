# IVORY backend setup (Firebase)

One-time setup so the storefront and admin portal (`/admin`) share a live Firebase
project (Firestore + Auth + Storage). Free Spark plan — no billing required.

## 1. Create the project

1. Go to https://console.firebase.google.com → **Add project** → give it a name → create.
2. Google Analytics is optional — skip it, it isn't used here.

## 2. Register a Web app

1. In the project overview, click the **`</>`** (Web) icon → give it a nickname → **Register app**.
2. Copy the `firebaseConfig` values shown. Put them in `.env.local` in the project root
   (create the file if it doesn't exist):

```
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

Restart `npm run dev` after adding these.

## 3. Enable Authentication

1. **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password**.

## 4. Create Firestore

1. **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** (the rules below replace the defaults) and a nearby region.

## 5. Enable Storage

1. **Build → Storage → Get started**, keep the default bucket, **production mode**.

## 6. Deploy the security rules

The repo ships `firestore.rules` and `storage.rules` (public read on storefront content,
staff-only writes — mirrors the app's access model exactly). Easiest path is the Firebase CLI:

```
npx firebase-tools login
npx firebase-tools use --add        # pick the project you just created
npx firebase-tools deploy --only firestore:rules,storage
```

(No CLI? Paste the contents of each file into **Firestore Database → Rules** and
**Storage → Rules** in the console instead, and publish.)

## 7. Seed the database

1. **Project settings (gear icon) → Service accounts → Generate new private key.**
   Save the downloaded file as `firebase/serviceAccountKey.json` (already gitignored —
   never commit it).
2. From the project root:
   ```
   npm run seed
   ```
   This fills every collection with the site's current copy (products, header/footer
   text, About/Terms/Privacy pages, FAQs, settings) so the storefront looks unchanged.

## 8. Create your first admin login

The admin portal uses regular Firebase email/password accounts. Every account that
signs in at `/admin` for the first time gets a `profiles/{uid}` document created
automatically with role `editor` — you promote the first one to `admin` manually:

1. **Authentication → Users → Add user.** Enter an email + password for yourself.
2. Go to `/admin` on the running site and sign in with that email/password once —
   this creates your `profiles` document.
3. **Firestore Database → Data → profiles → (your uid)** → edit the `role` field
   from `editor` to `admin`.
4. Refresh `/admin` — the **Staff** section is now visible.

Once you're an admin, use the **Staff** section in the portal to promote/demote other
accounts. To add a new staff member: create their login the same way (step 1 above),
then have them sign in once, then set their role from the **Staff** screen.
(A self-service "invite" button isn't possible from a pure frontend without exposing
a service-account key to the browser, so new logins are created here, once, per person.)

## What's editable vs. what isn't

Everything in the **Products, Categories & Activities, Home hero, Promo tiles,
Header, Footer, About/Terms/Privacy pages, FAQs, Settings (WhatsApp number, bank
details, shipping, tax, promo codes), Orders, and Staff** sections is stored in
Firestore and editable from `/admin`. A few homepage marketing sections (the mid
banners, the triple-CTA row, the secondary video banner) and the Contact page's
store-locator list are still hardcoded in `src/pages/Home.tsx` / `StaticPages.tsx` —
they weren't part of the agreed admin scope, but can be moved into the CMS later
the same way the rest was.
