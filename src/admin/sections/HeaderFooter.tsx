import { useEffect, useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { updateSiteContent } from '../../lib/api';
import type { HeaderContent, FooterContent, LinkTarget } from '../../types';
import { Field, TextInput, TextArea, Card, PrimaryButton, StatusBanner, PageHeader } from '../components/FormFields';

type Status = { type: 'success' | 'error'; message: string } | null;

const LINK_TARGETS: LinkTarget[] = ['home', 'collection', 'about', 'contact', 'faq', 'terms', 'privacy'];

function HeaderCard() {
  const { header, refresh } = useSiteContent();
  const [form, setForm] = useState<HeaderContent>(header);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => setForm(header), [header]);

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteContent('header', form);
      await refresh();
      setStatus({ type: 'success', message: 'Header updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Header">
      <Field label="Announcement bar"><TextInput value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} /></Field>
      <div className="grid grid-cols-4 gap-3">
        <Field label="Home"><TextInput value={form.navLabels.home} onChange={(e) => setForm({ ...form, navLabels: { ...form.navLabels, home: e.target.value } })} /></Field>
        <Field label="Shop"><TextInput value={form.navLabels.shop} onChange={(e) => setForm({ ...form, navLabels: { ...form.navLabels, shop: e.target.value } })} /></Field>
        <Field label="Concept"><TextInput value={form.navLabels.concept} onChange={(e) => setForm({ ...form, navLabels: { ...form.navLabels, concept: e.target.value } })} /></Field>
        <Field label="Contact"><TextInput value={form.navLabels.contact} onChange={(e) => setForm({ ...form, navLabels: { ...form.navLabels, contact: e.target.value } })} /></Field>
      </div>
      <p className="text-[9px] font-mono text-black/30 uppercase">Mega-menu feature is managed under Home & Promo Tiles.</p>
      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save header'}</PrimaryButton>
    </Card>
  );
}

function FooterCard() {
  const { footer, refresh } = useSiteContent();
  const [form, setForm] = useState<FooterContent>(footer);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => setForm(footer), [footer]);

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteContent('footer', form);
      await refresh();
      setStatus({ type: 'success', message: 'Footer updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const updateColumn = (colIndex: number, patch: Partial<FooterContent['columns'][number]>) => {
    setForm({ ...form, columns: form.columns.map((c, i) => i === colIndex ? { ...c, ...patch } : c) });
  };
  const updateLink = (colIndex: number, linkIndex: number, patch: Partial<FooterContent['columns'][number]['links'][number]>) => {
    const col = form.columns[colIndex];
    updateColumn(colIndex, { links: col.links.map((l, i) => i === linkIndex ? { ...l, ...patch } : l) });
  };

  return (
    <Card title="Footer">
      <Field label="Newsletter heading"><TextInput value={form.newsletterHeading} onChange={(e) => setForm({ ...form, newsletterHeading: e.target.value })} /></Field>
      <Field label="Newsletter body"><TextArea rows={2} value={form.newsletterBody} onChange={(e) => setForm({ ...form, newsletterBody: e.target.value })} /></Field>

      <div className="space-y-4">
        <p className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Link columns</p>
        {form.columns.map((col, ci) => (
          <div key={ci} className="border border-black/10 p-3 space-y-2">
            <TextInput value={col.heading} onChange={(e) => updateColumn(ci, { heading: e.target.value })} className="font-bold" />
            {col.links.map((link, li) => (
              <div key={li} className="flex gap-2 items-center">
                <TextInput value={link.label} onChange={(e) => updateLink(ci, li, { label: e.target.value })} className="flex-1" />
                <select
                  value={link.target}
                  onChange={(e) => updateLink(ci, li, { target: e.target.value as LinkTarget })}
                  className="bg-zinc-50 border border-black/10 focus:border-black px-2 py-2.5 text-[10px] font-mono uppercase outline-none rounded-none h-[38px]"
                >
                  {LINK_TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Copyright line" hint="Year is added automatically"><TextInput value={form.copyright} onChange={(e) => setForm({ ...form, copyright: e.target.value })} /></Field>
        <Field label="Compliance badge"><TextInput value={form.complianceBadge} onChange={(e) => setForm({ ...form, complianceBadge: e.target.value })} /></Field>
      </div>

      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save footer'}</PrimaryButton>
    </Card>
  );
}

export default function HeaderFooter() {
  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Header & Footer" subtitle="Site-wide announcement bar, nav labels, and footer content." />
      <HeaderCard />
      <FooterCard />
    </div>
  );
}
