-- Drop the old overly restrictive constraint
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_type_check;

-- Add the new constraint with all supported types
ALTER TABLE events ADD CONSTRAINT events_type_check 
CHECK (type IN ('class', 'exam', 'study_session', 'task', 'deadline'));
