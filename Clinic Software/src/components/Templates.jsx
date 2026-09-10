import { useState } from "react";
import { S } from "../styles/styles";

export default function Templates({ templates, addTemplate, deleteTemplate }) {
  const [showForm, setShowForm] = useState(false);
  const blankRx = () => ({ medicine: "", dosage: "", duration: "", instructions: "" });
  const [form, setForm] = useState({ name: "", prescription: [blankRx()] });

  const addRx = () => setForm(f => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = i => setForm(f => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));
  const setRx = (i, k) => e => setForm(f => { const p = [...f.prescription]; p[i] = { ...p[i], [k]: e.target.value }; return { ...f, prescription: p }; });

  const save = async () => {
    if (!form.name) return alert("Template name required");
    await addTemplate({ ...form, id: "T-" + Date.now() });
    setShowForm(false);
    setForm({ name: "", prescription: [blankRx()] });
  };

  return (
    <div>
      {showForm && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ ...S.modalBox, maxWidth: 700 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Create Template</div>
            <label style={S.label}>Template Name</label>
            <input style={{ ...S.input, marginBottom: 20 }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Common Cold, Diabetes Follow-up" />
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Medicines</div>
            {form.prescription.map((rx, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr auto", gap: 8, marginBottom: 8 }}>
                <input style={S.input} value={rx.medicine} onChange={setRx(i,"medicine")} placeholder="Medicine name" />
                <input style={S.input} value={rx.dosage} onChange={setRx(i,"dosage")} placeholder="Dosage" />
                <input style={S.input} value={rx.duration} onChange={setRx(i,"duration")} placeholder="Duration" />
                <input style={S.input} value={rx.instructions} onChange={setRx(i,"instructions")} placeholder="Instructions" />
                <button style={{ ...S.btn, ...S.btnDanger, padding: "8px 10px" }} onClick={() => rmRx(i)}>✕</button>
              </div>
            ))}
            <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 13, marginTop: 4 }} onClick={addRx}>+ Add Medicine</button>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button style={{ ...S.btn, ...S.btnSecondary }} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save}>Save Template</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Prescription Templates</div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowForm(true)}>+ New Template</button>
      </div>
      {templates.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", padding: 40 }}>No templates yet. Create one to save time on common prescriptions.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {templates.map(t => (
            <div key={t.id} style={S.card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📋 {t.name}</div>
              {(t.prescription || t.template_medicines || []).map((rx, i) => (
                <div key={i} style={{ fontSize: 13, padding: "6px 10px", background: "#f9fafb", borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{rx.medicine}</span> — {rx.dosage}, {rx.duration}
                  <div style={{ color: "#6b7280", fontSize: 12 }}>{rx.instructions}</div>
                </div>
              ))}
              <button style={{ ...S.btn, ...S.btnDanger, fontSize: 12, marginTop: 10 }} onClick={() => deleteTemplate(t.id)}>Delete Template</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
