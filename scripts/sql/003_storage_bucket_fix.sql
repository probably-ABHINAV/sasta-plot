-- Create plots bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('plots', 'plots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop all existing policies for plots bucket
DO $$
BEGIN
  -- Drop existing policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read plots') THEN
    DROP POLICY "Public read plots" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated upload plots') THEN
    DROP POLICY "Authenticated upload plots" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners update plots') THEN
    DROP POLICY "Owners update plots" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners delete plots') THEN
    DROP POLICY "Owners delete plots" ON storage.objects;
  END IF;
END
$$;

-- Create new policies for plots bucket
CREATE POLICY "Public read plots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'plots');

CREATE POLICY "Anyone can upload plots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'plots');

CREATE POLICY "Anyone can update plots"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'plots');

CREATE POLICY "Anyone can delete plots"
ON storage.objects
FOR DELETE
USING (bucket_id = 'plots');