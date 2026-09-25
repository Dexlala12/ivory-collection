import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { ensureProfile, fetchProfile } from '../lib/api';
import type { Profile } from '../types';

interface AdminAuthValue {
  session: User | null;
  profile: Profile | null;
  /** True while the initial session/profile check is in flight. */
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;
      setSession(user);
      setLoading(true);
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        await ensureProfile(user.uid, user.email);
        const p = await fetchProfile(user.uid);
        if (!cancelled) setProfile(p);
      } catch (err) {
        console.error('Failed to load staff profile:', err);
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to sign in.' };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value: AdminAuthValue = {
    session, profile, loading, isAdmin: profile?.role === 'admin', signIn, signOut
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
}
