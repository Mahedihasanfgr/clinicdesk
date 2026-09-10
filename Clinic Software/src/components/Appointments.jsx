import { useState } from "react";
import { S } from "../styles/styles";
import { today } from "../utils/helpers";
import PatientDetail from "./PatientDetail";
import VisitForm from "./VisitForm";

const BLANK_FORM = { patientId: "", date: today(), time: "", reason: "" };
const BLANK_NEW_PT = { name: "", contact: "", age: "", gender: "Male" };

export default function Appointments({ appointments, addAppointment, updateAppointment, deleteAppointment, patients, addPatient, addVisit, templates, user }) {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("existing");
  const [form, setForm] = useState(BLANK_FORM);
  const [newPt, setNewPt] = useState(BLANK_NEW_PT);
  const [viewDate, setViewDate] = useState(today());
  const [saving, setSaving] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [visitPatient, setVisitPatient] = useState(null); // { patient, aptId }
  const [viewPatient, setViewPatient] = useState(null);   // { patient }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPt = k => e => setNewPt(f => ({ ...f, [k]: e.target.value }));

  const allDayApts = appointments.filter(a => (a.date || "").toString().slice(0, 10) === viewDate);
  const completedCount = allDayApts.filter(a => a.status === "completed" || a.status === "cancelled").length;
  const dayApts = allDayApts
    .filter(a => showCompleted ? true : a.status !== "completed" && a.status !== "cancelled")
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const handleAdd = async () => {
    if (!form.date || !form.time) return alert("Date and time are required");
    setSaving(true);
    try {
      let patientId = form.patientId;
      let patientName = "";
      if (mode === "new") {
        if (!newPt.name || !newPt.contact) return alert("Patient name and contact are required");
        const saved = await addPatient(newPt);
        patientId = saved.id;
        patientName = saved.name;
      } else {
        if (!patientId) return alert("Please select a patient");
        patientName = patients.find(p => p.id === patientId)?.name || "";
      }
      await addAppointment({ ...form, status: "confirmed", patientId, patientName, patient_name: patientName });
      setShowForm(false);
      setForm(BLANK_FORM);
      setNewPt(BLANK_NEW_PT);
      setMode("existing");
    } catch (err) {
      alert(err.message || "Failed to book appointment");
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => { setShowForm(false); setForm(BLANK_FORM); setNewPt(BLANK_NEW_PT); setMode("existing"); };

  return (
    <div>
      {/* Book Appointment Modal */}
      {showForm && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div style={S.modalBox}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Book Appointment</div>
            <div style={{ display: "flex", marginBottom: 20, borderRadius: 8, overflow: "hidden", border: "1.5px solid #d1d5db", width: "fit-content" }}>
              {["existing", "new"].map(m => (
                <button key={m} style={{ padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: mode === m ? "#1a1a2e" : "#f9fafb", color: mode === m ? "#fff" : "#6b7280" }}
                  onClick={() => setMode(m)}>
                  {m === "existing" ? "Existing Patient" : "New Patient"}
                </button>
              ))}
            </div>
            {mode === "existing" ? (
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Patient *</label>
                <select style={S.input} value={form.patientId} onChange={set("patientId")}>
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} {p.surname || ""} — {p.contact}</option>)}
                </select>
              </div>
            ) : (
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16, marginBottom: 16, border: "1px solid #e5e7eb" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 12 }}>New Patient Details</div>
                <div style={S.grid2}>
                  <div><label style={S.label}>Full Name *</label><input style={S.input} value={newPt.name} onChange={setPt("name")} placeholder="Patient full name" /></div>
                  <div><label style={S.label}>Contact *</label><input style={S.input} value={newPt.contact} onChange={setPt("contact")} placeholder="Mobile number" /></div>
                  <div><label style={S.label}>Age</label><input style={S.input} type="number" value={newPt.age} onChange={setPt("age")} placeholder="Age" /></div>
                  <div>
                    <label style={S.label}>Gender</label>
                    <select style={S.input} value={newPt.gender} onChange={setPt("gender")}>
                      {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 10 }}>✅ This patient will also be saved in the Patients list</div>
              </div>
            )}
            <div style={S.grid2}>
              <div><label style={S.label}>Date *</label><input type="date" style={S.input} value={form.date} onChange={set("date")} /></div>
              <div><label style={S.label}>Time *</label><input type="time" style={S.input} value={form.time} onChange={set("time")} /></div>
              <div><label style={S.label}>Reason</label><input style={S.input} value={form.reason} onChange={set("reason")} placeholder="Reason for visit" /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button style={{ ...S.btn, ...S.btnSecondary }} onClick={closeForm}>Cancel</button>
              <button style={{ ...S.btn, ...S.btnPrimary }} onClick={handleAdd} disabled={saving}>
                {saving ? "Saving..." : "Book Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Visit — direct VisitForm, no PatientDetail behind it */}
      {visitPatient && (
        <VisitForm
          patient={visitPatient.patient}
          lastVisit={[...(visitPatient.patient.visits || [])].sort((a, b) => new Date(b.date) - new Date(a.date))[0]}
          templates={templates}
          userRole={user?.role}
          onSave={async v => {
            await addVisit(visitPatient.patient, v);
            await updateAppointment(visitPatient.aptId, "completed");
            setVisitPatient(null);
          }}
          onClose={() => setVisitPatient(null)}
        />
      )}

      {/* View — PatientDetail for completed */}
      {viewPatient && (
        <PatientDetail
          asModal
          patient={viewPatient.patient}
          openVisitForm={false}
          templates={templates}
          user={user}
          onBack={() => setViewPatient(null)}
          onAddVisit={async v => { await addVisit(viewPatient.patient, v); }}
          onVisitSaved={() => setViewPatient(null)}
          onUpdatePatient={data => data}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Appointments</div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowForm(true)}>+ Book Appointment</button>
      </div>

      {/* Date + toggle */}
      <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 600 }}>Date:</div>
        <input type="date" style={{ ...S.input, width: 180 }} value={viewDate} onChange={e => setViewDate(e.target.value)} />
        <div style={{ color: "#6b7280", fontSize: 14 }}>{dayApts.length} appointment{dayApts.length !== 1 ? "s" : ""}</div>
        {completedCount > 0 && (
          <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12, marginLeft: "auto" }} onClick={() => setShowCompleted(v => !v)}>
            {showCompleted ? "Hide Completed" : `Show Completed (${completedCount})`}
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dayApts.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", padding: 40 }}>
            No {showCompleted ? "" : "pending "}appointments for this date.
          </div>
        ) : dayApts.map(a => {
          const isCompleted = a.status === "completed" || a.status === "cancelled";
          const patientId = a.patientId || a.patient_id;
          return (
            <div key={a.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", opacity: isCompleted ? 0.65 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ background: "#1a1a2e", color: "#fff", padding: "8px 14px", borderRadius: 10, fontWeight: 700, fontSize: 14, minWidth: 56, textAlign: "center" }}>{a.time}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{a.patientName || a.patient_name}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{a.reason || "General checkup"}</div>
                  {isCompleted && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.status}</div>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {isCompleted ? (
                  <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }}
                    onClick={() => { const pt = patients.find(p => p.id === patientId); if (pt) setViewPatient({ patient: pt }); }}>
                    👁 View
                  </button>
                ) : (
                  <>
                    {user?.role === "doctor" && (
                      <button style={{ ...S.btn, ...S.btnSuccess, fontSize: 12 }}
                        onClick={() => { const pt = patients.find(p => p.id === patientId); if (pt) setVisitPatient({ patient: pt, aptId: a.id }); }}>
                        🩺 Start Visit
                      </button>
                    )}
                    <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }}
                      onClick={() => { const pt = patients.find(p => p.id === patientId); if (pt) setViewPatient({ patient: pt }); }}>
                      👁 View
                    </button>
                    <button style={{ ...S.btn, ...S.btnDanger, fontSize: 12 }}
                      onClick={() => { if (window.confirm("Cancel this appointment?")) deleteAppointment(a.id); }}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
