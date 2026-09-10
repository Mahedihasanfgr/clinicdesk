import { useState } from "react";
import { S } from "../styles/styles";
import {
  FileText,
  Plus,
  Trash2,
  Pill,
  X,
  Sparkles,
  Save,
  AlertCircle
} from "lucide-react";

export default function Templates({ templates, addTemplate, deleteTemplate }) {
  const [showForm, setShowForm] = useState(false);
  const blankRx = () => ({ medicine: "", dosage: "", duration: "", instructions: "" });
  const [form, setForm] = useState({ name: "", prescription: [blankRx()] });
  const [err, setErr] = useState("");

  const addRx = () => setForm(f => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = i => setForm(f => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));
  const setRx = (i, k) => e => setForm(f => {
    const p = [...f.prescription];
    p[i] = { ...p[i], [k]: e.target.value };
    return { ...f, prescription: p };
  });

  const save = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      setErr("Template name is required");
      return;
    }
    await addTemplate({ ...form, id: "T-" + Date.now() });
    setShowForm(false);
    setForm({ name: "", prescription: [blankRx()] });
    setErr("");
  };

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Create Template Modal */}
      {showForm && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ ...S.modalBox, maxWidth: 720 }} className="animate-fade">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 16,
              borderBottom: "1px solid #E2E8F0",
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF",
                }}>
                  <Sparkles size={20} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Create Clinical Rx Template
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748B",
                  cursor: "pointer",
                }}
                className="btn-interactive"
              >
                <X size={16} />
              </button>
            </div>

            {err && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={save}>
              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>Template Clinical Title *</label>
                <input
                  style={{ ...S.input, fontWeight: 600 }}
                  value={form.name}
                  onChange={e => {
                    setErr("");
                    setForm(f => ({ ...f, name: e.target.value }));
                  }}
                  placeholder="e.g. Acute Viral URI Protocol, Type 2 DM Maintenance, Hypertension"
                  required
                  autoFocus
                />
              </div>

              <div style={{
                background: "#F8FAFC",
                borderRadius: 14,
                border: "1px solid #E2E8F0",
                padding: "16px 18px",
                marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0F766E",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  <Pill size={15} /> Included Medicines
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {form.prescription.map((rx, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr 36px", gap: 8, alignItems: "center" }}>
                      <input style={{ ...S.input, padding: "8px 10px", fontSize: 13 }} value={rx.medicine} onChange={setRx(i, "medicine")} placeholder="Medicine name" required />
                      <input style={{ ...S.input, padding: "8px 10px", fontSize: 13 }} value={rx.dosage} onChange={setRx(i, "dosage")} placeholder="Dosage" />
                      <input style={{ ...S.input, padding: "8px 10px", fontSize: 13 }} value={rx.duration} onChange={setRx(i, "duration")} placeholder="Duration" />
                      <input style={{ ...S.input, padding: "8px 10px", fontSize: 13 }} value={rx.instructions} onChange={setRx(i, "instructions")} placeholder="Instructions" />
                      <button
                        type="button"
                        style={{ ...S.btn, ...S.btnDanger, padding: "8px", width: 36, height: 36, borderRadius: 8 }}
                        onClick={() => rmRx(i)}
                        disabled={form.prescription.length === 1}
                        className="btn-interactive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  style={{ ...S.btn, ...S.btnSecondary, fontSize: 12.5, padding: "6px 12px", marginTop: 10, color: "#0D9488", fontWeight: 700 }}
                  onClick={addRx}
                  className="btn-interactive"
                >
                  <Plus size={14} /> Add Medicine
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" style={{ ...S.btn, ...S.btnSecondary, padding: "9px 16px" }} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" style={{ ...S.btn, ...S.btnPrimary, padding: "9px 20px" }} className="btn-interactive">
                  <Save size={15} />
                  <span>Save Clinical Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        ...S.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
          }}>
            <FileText size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                Prescription Protocols & Templates
              </h1>
              <span style={S.badge("teal")}>
                {templates.length} Saved Protocols
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
              Pre-configure frequent drug combinations for rapid 1-click consultation orders
            </p>
          </div>
        </div>

        <button
          style={{
            ...S.btn,
            ...S.btnPrimary,
            padding: "10px 18px",
            fontSize: 13.5,
            borderRadius: 12,
          }}
          className="btn-interactive"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          <span>New Prescription Protocol</span>
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div style={{
          ...S.card,
          textAlign: "center",
          padding: "54px 20px",
          color: "#64748B",
          border: "1px dashed #CBD5E1",
        }}>
          <Sparkles size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#334155" }}>
            No Saved Prescription Protocols
          </div>
          <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, marginBottom: 18 }}>
            Save regular clinical treatments (e.g. URI, HTN, Diabetes) to speed up OPD consultation workflow.
          </p>
          <button
            style={{ ...S.btn, ...S.btnPrimary, fontSize: 13, padding: "9px 18px" }}
            className="btn-interactive"
            onClick={() => setShowForm(true)}
          >
            <Plus size={15} />
            <span>Create First Template</span>
          </button>
        </div>
      ) : (
        <div style={S.grid2}>
          {templates.map(t => {
            const list = t.prescription || t.template_medicines || [];
            return (
              <div key={t.id} style={{ ...S.card, marginBottom: 0 }} className="card-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Pill size={18} color="#0D9488" />
                    <span style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>{t.name}</span>
                  </div>
                  <span style={S.badge("slate")}>
                    {list.length} Drugs
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {list.map((rx, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 12px",
                        background: "#F8FAFC",
                        borderRadius: 10,
                        border: "1px solid #E2E8F0",
                        fontSize: 13,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>
                        {rx.medicine}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                        {rx.dosage && `${rx.dosage} • `}{rx.duration && `${rx.duration} • `}{rx.instructions}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                  <button
                    style={{
                      ...S.btn,
                      ...S.btnDanger,
                      padding: "6px 12px",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                    className="btn-interactive"
                    onClick={() => {
                      if (window.confirm(`Delete protocol "${t.name}"?`)) {
                        deleteTemplate(t.id);
                      }
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
