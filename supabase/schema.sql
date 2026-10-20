-- DCF Lab community schema. Run once in the Supabase SQL editor
-- (Project → SQL Editor → New query → paste → Run).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE
-- where Postgres supports it, and CREATE POLICY statements are preceded by
-- a DROP POLICY IF EXISTS so changes to this file can be re-applied.

-- ============================================================
-- profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  school text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable" on public.profiles for select using (true);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row (with a throwaway default username) whenever
-- someone signs up, so there's never a gap between auth.users and profiles.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- companies + company_prices (admin/service-role managed; no public write policy)
-- ============================================================
create table if not exists public.companies (
  slug text primary key,
  name text not null,
  ticker text not null,
  exchange text not null,
  sector text not null,
  currency text not null check (currency in ('INR', 'USD')),
  last_fy_revenue numeric not null,
  net_debt numeric not null,
  diluted_shares numeric not null,
  source text,
  as_of_date date,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;

drop policy if exists "companies are publicly readable" on public.companies;
create policy "companies are publicly readable" on public.companies for select using (true);

create table if not exists public.company_prices (
  id bigint generated always as identity primary key,
  company_slug text not null references public.companies(slug) on delete cascade,
  price numeric not null,
  as_of_date date not null,
  created_at timestamptz not null default now()
);

alter table public.company_prices enable row level security;

drop policy if exists "company prices are publicly readable" on public.company_prices;
create policy "company prices are publicly readable" on public.company_prices for select using (true);

-- ============================================================
-- models
-- ============================================================
create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  company_slug text not null references public.companies(slug),
  status text not null default 'draft' check (status in ('draft', 'published')),
  visibility text not null default 'public' check (visibility in ('public', 'unlisted', 'private')),
  source text not null check (source in ('builder', 'upload')),
  thesis text,
  assumptions jsonb,
  implied_price numeric,
  market_price_at_publish numeric,
  forked_from_id uuid references public.models(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.models enable row level security;

drop policy if exists "models are readable if public/unlisted or owned" on public.models;
create policy "models are readable if public/unlisted or owned" on public.models
  for select using (visibility in ('public', 'unlisted') or owner_id = auth.uid());

drop policy if exists "owners can insert their own models" on public.models;
create policy "owners can insert their own models" on public.models
  for insert with check (owner_id = auth.uid());

drop policy if exists "owners can update their own models" on public.models;
create policy "owners can update their own models" on public.models
  for update using (owner_id = auth.uid());

drop policy if exists "owners can delete their own models" on public.models;
create policy "owners can delete their own models" on public.models
  for delete using (owner_id = auth.uid());

-- ============================================================
-- model_versions (append-only edit history)
-- ============================================================
create table if not exists public.model_versions (
  id bigint generated always as identity primary key,
  model_id uuid not null references public.models(id) on delete cascade,
  version_number int not null,
  assumptions jsonb,
  thesis text,
  created_at timestamptz not null default now()
);

alter table public.model_versions enable row level security;

drop policy if exists "versions follow parent model visibility" on public.model_versions;
create policy "versions follow parent model visibility" on public.model_versions
  for select using (
    exists (
      select 1 from public.models m
      where m.id = model_id and (m.visibility in ('public', 'unlisted') or m.owner_id = auth.uid())
    )
  );

drop policy if exists "owners can insert versions for their own models" on public.model_versions;
create policy "owners can insert versions for their own models" on public.model_versions
  for insert with check (
    exists (select 1 from public.models m where m.id = model_id and m.owner_id = auth.uid())
  );

-- ============================================================
-- model_files (metadata only; bytes live in the "model-files" Storage bucket)
-- ============================================================
create table if not exists public.model_files (
  id bigint generated always as identity primary key,
  model_id uuid not null references public.models(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

alter table public.model_files enable row level security;

drop policy if exists "files follow parent model visibility" on public.model_files;
create policy "files follow parent model visibility" on public.model_files
  for select using (
    exists (
      select 1 from public.models m
      where m.id = model_id and (m.visibility in ('public', 'unlisted') or m.owner_id = auth.uid())
    )
  );

drop policy if exists "owners can insert files for their own models" on public.model_files;
create policy "owners can insert files for their own models" on public.model_files
  for insert with check (
    exists (select 1 from public.models m where m.id = model_id and m.owner_id = auth.uid())
  );

drop policy if exists "owners can delete their own files" on public.model_files;
create policy "owners can delete their own files" on public.model_files
  for delete using (
    exists (select 1 from public.models m where m.id = model_id and m.owner_id = auth.uid())
  );

-- ============================================================
-- comments (one level of threading via parent_id; soft-deleted, never hard-removed)
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  assumption_key text,
  body text not null,
  prompt_type text check (prompt_type in ('challenge', 'question', 'source')),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

alter table public.comments enable row level security;

drop policy if exists "comments follow parent model visibility" on public.comments;
create policy "comments follow parent model visibility" on public.comments
  for select using (
    exists (
      select 1 from public.models m
      where m.id = model_id and (m.visibility in ('public', 'unlisted') or m.owner_id = auth.uid())
    )
  );

drop policy if exists "authed users can insert comments on visible models" on public.comments;
create policy "authed users can insert comments on visible models" on public.comments
  for insert with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.models m
      where m.id = model_id and (m.visibility in ('public', 'unlisted') or m.owner_id = auth.uid())
    )
  );

drop policy if exists "authors can update their own comments" on public.comments;
create policy "authors can update their own comments" on public.comments
  for update using (author_id = auth.uid());

-- ============================================================
-- votes + saves
-- ============================================================
create table if not exists public.comment_votes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

alter table public.comment_votes enable row level security;

drop policy if exists "comment votes are publicly readable" on public.comment_votes;
create policy "comment votes are publicly readable" on public.comment_votes for select using (true);

drop policy if exists "users can vote as themselves" on public.comment_votes;
create policy "users can vote as themselves" on public.comment_votes for insert with check (user_id = auth.uid());

drop policy if exists "users can remove their own vote" on public.comment_votes;
create policy "users can remove their own vote" on public.comment_votes for delete using (user_id = auth.uid());

create table if not exists public.model_votes (
  model_id uuid not null references public.models(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (model_id, user_id)
);

alter table public.model_votes enable row level security;

drop policy if exists "model votes are publicly readable" on public.model_votes;
create policy "model votes are publicly readable" on public.model_votes for select using (true);

drop policy if exists "users can vote as themselves on models" on public.model_votes;
create policy "users can vote as themselves on models" on public.model_votes for insert with check (user_id = auth.uid());

drop policy if exists "users can remove their own model vote" on public.model_votes;
create policy "users can remove their own model vote" on public.model_votes for delete using (user_id = auth.uid());

create table if not exists public.saves (
  model_id uuid not null references public.models(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (model_id, user_id)
);

alter table public.saves enable row level security;

drop policy if exists "users can see their own saves" on public.saves;
create policy "users can see their own saves" on public.saves for select using (user_id = auth.uid());

drop policy if exists "users can save as themselves" on public.saves;
create policy "users can save as themselves" on public.saves for insert with check (user_id = auth.uid());

drop policy if exists "users can remove their own save" on public.saves;
create policy "users can remove their own save" on public.saves for delete using (user_id = auth.uid());

-- ============================================================
-- activity_events + notifications
-- ============================================================
create table if not exists public.activity_events (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('published', 'forked', 'commented', 'replied', 'upvoted', 'call_hit', 'call_missed')),
  model_id uuid references public.models(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  visible_publicly boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.activity_events enable row level security;

drop policy if exists "public events are readable by everyone" on public.activity_events;
create policy "public events are readable by everyone" on public.activity_events
  for select using (visible_publicly or actor_id = auth.uid());

drop policy if exists "users can insert their own events" on public.activity_events;
create policy "users can insert their own events" on public.activity_events
  for insert with check (actor_id = auth.uid());

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id bigint not null references public.activity_events(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "users can see their own notifications" on public.notifications;
create policy "users can see their own notifications" on public.notifications for select using (user_id = auth.uid());

drop policy if exists "users can mark their own notifications read" on public.notifications;
create policy "users can mark their own notifications read" on public.notifications for update using (user_id = auth.uid());

-- ============================================================
-- reports + admin moderation
-- ============================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  target_type text not null check (target_type in ('model', 'comment')),
  target_id uuid not null,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

drop policy if exists "admins can read reports" on public.reports;
create policy "admins can read reports" on public.reports for select using (public.is_admin());

drop policy if exists "authed users can file reports" on public.reports;
create policy "authed users can file reports" on public.reports for insert with check (reporter_id = auth.uid());

drop policy if exists "admins can update reports" on public.reports;
create policy "admins can update reports" on public.reports for update using (public.is_admin());

-- ============================================================
-- To make yourself an admin after you've signed in once:
--   update public.profiles set role = 'admin' where username = 'your_username_here';
-- ============================================================
