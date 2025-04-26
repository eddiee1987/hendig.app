-- supabase/migrations/20250425183400_enable_rls_checklists.sql

-- Enable RLS for all new tables
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Policies for checklist_templates
DROP POLICY IF EXISTS "Allow authenticated read access to active templates" ON checklist_templates;
CREATE POLICY "Allow authenticated read access to active templates"
    ON checklist_templates FOR SELECT
    USING (auth.role() = 'authenticated' AND is_active = true);

DROP POLICY IF EXISTS "Allow users to insert their own templates" ON checklist_templates;
CREATE POLICY "Allow users to insert their own templates"
    ON checklist_templates FOR INSERT
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Allow users to update their own templates" ON checklist_templates;
CREATE POLICY "Allow users to update their own templates"
    ON checklist_templates FOR UPDATE
    USING (auth.uid() = created_by);

-- Policies for checklist_template_items
DROP POLICY IF EXISTS "Allow authenticated read access to items of active templates" ON checklist_template_items;
CREATE POLICY "Allow authenticated read access to items of active templates"
    ON checklist_template_items FOR SELECT
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM checklist_templates ct
            WHERE ct.id = checklist_template_items.template_id AND ct.is_active = true
        )
    );

DROP POLICY IF EXISTS "Allow users to insert items for their own templates" ON checklist_template_items;
CREATE POLICY "Allow users to insert items for their own templates"
    ON checklist_template_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM checklist_templates ct
            WHERE ct.id = checklist_template_items.template_id AND ct.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow users to update items for their own templates" ON checklist_template_items;
CREATE POLICY "Allow users to update items for their own templates"
    ON checklist_template_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM checklist_templates ct
            WHERE ct.id = checklist_template_items.template_id AND ct.created_by = auth.uid()
        )
    );

-- Policies for checklists
DROP POLICY IF EXISTS "Allow users to read their own checklists" ON checklists;
CREATE POLICY "Allow users to read their own checklists"
    ON checklists FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert their own checklists" ON checklists;
CREATE POLICY "Allow users to insert their own checklists"
    ON checklists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to update their own checklists" ON checklists;
CREATE POLICY "Allow users to update their own checklists"
    ON checklists FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for checklist_items
DROP POLICY IF EXISTS "Allow users to read items of their own checklists" ON checklist_items;
CREATE POLICY "Allow users to read items of their own checklists"
    ON checklist_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM checklists c
            WHERE c.id = checklist_items.checklist_id AND c.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow users to insert items for their own checklists" ON checklist_items;
CREATE POLICY "Allow users to insert items for their own checklists"
    ON checklist_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM checklists c
            WHERE c.id = checklist_items.checklist_id AND c.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow users to update items for their own checklists" ON checklist_items;
CREATE POLICY "Allow users to update items for their own checklists"
    ON checklist_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM checklists c
            WHERE c.id = checklist_items.checklist_id AND c.user_id = auth.uid()
        )
    );

-- Note: DELETE policies are omitted for now. Add them if needed, e.g.:
-- CREATE POLICY "Allow users to delete their own templates" ON checklist_templates FOR DELETE USING (auth.uid() = created_by);
-- CREATE POLICY "Allow users to delete items for their own templates" ON checklist_template_items FOR DELETE USING (...);
-- CREATE POLICY "Allow users to delete their own checklists" ON checklists FOR DELETE USING (auth.uid() = user_id);
-- CREATE POLICY "Allow users to delete items for their own checklists" ON checklist_items FOR DELETE USING (...);
