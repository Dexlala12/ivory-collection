import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { isFirebaseConfigured } from '../lib/firebase';

export default function Login() {
  const { session, signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

        <p className="text-[9px] font-mono text-black/30 text-center uppercase leading-relaxed">
          Staff accounts are created in Firebase — see firebase/README.md
        </p>
      </div>
    </div>
  );
}
