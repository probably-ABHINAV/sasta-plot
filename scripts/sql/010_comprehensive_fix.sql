-- Comprehensive fix for all database issues

-- Ensure plots table has all required columns
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS size_sqyd integer,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Generate slugs for existing records without slugs
DO $$
DECLARE
    rec RECORD;
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER;
BEGIN
    FOR rec IN SELECT id, title FROM public.plots WHERE slug IS NULL ORDER BY created_at NULLS LAST
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

-- Make slug not null after fixing
ALTER TABLE public.plots 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint if it doesn't exist
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

-- Enable RLS
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read plots" ON public.plots;
DROP POLICY IF EXISTS "Authenticated can write plots" ON public.plots;

-- Create comprehensive policies
CREATE POLICY "Public can read plots"
  ON public.plots FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert plots"
  ON public.plots FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update plots"
  ON public.plots FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete plots"
  ON public.plots FOR DELETE TO authenticated
  USING (true);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Public can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

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

-- Create inquiries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plot_id uuid REFERENCES public.plots(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Inquiries policies
DROP POLICY IF EXISTS "Authenticated can read inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;

CREATE POLICY "Authenticated can read inquiries"
  ON public.inquiries FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);
