'use server';

import { requireAdmin } from '@/lib/actions/auth';
import { createServerSupabase } from '@/lib/supabase/server';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

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

  if (file.size > MAX_BYTES) {
    return { url: null, error: 'File too large. Maximum size is 5MB.' };
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return { url: null, error: 'Supabase not configured' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(ext) ? ext : 'webp';
  const path = `${folder}/${crypto.randomUUID()}.${safeExt}`;

  const { error } = await supabase.storage
    .from('portfolio-assets')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
