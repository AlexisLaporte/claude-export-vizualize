-- Check if user_id column exists, if not add it
-- Note: SQLite doesn't have IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we need to handle this in the migration script

-- First, check the schema
-- If the column doesn't exist, this will be run by the migration script
ALTER TABLE exports ADD COLUMN user_id TEXT;
