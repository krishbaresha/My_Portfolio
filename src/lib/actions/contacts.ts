'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/actions/auth';
import { createServerSupabase } from '@/lib/supabase/server';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  created_at: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_COMPANY = 120;
const MAX_BUDGET = 60;
const MAX_MESSAGE = 4000;

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

/**
 * Validate and persist a contact submission. Returns a structured result so the
 * client can show field-level feedback. Uses the public anon-key path via the
 * shared client; the `contacts_public_insert` RLS policy permits this.
 */
export async function submitContactAction(
  input: ContactInput
): Promise<{ data: Contact | null; error: string | null }> {
  const name = String(input?.name ?? '').trim();
  const email = String(input?.email ?? '').trim();
  const company = String(input?.company ?? '').trim();
  const budget = String(input?.budget ?? '').trim();
  const message = String(input?.message ?? '').trim();

  if (!name || name.length > MAX_NAME) {
    return { data: null, error: 'Please enter your name.' };
  }
  if (!EMAIL_RE.test(email) || email.length > MAX_EMAIL) {
    return { data: null, error: 'Please enter a valid email address.' };
  }
  if (company.length > MAX_COMPANY) {
    return { data: null, error: 'Company name is too long.' };
  }
  if (budget.length > MAX_BUDGET) {
    return { data: null, error: 'Budget field is too long.' };
  }
  if (!message || message.length > MAX_MESSAGE) {
    return { data: null, error: 'Please enter a message (up to 4000 characters).' };
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return { data: null, error: 'Messaging is unavailable. Please try again later.' };
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([{ name, email, company, budget, message }])
    .select()
    .single();

  if (error) {
    console.error('Error saving contact:', error.message);
    return { data: null, error: 'Failed to send message. Please try again.' };
  }

  revalidatePath('/admin');
  return { data: data as Contact | null, error: null };
}

/**
 * Admin-only: list all contact submissions. Uses the service-role client so the
 * RLS policy (public insert only, no public read) is bypassed safely.
 */
export async function listContactsAction(): Promise<{ data: Contact[]; error: string | null }> {
  await requireAdmin();

  const supabase = createServerSupabase();
  if (!supabase) {
    return { data: [], error: 'Supabase not configured' };
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error.message);
    return { data: [], error: error.message };
  }

  return { data: (data as Contact[]) ?? [], error: null };
}
