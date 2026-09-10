import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password, clinicCode } = req.body;
  if (!clinicCode) return res.status(400).json({ error: "Clinic code is required" });

  try {
    // 1. Find clinic in master clinics table
    const clinicResult = await pool.query(
      "SELECT * FROM clinics WHERE clinic_code = $1",
      [clinicCode.toLowerCase().trim()]
    );
    const clinic = clinicResult.rows[0];
    if (!clinic) return res.status(401).json({ error: "Clinic not found. Check your clinic code." });

    // 2. Find user inside this clinic (filtering by clinic_id)
    const inputUser = (username || "").trim().toLowerCase();
    let userResult = await pool.query(
      "SELECT * FROM users WHERE clinic_id = $1 AND LOWER(username) = $2",
      [clinic.id, inputUser]
    );
    let user = userResult.rows[0];

    // Fallback: If username wasn't matched directly, check if user entered clinic email or doctor name
    if (!user) {
      if (inputUser === (clinic.email || "").toLowerCase() || inputUser === (clinic.doctor_name || "").toLowerCase()) {
        const docResult = await pool.query(
          "SELECT * FROM users WHERE clinic_id = $1 AND role = 'doctor' LIMIT 1",
          [clinic.id]
        );
        user = docResult.rows[0];
      } else if (inputUser === "receptionist") {
        const recResult = await pool.query(
          "SELECT * FROM users WHERE clinic_id = $1 AND role = 'receptionist' LIMIT 1",
          [clinic.id]
        );
        user = recResult.rows[0];
      }
    }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // 3. Sign JWT with clinicId so middleware can route queries safely
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        clinicId: clinic.id,
        clinicCode: clinic.clinic_code,
        clinicName: clinic.clinic_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        clinicId: clinic.id,
        clinicCode: clinic.clinic_code,
        clinicName: clinic.clinic_name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
