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
