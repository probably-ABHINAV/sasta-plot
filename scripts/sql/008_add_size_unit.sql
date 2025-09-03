
-- Add size_unit column to plots table
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS size_unit TEXT DEFAULT 'sq.yd';

-- Update existing records to have default unit
UPDATE public.plots 
SET size_unit = 'sq.yd' 
WHERE size_unit IS NULL;
