-- Create table for lager transactions (historikk)
CREATE TABLE IF NOT EXISTS lager_transactions (
  id SERIAL PRIMARY KEY,
  lager_id INTEGER NOT NULL REFERENCES lager(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('inntak', 'uttak')),
  antall INTEGER NOT NULL,
  kommentar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Index for faster lookup by lager_id
CREATE INDEX IF NOT EXISTS idx_lager_transactions_lager_id ON lager_transactions(lager_id);
