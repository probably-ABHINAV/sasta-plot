-- Idempotently add size_sqyd to public.plots if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'plots'
      AND column_name = 'size_sqyd'
  ) THEN
    ALTER TABLE public.plots
      ADD COLUMN size_sqyd integer;
  END IF;
END
$$;

-- Optional: basic sanity constraint (won't fail if it already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'plots_size_sqyd_positive'
      AND n.nspname = 'public'
      AND t.relname = 'plots'
  ) THEN
    ALTER TABLE public.plots
      ADD CONSTRAINT plots_size_sqyd_positive CHECK (size_sqyd IS NULL OR size_sqyd >= 0);
  END IF;
END
$$;

-- Add any missing columns or constraints
alter table public.plots 
add column if not exists images text[] default '{}',
add column if not exists image_url text,
add column if not exists slug text,
add column if not exists latitude double precision,
add column if not exists longitude double precision;

-- Generate slugs for existing records without slugs, handling duplicates
DO $$
DECLARE
    rec RECORD;
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER;
BEGIN
    FOR rec IN SELECT id, title FROM public.plots WHERE slug IS NULL ORDER BY created_at
    LOOP
        -- Generate base slug
        base_slug := lower(replace(replace(rec.title, ' ', '-'), '.', ''));
        base_slug := regexp_replace(base_slug, '[^a-z0-9-]', '', 'g');
        base_slug := regexp_replace(base_slug, '-+', '-', 'g');
        base_slug := trim(both '-' from base_slug);
        
        -- Handle duplicates by adding a counter
        final_slug := base_slug;
        counter := 1;
        
        WHILE EXISTS (SELECT 1 FROM public.plots WHERE slug = final_slug AND id != rec.id) LOOP
            final_slug := base_slug || '-' || counter;
            counter := counter + 1;
        END LOOP;
        
        -- Update the record with the unique slug
        UPDATE public.plots SET slug = final_slug WHERE id = rec.id;
    END LOOP;
END
$$;

-- Now handle existing duplicate slugs
DO $$
DECLARE
    rec RECORD;
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER;
BEGIN
    FOR rec IN 
        SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
        FROM public.plots 
        WHERE slug IS NOT NULL
    LOOP
        IF rec.rn > 1 THEN
            -- This is a duplicate, need to make it unique
            base_slug := rec.slug;
            final_slug := base_slug || '-' || rec.rn;
            counter := rec.rn;
            
            WHILE EXISTS (SELECT 1 FROM public.plots WHERE slug = final_slug AND id != rec.id) LOOP
                counter := counter + 1;
                final_slug := base_slug || '-' || counter;
            END LOOP;
            
            UPDATE public.plots SET slug = final_slug WHERE id = rec.id;
        END IF;
    END LOOP;
END
$$;

-- Make slug not null and unique after fixing duplicates
alter table public.plots 
alter column slug set not null;

-- Add unique constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'plots_slug_unique'
      AND n.nspname = 'public'
      AND t.relname = 'plots'
  ) THEN
    ALTER TABLE public.plots
      ADD CONSTRAINT plots_slug_unique UNIQUE (slug);
  END IF;
END
$$;

-- Add profiles table for role-based access
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Public can read profiles'
  ) THEN
    CREATE POLICY "Public can read profiles"
      ON public.profiles FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE TO authenticated
      USING (auth.uid() = id);
  END IF;
END
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies if needed
drop policy if exists "Public can read plots" on public.plots;
create policy "Public can read plots"
  on public.plots for select
  using (true);

drop policy if exists "Authenticated can write plots" on public.plots;
create policy "Authenticated can write plots"
  on public.plots for all to authenticated
  using (true) with check (true);