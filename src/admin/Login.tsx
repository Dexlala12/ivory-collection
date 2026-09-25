import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { isFirebaseConfigured } from '../lib/firebase';

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18A13.44 13.44 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

export default function Login() {
  const { session, signIn, signInWithGoogle } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3 font-mono text-xs uppercase tracking-wider">
          <p className="font-bold">Backend not configured</p>
          <p className="text-black/60 normal-case">
            The admin portal needs Firebase set up first. Follow the steps in
            <code className="mx-1 bg-zinc-100 px-1.5 py-0.5">firebase/README.md</code>
            to create a project and set the <code className="bg-zinc-100 px-1.5 py-0.5">VITE_FIREBASE_*</code> variables in <code className="bg-zinc-100 px-1.5 py-0.5">.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) setError(err);
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    setGoogleSubmitting(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase">IVORY</h1>
          <p className="text-[10px] font-mono tracking-widest text-black/40 uppercase">Admin Portal Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Email</label>
            <input
              type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none"
            />
          </div>

          {error && <p className="text-[10px] font-mono text-red-600">{error}</p>}

          <button
            type="submit" disabled={submitting}
            className="w-full bg-black hover:bg-black/80 text-white py-3.5 text-xs font-mono tracking-widest font-bold uppercase transition-colors flex items-center justify-center space-x-2 disabled:opacity-55"
          >
            <Lock size={12} />
            <span>{submitting ? 'SIGNING IN...' : 'SIGN IN'}</span>
          </button>
        </form>

        <div className="flex items-center space-x-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-[9px] font-mono text-black/30 tracking-widest">OR</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <button
          type="button" onClick={handleGoogleSignIn} disabled={googleSubmitting}
          className="w-full border border-black/10 hover:border-black bg-zinc-50 py-3.5 text-xs font-mono tracking-widest font-bold uppercase transition-colors flex items-center justify-center space-x-2 disabled:opacity-55"
        >
          <GoogleIcon />
          <span>{googleSubmitting ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}</span>
        </button>

        <p className="text-[9px] font-mono text-black/30 text-center uppercase leading-relaxed">
          Staff accounts are created in Firebase — see firebase/README.md
        </p>
      </div>
    </div>
  );
}
