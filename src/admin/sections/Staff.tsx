import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { fetchAllProfiles, removeStaff, createStaffLogin } from '../../lib/api';
import type { Profile } from '../../types';
import { useAdminAuth } from '../AdminAuthContext';
import { PageHeader, StatusBanner, Field, TextInput, PrimaryButton, Card } from '../components/FormFields';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function Staff() {
  const { profile: currentProfile } = useAdminAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllProfiles()
      .then(setProfiles)
      .catch((err) => setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to load staff.' }))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (p: Profile) => {
    if (p.id === currentProfile?.id) { alert("You can't remove your own access."); return; }
    if (!confirm(`Remove ${p.email}'s access to the admin portal?`)) return;
    try {
      await removeStaff(p.id);
      load();
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to remove staff.' });
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setStatus(null);
    try {
      await createStaffLogin(email, password);
      setStatus({ type: 'success', message: `Login created for ${email}.` });
      setEmail('');
      setPassword('');
      load();
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create login.' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <PageHeader title="Staff" subtitle="Everyone listed here can sign in to the admin portal and edit everything in it." />
        <StatusBanner status={status} />
      </div>

      <Card title="Create a staff login">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Email">
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" hint="Share this with them directly — they can sign in with it right away.">
            <TextInput type="text" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <PrimaryButton type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create login'}
          </PrimaryButton>
        </form>
      </Card>

      {loading ? (
        <p className="text-xs text-black/40 font-mono">Loading...</p>
      ) : (
        <div className="border border-black/10 divide-y divide-black/10">
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-bold">{p.email}</p>
                <p className="text-[9px] font-mono text-black/40 uppercase">Joined {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => remove(p)}
                disabled={p.id === currentProfile?.id}
                className="text-[10px] font-mono text-red-600 hover:text-red-800 uppercase disabled:opacity-30"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
