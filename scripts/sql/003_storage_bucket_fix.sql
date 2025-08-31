-- Robust, cross-version bucket creation and policies for 'plots'
-- Tries storage.create_bucket if available; otherwise upserts into storage.buckets.
-- Safe to run multiple times.

-- 1) Try create_bucket if the function exists (works on newer projects)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'storage' AND p.proname = 'create_bucket'
  ) THEN
    BEGIN
      PERFORM storage.create_bucket(
        id => 'plots',
        name => 'plots',
        public => true
      );
    EXCEPTION WHEN OTHERS THEN
      -- bucket may already exist; ignore
      NULL;
    END;
  END IF;
END
$$;

-- 2) Fallback: ensure bucket exists via direct upsert (cross-version safe)
INSERT INTO storage.buckets (id, name, public)
SELECT 'plots', 'plots', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'plots');

-- 3) Ensure RLS is enabled for storage.objects (should be by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4) Replace existing policies for 'plots' bucket with a clean set
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read plots'
  ) THEN
    EXECUTE 'DROP POLICY "Public read plots" ON storage.objects';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated upload plots'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated upload plots" ON storage.objects';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners update plots'
  ) THEN
    EXECUTE 'DROP POLICY "Owners update plots" ON storage.objects';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners delete plots'
  ) THEN
    EXECUTE 'DROP POLICY "Owners delete plots" ON storage.objects';
  END IF;
END
$$;

-- 5) Public read for plots images
CREATE POLICY "Public read plots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'plots');

-- 6) Authenticated users can upload to plots bucket
CREATE POLICY "Authenticated upload plots"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'plots');

-- 7) Only owners can update/delete their files in plots bucket
CREATE POLICY "Owners update plots"
ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'plots' AND owner = auth.uid())
WITH CHECK (bucket_id = 'plots' AND owner = auth.uid());

CREATE POLICY "Owners delete plots"
ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'plots' AND owner = auth.uid());
