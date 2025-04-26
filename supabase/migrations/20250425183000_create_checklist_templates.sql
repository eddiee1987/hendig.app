-- supabase/migrations/20250425183000_create_checklist_templates.sql

CREATE TABLE checklist_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    -- department_id uuid REFERENCES departments(id), -- Optional: Uncomment if you have a departments table
    is_active BOOLEAN DEFAULT true NOT NULL -- To allow soft deletes or disabling templates
);

-- Trigger to update updated_at timestamp
-- Ensure moddatetime extension is enabled: CREATE EXTENSION IF NOT EXISTS moddatetime;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON checklist_templates
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

COMMENT ON TABLE checklist_templates IS 'Stores reusable checklist templates for HMS.';
COMMENT ON COLUMN checklist_templates.name IS 'The name of the checklist template (e.g., Arbeid i høyden).';
COMMENT ON COLUMN checklist_templates.description IS 'A brief description of the template''s purpose.';
COMMENT ON COLUMN checklist_templates.created_by IS 'User who created the template.';
-- COMMENT ON COLUMN checklist_templates.department_id IS 'Optional department association.';
COMMENT ON COLUMN checklist_templates.is_active IS 'Whether the template is currently active and available for use.';
