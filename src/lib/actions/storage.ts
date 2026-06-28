'use server';

import sharp from 'sharp';
import { requireAdmin } from '@/lib/actions/auth';
import { createServerSupabase } from '@/lib/supabase/server';
import { UPLOAD_CONSTRAINTS } from '@/lib/assets';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

async function optimizeImage(buffer: Buffer): Promise<{ data: Buffer; contentType: string; ext: string }> {
  const optimized = await sharp(buffer)
    .rotate()
    .resize(UPLOAD_CONSTRAINTS.maxWidth, UPLOAD_CONSTRAINTS.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: UPLOAD_CONSTRAINTS.webpQuality, effort: 4 })
    .toBuffer();

  return { data: optimized, contentType: 'image/webp', ext: 'webp' };
}

export async function uploadPortfolioImage(
  formData: FormData,
  folder: 'projects' | 'testimonials'
): Promise<{ url: string | null; error: string | null }> {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { url: null, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'Invalid file type. Use JPEG, PNG, WebP, AVIF, or GIF.' };
  }

  if (file.size > UPLOAD_CONSTRAINTS.maxBytes) {
    return { url: null, error: 'File too large. Maximum size is 5MB.' };
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return { url: null, error: 'Supabase not configured' };
  }

  const raw = Buffer.from(await file.arrayBuffer());
  const { data, contentType, ext } = await optimizeImage(raw);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('portfolio-assets').upload(path, data, {
    cacheControl: '31536000',
    upsert: false,
    contentType,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: publicUrl } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
  return { url: publicUrl.publicUrl, error: null };
}
