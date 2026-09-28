import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined
};

// True once every VITE_FIREBASE_* var is set (see firebase/README.md).
// The storefront falls back to bundled seed data when this is false, so the
// site still runs before the backend is configured.
export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

// Falls back to a harmless placeholder config so initializeApp() never throws
// when the backend isn't configured yet — callers must still check
// isFirebaseConfigured before relying on real data.
const app =
  getApps()[0] ??
  initializeApp(
    isFirebaseConfigured
      ? firebaseConfig
      : { apiKey: 'placeholder-api-key', projectId: 'placeholder-project', appId: 'placeholder-app-id' }
  );

// ignoreUndefinedProperties: fallback content (and forms that leave optional
// fields blank) can carry `undefined` values, which Firestore rejects by
// default — silently drop them instead of throwing.
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
export const auth = getAuth(app);
export const storage = getStorage(app);
