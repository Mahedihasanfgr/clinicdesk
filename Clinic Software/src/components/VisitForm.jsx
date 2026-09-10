import { useState } from "react";
import { createPortal } from "react-dom";
import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";
import { printPrescription } from "../utils/printPrescription";
import { apiSendWhatsApp } from "../api";
import {
  Stethoscope,
  Pill,
  Plus,
  Trash2,
  Printer,
  Copy,
  Clock,
  AlertTriangle,
  FileText,
  Activity,
  DollarSign,
  Send,
  X,
  Sparkles,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function VisitForm({ patient, lastVisit, templates, onSave, onClose, userRole }) {
  const blankRx = () => ({ medicine: "", dosage: "", times_per_day: "", days: "", instructions: "" });
  const [form, setForm] = useState({
    date: today(),
    chief_complaint: "",
    symptoms: "",
    diagnosis: "",
    notes: "",
    vitals: { bp: "", sugar: "", temp: "", weight: "", pulse: "" },
    prescription: [blankRx()],
    fee: 500,
    followup_date: "",
    followup_note: ""
  });
  const [showHistory, setShowHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const setF = k => e => {
    setErr("");
    setForm(f => ({ ...f, [k]: e.target.value }));
  };
  const setV = k => e => setForm(f => ({ ...f, vitals: { ...f.vitals, [k]: e.target.value } }));
  const setRx = (i, k) => e => setForm(f => {
    const p = [...f.prescription];
    p[i] = { ...p[i], [k]: e.target.value };
    return { ...f, prescription: p };
  });
  const addRx = () => setForm(f => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = i => setForm(f => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));

  const applyTemplate = t => {
    setForm(f => ({
      ...f,
      prescription: t.prescription.map(r => ({ ...r, times_per_day: r.times_per_day || "", days: r.days || "" }))
    }));
  };

  const copyLast = () => {
    if (lastVisit) {
      setForm(f => ({
        ...f,
        prescription: (lastVisit.prescription || []).map(r => ({ ...r })),
        diagnosis: lastVisit.diagnosis || f.diagnosis
      }));
    }
  };

  const save = async () => {
    if (!form.chief_complaint.trim()) {
      setErr("Chief complaint is required to document the visit.");
      return;
    }
    setSending(true);
    try {
      const savedVisit = await onSave(form);
      const visitData = { ...form, id: savedVisit?.id || savedVisit?.visitId || "" };
      printPrescription(patient, visitData);
    } catch (e) {
      setErr(e.message || "Failed to save visit record.");
    } finally {
      setSending(false);
    }
  };

  const sortedVisits = [...(patient.visits || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return createPortal(
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 880, maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: "1px solid #E2E8F0",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
            }}>
              <Stethoscope size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Clinical Encounter: {patient.name} {patient.surname || ""}
                </h2>
                <span style={{ ...S.badge("slate"), fontSize: 11, fontFamily: "monospace" }}>
                  #{patient.id}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 1 }}>
                OPD consultation note, vital parameters, and digital prescription
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {sortedVisits.length > 0 && (
              <button
                style={{
                  ...S.btn,
                  ...S.btnSecondary,
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 8,
                }}
                className="btn-interactive"
                onClick={() => setShowHistory(v => !v)}
              >
                <FileText size={13} color="#0D9488" />
                <span>{showHistory ? "Hide Past Visits" : `History (${sortedVisits.length})`}</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
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
        </div>

        {/* Error Alert */}
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

        {/* History Accordion Dropdown */}
        {showHistory && (
          <div style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 16,
            maxHeight: 220,
            overflowY: "auto",
          }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: "#0F766E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Previous Patient Consultations
            </div>
            {sortedVisits.map((v, idx) => (
              <div key={v.id} style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}>{fmtDate(v.date)}</span>
                  {idx === 0 && <span style={S.badge("teal")}>Latest</span>}
                </div>
                {v.chief_complaint && <div style={{ fontSize: 12, color: "#334155" }}><strong>CC:</strong> {v.chief_complaint}</div>}
                {v.diagnosis && <div style={{ fontSize: 12, color: "#64748B" }}><strong>Diagnosis:</strong> {v.diagnosis}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Patient Allergy & KCO Warning Banner */}
        {(patient.kco || patient.allergy || patient.ongoing_medicines || patient.ongoingMedicines) && (
          <div style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 16,
            padding: "10px 14px",
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 10,
            fontSize: 12.5,
          }}>
            {patient.allergy && (
              <span style={{ color: "#B91C1C", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertTriangle size={14} /> Allergy: {patient.allergy}
              </span>
            )}
            {patient.kco && (
              <span style={{ color: "#4338CA", fontWeight: 600 }}>
                • K/C/O: {patient.kco}
              </span>
            )}
            {(patient.ongoing_medicines || patient.ongoingMedicines) && (
              <span style={{ color: "#15803D", fontWeight: 600 }}>
                • Ongoing: {patient.ongoing_medicines || patient.ongoingMedicines}
              </span>
            )}
          </div>
        )}

        {/* Chief Complaint */}
        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>Chief Complaint *</label>
          <input
            style={{ ...S.input, fontWeight: 600 }}
            value={form.chief_complaint}
            onChange={setF("chief_complaint")}
            placeholder="Primary symptoms, duration, reasons for OPD consultation..."
            autoFocus
          />
        </div>

        {/* Vitals Strip */}
        <div style={{
          background: "#F8FAFC",
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          padding: "12px 16px",
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <Activity size={14} color="#0D9488" /> Clinical Vitals
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {[
              ["bp", "BP (mmHg)", "120/80"],
              ["sugar", "Blood Sugar", "mg/dL"],
              ["temp", "Temp (°F)", "98.6"],
              ["weight", "Weight (kg)", "65"],
              ["pulse", "Pulse (bpm)", "72"]
            ].map(([k, l, ph]) => (
              <div key={k}>
                <label style={{ ...S.label, fontSize: 11.5, color: "#64748B", marginBottom: 3 }}>{l}</label>
                <input
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13, background: "#FFFFFF" }}
                  value={form.vitals[k]}
                  onChange={setV(k)}
                  placeholder={ph}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Symptoms & Diagnosis */}
        <div style={{ ...S.grid2, marginBottom: 16 }}>
          <div>
            <label style={S.label}>Observed Symptoms</label>
            <textarea
              style={{ ...S.input, height: 72, resize: "vertical" }}
              value={form.symptoms}
              onChange={setF("symptoms")}
              placeholder="Clinical observations, onset, fever, cough..."
            />
          </div>

          <div>
            <label style={S.label}>Provisional Diagnosis</label>
            <textarea
              style={{ ...S.input, height: 72, resize: "vertical", fontWeight: 600 }}
              value={form.diagnosis}
              onChange={setF("diagnosis")}
              placeholder="Diagnosis (e.g. Acute Bronchitis, Viral URI)..."
            />
          </div>
        </div>

        {/* Prescription Section */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          padding: "16px 18px",
          marginBottom: 16,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#0F766E",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <Pill size={16} /> Prescribed Medicines (Rx)
            </div>

            {userRole === "doctor" && (
              <div style={{ display: "flex", gap: 8 }}>
                {lastVisit && (
                  <button
                    type="button"
                    style={{ ...S.btn, ...S.btnSecondary, padding: "5px 10px", fontSize: 12 }}
                    className="btn-interactive"
                    onClick={copyLast}
                  >
                    <Copy size={13} /> Copy Last Visit
                  </button>
                )}

                {templates?.length > 0 && (
                  <select
                    style={{ ...S.input, width: "auto", fontSize: 12, padding: "5px 10px" }}
                    onChange={e => {
                      const t = templates.find(x => x.id === e.target.value);
                      if (t) applyTemplate(t);
                      e.target.value = "";
                    }}
                  >
                    <option value="">Apply Saved Template...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                )}
              </div>
            )}
          </div>

          {/* Rx Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 1fr 1fr 1fr 2fr 36px",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#64748B",
              textTransform: "uppercase",
              paddingLeft: 4,
            }}>
              <div>Medicine Name</div>
              <div>Dosage</div>
              <div>Times/Day</div>
              <div>Duration</div>
              <div>Instructions</div>
              <div />
            </div>

            {form.prescription.map((rx, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1fr 1fr 1fr 2fr 36px",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <input
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  value={rx.medicine}
                  onChange={setRx(i, "medicine")}
                  placeholder="e.g. Paracetamol 650"
                />
                <input
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  value={rx.dosage}
                  onChange={setRx(i, "dosage")}
                  placeholder="1 Tab"
                />
                <input
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  value={rx.times_per_day}
                  onChange={setRx(i, "times_per_day")}
                  placeholder="1-0-1"
                />
                <input
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  value={rx.days}
                  onChange={setRx(i, "days")}
                  placeholder="5 Days"
                />
                <input
                  style={{ ...S.input, padding: "8px 10px", fontSize: 13 }}
                  value={rx.instructions}
                  onChange={setRx(i, "instructions")}
                  placeholder="After Meals"
                />
                <button
                  type="button"
                  style={{
                    ...S.btn,
                    ...S.btnDanger,
                    padding: "8px",
                    borderRadius: 8,
                    width: 36,
                    height: 36,
                  }}
                  className="btn-interactive"
                  onClick={() => rmRx(i)}
                  disabled={form.prescription.length === 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            style={{
              ...S.btn,
              ...S.btnSecondary,
              fontSize: 12.5,
              padding: "6px 14px",
              marginTop: 10,
              borderRadius: 8,
              color: "#0D9488",
              fontWeight: 700,
            }}
            className="btn-interactive"
            onClick={addRx}
          >
            <Plus size={14} /> Add Medicine Row
          </button>
        </div>

        {/* Follow-up & Consultation Fee Strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          padding: "14px 16px",
          background: "#F8FAFC",
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          marginBottom: 20,
        }}>
          <div>
            <label style={S.label}>Consultation Fee (₹)</label>
            <input
              type="number"
              style={{ ...S.input, padding: "8px 12px", fontWeight: 700, color: "#059669" }}
              value={form.fee}
              onChange={setF("fee")}
            />
          </div>

          <div>
            <label style={S.label}>Follow-up Date</label>
            <input
              type="date"
              style={{ ...S.input, padding: "8px 12px" }}
              value={form.followup_date}
              onChange={setF("followup_date")}
              min={today()}
            />
          </div>

          <div>
            <label style={S.label}>Follow-up Note</label>
            <input
              style={{ ...S.input, padding: "8px 12px" }}
              value={form.followup_note}
              onChange={setF("followup_note")}
              placeholder="e.g. Review blood sugar"
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            type="button"
            style={{ ...S.btn, ...S.btnSecondary, padding: "10px 18px" }}
            onClick={onClose}
            className="btn-interactive"
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              ...S.btn,
              ...S.btnPrimary,
              padding: "10px 22px",
              fontSize: 14,
              borderRadius: 10,
              opacity: sending ? 0.75 : 1,
            }}
            className="btn-interactive"
            onClick={save}
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
                <span>Saving & Generating Rx...</span>
              </>
            ) : (
              <>
                <Printer size={16} />
                <span>Save, Print & WhatsApp Rx</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
