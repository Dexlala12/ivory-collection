import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../lib/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
}

// Lets staff either upload a file (stored in the Supabase "media" bucket) or
// paste a URL directly — keeps the existing Unsplash-URL workflow available
// while making local uploads the easy default for non-technical users.
export default function ImageUploader({ value, onChange, folder, label = 'Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">{label}</label>
      <div className="flex items-start space-x-3">
        <div className="w-20 h-20 shrink-0 bg-zinc-100 border border-black/10 overflow-hidden flex items-center justify-center relative">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-[8px] font-mono text-black/30 uppercase text-center px-1">No image</span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
          )}
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-0.5 right-0.5 bg-black text-white p-0.5"
              aria-label="Clear image"
            >
              <X size={10} />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL, or upload a file"
            className="w-full bg-zinc-50 border border-black/10 focus:border-black px-3 py-2.5 text-xs font-mono outline-none rounded-none"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-1.5 border border-black/20 hover:border-black px-3 py-1.5 text-[9px] font-mono tracking-wider font-bold uppercase disabled:opacity-50"
          >
            <Upload size={11} />
            <span>{uploading ? 'Uploading...' : 'Upload file'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          {error && <p className="text-[9px] font-mono text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
