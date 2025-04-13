-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  client TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'archived')),
  start_date DATE NOT NULL,
  end_date DATE,
  budget NUMERIC,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_projects table
CREATE TABLE IF NOT EXISTS scheduled_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, scheduled_date)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_projects_updated_at
BEFORE UPDATE ON scheduled_projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select projects"
ON projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects"
ON projects FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete projects"
ON projects FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to select scheduled_projects"
ON scheduled_projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert scheduled_projects"
ON scheduled_projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update scheduled_projects"
ON scheduled_projects FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete scheduled_projects"
ON scheduled_projects FOR DELETE
TO authenticated
USING (true);
