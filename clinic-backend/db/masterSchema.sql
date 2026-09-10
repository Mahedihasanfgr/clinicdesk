-- Master database schema
-- Run this on clinic_master database

CREATE TABLE IF NOT EXISTS clinics (
  id SERIAL PRIMARY KEY,
  clinic_code VARCHAR(30) UNIQUE NOT NULL,       -- e.g. "mehta_clinic" (used at login)
  clinic_name VARCHAR(150) NOT NULL,             -- e.g. "Mehta Wellness Clinic"
  doctor_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  db_name VARCHAR(60) UNIQUE NOT NULL,           -- e.g. "clinic_mehta_clinic"
  created_at TIMESTAMP DEFAULT NOW()
);
