-- Single Database Unified Multi-Tenant Schema for ClinicDesk

-- Global Sequences
CREATE SEQUENCE IF NOT EXISTS patient_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS appointment_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS visit_id_seq START 1;

-- 1. Clinics Master Table
CREATE TABLE IF NOT EXISTS clinics (
  id SERIAL PRIMARY KEY,
  clinic_code VARCHAR(30) UNIQUE NOT NULL,
  clinic_name VARCHAR(150) NOT NULL,
  doctor_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  db_name VARCHAR(60) DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Drop unique db_name constraint if present from old master schema
ALTER TABLE clinics DROP CONSTRAINT IF EXISTS clinics_db_name_key;

-- 2. Users Table (Tenant Isolated via clinic_id)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clinic_id INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Patients Table (Tenant Isolated via clinic_id)
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(20) PRIMARY KEY,
  clinic_id INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100),
  age INTEGER,
  gender VARCHAR(10),
  contact VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  blood_group VARCHAR(5),
  allergy TEXT,
  ongoing_medicines TEXT,
  kco TEXT,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 4. Visits Table (Tenant Isolated via clinic_id)
CREATE TABLE IF NOT EXISTS visits (
  id VARCHAR(20) PRIMARY KEY,
  clinic_id INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id VARCHAR(20) REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  chief_complaint TEXT,
  symptoms TEXT,
  diagnosis TEXT,
  notes TEXT,
  fee NUMERIC(10,2),
  followup_date DATE,
  followup_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Vitals Table
CREATE TABLE IF NOT EXISTS vitals (
  id SERIAL PRIMARY KEY,
  visit_id VARCHAR(20) REFERENCES visits(id) ON DELETE CASCADE,
  bp VARCHAR(20),
  sugar VARCHAR(30),
  temp VARCHAR(20),
  weight VARCHAR(20),
  pulse VARCHAR(20)
);

-- 6. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  visit_id VARCHAR(20) REFERENCES visits(id) ON DELETE CASCADE,
  medicine VARCHAR(100),
  dosage VARCHAR(50),
  times_per_day VARCHAR(20),
  days VARCHAR(20),
  instructions TEXT
);

-- 7. Appointments Table (Tenant Isolated via clinic_id)
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(20) PRIMARY KEY,
  clinic_id INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id VARCHAR(20) REFERENCES patients(id) ON DELETE CASCADE,
  patient_name VARCHAR(100),
  date DATE NOT NULL,
  time VARCHAR(10),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed','waiting','completed','cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Templates Table (Tenant Isolated via clinic_id)
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(30) PRIMARY KEY,
  clinic_id INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. Template Medicines Table
CREATE TABLE IF NOT EXISTS template_medicines (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(30) REFERENCES templates(id) ON DELETE CASCADE,
  medicine VARCHAR(100),
  dosage VARCHAR(50),
  duration VARCHAR(50),
  instructions TEXT
);

-- Migration fallback for pre-existing tables without clinic_id
ALTER TABLE users ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE;

-- Drop legacy unique username constraint across table, replace with (clinic_id, username)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE users DROP CONSTRAINT IF EXISTS unique_clinic_username;
ALTER TABLE users ADD CONSTRAINT unique_clinic_username UNIQUE (clinic_id, username);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_clinic ON users(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_clinic ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_visits_clinic ON visits(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_templates_clinic ON templates(clinic_id);
