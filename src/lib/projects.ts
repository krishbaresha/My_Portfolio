/**
 * Server-side project fetcher.
 * This file runs ONLY on the server (RSC / API routes).
 * It directly calls Supabase without exposing secrets to the client.
 */

import { createClient } from '@supabase/supabase-js';
import type { Project } from './supabase';

// Server-only Supabase client (can use service role key if needed)
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neuro Flow',
    slug: 'neuro-flow',
    description:
      'Autonomous multi-agent system executing visual web tasks and complex workflows with real-time UI tracking.',
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    tech_stack: ['Next.js', 'TypeScript', 'Puppeteer', 'Vector DB', 'AI'],
    github_url: 'https://github.com/krishbaresha/neuro-flow',
    live_url: 'https://neuro-flow.vercel.app',
    featured: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Aurora Canvas',
    slug: 'aurora-canvas',
    description:
      'High-performance WebGL creative dashboard representing system metrics through reactive flow fields.',
    thumbnail:
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
    tech_stack: ['Three.js', 'WebGL', 'GSAP', 'React Three Fiber', 'GLSL'],
    github_url: 'https://github.com/krishbaresha/aurora-canvas',
    live_url: 'https://aurora-canvas.vercel.app',
    featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Synapse RAG',
    slug: 'synapse-rag',
    description:
      'Local vector search and RAG engine optimized for real-time document intelligence and semantic queries.',
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    tech_stack: ['AI', 'pgvector', 'PostgreSQL', 'Gemini API', 'Python'],
    github_url: 'https://github.com/krishbaresha/synapse-rag',
    live_url: 'https://synapse-rag.vercel.app',
    featured: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Dashboard Forge',
    slug: 'dashboard-forge',
    description:
      'SaaS analytics dashboard with real-time charts, user segmentation, and webhook event pipelines.',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    tech_stack: ['Next.js', 'Supabase', 'Recharts', 'TypeScript', 'Tailwind'],
    github_url: 'https://github.com/krishbaresha/dashboard-forge',
    live_url: null,
    featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Prompt Forge',
    slug: 'prompt-forge',
    description:
      'AI prompt engineering studio with chain-of-thought debugging, version history, and model comparison.',
    thumbnail:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
    tech_stack: ['React', 'OpenAI', 'Anthropic', 'LangChain', 'Node.js'],
    github_url: 'https://github.com/krishbaresha/prompt-forge',
    live_url: null,
    featured: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Motion Studio',
    slug: 'motion-studio',
    description:
      'Visual animation composer for creating Framer Motion sequences with live code preview and export.',
    thumbnail:
      'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800',
    tech_stack: ['React', 'Framer Motion', 'Monaco Editor', 'TypeScript'],
    github_url: 'https://github.com/krishbaresha/motion-studio',
    live_url: null,
    featured: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Fetch all projects from Supabase, ordered by sort_order.
 * Gracefully falls back to static data if Supabase is unconfigured.
 * Results are cached for 60 seconds by Next.js fetch cache.
 */
export async function getProjects(): Promise<Project[]> {
  const client = getServerClient();

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

    return (data as Project[]).length > 0 ? (data as Project[]) : FALLBACK_PROJECTS;
  } catch (err) {
    console.error('[projects] Unexpected error:', err);
    return FALLBACK_PROJECTS;
  }
}
