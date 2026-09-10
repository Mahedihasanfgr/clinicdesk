import express from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { clinicName, clinicCode, doctorName, doctorPassword, receptionPassword, email } = req.body;

  if (!clinicName || !clinicCode || !doctorName || !doctorPassword || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const safeCode = clinicCode.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if clinic code or email already exists
    const existing = await client.query(
      "SELECT id FROM clinics WHERE clinic_code = $1 OR email = $2",
      [safeCode, email.trim().toLowerCase()]
    );
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Clinic code or email already registered" });
    }

    // Insert clinic into master clinics table
    const clinicRes = await client.query(
      "INSERT INTO clinics (clinic_code, clinic_name, doctor_name, email, db_name) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [safeCode, clinicName.trim(), doctorName.trim(), email.trim().toLowerCase(), "public"]
    );
    const clinicId = clinicRes.rows[0].id;

    // Hash passwords
    const doctorHash = await bcrypt.hash(doctorPassword, 10);
    const receptionHash = await bcrypt.hash(receptionPassword || "reception123", 10);

    // Insert Doctor and Reception accounts linked by clinic_id
    await client.query(
      "INSERT INTO users (clinic_id, username, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)",
      [clinicId, "doctor", doctorHash, "doctor", doctorName.trim()]
    );
    await client.query(
      "INSERT INTO users (clinic_id, username, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)",
      [clinicId, "reception", receptionHash, "receptionist", `Reception - ${clinicName.trim()}`]
    );

    await client.query("COMMIT");
    res.json({ success: true, clinicCode: safeCode });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
