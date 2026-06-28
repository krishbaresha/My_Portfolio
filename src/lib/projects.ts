/**
 * Server-side project fetcher.
 * Runs only on the server (RSC / Server Actions).
 */

import { createServerSupabase } from '@/lib/supabase/server';
import { FALLBACK_PROJECTS } from '@/lib/fallback-data';
import type { Project } from './supabase';

function normalizeProject(row: Record<string, unknown>): Project {
  const base = row as unknown as Project;
  return {
    ...base,
    impact_metrics: Array.isArray(row.impact_metrics)
      ? (row.impact_metrics as Project['impact_metrics'])
      : [],
    category: (row.category as string) ?? 'Full Stack',
    technical_challenge: (row.technical_challenge as string | null) ?? null,
    architecture: (row.architecture as string | null) ?? null,
  };
}

/**
 * Fetch all projects ordered by sort_order.
 * Cached for 60s via Next.js fetch cache on the Supabase client.
 */
export async function getProjects(): Promise<Project[]> {
  const client = createServerSupabase();

  if (!client) {
    console.warn('[projects] Supabase not configured — using fallback data');
    return FALLBACK_PROJECTS;
  }

  try {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[projects] Supabase query error:', error.message);
      return FALLBACK_PROJECTS;
    }

    const rows = (data ?? []).map(normalizeProject);
    return rows.length > 0 ? rows : FALLBACK_PROJECTS;
  } catch (err) {
    console.error('[projects] Unexpected error:', err);
    return FALLBACK_PROJECTS;
  }
}

/** Fetch a single project by slug for case-study pages. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const client = createServerSupabase();

  if (!client) {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
    }

    return normalizeProject(data);
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}
