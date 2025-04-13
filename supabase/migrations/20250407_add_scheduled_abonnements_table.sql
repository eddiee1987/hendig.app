-- Create scheduled_abonnements table
CREATE TABLE IF NOT EXISTS scheduled_abonnements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  abonnement_id BIGINT REFERENCES abonnementer(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_scheduled_abonnements_updated_at
BEFORE UPDATE ON scheduled_abonnements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE scheduled_abonnements ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select scheduled_abonnements"
ON scheduled_abonnements FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert scheduled_abonnements"
ON scheduled_abonnements FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update scheduled_abonnements"
ON scheduled_abonnements FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete scheduled_abonnements"
ON scheduled_abonnements FOR DELETE
TO authenticated
USING (true);
