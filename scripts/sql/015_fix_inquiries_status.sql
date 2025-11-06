
-- Add status column to inquiries table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'inquiries' 
      AND column_name = 'status'
  ) THEN
    ALTER TABLE inquiries ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
END $$;

-- Update existing rows without status
UPDATE inquiries SET status = 'pending' WHERE status IS NULL;

-- Add a check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'inquiries_status_check'
  ) THEN
    ALTER TABLE inquiries 
    ADD CONSTRAINT inquiries_status_check 
    CHECK (status IN ('pending', 'seen', 'responded', 'closed'));
  END IF;
END $$;
