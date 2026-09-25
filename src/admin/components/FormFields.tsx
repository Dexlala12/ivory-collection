import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';

// Shared, minimally-styled form primitives for the admin portal — mirrors the
// storefront's mono-label / hard-edge input look (see e.g. Checkout.tsx) so
// the portal feels like part of the same product.

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">{label}</label>
      {children}
      {hint && <p className="text-[9px] text-black/40 font-mono">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full bg-zinc-50 border border-black/10 focus:border-black px-3 py-2.5 text-xs font-mono outline-none rounded-none';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-none ${props.className ?? ''}`} />;
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center space-x-2 text-[10px] font-mono uppercase text-black/70 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-black w-4 h-4 cursor-pointer" />
      <span>{label}</span>
    </label>
  );
}

export function Card({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="border border-black/10 p-6 space-y-4">
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-black hover:bg-black/80 text-white px-5 py-2.5 text-[10px] font-mono tracking-widest font-bold uppercase transition-colors disabled:opacity-50 ${props.className ?? ''}`}
    />
  );
}

export function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`border border-black/20 hover:border-black px-5 py-2.5 text-[10px] font-mono tracking-widest font-bold uppercase transition-colors disabled:opacity-50 ${props.className ?? ''}`}
    />
  );
}

export function DangerButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`text-red-600 hover:text-red-800 text-[10px] font-mono tracking-widest font-bold uppercase transition-colors disabled:opacity-50 ${props.className ?? ''}`}
    />
  );
}

export function StatusBanner({ status }: { status: { type: 'success' | 'error'; message: string } | null }) {
  if (!status) return null;
  return (
    <p className={`text-[10px] font-mono uppercase ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
      {status.type === 'success' ? '✓ ' : '✗ '}{status.message}
    </p>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 space-y-1">
      <h1 className="text-xl font-black tracking-tight uppercase">{title}</h1>
      {subtitle && <p className="text-xs text-black/50">{subtitle}</p>}
    </div>
  );
}
