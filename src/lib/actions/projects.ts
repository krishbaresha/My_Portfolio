'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/actions/auth';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Project, ProjectUpsert } from '@/lib/supabase';

export async function upsertProjectAction(
  project: ProjectUpsert
): Promise<{ data: Project | null; error: string | null }> {
  await requireAdmin();

  const supabase = createServerSupabase();
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  const { id, ...rest } = project;
  const payload = {
    ...rest,
    ...(id ? { id } : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('projects')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin');
    if (project.slug) revalidatePath(`/projects/${project.slug}`);
  }

  return { data: data as Project | null, error: error?.message ?? null };
}

export async function deleteProjectAction(
  id: string
): Promise<{ error: string | null }> {
  await requireAdmin();

  const supabase = createServerSupabase();
  if (!supabase) {
    return { error: 'Supabase not configured' };
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin');
  }

  return { error: error?.message ?? null };
}
