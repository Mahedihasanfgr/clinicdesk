import express from "express";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const templates = await req.pool.query(
      "SELECT * FROM templates WHERE clinic_id = $1 ORDER BY created_at DESC",
      [req.clinicId]
    );
    const medicines = await req.pool.query(
      `SELECT tm.* FROM template_medicines tm
       JOIN templates t ON tm.template_id = t.id
       WHERE t.clinic_id = $1`,
      [req.clinicId]
    );
    const result = templates.rows.map(t => ({
      ...t,
      prescription: medicines.rows.filter(m => m.template_id === t.id)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { id, name, prescription } = req.body;
  const client = await req.pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "INSERT INTO templates (id, clinic_id, name) VALUES ($1,$2,$3)",
      [id, req.clinicId, name]
    );
    for (const rx of prescription || []) {
      await client.query(
        "INSERT INTO template_medicines (template_id, medicine, dosage, duration, instructions) VALUES ($1,$2,$3,$4,$5)",
        [id, rx.medicine, rx.dosage, rx.duration, rx.instructions]
      );
    }
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await req.pool.query("DELETE FROM templates WHERE id=$1 AND clinic_id=$2", [req.params.id, req.clinicId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
