-- supabase/migrations/20250425183100_create_checklist_template_items.sql

CREATE TABLE checklist_template_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL,
    item_order INT NOT NULL, -- To maintain the order of items within a template
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger to update updated_at timestamp
-- Ensure moddatetime extension is enabled: CREATE EXTENSION IF NOT EXISTS moddatetime;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON checklist_template_items
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Index for faster lookup by template_id
CREATE INDEX idx_checklist_template_items_template_id ON checklist_template_items(template_id);

COMMENT ON TABLE checklist_template_items IS 'Stores individual items or questions for each checklist template.';
COMMENT ON COLUMN checklist_template_items.template_id IS 'Foreign key linking to the parent checklist template.';
COMMENT ON COLUMN checklist_template_items.item_text IS 'The text of the checklist item (e.g., Fall til lavere nivå).';
COMMENT ON COLUMN checklist_template_items.item_order IS 'The display order of the item within its template.';
