-- Migration: enriched project metadata for Bento dashboard
-- Run in Supabase Dashboard → SQL Editor (safe to re-run)

alter table public.projects
  add column if not exists technical_challenge text,
  add column if not exists architecture text,
  add column if not exists impact_metrics jsonb not null default '[]'::jsonb,
  add column if not exists category text not null default 'Full Stack';

create index if not exists projects_category_idx on public.projects (category);

comment on column public.projects.technical_challenge is 'Primary engineering problem solved';
comment on column public.projects.architecture is 'Stack / system design summary';
comment on column public.projects.impact_metrics is 'Array of {label, value} business metrics';
comment on column public.projects.category is 'Filter category: AI | WebGL | Full Stack | SaaS';
