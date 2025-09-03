
-- Add missing columns to plots table
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS images text[];
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS size_unit text DEFAULT 'sq.yd';
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS plots_slug_idx ON public.plots(slug);

-- Update RLS policies to allow reading and writing for admin operations
DROP POLICY IF EXISTS "Anyone can view plots" ON public.plots;
DROP POLICY IF EXISTS "plots_public_read" ON public.plots;
DROP POLICY IF EXISTS "plots_owner_write" ON public.plots;

CREATE POLICY "Anyone can view plots" ON public.plots
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage plots" ON public.plots
  FOR ALL USING (true) WITH CHECK (true);

-- Ensure plot_images table exists and has proper policies
CREATE TABLE IF NOT EXISTS public.plot_images (
  id bigserial primary key,
  plot_id bigint not null references public.plots(id) on delete cascade,
  url text not null,
  created_at timestamptz default now()
);

ALTER TABLE public.plot_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plot_images_public_read" ON public.plot_images;
DROP POLICY IF EXISTS "plot_images_owner_write" ON public.plot_images;

CREATE POLICY "Anyone can view plot images" ON public.plot_images
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage plot images" ON public.plot_images
  FOR ALL USING (true) WITH CHECK (true);
