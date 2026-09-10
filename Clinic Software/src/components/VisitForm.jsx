import { useState } from "react";
import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";
import { printPrescription } from "../utils/printPrescription";
import { apiSendWhatsApp } from "../api";

export default function VisitForm({ patient, lastVisit, templates, onSave, onClose, userRole }) {
  const blankRx = () => ({ medicine: "", dosage: "", times_per_day: "", days: "", instructions: "" });
  const [form, setForm] = useState({
    date: today(), chief_complaint: "", symptoms: "", diagnosis: "", notes: "",
    vitals: { bp: "", sugar: "", temp: "", weight: "", pulse: "" },
    prescription: [blankRx()], fee: 500, followup_date: "", followup_note: ""
  });
  const [showHistory, setShowHistory] = useState(false);

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setV = k => e => setForm(f => ({ ...f, vitals: { ...f.vitals, [k]: e.target.value } }));
  const setRx = (i, k) => e => setForm(f => { const p = [...f.prescription]; p[i] = { ...p[i], [k]: e.target.value }; return { ...f, prescription: p }; });
  const addRx = () => setForm(f => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = i => setForm(f => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));
  const applyTemplate = t => setForm(f => ({ ...f, prescription: t.prescription.map(r => ({ ...r, times_per_day: r.times_per_day || "", days: r.days || "" })) }));
  const copyLast = () => { if (lastVisit) setForm(f => ({ ...f, prescription: lastVisit.prescription.map(r => ({ ...r })), diagnosis: lastVisit.diagnosis })); };

  const [sending, setSending] = useState(false);

  const save = async () => {
    if (!form.chief_complaint) return alert("Chief Complaint is required");
    setSending(true);
    try {
      const savedVisit = await onSave(form);
      const visitData = { ...form, id: savedVisit?.visitId || "" };
      printPrescription(patient, visitData);
      const wa = await apiSendWhatsApp(patient, visitData);
      if (wa.error) console.warn("WhatsApp:", wa.error);
    } finally {
      setSending(false);
    }
  };

  const sortedVisits = [...(patient.visits || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 820 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>New Visit — {patient.name} {patient.surname || ""}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>Patient ID: {patient.id}</div>
          </div>
          {sortedVisits.length > 0 && (
            <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={() => setShowHistory(v => !v)}>
              📋 {showHistory ? "Hide History" : `View History (${sortedVisits.length})`}
            </button>
          )}
        </div>

        {/* History panel */}
        {showHistory && (
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginTop: 12, marginBottom: 12, maxHeight: 240, overflowY: "auto" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 10 }}>Past Visits</div>
            {sortedVisits.map((v, idx) => (
              <div key={v.id} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{fmtDate(v.date)}</span>
                  {idx === 0 && <span style={{ ...S.badge("blue"), fontSize: 11 }}>Latest</span>}
                </div>
                {v.chief_complaint && <div style={{ fontSize: 12, color: "#374151" }}><strong>CC:</strong> {v.chief_complaint}</div>}
                <div style={{ fontSize: 12, color: "#374151" }}><strong>Diagnosis:</strong> {v.diagnosis || "—"}</div>
                {v.prescription?.length > 0 && (
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    <strong>Rx:</strong> {v.prescription.map(r => r.medicine).join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Patient alerts */}
        {(patient.kco || patient.allergy || patient.ongoing_medicines || patient.ongoingMedicines) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, marginBottom: 12 }}>
            {patient.kco && <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#1d4ed8" }}><strong>K/C/O:</strong> {patient.kco}</div>}
            {patient.allergy && <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#c2410c" }}>⚠️ <strong>Allergy:</strong> {patient.allergy}</div>}
            {(patient.ongoing_medicines || patient.ongoingMedicines) && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#15803d" }}><strong>Ongoing:</strong> {patient.ongoing_medicines || patient.ongoingMedicines}</div>}
          </div>
        )}

        {/* Chief Complaint */}
        <div style={{ marginBottom: 16, marginTop: 12 }}>
          <label style={S.label}>Chief Complaint *</label>
          <input style={S.input} value={form.chief_complaint} onChange={setF("chief_complaint")} placeholder="Main reason for today's visit..." />
        </div>

        {/* Vitals */}
        <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 8 }}>Vitals</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
          {[["bp","BP (mmHg)"],["sugar","Blood Sugar"],["temp","Temp"],["weight","Weight"],["pulse","Pulse"]].map(([k,l]) => (
            <div key={k}><label style={{ ...S.label, fontSize: 12 }}>{l}</label><input style={S.input} value={form.vitals[k]} onChange={setV(k)} placeholder={k==="bp"?"120/80":k==="temp"?"°F":""} /></div>
          ))}
        </div>

        {/* Symptoms / Diagnosis */}
        <div style={S.grid2}>
          <div>
            <label style={S.label}>Symptoms</label>
            <textarea style={{ ...S.input, height: 80, resize: "vertical" }} value={form.symptoms} onChange={setF("symptoms")} placeholder="Describe symptoms..." />
          </div>
          <div>
            <label style={S.label}>Diagnosis</label>
            <textarea style={{ ...S.input, height: 80, resize: "vertical" }} value={form.diagnosis} onChange={setF("diagnosis")} placeholder="Doctor's diagnosis..." />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={S.label}>Notes</label>
          <textarea style={{ ...S.input, height: 60, resize: "vertical" }} value={form.notes} onChange={setF("notes")} placeholder="Additional notes, referrals, follow-up..." />
        </div>

        {/* Prescription */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>Prescription</div>
            {userRole === "doctor" && (
              <div style={{ display: "flex", gap: 8 }}>
                {lastVisit && <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={copyLast}>⤴ Copy Last Visit</button>}
                {templates?.length > 0 && (
                  <select style={{ ...S.input, width: "auto", fontSize: 12, padding: "6px 10px" }} onChange={e => { const t = templates.find(x => x.id === e.target.value); if (t) applyTemplate(t); e.target.value = ""; }}>
                    <option value="">Apply Template...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 2fr auto", gap: 8, marginBottom: 4 }}>
            {["Medicine","Dosage","Times/Day","Days","Instructions",""].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", paddingLeft: 4 }}>{h}</div>
            ))}
          </div>
          {form.prescription.map((rx, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input style={S.input} value={rx.medicine} onChange={setRx(i,"medicine")} placeholder="Medicine name" />
              <input style={S.input} value={rx.dosage} onChange={setRx(i,"dosage")} placeholder="e.g. 1 tab" />
              <input style={S.input} value={rx.times_per_day} onChange={setRx(i,"times_per_day")} placeholder="e.g. 3" />
              <input style={S.input} value={rx.days} onChange={setRx(i,"days")} placeholder="e.g. 5" />
              <input style={S.input} value={rx.instructions} onChange={setRx(i,"instructions")} placeholder="After food, etc." />
              <button style={{ ...S.btn, ...S.btnDanger, padding: "8px 10px" }} onClick={() => rmRx(i)}>✕</button>
            </div>
          ))}
          <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 13, marginTop: 4 }} onClick={addRx}>+ Add Medicine</button>
        </div>

        {/* Fee */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ ...S.label, margin: 0, whiteSpace: "nowrap" }}>Consultation Fee (₹)</label>
          <input style={{ ...S.input, width: 140 }} type="number" value={form.fee} onChange={setF("fee")} />
        </div>

        {/* Follow-up */}
        <div style={{ marginTop: 16, padding: 16, background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 10 }}>Follow-up (Optional)</div>
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Follow-up Date</label>
              <input type="date" style={S.input} value={form.followup_date} onChange={setF("followup_date")} min={today()} />
            </div>
            <div>
              <label style={S.label}>Note</label>
              <input style={S.input} value={form.followup_note} onChange={setF("followup_note")} placeholder="e.g. Review blood sugar, Check BP" />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save} disabled={sending}>
            {sending ? "Saving..." : "Save & Print"}
          </button>
        </div>
      </div>
    </div>
  );
}
