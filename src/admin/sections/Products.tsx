import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, X } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { createProduct, updateProduct, deleteProduct } from '../../lib/api';
import type { Product } from '../../types';
import { Field, TextInput, TextArea, NumberInput, Toggle, PrimaryButton, SecondaryButton, DangerButton, StatusBanner, PageHeader } from '../components/FormFields';
import ImageUploader from '../components/ImageUploader';

type Status = { type: 'success' | 'error'; message: string } | null;

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function emptyProduct(): Product {
  return {
    id: '', name: '', price: 0, description: '', images: [''], category: '', activities: [],
    sizes: [], colors: [{ name: '', hex: '#111111' }], rating: 5, inStock: true, highlights: [],
    specs: { material: '', fit: '', care: '' }
  };
}

export default function Products() {
  const { products, categories, activities, refresh } = useSiteContent();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const startCreate = () => { setEditing(emptyProduct()); setIsNew(true); setStatus(null); };
  const startEdit = (p: Product) => { setEditing({ ...p, colors: [...p.colors], images: [...p.images], activities: [...p.activities], sizes: [...p.sizes], highlights: [...p.highlights] }); setIsNew(false); setStatus(null); };
  const cancel = () => { setEditing(null); setStatus(null); };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.id) { setStatus({ type: 'error', message: 'Product ID is required.' }); return; }
    if (!editing.name || !editing.category) { setStatus({ type: 'error', message: 'Name and category are required.' }); return; }

    const cleaned: Product = {
      ...editing,
      images: editing.images.filter(Boolean),
      colors: editing.colors.filter((c) => c.name && c.hex),
      sizes: editing.sizes.filter(Boolean),
      highlights: editing.highlights.filter(Boolean)
    };

    setSaving(true);
    try {
      if (isNew) {
        await createProduct(cleaned);
      } else {
        await updateProduct(cleaned.id, cleaned);
      }
      await refresh();
      setStatus({ type: 'success', message: 'Product saved.' });
      setEditing(null);
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    try {
      await deleteProduct(p.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const toggleStock = async (p: Product) => {
    try {
      await updateProduct(p.id, { inStock: !p.inStock });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed.');
    }
  };

  // ---------------------------------------------------------------------
  // Edit / create form
  // ---------------------------------------------------------------------
  if (editing) {
    const set = <K extends keyof Product>(key: K, value: Product[K]) => setEditing({ ...editing, [key]: value });

    return (
      <div className="max-w-3xl">
        <button onClick={cancel} className="flex items-center space-x-1.5 text-[10px] font-mono text-black/50 hover:text-black uppercase mb-6">
          <ArrowLeft size={12} /><span>Back to products</span>
        </button>

        <PageHeader title={isNew ? 'New product' : `Edit: ${editing.name}`} />

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product ID (URL-safe, permanent)">
              <div className="flex gap-2">
                <TextInput value={editing.id} disabled={!isNew} onChange={(e) => set('id', slugify(e.target.value))} placeholder="e.g. nero-utility-parka" />
                {isNew && <SecondaryButton type="button" onClick={() => set('id', slugify(editing.name))}>From name</SecondaryButton>}
              </div>
            </Field>
            <Field label="Name">
              <TextInput value={editing.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (USD)">
              <NumberInput step="0.01" min="0" value={editing.price} onChange={(e) => set('price', Number(e.target.value))} />
            </Field>
            <Field label="Rating (0–5)">
              <NumberInput step="0.1" min="0" max="5" value={editing.rating} onChange={(e) => set('rating', Number(e.target.value))} />
            </Field>
          </div>

          <Field label="Description">
            <TextArea rows={3} value={editing.description} onChange={(e) => set('description', e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={editing.category} onChange={(e) => set('category', e.target.value)} className="w-full bg-zinc-50 border border-black/10 focus:border-black px-3 py-2.5 text-xs font-mono outline-none rounded-none h-[38px]">
                <option value="">Select...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Toggle checked={editing.inStock} onChange={(v) => set('inStock', v)} label="In stock" />
          </div>

          <Field label="Activities">
            <div className="flex flex-wrap gap-3 pt-1">
              {activities.map((a) => (
                <label key={a.id} className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-black/70">
                  <input
                    type="checkbox"
                    checked={editing.activities.includes(a.id)}
                    onChange={(e) => set('activities', e.target.checked ? [...editing.activities, a.id] : editing.activities.filter((x) => x !== a.id))}
                    className="accent-black w-3.5 h-3.5"
                  />
                  <span>{a.name}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Sizes (comma-separated)">
            <TextInput value={editing.sizes.join(', ')} onChange={(e) => set('sizes', e.target.value.split(',').map((s) => s.trim()))} placeholder="S, M, L, XL" />
          </Field>

          <Field label="Colors">
            <div className="space-y-2">
              {editing.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={c.hex} onChange={(e) => set('colors', editing.colors.map((cc, ci) => ci === i ? { ...cc, hex: e.target.value } : cc))} className="w-9 h-9 border border-black/10 shrink-0" />
                  <TextInput value={c.name} onChange={(e) => set('colors', editing.colors.map((cc, ci) => ci === i ? { ...cc, name: e.target.value } : cc))} placeholder="Color name" />
                  <button type="button" onClick={() => set('colors', editing.colors.filter((_, ci) => ci !== i))} className="text-black/30 hover:text-red-600"><X size={14} /></button>
                </div>
              ))}
              <SecondaryButton type="button" onClick={() => set('colors', [...editing.colors, { name: '', hex: '#111111' }])}>+ Add color</SecondaryButton>
            </div>
          </Field>

          <Field label="Images">
            <div className="space-y-3">
              {editing.images.map((img, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1">
                    <ImageUploader value={img} onChange={(url) => set('images', editing.images.map((im, ii) => ii === i ? url : im))} folder="products" label={`Image ${i + 1}`} />
                  </div>
                  <button type="button" onClick={() => set('images', editing.images.filter((_, ii) => ii !== i))} className="text-black/30 hover:text-red-600 mt-6"><X size={14} /></button>
                </div>
              ))}
              <SecondaryButton type="button" onClick={() => set('images', [...editing.images, ''])}>+ Add image</SecondaryButton>
            </div>
          </Field>

          <Field label="Highlights (one per line)">
            <TextArea rows={4} value={editing.highlights.join('\n')} onChange={(e) => set('highlights', e.target.value.split('\n'))} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Material">
              <TextInput value={editing.specs.material} onChange={(e) => set('specs', { ...editing.specs, material: e.target.value })} />
            </Field>
            <Field label="Fit">
              <TextInput value={editing.specs.fit} onChange={(e) => set('specs', { ...editing.specs, fit: e.target.value })} />
            </Field>
            <Field label="Care">
              <TextInput value={editing.specs.care} onChange={(e) => set('specs', { ...editing.specs, care: e.target.value })} />
            </Field>
          </div>

          <StatusBanner status={status} />

          <div className="flex items-center space-x-3 pt-2">
            <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save product'}</PrimaryButton>
            <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // List view
  // ---------------------------------------------------------------------
  return (
    <div>
      <PageHeader title="Products" subtitle="Everything shown in the shop and on the homepage." />
      <StatusBanner status={status} />

      <div className="flex items-center justify-between mb-4 mt-2">
        <TextInput placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <PrimaryButton onClick={startCreate} className="flex items-center space-x-1.5">
          <Plus size={12} /><span>New product</span>
        </PrimaryButton>
      </div>

      <div className="border border-black/10 divide-y divide-black/10">
        {filtered.length === 0 && <p className="p-6 text-xs text-black/40 font-mono">No products found.</p>}
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <img src={p.images[0]} alt="" className="w-12 h-14 object-cover bg-zinc-100 shrink-0" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{p.name}</p>
              <p className="text-[10px] font-mono text-black/40 uppercase">{p.category} &middot; ${p.price.toFixed(2)}</p>
            </div>
            <button onClick={() => toggleStock(p)} className={`text-[9px] font-mono px-2 py-1 border uppercase tracking-wider ${p.inStock ? 'border-green-600 text-green-600' : 'border-red-500 text-red-500'}`}>
              {p.inStock ? 'In stock' : 'Sold out'}
            </button>
            <button onClick={() => startEdit(p)} className="text-black/40 hover:text-black"><Pencil size={14} /></button>
            <DangerButton onClick={() => handleDelete(p)} className="px-0"><Trash2 size={14} /></DangerButton>
          </div>
        ))}
      </div>
    </div>
  );
}
