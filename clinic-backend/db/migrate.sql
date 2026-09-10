-- Add surname to patients
ALTER TABLE patients ADD COLUMN IF NOT EXISTS surname VARCHAR(100);

-- Add medical history fields to patients
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergy TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS ongoing_medicines TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS kco TEXT;

-- Add chief_complaint to visits
ALTER TABLE visits ADD COLUMN IF NOT EXISTS chief_complaint TEXT;

-- Add followup fields to visits
ALTER TABLE visits ADD COLUMN IF NOT EXISTS followup_date DATE;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS followup_note TEXT;

-- Fix prescriptions: replace duration/instructions with times_per_day and days
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS times_per_day VARCHAR(20);
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS days VARCHAR(20);
