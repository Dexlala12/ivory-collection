// IVORY — Firestore seed script.
// Populates every content collection with the site's current (pre-CMS) copy,
// sourced directly from src/data/products.ts + src/data/fallbackContent.ts —
// the same data the storefront falls back to when Firebase isn't configured —
// so the site looks identical the moment it switches over to reading live
// Firestore data. Idempotent: every write uses a fixed doc id and can be re-run.
//
// Usage: see firebase/README.md. In short —
//   1. Download a service account key from Firebase console
//      (Project settings -> Service accounts -> Generate new private key)
//   2. Save it as firebase/serviceAccountKey.json (gitignored)
//   3. npm run seed

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { CATEGORIES, ACTIVITIES, PRODUCTS, PROMO_TILES, FAQS } from '../src/data/products';
import {
  FALLBACK_PAGES, FALLBACK_HEADER, FALLBACK_FOOTER, FALLBACK_HOME_HERO,
  FALLBACK_SETTINGS, FALLBACK_PROMO_CODES
} from '../src/data/fallbackContent';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

const app = existsSync(keyPath)
  ? initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, 'utf-8'))) })
  : initializeApp({ credential: applicationDefault() });

const db = getFirestore(app);

async function seed() {
  const batch = db.batch();

  CATEGORIES.filter((c) => c.id !== 'all').forEach((c, i) => {
    batch.set(db.collection('categories').doc(c.id), { name: c.name, sortOrder: (i + 1) * 10 });
  });

  ACTIVITIES.forEach((a, i) => {
    batch.set(db.collection('activities').doc(a.id), { name: a.name, sortOrder: (i + 1) * 10 });
  });

  PRODUCTS.forEach((p, i) => {
    const { id, ...data } = p;
    batch.set(db.collection('products').doc(id), { ...data, sortOrder: (i + 1) * 10 });
  });

  PROMO_TILES.forEach((t, i) => {
    batch.set(db.collection('promoTiles').doc(`tile-${i + 1}`), { ...t, sortOrder: (i + 1) * 10 });
  });

  FAQS.forEach((f, i) => {
    batch.set(db.collection('faqs').doc(`faq-${i + 1}`), { ...f, sortOrder: (i + 1) * 10 });
  });

  for (const page of Object.values(FALLBACK_PAGES)) {
    const { slug, ...data } = page;
    batch.set(db.collection('pages').doc(slug), data);
  }

  batch.set(db.collection('siteContent').doc('header'), { value: FALLBACK_HEADER });
  batch.set(db.collection('siteContent').doc('footer'), { value: FALLBACK_FOOTER });
  batch.set(db.collection('siteContent').doc('home_hero'), { value: FALLBACK_HOME_HERO });

  batch.set(db.collection('settings').doc('main'), FALLBACK_SETTINGS);

  FALLBACK_PROMO_CODES.forEach((c) => {
    batch.set(db.collection('promoCodes').doc(c.code), { code: c.code, rate: c.rate, active: c.active });
  });

  await batch.commit();
  console.log('Firestore seeded successfully.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
