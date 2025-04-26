-- Add customer_name column to inspections table if it doesn't exist
ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Update comment on the table
COMMENT ON COLUMN inspections.customer_name IS 'The name of the customer for this inspection';
