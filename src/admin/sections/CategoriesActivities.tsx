import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { upsertCategory, deleteCategory, upsertActivity, deleteActivity } from '../../lib/api';
import type { Category, Activity } from '../../types';
import { TextInput, PrimaryButton, PageHeader, StatusBanner } from '../components/FormFields';

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type Status = { type: 'success' | 'error'; message: string } | null;

function EditableList<T extends { id: string; name: string; sortOrder: number }>({
  title, items, onSave, onDelete
}: {
  title: string;
  items: T[];
  onSave: (id: string, name: string, sortOrder: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [newName, setNewName] = useState('');
  const [status, setStatus] = useState<Status>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const id = slugify(newName);
    try {
      await onSave(id, newName.trim(), (items.length + 1) * 10);
      setNewName('');
      setStatus(null);
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to add.' });
    }
  };

  const handleRename = async (item: T, name: string) => {
    try {
      await onSave(item.id, name, item.sortOrder);
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to save.' });
    }
  };

  const handleDelete = async (item: T) => {
    if (!confirm(`Delete "${item.name}"? Products using it will keep the old value until reassigned.`)) return;
    try {
      await onDelete(item.id);
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to delete — it may still be in use by a product.' });
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">{title}</h2>
      <StatusBanner status={status} />
      <div className="border border-black/10 divide-y divide-black/10">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3">
            <TextInput defaultValue={item.name} onBlur={(e) => e.target.value !== item.name && handleRename(item, e.target.value)} className="flex-1" />
            <span className="text-[9px] font-mono text-black/30 uppercase">{item.id}</span>
            <button onClick={() => handleDelete(item)} className="text-black/30 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <TextInput value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={`New ${title.toLowerCase().replace(/s$/, '')} name`} className="flex-1" />
        <PrimaryButton onClick={handleAdd} className="flex items-center space-x-1.5"><Plus size={12} /><span>Add</span></PrimaryButton>
      </div>
    </div>
  );
}

export default function CategoriesActivities() {
  const { categories, activities, refresh } = useSiteContent();

  const saveCategory = async (id: string, name: string, sortOrder: number) => {
    await upsertCategory({ id, name, sortOrder } as Category);
    await refresh();
  };
  const removeCategory = async (id: string) => { await deleteCategory(id); await refresh(); };

  const saveActivity = async (id: string, name: string, sortOrder: number) => {
    await upsertActivity({ id, name, sortOrder } as Activity);
    await refresh();
  };
  const removeActivity = async (id: string) => { await deleteActivity(id); await refresh(); };

  return (
    <div className="max-w-2xl space-y-10">
      <PageHeader title="Categories & Activities" subtitle="Used to organize products across the shop, nav, and filters." />
      <EditableList title="Categories" items={categories} onSave={saveCategory} onDelete={removeCategory} />
      <EditableList title="Activities" items={activities} onSave={saveActivity} onDelete={removeActivity} />
    </div>
  );
}
