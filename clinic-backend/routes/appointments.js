import express from "express";
import auth from "../middleware.js";

const router = express.Router();

// GET - exclude completed by default, include with ?all=true
router.get("/", auth, async (req, res) => {
  try {
    const statusClause = req.query.all === "true" ? "" : "AND status != 'completed'";
    const result = await req.pool.query(
      `SELECT *, to_char(date, 'YYYY-MM-DD') AS date FROM appointments WHERE clinic_id = $1 ${statusClause} ORDER BY appointments.date DESC, time ASC`,
      [req.clinicId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { patientId, patientName, date, time, reason, status } = req.body;
  try {
    const seqResult = await req.pool.query("SELECT nextval('appointment_id_seq') AS val");
    const id = `APT-${String(seqResult.rows[0].val).padStart(4, "0")}`;
    const result = await req.pool.query(
      `INSERT INTO appointments (id, clinic_id, patient_id, patient_name, date, time, reason, status)
       VALUES ($1,$2,$3,$4,$5::date,$6,$7,$8) RETURNING *, to_char(date, 'YYYY-MM-DD') AS date`,
      [id, req.clinicId, patientId || null, patientName, date, time, reason, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await req.pool.query(
      "UPDATE appointments SET status=$1 WHERE id=$2 AND clinic_id=$3 RETURNING *, to_char(date, 'YYYY-MM-DD') AS date",
      [status, req.params.id, req.clinicId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Appointment not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await req.pool.query("DELETE FROM appointments WHERE id=$1 AND clinic_id=$2", [req.params.id, req.clinicId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
