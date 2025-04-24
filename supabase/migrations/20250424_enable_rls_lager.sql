-- Allow read access to lager_transactions for anon/public
CREATE POLICY "Allow read access to lager_transactions for anon" ON lager_transactions
FOR SELECT USING (true);

-- Allow read access to lager for anon/public
CREATE POLICY "Allow read access to lager for anon" ON lager
FOR SELECT USING (true);

-- Enable RLS if not already enabled
ALTER TABLE lager_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lager ENABLE ROW LEVEL SECURITY;
