/**
 * Batch re-optimize images already in Supabase Storage.
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in env.
 *
 * Usage: node scripts/batch-optimize-storage.mjs
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'portfolio-assets';
const MAX_W = 1200;
const MAX_H = 800;
const QUALITY = 82;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function optimizeBuffer(buffer) {
  return sharp(buffer)
    .rotate()
    .resize(MAX_W, MAX_H, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();
}

async function processFolder(prefix) {
  const { data: files, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 500 });
  if (error) throw error;

  for (const file of files ?? []) {
    if (!file.name || file.name.endsWith('/')) continue;
    const path = `${prefix}/${file.name}`;
    if (file.name.endsWith('.webp')) {
      console.log(`skip (already webp): ${path}`);
      continue;
    }

    const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path);
    if (dlErr || !blob) {
      console.warn(`skip download failed: ${path}`);
      continue;
    }

    const optimized = await optimizeBuffer(Buffer.from(await blob.arrayBuffer()));
    const webpPath = path.replace(/\.[^.]+$/, '.webp');

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(webpPath, optimized, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

    if (upErr) console.error(`upload failed: ${webpPath}`, upErr.message);
    else console.log(`optimized → ${webpPath} (${(optimized.length / 1024).toFixed(1)} KB)`);
  }
}

await processFolder('projects');
await processFolder('testimonials');
console.log('Done.');
