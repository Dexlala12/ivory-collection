import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';
import { fetchSiteContent, type SiteContentBundle } from '../lib/api';
import { PRODUCTS } from '../data/products';
import {
  FALLBACK_CATEGORIES, FALLBACK_ACTIVITIES, FALLBACK_PROMO_TILES, FALLBACK_FAQS,
  FALLBACK_PAGES, FALLBACK_HEADER, FALLBACK_FOOTER, FALLBACK_HOME_HERO,
  FALLBACK_SETTINGS, FALLBACK_PROMO_CODES
} from '../data/fallbackContent';
import type { Category } from '../types';

// Synthetic "view everything" entry. Not stored in the database — the admin
// Categories screen only manages real categories — but the storefront nav
// (mega-menu, mobile nav, Collection's quick-select chips) has always shown
// this as the first entry, so it's prepended here for those consumers.
export const ALL_CATEGORIES_OPTION: Category = { id: 'all', name: 'ALL PRODUCTS', sortOrder: -1 };

const FALLBACK_BUNDLE: SiteContentBundle = {
  products: PRODUCTS,
  categories: FALLBACK_CATEGORIES,
  activities: FALLBACK_ACTIVITIES,
  promoTiles: FALLBACK_PROMO_TILES,
  faqs: FALLBACK_FAQS,
  pages: FALLBACK_PAGES,
  header: FALLBACK_HEADER,
  footer: FALLBACK_FOOTER,
  homeHero: FALLBACK_HOME_HERO,
  settings: FALLBACK_SETTINGS,
  promoCodes: FALLBACK_PROMO_CODES
};

interface SiteContentValue extends SiteContentBundle {
  categoriesWithAll: Category[];
  loading: boolean;
  /** Set when Firebase is configured but the fetch failed — bundled fallback content is shown instead. */
  error: string | null;
  /** Re-fetches from Firebase. Call after any admin-portal mutation so the storefront reflects the edit immediately. */
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<SiteContentBundle>(FALLBACK_BUNDLE);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setBundle(FALLBACK_BUNDLE);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchSiteContent();
      setBundle(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load site content from Firebase, showing bundled fallback content.', err);
      setBundle(FALLBACK_BUNDLE);
      setError(err instanceof Error ? err.message : 'Failed to load site content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo<SiteContentValue>(() => ({
    ...bundle,
    categoriesWithAll: [ALL_CATEGORIES_OPTION, ...bundle.categories],
    loading,
    error,
    refresh: load
  }), [bundle, loading, error, load]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within a SiteContentProvider');
  return ctx;
}
