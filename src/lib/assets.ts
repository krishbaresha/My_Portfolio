/**
 * Asset performance utilities.
 *
 * Strategy for sub-1s LCP:
 * 1. Upload via admin → server action compresses to WebP (max 1200px) before Supabase Storage.
 * 2. next/image serves responsive srcset with priority on first 2 Bento cards only.
 * 3. RSC streams project metadata immediately; thumbnails hydrate progressively.
 * 4. Batch pre-warm: run `node scripts/batch-optimize-storage.mjs` to re-process existing assets.
 * 5. Storage cacheControl: 31536000 (1yr immutable) — CDN edge cache after first hit.
 */

export const IMAGE_SIZES = {
  bentoFeatured: '(max-width: 768px) 100vw, 66vw',
  bentoStandard: '(max-width: 768px) 100vw, 33vw',
  detailHero: '(max-width: 768px) 100vw, 1200px',
} as const;

export const UPLOAD_CONSTRAINTS = {
  maxWidth: 1200,
  maxHeight: 800,
  webpQuality: 82,
  maxBytes: 5 * 1024 * 1024,
} as const;

/** Priority image count for above-the-fold Bento cards. */
export const PRIORITY_IMAGE_COUNT = 2;

/**
 * Batch-process an array of async tasks with concurrency limit.
 * Used client-side for idle-time prefetch of remaining thumbnails.
 */
export async function batchProcess<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  batchSize = 4
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(processor));
  }
}

/** Schedule work during browser idle time to avoid blocking main thread. */
export function scheduleIdle(task: () => void): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: 2000 });
  } else {
    setTimeout(task, 16);
  }
}
