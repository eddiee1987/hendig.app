-- supabase/migrations/20250425183200_create_checklists.sql

-- Define an enum type for checklist status
CREATE TYPE checklist_status AS ENUM ('Påbegynt', 'Fullført');

CREATE TABLE checklists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid NOT NULL REFERENCES checklist_templates(id),
    user_id uuid NOT NULL REFERENCES auth.users(id), -- User who filled out the checklist
    -- project_id uuid REFERENCES projects(id), -- Optional: Link to a project
    -- location_id uuid REFERENCES locations(id), -- Optional: Link to a location
    status checklist_status DEFAULT 'Påbegynt' NOT NULL,
    completed_at TIMESTAMPTZ, -- Timestamp when the checklist was marked as completed
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger to update updated_at timestamp
-- Ensure moddatetime extension is enabled: CREATE EXTENSION IF NOT EXISTS moddatetime;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON checklists
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Indexes for faster lookups
CREATE INDEX idx_checklists_template_id ON checklists(template_id);
CREATE INDEX idx_checklists_user_id ON checklists(user_id);
CREATE INDEX idx_checklists_status ON checklists(status);
-- CREATE INDEX idx_checklists_project_id ON checklists(project_id); -- Optional
-- CREATE INDEX idx_checklists_location_id ON checklists(location_id); -- Optional

COMMENT ON TABLE checklists IS 'Stores instances of filled-out checklists based on templates.';
COMMENT ON COLUMN checklists.template_id IS 'The template this checklist instance is based on.';
COMMENT ON COLUMN checklists.user_id IS 'The user who initiated and filled out this checklist.';
-- COMMENT ON COLUMN checklists.project_id IS 'Optional link to the project associated with this checklist.';
-- COMMENT ON COLUMN checklists.location_id IS 'Optional link to the location where the checklist was performed.';
COMMENT ON COLUMN checklists.status IS 'The current status of the checklist (Påbegynt, Fullført).';
COMMENT ON COLUMN checklists.completed_at IS 'Timestamp when the checklist status was set to Fullført.';
