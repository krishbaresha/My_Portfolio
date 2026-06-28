'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/actions/auth';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Testimonial } from '@/lib/supabase';

export async function addTestimonialAction(testimonial: {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar_url?: string;
}): Promise<{ data: Testimonial | null; error: string | null }> {
  await requireAdmin();

  const supabase = createServerSupabase();
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single();

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin');
  }

  return { data: data as Testimonial | null, error: error?.message ?? null };
}

export async function deleteTestimonialAction(
  id: string
): Promise<{ error: string | null }> {
  await requireAdmin();

  const supabase = createServerSupabase();
  if (!supabase) {
    return { error: 'Supabase not configured' };
  }

  const { error } = await supabase.from('testimonials').delete().eq('id', id);

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin');
  }

  return { error: error?.message ?? null };
}
