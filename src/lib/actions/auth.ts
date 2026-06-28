'use server';

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = 'authenticated';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET;
}

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (session !== SESSION_VALUE) {
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

  if (passcode !== secret) {
    return { success: false, error: 'Invalid passcode. Access denied.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
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
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export { requireAdmin };
