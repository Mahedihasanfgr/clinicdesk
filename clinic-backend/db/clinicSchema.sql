-- Per-clinic database schema
-- This is applied to each new clinic's own database

-- Sequences for server-side ID generation
CREATE SEQUENCE IF NOT EXISTS patient_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS appointment_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS visit_id_seq START 1;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(20) PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS visits (
  id VARCHAR(20) PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS vitals (
  id SERIAL PRIMARY KEY,
  visit_id VARCHAR(20) REFERENCES visits(id) ON DELETE CASCADE,
  bp VARCHAR(20),
  sugar VARCHAR(30),
  temp VARCHAR(20),
  weight VARCHAR(20),
  pulse VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  visit_id VARCHAR(20) REFERENCES visits(id) ON DELETE CASCADE,
  medicine VARCHAR(100),
  dosage VARCHAR(50),
  times_per_day VARCHAR(20),
  days VARCHAR(20),
  instructions TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(20) PRIMARY KEY,
  patient_id VARCHAR(20) REFERENCES patients(id) ON DELETE CASCADE,
  patient_name VARCHAR(100),
  date DATE NOT NULL,
  time VARCHAR(10),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed','waiting','completed','cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS template_medicines (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(30) REFERENCES templates(id) ON DELETE CASCADE,
  medicine VARCHAR(100),
  dosage VARCHAR(50),
  duration VARCHAR(50),
  instructions TEXT
);
