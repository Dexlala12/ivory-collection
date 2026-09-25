import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// True once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see supabase/README.md).
// The storefront falls back to bundled seed data when this is false, so the site
// still runs before the backend is configured.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Falls back to a harmless placeholder so createClient() never throws when the
// backend isn't configured yet — callers must still check isSupabaseConfigured
// before relying on real data.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
