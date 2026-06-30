/**
 * Simple in-memory token-bucket rate limiter for server-side use.
 *
 * Limits are per-identifier (typically the client IP). State lives in the
 * Node.js process, so this is best-effort and approximate across serverless
 * instances — sufficient to stop trivial abuse of the AI endpoints without
 * adding external dependencies. For stricter limits, swap the Map for a
 * durable store (Upstash/KV, Vercel KV) keeping the same signature.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface LimitConfig {
  /** Maximum tokens a bucket can hold (= burst capacity). */
  capacity: number;
  /** Tokens added per second (refill rate = sustained throughput). */
  refillPerSecond: number;
}

interface LimitResult {
  allowed: boolean;
  /** Minimum epoch ms the caller should wait before retrying, or null. */
  retryAfterMs: number | null;
}

const buckets = new Map<string, Bucket>();
// Bound memory growth: evict expired buckets periodically.
const MAX_BUCKETS = 10_000;

function pruneIfNeeded(): void {
  if (buckets.size < MAX_BUCKETS) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > 60_000 && bucket.tokens <= 0) {
      buckets.delete(key);
    }
  }
}

/**
 * Returns the client IP from a Request, preferring forwarded-for headers.
 * Falls back to 'unknown' (all such callers share one bucket).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Check a request against the rate limit. Returns whether it is allowed and,
 * if not, how long to wait. Consumes one token when allowed.
 */
export function checkRateLimit(identifier: string, config: LimitConfig): LimitResult {
  const now = Date.now();
  let bucket = buckets.get(identifier);

  if (!bucket) {
    bucket = { tokens: config.capacity, lastRefill: now };
    buckets.set(identifier, bucket);
    pruneIfNeeded();
  } else {
    // Refill based on elapsed time.
    const elapsedSeconds = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(config.capacity, bucket.tokens + elapsedSeconds * config.refillPerSecond);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterMs: null };
  }

  // Need 1 token; compute time until at least 1 token is available.
  const deficit = 1 - bucket.tokens;
  const retryAfterMs = Math.ceil((deficit / config.refillPerSecond) * 1000);
  return { allowed: false, retryAfterMs };
}

/**
 * Convenience helper for Next.js Route Handlers. Returns a 429 NextResponse
 * if the request exceeds the limit, otherwise null.
 *
 * Usage:
 *   const limited = rateLimitResponse(req, 'chat', { capacity: 10, refillPerSecond: 0.2 });
 *   if (limited) return limited;
 */
export function rateLimitResponse(
  req: Request,
  scope: string,
  config: LimitConfig
): Response | null {
  const ip = getClientIp(req);
  const result = checkRateLimit(`${scope}:${ip}`, config);
  if (result.allowed) return null;

  const retryAfterSec = Math.max(1, Math.ceil((result.retryAfterMs ?? 1000) / 1000));
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please slow down.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSec),
      },
    }
  );
}
