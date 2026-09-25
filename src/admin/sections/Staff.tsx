import { useEffect, useState } from 'react';
import { fetchAllProfiles, updateProfileRole, removeStaff } from '../../lib/api';
import type { Profile, StaffRole } from '../../types';
import { useAdminAuth } from '../AdminAuthContext';
import { PageHeader, StatusBanner } from '../components/FormFields';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function Staff() {
  const { profile: currentProfile } = useAdminAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);

  const load = () => {
    setLoading(true);
    fetchAllProfiles()
      .then(setProfiles)
      .catch((err) => setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to load staff.' }))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeRole = async (p: Profile, role: StaffRole) => {
    try {
      await updateProfileRole(p.id, role);
      load();
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update role.' });
    }
  };

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

  return (
    <div className="max-w-2xl">
      <PageHeader title="Staff" subtitle="Who can sign in to this admin portal, and what they can do." />
      <StatusBanner status={status} />

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
              <div className="flex items-center space-x-3">
                <select
                  value={p.role}
                  onChange={(e) => changeRole(p, e.target.value as StaffRole)}
                  disabled={p.id === currentProfile?.id}
                  className="bg-zinc-50 border border-black/10 focus:border-black px-2 py-1.5 text-[10px] font-mono uppercase outline-none rounded-none disabled:opacity-50"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  onClick={() => remove(p)}
                  disabled={p.id === currentProfile?.id}
                  className="text-[10px] font-mono text-red-600 hover:text-red-800 uppercase disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 border border-black/10 p-4 space-y-2">
        <p className="text-[10px] font-mono tracking-wider text-black/60 uppercase font-bold">Adding a new staff member</p>
        <p className="text-xs text-black/60 leading-relaxed">
          Create their login in the Supabase dashboard (Authentication → Add user) — they'll appear
          here automatically as an <span className="font-mono">editor</span>. Then promote them to
          <span className="font-mono"> admin</span> above if needed. See <span className="font-mono">supabase/README.md</span>.
        </p>
      </div>
    </div>
  );
}
