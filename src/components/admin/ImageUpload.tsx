'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadPortfolioImage } from '@/lib/actions/storage';

type Props = {
  label: string;
  folder: 'projects' | 'testimonials';
  value: string;
  onChange: (url: string) => void;
  allowUrlFallback?: boolean;
};

export function ImageUpload({
  label,
  folder,
  value,
  onChange,
  allowUrlFallback = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append('file', file);

    const { url, error: err } = await uploadPortfolioImage(fd, folder);
    if (err || !url) {
      setError(err ?? 'Upload failed');
    } else {
      onChange(url);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
        {label}
      </label>

      <div className="flex gap-3 items-start">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-foreground/10"
          />
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1 py-3 rounded-xl border border-dashed border-foreground/20 text-xs text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {allowUrlFallback && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-field text-xs"
          placeholder="Or paste image URL…"
        />
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
