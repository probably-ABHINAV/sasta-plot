
-- Create inquiries table for contact form submissions
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  plot_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies if needed
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Allow read access (adjust as needed for your auth setup)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'inquiries' 
      AND policyname = 'Allow read access to inquiries'
  ) THEN
    CREATE POLICY "Allow read access to inquiries" ON inquiries
      FOR SELECT USING (true);
  END IF;

  -- Allow insert access (adjust as needed for your auth setup)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'inquiries' 
      AND policyname = 'Allow insert access to inquiries'
  ) THEN
    CREATE POLICY "Allow insert access to inquiries" ON inquiries
      FOR INSERT WITH CHECK (true);
  END IF;
END
$$;
