-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id BIGINT REFERENCES abonnementer(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  inspection_date DATE NOT NULL,
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('vårvedlikehold', 'høstvedlikehold', 'rehabilitering')),
  status TEXT NOT NULL CHECK (status IN ('planlagt', 'utført')),
  notes TEXT,
  roof_condition TEXT,
  inspector TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_inspections_updated_at
BEFORE UPDATE ON inspections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select inspections"
ON inspections FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert inspections"
ON inspections FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update inspections"
ON inspections FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete inspections"
ON inspections FOR DELETE
TO authenticated
USING (true);
