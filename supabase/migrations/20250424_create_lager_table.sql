-- Create table for Lager
CREATE TABLE lager (
  id SERIAL PRIMARY KEY,
  navn TEXT NOT NULL,
  antall INTEGER NOT NULL,
  beskrivelse TEXT
);
