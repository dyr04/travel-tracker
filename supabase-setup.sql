-- ============================================================
-- Travel Tracker — database setup
-- Paste this whole file into Supabase: SQL Editor -> New query -> Run
-- ============================================================

-- 1. One row per user holds all their trip data as JSON.
create table if not exists public.trip_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Turn on Row Level Security so users can ONLY see their own row.
alter table public.trip_data enable row level security;

-- 3. Policies: a signed-in user may read/write only their own row.
drop policy if exists "own row select" on public.trip_data;
create policy "own row select" on public.trip_data
  for select using (auth.uid() = user_id);

drop policy if exists "own row insert" on public.trip_data;
create policy "own row insert" on public.trip_data
  for insert with check (auth.uid() = user_id);

drop policy if exists "own row update" on public.trip_data;
create policy "own row update" on public.trip_data
  for update using (auth.uid() = user_id);

-- Done. Your data is now private per-account.
