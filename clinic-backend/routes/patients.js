import express from "express";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const patients = await req.pool.query(
      "SELECT * FROM patients WHERE clinic_id = $1 ORDER BY created_at DESC",
      [req.clinicId]
    );
    const visits = await req.pool.query(
      `SELECT v.id, v.patient_id, to_char(v.date, 'YYYY-MM-DD') AS visit_date,
        v.chief_complaint, v.symptoms, v.diagnosis, v.notes, v.fee, v.created_at,
        to_char(v.followup_date, 'YYYY-MM-DD') AS followup_date, v.followup_note,
        json_build_object('bp',vt.bp,'sugar',vt.sugar,'temp',vt.temp,'weight',vt.weight,'pulse',vt.pulse) AS vitals,
        COALESCE(json_agg(json_build_object(
          'id',p.id,'medicine',p.medicine,'dosage',p.dosage,
          'times_per_day',p.times_per_day,'days',p.days,'instructions',p.instructions
        )) FILTER (WHERE p.id IS NOT NULL), '[]') AS prescription
      FROM visits v
      LEFT JOIN vitals vt ON vt.visit_id = v.id
      LEFT JOIN prescriptions p ON p.visit_id = v.id
      WHERE v.clinic_id = $1
      GROUP BY v.id, vt.bp, vt.sugar, vt.temp, vt.weight, vt.pulse
      ORDER BY v.date DESC`,
      [req.clinicId]
    );

    const result = patients.rows.map(p => ({
      ...p,
      bloodGroup: p.blood_group,
      visits: visits.rows.filter(v => v.patient_id === p.id).map(v => ({ ...v, date: v.visit_date }))
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { name, surname, age, gender, contact, email, address, bloodGroup, allergy, ongoingMedicines, kco } = req.body;
  try {
    const seqResult = await req.pool.query("SELECT nextval('patient_id_seq') AS val");
    const id = `OPD-${String(seqResult.rows[0].val).padStart(4, "0")}`;
    const result = await req.pool.query(
      `INSERT INTO patients (id, clinic_id, name, surname, age, gender, contact, email, address, blood_group, allergy, ongoing_medicines, kco)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [id, req.clinicId, name, surname, age, gender, contact, email, address, bloodGroup, allergy, ongoingMedicines, kco]
    );
    res.json({ ...result.rows[0], bloodGroup: result.rows[0].blood_group, visits: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { name, surname, age, gender, contact, email, address, bloodGroup, allergy, ongoingMedicines, kco } = req.body;
  try {
    const result = await req.pool.query(
      `UPDATE patients SET name=$1, surname=$2, age=$3, gender=$4, contact=$5, email=$6,
       address=$7, blood_group=$8, allergy=$9, ongoing_medicines=$10, kco=$11
       WHERE id=$12 AND clinic_id=$13 RETURNING *`,
      [name, surname, age, gender, contact, email, address, bloodGroup, allergy, ongoingMedicines, kco, req.params.id, req.clinicId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Patient not found" });
    res.json({ ...result.rows[0], bloodGroup: result.rows[0].blood_group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/visits", auth, async (req, res) => {
  const { date, chief_complaint, symptoms, diagnosis, notes, fee, vitals, prescription, followup_date, followup_note } = req.body;
  const client = await req.pool.connect();
  try {
    await client.query("BEGIN");
    const patientCheck = await client.query(
      "SELECT id FROM patients WHERE id = $1 AND clinic_id = $2",
      [req.params.id, req.clinicId]
    );
    if (patientCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Patient not found in this clinic" });
    }
    const seqResult = await client.query("SELECT nextval('visit_id_seq') AS val");
    const id = `V-${String(seqResult.rows[0].val).padStart(4, "0")}`;
    await client.query(
      "INSERT INTO visits (id, clinic_id, patient_id, date, chief_complaint, symptoms, diagnosis, notes, fee, followup_date, followup_note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [id, req.clinicId, req.params.id, date, chief_complaint, symptoms, diagnosis, notes, fee, followup_date || null, followup_note || null]
    );
    if (vitals) {
      await client.query(
        "INSERT INTO vitals (visit_id, bp, sugar, temp, weight, pulse) VALUES ($1,$2,$3,$4,$5,$6)",
        [id, vitals.bp, vitals.sugar, vitals.temp, vitals.weight, vitals.pulse]
      );
    }
    for (const rx of prescription || []) {
      await client.query(
        "INSERT INTO prescriptions (visit_id, medicine, dosage, times_per_day, days, instructions) VALUES ($1,$2,$3,$4,$5,$6)",
        [id, rx.medicine, rx.dosage, rx.times_per_day, rx.days, rx.instructions]
      );
    }
    await client.query("COMMIT");
    res.json({ success: true, visitId: id });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
