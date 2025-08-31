create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_self" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 'user')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.plots (
  id bigserial primary key,
  title text not null,
  location text not null,
  price numeric(12,2) not null,
  size_sqyd integer not null,
  description text,
  featured boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.plots enable row level security;
create policy "plots_public_read" on public.plots for select to anon, authenticated using (true);
create policy "plots_owner_write" on public.plots for all to authenticated
  using (created_by = auth.uid()) with check (created_by = auth.uid());

create table if not exists public.plot_images (
  id bigserial primary key,
  plot_id bigint not null references public.plots(id) on delete cascade,
  url text not null,
  created_at timestamptz default now()
);
alter table public.plot_images enable row level security;
create policy "plot_images_public_read" on public.plot_images for select to anon, authenticated using (true);
create policy "plot_images_owner_write" on public.plot_images for all to authenticated
  using (exists (select 1 from public.plots p where p.id = plot_id and p.created_by = auth.uid()))
  with check (exists (select 1 from public.plots p where p.id = plot_id and p.created_by = auth.uid()));

create table if not exists public.inquiries (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text,
  message text,
  plot_id bigint references public.plots(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.inquiries enable row level security;
create policy "inquiries_insert_any" on public.inquiries for insert to anon, authenticated with check (true);
create policy "inquiries_read_auth" on public.inquiries for select to authenticated using (true);

create table if not exists public.posts (
  id bigserial primary key,
  title text not null,
  slug text unique not null,
  content text,
  published boolean default false,
  author uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.posts enable row level security;
create policy "posts_public_read_published" on public.posts for select to anon, authenticated using (published = true);
create policy "posts_author_write" on public.posts for all to authenticated using (author = auth.uid()) with check (author = auth.uid());

-- Storage bucket for plots
select storage.create_bucket('plots', public := true);

-- Storage policies
create policy "storage_read_plots" on storage.objects for select to anon, authenticated using (bucket_id = 'plots');
create policy "storage_write_plots" on storage.objects for insert to authenticated with check (bucket_id = 'plots');
create policy "storage_update_delete_own" on storage.objects for update to authenticated
  using (bucket_id = 'plots' and owner = auth.uid())
  with check (bucket_id = 'plots' and owner = auth.uid());

-- Helpful indexes
create index if not exists plots_featured_idx on public.plots (featured);
create index if not exists plots_location_idx on public.plots (location);
create index if not exists plot_images_plot_id_idx on public.plot_images (plot_id);
create index if not exists inquiries_plot_id_idx on public.inquiries (plot_id);
create index if not exists posts_slug_idx on public.posts (slug);
