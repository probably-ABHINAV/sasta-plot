-- Idempotent schema + RLS without using storage.create_bucket (replaces 001_init.sql)
-- Run order: 1) 004_schema_rerun.sql, 2) 003_storage_bucket_fix.sql, 3) 002_seed.sql

begin;

-- PROFILES (optional, used by auth if needed later)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text default 'user',
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

-- Allow users to read their own profile; admins can be added later
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can read own profile'
  ) then
    create policy "Users can read own profile"
      on public.profiles for select
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert own profile'
  ) then
    create policy "Users can insert own profile"
      on public.profiles for insert to authenticated
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on public.profiles for update to authenticated
      using (auth.uid() = id) with check (auth.uid() = id);
  end if;
end $$;

-- PLOTS
create table if not exists public.plots (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  price numeric(12,2),
  area_sqft integer,
  description text,
  featured boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.plots enable row level security;

-- RLS: public can read; authenticated can write
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='plots' and policyname='Public can read plots'
  ) then
    create policy "Public can read plots"
      on public.plots for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='plots' and policyname='Authenticated can write plots'
  ) then
    create policy "Authenticated can write plots"
      on public.plots for all to authenticated
      using (true) with check (true);
  end if;
end $$;

-- PLOT IMAGES
create table if not exists public.plot_images (
  id uuid primary key default gen_random_uuid(),
  plot_id uuid not null references public.plots(id) on delete cascade,
  url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);
alter table public.plot_images enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='plot_images' and policyname='Public can read plot_images'
  ) then
    create policy "Public can read plot_images"
      on public.plot_images for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='plot_images' and policyname='Authenticated can write plot_images'
  ) then
    create policy "Authenticated can write plot_images"
      on public.plot_images for all to authenticated
      using (true) with check (true);
  end if;
end $$;

-- INQUIRIES
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  plot_id uuid references public.plots(id) on delete set null,
  name text not null,
  email text,
  phone text,
  message text,
  created_at timestamp with time zone default now()
);
alter table public.inquiries enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inquiries' and policyname='Public can create inquiries'
  ) then
    create policy "Public can create inquiries"
      on public.inquiries for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inquiries' and policyname='Authenticated can read inquiries'
  ) then
    create policy "Authenticated can read inquiries"
      on public.inquiries for select to authenticated
      using (true);
  end if;
end $$;

-- BLOG POSTS (simple)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  published boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='Public can read published posts'
  ) then
    create policy "Public can read published posts"
      on public.posts for select
      using (published = true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='posts' and policyname='Authenticated can write posts'
  ) then
    create policy "Authenticated can write posts"
      on public.posts for all to authenticated
      using (true) with check (true);
  end if;
end $$;

commit;
