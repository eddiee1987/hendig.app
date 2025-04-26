-- Legg til før- og etter-bilder i inspections
ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS before_images TEXT[];

ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS after_images TEXT[];
