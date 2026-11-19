-- Ruang Berani: run this whole file once in Supabase > SQL Editor.
create extension if not exists pgcrypto;

-- ============ staff profiles ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'pending' check (role in ('pending','staff','admin')),
  can_read_stories boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','admin')) $$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;
create or replace function public.can_read_stories() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid()
    and (role = 'admin' or (role = 'staff' and can_read_stories))) $$;

alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
drop policy if exists "admin read profiles" on public.profiles;
drop policy if exists "admin update profiles" on public.profiles;
create policy "own profile" on public.profiles for select using (id = auth.uid());
create policy "admin read profiles" on public.profiles for select using (public.is_admin());
create policy "admin update profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- ============ public content ============
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null, nta text, position text, location text, photo_url text, bio text,
  sort_order int not null default 0,
  consent_confirmed boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null, caption text, date_label text, location text, description text,
  cover_url text, photos text[] not null default '{}',
  sort_order int not null default 0,
  consent_confirmed boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  section text not null default 'highlight' check (section in ('trusted','highlight')),
  name text not null, organization text, rating int not null default 5 check (rating between 0 and 5),
  quote text not null,
  sort_order int not null default 0,
  consent_confirmed boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.affiliations (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text not null unique, logo_url text, description text,
  status text default 'Affiliation', since_label text, until_label text default 'Undecided time',
  sort_order int not null default 0,
  consent_confirmed boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

do $$
declare t text;
begin
  foreach t in array array['members','events','testimonials','affiliations'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('drop policy if exists "staff all" on public.%I', t);
    -- visitors only ever see items that are published AND have confirmed permission
    execute format('create policy "public read" on public.%I for select using (published and consent_confirmed)', t);
    execute format('create policy "staff all" on public.%I for all using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

alter table public.site_settings enable row level security;
drop policy if exists "settings read" on public.site_settings;
drop policy if exists "settings write" on public.site_settings;
create policy "settings read" on public.site_settings for select using (true);
create policy "settings write" on public.site_settings for all using (public.is_staff()) with check (public.is_staff());

-- ============ stories (sensitive) ============
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  mode text not null check (mode in ('anonymous','identified')),
  is_minor boolean not null default false,
  category text not null,
  story_body text not null check (char_length(story_body) between 20 and 8000),
  reporter_name text check (char_length(reporter_name) <= 120),
  reporter_contact text check (char_length(reporter_contact) <= 160),
  school_name text check (char_length(school_name) <= 160),
  consent_storage boolean not null,
  consent_adaptation boolean not null default false,
  consent_publication boolean not null default false,
  consent_school_forward boolean not null default false,
  guardian_permission boolean not null default false,
  consent_version text not null default 'v1',
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','in_review','referred','closed'))
);
alter table public.stories enable row level security;
drop policy if exists "anyone can submit" on public.stories;
drop policy if exists "reader select" on public.stories;
drop policy if exists "reader update" on public.stories;
drop policy if exists "admin delete" on public.stories;
-- Visitors can INSERT only (never read), and only with storage consent given.
create policy "anyone can submit" on public.stories for insert to anon, authenticated
  with check (consent_storage = true and status = 'new');
create policy "reader select" on public.stories for select using (public.can_read_stories());
create policy "reader update" on public.stories for update using (public.can_read_stories()) with check (public.can_read_stories());
create policy "admin delete" on public.stories for delete using (public.is_admin());

-- Only the status may change after submission.
create or replace function public.stories_status_only() returns trigger language plpgsql as $$
begin
  if (to_jsonb(new) - 'status') is distinct from (to_jsonb(old) - 'status') then
    raise exception 'Only status can be updated';
  end if;
  return new;
end $$;
drop trigger if exists stories_status_only on public.stories;
create trigger stories_status_only before update on public.stories
  for each row execute function public.stories_status_only();

create table if not exists public.story_access_log (
  id bigint generated always as identity primary key,
  story_id uuid references public.stories(id) on delete cascade,
  staff_id uuid not null default auth.uid(),
  action text not null,
  created_at timestamptz not null default now()
);
alter table public.story_access_log enable row level security;
drop policy if exists "log insert" on public.story_access_log;
drop policy if exists "log read" on public.story_access_log;
create policy "log insert" on public.story_access_log for insert with check (staff_id = auth.uid() and public.can_read_stories());
create policy "log read" on public.story_access_log for select using (public.is_admin());

-- ============ media storage ============
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
drop policy if exists "media read" on storage.objects;
drop policy if exists "media insert" on storage.objects;
drop policy if exists "media update" on storage.objects;
drop policy if exists "media delete" on storage.objects;
create policy "media read" on storage.objects for select using (bucket_id = 'media');
create policy "media insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_staff());
create policy "media update" on storage.objects for update using (bucket_id = 'media' and public.is_staff());
create policy "media delete" on storage.objects for delete using (bucket_id = 'media' and public.is_staff());
