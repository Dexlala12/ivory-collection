import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { updateSettings, upsertPromoCode, deletePromoCode } from '../../lib/api';
import type { Settings, PromoCode } from '../../types';
import { Field, TextInput, NumberInput, Toggle, Card, PrimaryButton, SecondaryButton, StatusBanner, PageHeader } from '../components/FormFields';

type Status = { type: 'success' | 'error'; message: string } | null;

function SettingsCard() {
  const { settings, refresh } = useSiteContent();
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const save = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      await refresh();
      setStatus({ type: 'success', message: 'Settings saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Checkout & contact">
      <Field label="WhatsApp number" hint="Digits only, with country code, no + or spaces (e.g. 94771234567)">
        <TextInput value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, '') })} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Free shipping threshold ($)"><NumberInput step="0.01" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })} /></Field>
        <Field label="Tax rate (%)"><NumberInput step="0.1" value={form.taxRate * 100} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) / 100 })} /></Field>
        <Field label="Standard shipping ($)"><NumberInput step="0.01" value={form.standardShippingCost} onChange={(e) => setForm({ ...form, standardShippingCost: Number(e.target.value) })} /></Field>
        <Field label="Express shipping ($)"><NumberInput step="0.01" value={form.expressShippingCost} onChange={(e) => setForm({ ...form, expressShippingCost: Number(e.target.value) })} /></Field>
      </div>

      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save checkout settings'}</PrimaryButton>
    </Card>
  );
}

function BankCard() {
  const { settings, refresh } = useSiteContent();
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const save = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      await refresh();
      setStatus({ type: 'success', message: 'Bank details saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Bank details" action={<span className="text-[9px] font-mono text-black/30 uppercase">Shared with customers directly over WhatsApp</span>}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Bank name"><TextInput value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></Field>
        <Field label="Account name"><TextInput value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} /></Field>
        <Field label="Account number"><TextInput value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} /></Field>
        <Field label="Branch"><TextInput value={form.bankBranch} onChange={(e) => setForm({ ...form, bankBranch: e.target.value })} /></Field>
        <Field label="SWIFT code"><TextInput value={form.bankSwiftCode} onChange={(e) => setForm({ ...form, bankSwiftCode: e.target.value })} /></Field>
      </div>
      <StatusBanner status={status} />
      <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save bank details'}</PrimaryButton>
    </Card>
  );
}

function PromoCodesCard() {
  const { promoCodes, refresh } = useSiteContent();
  const [status, setStatus] = useState<Status>(null);
  const [drafts, setDrafts] = useState<Record<string, PromoCode>>({});
  const [newCode, setNewCode] = useState({ code: '', rate: 10 });

  const draftFor = (c: PromoCode) => drafts[c.id] ?? c;

  const save = async (code: PromoCode) => {
    try {
      await upsertPromoCode({ ...code, code: code.code.toUpperCase() });
      await refresh();
      setStatus({ type: 'success', message: 'Promo code saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Save failed.' });
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this promo code?')) return;
    await deletePromoCode(id);
    await refresh();
  };

  return (
    <Card title="Promo codes">
      <div className="space-y-3">
        {promoCodes.map((c) => {
          const d = draftFor(c);
          return (
            <div key={c.id} className="flex items-center gap-3">
              <TextInput value={d.code} onChange={(e) => setDrafts({ ...drafts, [c.id]: { ...d, code: e.target.value.toUpperCase() } })} className="w-32 font-bold" />
              <div className="flex items-center gap-1">
                <NumberInput
                  value={Math.round(d.rate * 100)}
                  onChange={(e) => setDrafts({ ...drafts, [c.id]: { ...d, rate: Number(e.target.value) / 100 } })}
                  className="w-20"
                />
                <span className="text-[10px] font-mono text-black/50">% off</span>
              </div>
              <Toggle checked={d.active} onChange={(v) => setDrafts({ ...drafts, [c.id]: { ...d, active: v } })} label="Active" />
              <PrimaryButton onClick={() => save(d)}>Save</PrimaryButton>
              <button onClick={() => remove(c.id)} className="text-black/30 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          );
        })}

        <div className="flex items-center gap-3 border-t border-black/10 pt-3">
          <TextInput value={newCode.code} onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })} placeholder="CODE" className="w-32" />
          <div className="flex items-center gap-1">
            <NumberInput value={newCode.rate} onChange={(e) => setNewCode({ ...newCode, rate: Number(e.target.value) })} className="w-20" />
            <span className="text-[10px] font-mono text-black/50">% off</span>
          </div>
          <PrimaryButton
            onClick={async () => {
              if (!newCode.code) return;
              await save({ id: '', code: newCode.code, rate: newCode.rate / 100, active: true });
              setNewCode({ code: '', rate: 10 });
            }}
            className="flex items-center space-x-1.5"
          >
            <Plus size={12} /><span>Add</span>
          </PrimaryButton>
        </div>
      </div>
      <StatusBanner status={status} />
    </Card>
  );
}

export default function SettingsSection() {
  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Settings" subtitle="Checkout behavior, bank details for WhatsApp inquiries, and promo codes." />
      <SettingsCard />
      <BankCard />
      <PromoCodesCard />
    </div>
  );
}
