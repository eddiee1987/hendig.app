-- supabase/migrations/20250425183300_create_checklist_items.sql

CREATE TABLE checklist_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id uuid NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    template_item_id uuid NOT NULL REFERENCES checklist_template_items(id) ON DELETE CASCADE, -- Link to the template item definition
    is_checked BOOLEAN DEFAULT false NOT NULL, -- Or maybe a different type if you need more states (e.g., N/A)
    comment TEXT, -- Optional comments for the specific item
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger to update updated_at timestamp
-- Ensure moddatetime extension is enabled: CREATE EXTENSION IF NOT EXISTS moddatetime;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON checklist_items
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Indexes for faster lookups
CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_template_item_id ON checklist_items(template_item_id);

COMMENT ON TABLE checklist_items IS 'Stores the status and comments for each item within a specific checklist instance.';
COMMENT ON COLUMN checklist_items.checklist_id IS 'Foreign key linking to the specific checklist instance.';
COMMENT ON COLUMN checklist_items.template_item_id IS 'Foreign key linking to the definition of the item in the template.';
COMMENT ON COLUMN checklist_items.is_checked IS 'Indicates whether the checklist item has been checked off.';
COMMENT ON COLUMN checklist_items.comment IS 'Optional user comments specific to this item in this checklist instance.';
