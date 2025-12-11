-- Add status column to events table for tracking completion
ALTER TABLE events ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Optional: Update existing rows to have a status
UPDATE events SET status = 'pending' WHERE status IS NULL;
