import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { updatePage, upsertFaq, deleteFaq } from '../../lib/api';
import type { Page, PageSlug, PageSection, Faq } from '../../types';
import { Field, TextInput, TextArea, Card, PrimaryButton, SecondaryButton, StatusBanner, PageHeader } from '../components/FormFields';
import ImageUploader from '../components/ImageUploader';

type Status = { type: 'success' | 'error'; message: string } | null;

const TABS: { slug: PageSlug; label: string }[] = [
  { slug: 'about', label: 'About' },
  { slug: 'terms', label: 'Terms' },
  { slug: 'privacy', label: 'Privacy' }
];

function PageEditor({ page: initial }: { page: Page }) {
  const { refresh } = useSiteContent();
  const [page, setPage] = useState<Page>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => setPage(initial), [initial]);

  const updateSection = (i: number, patch: Partial<PageSection>) => {
    setPage({ ...page, sections: page.sections.map((s, si) => si === i ? { ...s, ...patch } : s) });
  };

  const save = async () => {
    setSaving(true);
    try {
      await updatePage(page);
      await refresh();
      setStatus({ type: 'success', message: 'Page updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Banner title"><TextInput value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} /></Field>
        <Field label="Banner subtitle"><TextInput value={page.subtitle} onChange={(e) => setPage({ ...page, subtitle: e.target.value })} /></Field>
      </div>
      {page.slug !== 'about' && (
        <Field label="Content heading"><TextInput value={page.heading} onChange={(e) => setPage({ ...page, heading: e.target.value })} /></Field>
      )}

      <div className="space-y-4">
        <p className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Sections</p>
        {page.sections.map((section, i) => (
          <div key={i} className="border border-black/10 p-3 space-y-2">
            <div className="flex gap-2 items-center">
              <TextInput
                value={section.heading ?? ''}
                onChange={(e) => updateSection(i, { heading: e.target.value || null })}
                placeholder="Section heading (optional)"
                className="flex-1 font-bold"
              />
              <button onClick={() => setPage({ ...page, sections: page.sections.filter((_, si) => si !== i) })} className="text-black/30 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
            <TextArea
              rows={4}
              value={section.paragraphs.join('\n\n')}
              onChange={(e) => updateSection(i, { paragraphs: e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) })}
              placeholder="Paragraph text — leave a blank line between paragraphs"
            />
          </div>
        ))}
        <SecondaryButton onClick={() => setPage({ ...page, sections: [...page.sections, { heading: '', paragraphs: [''] }] })} className="flex items-center space-x-1.5">
          <Plus size={12} /><span>Add section</span>
        </SecondaryButton>
      </div>

      {page.slug === 'about' && (
        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Lifestyle images</p>
          {page.images.map((img, i) => (
            <div key={i} className="flex gap-2 items-start border border-black/10 p-3">
              <div className="flex-1 space-y-2">
                <ImageUploader value={img.url} onChange={(url) => setPage({ ...page, images: page.images.map((im, ii) => ii === i ? { ...im, url } : im) })} folder="pages" label={`Image ${i + 1}`} />
                <TextInput value={img.caption} onChange={(e) => setPage({ ...page, images: page.images.map((im, ii) => ii === i ? { ...im, caption: e.target.value } : im) })} placeholder="Caption" />
              </div>
              <button onClick={() => setPage({ ...page, images: page.images.filter((_, ii) => ii !== i) })} className="text-black/30 hover:text-red-600 mt-2"><Trash2 size={14} /></button>
            </div>
          ))}
          <SecondaryButton onClick={() => setPage({ ...page, images: [...page.images, { url: '', caption: '' }] })} className="flex items-center space-x-1.5">
            <Plus size={12} /><span>Add image</span>
          </SecondaryButton>
        </div>
      )}

      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save page'}</PrimaryButton>
    </div>
  );
}

function FaqEditor() {
  const { faqs, refresh } = useSiteContent();
  const [status, setStatus] = useState<Status>(null);
  const [drafts, setDrafts] = useState<Record<string, Faq>>({});
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const draftFor = (faq: Faq) => drafts[faq.id] ?? faq;

  const save = async (faq: Faq) => {
    try {
      await upsertFaq(faq);
      await refresh();
      setStatus({ type: 'success', message: 'FAQ saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await deleteFaq(id);
    await refresh();
  };

  return (
    <Card title="FAQ">
      <div className="space-y-4">
        {faqs.map((faq) => {
          const d = draftFor(faq);
          return (
            <div key={faq.id} className="border border-black/10 p-3 space-y-2">
              <TextInput value={d.question} onChange={(e) => setDrafts({ ...drafts, [faq.id]: { ...d, question: e.target.value } })} className="font-bold" />
              <TextArea rows={2} value={d.answer} onChange={(e) => setDrafts({ ...drafts, [faq.id]: { ...d, answer: e.target.value } })} />
              <div className="flex space-x-2">
                <PrimaryButton onClick={() => save(d)}>Save</PrimaryButton>
                <SecondaryButton onClick={() => remove(faq.id)} className="flex items-center space-x-1"><Trash2 size={11} /><span>Delete</span></SecondaryButton>
              </div>
            </div>
          );
        })}

        <div className="border border-dashed border-black/20 p-3 space-y-2">
          <TextInput value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} placeholder="New question" />
          <TextArea rows={2} value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} placeholder="Answer" />
          <PrimaryButton
            onClick={async () => {
              if (!newFaq.question || !newFaq.answer) return;
              await save({ id: '', question: newFaq.question, answer: newFaq.answer, sortOrder: (faqs.length + 1) * 10 });
              setNewFaq({ question: '', answer: '' });
            }}
            className="flex items-center space-x-1.5"
          >
            <Plus size={12} /><span>Add FAQ</span>
          </PrimaryButton>
        </div>
      </div>
      <StatusBanner status={status} />
    </Card>
  );
}

export default function Pages() {
  const { pages } = useSiteContent();
  const [activeTab, setActiveTab] = useState<PageSlug>('about');

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Pages & FAQ" subtitle="About, Terms, Privacy copy and the FAQ list." />

      <div className="flex border-b border-black/10">
        {TABS.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActiveTab(t.slug)}
            className={`px-4 py-2 text-[10px] font-mono tracking-wider uppercase font-bold border-b-2 ${activeTab === t.slug ? 'border-black text-black' : 'border-transparent text-black/40'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* key forces remount per tab so each PageEditor gets fresh local state from the latest fetched page */}
      <div key={activeTab}>
        <PageEditor page={pages[activeTab]} />
      </div>

      <FaqEditor />
    </div>
  );
}
