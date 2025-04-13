-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  project TEXT NOT NULL,
  comments TEXT,
  total_hours NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_time_entries_updated_at
BEFORE UPDATE ON time_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select time_entries"
ON time_entries FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert time_entries"
ON time_entries FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update time_entries"
ON time_entries FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete time_entries"
ON time_entries FOR DELETE
TO authenticated
USING (true);
