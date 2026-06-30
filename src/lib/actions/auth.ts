'use server';

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/**
 * The admin passcode. Supports both ADMIN_SECRET (documented in .env.example)
 * and ADMIN_PASSCODE (present in some local configs) so a naming mismatch
 * cannot silently disable authentication.
 */
function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSCODE;
}

/**
 * HMAC key used to sign session tokens. Derived from the admin secret so no
 * additional env var is required, but mixed with a static domain-separation
 * string so the token cannot be replayed as (or derived from) the passcode.
 */
function getSessionSigningKey(): string {
  const secret = getAdminSecret();
  if (!secret) return '';
  return `${secret}::admin-session-signing-key-v1`;
}

/**
 * Create a session token: a random id + an HMAC over that id.
 * Format: "<hexId>.<hexMac>". The id is non-secret; the MAC proves we issued it.
 */
function createSessionToken(): string {
  const id = crypto.randomUUID() + crypto.randomUUID(); // ~64 hex chars
  const mac = createHmac('sha256', getSessionSigningKey()).update(id).digest('hex');
  return `${id}.${mac}`;
}

/** Verify a session token's structure and HMAC in constant time. */
function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;

  const lastDot = token.lastIndexOf('.');
  const id = token.slice(0, lastDot);
  const mac = token.slice(lastDot + 1);
  if (!id || !mac) return false;

  const expectedMac = createHmac('sha256', getSessionSigningKey()).update(id).digest('hex');

  // Compare in constant time. Lengths must match for timingSafeEqual.
  if (mac.length !== expectedMac.length) return false;
  try {
    return timingSafeEqual(Buffer.from(mac), Buffer.from(expectedMac));
  } catch {
    return false;
  }
}

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    throw new Error('Unauthorized');
  }
}

export async function verifyAdminPasscode(
  passcode: string
): Promise<{ success: boolean; error?: string }> {
  const secret = getAdminSecret();
  if (!secret) {
    return { success: false, error: 'Admin not configured. Set ADMIN_SECRET in env.' };
  }

  // Constant-time comparison to avoid timing leaks of the secret's prefix.
  const passcodeBuf = Buffer.from(String(passcode));
  const secretBuf = Buffer.from(secret);
  let match = false;
  if (passcodeBuf.length === secretBuf.length) {
    try {
      match = timingSafeEqual(passcodeBuf, secretBuf);
    } catch {
      match = false;
    }
  }

  if (!match) {
    return { success: false, error: 'Invalid passcode. Access denied.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return { success: true };
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export { requireAdmin };
