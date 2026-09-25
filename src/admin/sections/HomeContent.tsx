import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { updateSiteContent, upsertPromoTile, deletePromoTile } from '../../lib/api';
import type { HomeHeroContent, HeaderContent, PromoTile } from '../../types';
import { Field, TextInput, TextArea, Card, PrimaryButton, SecondaryButton, StatusBanner, PageHeader } from '../components/FormFields';
import ImageUploader from '../components/ImageUploader';

type Status = { type: 'success' | 'error'; message: string } | null;

function HeroCard() {
  const { homeHero, refresh } = useSiteContent();
  const [form, setForm] = useState<HomeHeroContent>(homeHero);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteContent('home_hero', form);
      await refresh();
      setStatus({ type: 'success', message: 'Hero updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Homepage hero">
      <Field label="Eyebrow"><TextInput value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} /></Field>
      <Field label="Heading" hint="Use a line break for a two-line headline">
        <TextArea rows={2} value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      </Field>
      <Field label="Subheading"><TextArea rows={2} value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary button label"><TextInput value={form.primaryCtaLabel} onChange={(e) => setForm({ ...form, primaryCtaLabel: e.target.value })} /></Field>
        <Field label="Secondary button label"><TextInput value={form.secondaryCtaLabel} onChange={(e) => setForm({ ...form, secondaryCtaLabel: e.target.value })} /></Field>
      </div>
      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save hero'}</PrimaryButton>
    </Card>
  );
}

function MegaMenuCard() {
  const { header, refresh } = useSiteContent();
  const [form, setForm] = useState<HeaderContent['megaMenu']>(header.megaMenu);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteContent('header', { ...header, megaMenu: form });
      await refresh();
      setStatus({ type: 'success', message: 'Mega-menu feature updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Mega-menu feature" action={<span className="text-[9px] font-mono text-black/30 uppercase">Shown in Shop dropdown</span>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tag"><TextInput value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></Field>
        <Field label="Heading"><TextInput value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></Field>
      </div>
      <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="site" label="Feature image" />
      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save mega-menu'}</PrimaryButton>
    </Card>
  );
}

function PromoTilesCard() {
  const { promoTiles, categories, activities, refresh } = useSiteContent();
  const [status, setStatus] = useState<Status>(null);

  const emptyTile = (): PromoTile => ({ id: '', title: '', subtitle: '', image: '', link: categories[0]?.id ?? '', type: 'category', sortOrder: (promoTiles.length + 1) * 10 });
  const [drafts, setDrafts] = useState<Record<string, PromoTile>>({});

  const draftFor = (tile: PromoTile) => drafts[tile.id] ?? tile;
  const updateDraft = (tile: PromoTile, patch: Partial<PromoTile>) => setDrafts({ ...drafts, [tile.id]: { ...draftFor(tile), ...patch } });

  const [newTile, setNewTile] = useState<PromoTile>(emptyTile());

  const save = async (tile: PromoTile) => {
    try {
      await upsertPromoTile(tile);
      await refresh();
      setStatus({ type: 'success', message: 'Promo tile saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this promo tile?')) return;
    await deletePromoTile(id);
    await refresh();
  };

  const linkOptions = (type: 'category' | 'activity') => (type === 'category' ? categories : activities);

  return (
    <Card title="Promo tiles" action={<span className="text-[9px] font-mono text-black/30 uppercase">Home page, 2-up feature block</span>}>
      <div className="space-y-6">
        {promoTiles.map((tile) => {
          const d = draftFor(tile);
          return (
            <div key={tile.id} className="border border-black/10 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title"><TextInput value={d.title} onChange={(e) => updateDraft(tile, { title: e.target.value })} /></Field>
                <Field label="Subtitle"><TextInput value={d.subtitle} onChange={(e) => updateDraft(tile, { subtitle: e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Links to">
                  <select value={d.type} onChange={(e) => updateDraft(tile, { type: e.target.value as 'category' | 'activity', link: linkOptions(e.target.value as 'category' | 'activity')[0]?.id ?? '' })} className="w-full bg-zinc-50 border border-black/10 focus:border-black px-3 py-2.5 text-xs font-mono outline-none rounded-none h-[38px]">
                    <option value="category">Category</option>
                    <option value="activity">Activity</option>
                  </select>
                </Field>
                <Field label="Target">
                  <select value={d.link} onChange={(e) => updateDraft(tile, { link: e.target.value })} className="w-full bg-zinc-50 border border-black/10 focus:border-black px-3 py-2.5 text-xs font-mono outline-none rounded-none h-[38px]">
                    {linkOptions(d.type).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </Field>
              </div>
              <ImageUploader value={d.image} onChange={(url) => updateDraft(tile, { image: url })} folder="site" label="Tile image" />
              <div className="flex items-center space-x-3">
                <PrimaryButton onClick={() => save(d)}>Save</PrimaryButton>
                <SecondaryButton onClick={() => remove(tile.id)} className="flex items-center space-x-1"><Trash2 size={11} /><span>Delete</span></SecondaryButton>
              </div>
            </div>
          );
        })}

        <div className="border border-dashed border-black/20 p-4 space-y-3">
          <p className="text-[10px] font-mono uppercase text-black/40 font-bold">New promo tile</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title"><TextInput value={newTile.title} onChange={(e) => setNewTile({ ...newTile, title: e.target.value })} /></Field>
            <Field label="Subtitle"><TextInput value={newTile.subtitle} onChange={(e) => setNewTile({ ...newTile, subtitle: e.target.value })} /></Field>
          </div>
          <ImageUploader value={newTile.image} onChange={(url) => setNewTile({ ...newTile, image: url })} folder="site" label="Tile image" />
          <PrimaryButton
            onClick={async () => {
              if (!newTile.title) return;
              await save(newTile);
              setNewTile(emptyTile());
            }}
            className="flex items-center space-x-1.5"
          >
            <Plus size={12} /><span>Add tile</span>
          </PrimaryButton>
        </div>
      </div>
      <StatusBanner status={status} />
    </Card>
  );
}

export default function HomeContent() {
  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Home & Promo Tiles" subtitle="Controls the homepage hero, the Shop mega-menu feature, and the 2-up promo block." />
      <HeroCard />
      <MegaMenuCard />
      <PromoTilesCard />
    </div>
  );
}
