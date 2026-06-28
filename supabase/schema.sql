-- Portfolio Supabase schema
-- Run in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

-- ─── Projects ─────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  slug                 text not null unique,
  description          text,
  technical_challenge  text,
  architecture         text,
  impact_metrics       jsonb not null default '[]'::jsonb,
  category             text not null default 'Full Stack',
  thumbnail            text,
  tech_stack           text[] not null default '{}',
  github_url           text,
  live_url             text,
  featured             boolean not null default false,
  sort_order           int not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists projects_sort_order_idx on public.projects (sort_order asc);

-- ─── Testimonials ─────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  company     text not null,
  text        text not null,
  avatar_url  text,
  rating      int not null default 5 check (rating between 1 and 5),
  created_at  timestamptz not null default now()
);

-- ─── Contacts ─────────────────────────────────────────────────────────────────
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  company    text,
  budget     text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ─── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.contacts enable row level security;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
  on public.projects for select using (true);

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read"
  on public.testimonials for select using (true);

drop policy if exists "contacts_public_insert" on public.contacts;
create policy "contacts_public_insert"
  on public.contacts for insert with check (true);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "portfolio_assets_public_read" on storage.objects;
create policy "portfolio_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

drop policy if exists "portfolio_assets_service_write" on storage.objects;
create policy "portfolio_assets_service_write"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets');

drop policy if exists "portfolio_assets_service_update" on storage.objects;
create policy "portfolio_assets_service_update"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets');

drop policy if exists "portfolio_assets_service_delete" on storage.objects;
create policy "portfolio_assets_service_delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets');
