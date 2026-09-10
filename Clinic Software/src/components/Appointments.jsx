import { useState } from "react";
import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";
import PatientDetail from "./PatientDetail";
import VisitForm from "./VisitForm";
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  User,
  Stethoscope,
  Eye,
  XCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Filter,
  Check
} from "lucide-react";

const BLANK_FORM = { patientId: "", date: today(), time: "", reason: "" };
const BLANK_NEW_PT = { name: "", contact: "", age: "", gender: "Male" };

export default function Appointments({
  appointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  patients,
  addPatient,
  addVisit,
  templates,
  user
}) {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("existing");
  const [form, setForm] = useState(BLANK_FORM);
  const [newPt, setNewPt] = useState(BLANK_NEW_PT);
  const [viewDate, setViewDate] = useState(today());
  const [saving, setSaving] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [visitPatient, setVisitPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [err, setErr] = useState("");

  const set = k => e => {
    setErr("");
    setForm(f => ({ ...f, [k]: e.target.value }));
  };
  const setPt = k => e => {
    setErr("");
    setNewPt(f => ({ ...f, [k]: e.target.value }));
  };

  const allDayApts = appointments.filter(a => (a.date || "").toString().slice(0, 10) === viewDate);
  const completedCount = allDayApts.filter(a => a.status === "completed" || a.status === "cancelled").length;
  const dayApts = allDayApts
    .filter(a => (showCompleted ? true : a.status !== "completed" && a.status !== "cancelled"))
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!form.date || !form.time) {
      setErr("Appointment date and time slot are required");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      let patientId = form.patientId;
      let patientName = "";
      if (mode === "new") {
        if (!newPt.name.trim() || !newPt.contact.trim()) {
          setErr("New patient name and contact number are required");
          setSaving(false);
          return;
        }
        const saved = await addPatient(newPt);
        patientId = saved.id;
        patientName = saved.name;
      } else {
        if (!patientId) {
          setErr("Please select an existing patient from the directory");
          setSaving(false);
          return;
        }
        patientName = patients.find(p => p.id === patientId)?.name || "";
      }
      await addAppointment({ ...form, status: "confirmed", patientId, patientName, patient_name: patientName });
      closeForm();
    } catch (err) {
      setErr(err.message || "Failed to schedule appointment");
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(BLANK_FORM);
    setNewPt(BLANK_NEW_PT);
    setMode("existing");
    setErr("");
  };

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Book Appointment Modal */}
      {showForm && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && closeForm()}>
          <div style={{ ...S.modalBox, maxWidth: 640 }} className="animate-fade">
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
                  <CalendarPlus size={20} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Schedule Patient Appointment
                </h2>
              </div>

              <button
                onClick={closeForm}
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

            {/* Mode Switcher */}
            <div style={{
              display: "flex",
              background: "#F1F5F9",
              padding: 4,
              borderRadius: 10,
              width: "fit-content",
              marginBottom: 20,
            }}>
              {["existing", "new"].map(m => {
                const isAct = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      background: isAct ? "#FFFFFF" : "transparent",
                      color: isAct ? "#0D9488" : "#64748B",
                      boxShadow: isAct ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.18s ease",
                    }}
                    onClick={() => {
                      setMode(m);
                      setErr("");
                    }}
                  >
                    {m === "existing" ? "Existing Directory Patient" : "New Patient Intake"}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAdd}>
              {mode === "existing" ? (
                <div style={{ marginBottom: 18 }}>
                  <label style={S.label}>Select Patient *</label>
                  <select
                    style={S.input}
                    value={form.patientId}
                    onChange={set("patientId")}
                    required
                  >
                    <option value="">Choose registered patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.surname || ""} — {p.contact} (#{p.id})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{
                  background: "#F8FAFC",
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 18,
                  border: "1px solid #E2E8F0",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0F766E", marginBottom: 12, textTransform: "uppercase" }}>
                    Quick Patient Registration
                  </div>
                  <div style={S.grid2}>
                    <div>
                      <label style={S.label}>Full Name *</label>
                      <input style={S.input} value={newPt.name} onChange={setPt("name")} placeholder="Patient full name" required />
                    </div>
                    <div>
                      <label style={S.label}>Contact Phone *</label>
                      <input style={S.input} value={newPt.contact} onChange={setPt("contact")} placeholder="Mobile number" required />
                    </div>
                    <div>
                      <label style={S.label}>Age</label>
                      <input style={S.input} type="number" value={newPt.age} onChange={setPt("age")} placeholder="Age in years" />
                    </div>
                    <div>
                      <label style={S.label}>Gender</label>
                      <select style={S.input} value={newPt.gender} onChange={setPt("gender")}>
                        {["Male", "Female", "Other"].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div style={S.grid2}>
                <div>
                  <label style={S.label}>Appointment Date *</label>
                  <input type="date" style={S.input} value={form.date} onChange={set("date")} required />
                </div>
                <div>
                  <label style={S.label}>Appointment Time Slot *</label>
                  <input type="time" style={S.input} value={form.time} onChange={set("time")} required />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={S.label}>Consultation Purpose / Chief Complaint</label>
                <input
                  style={S.input}
                  value={form.reason}
                  onChange={set("reason")}
                  placeholder="e.g. Routine fever checkup, Follow-up consultation, Knee pain..."
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
                <button type="button" style={{ ...S.btn, ...S.btnSecondary, padding: "9px 16px" }} onClick={closeForm}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...S.btn, ...S.btnPrimary, padding: "9px 20px" }}
                  disabled={saving}
                  className="btn-interactive"
                >
                  <CalendarPlus size={16} />
                  <span>{saving ? "Scheduling..." : "Confirm Appointment"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Start Visit Modal directly */}
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

      {/* View Patient Modal */}
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
            background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)",
          }}>
            <CalendarDays size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                Appointment Schedule
              </h1>
              <span style={S.badge("blue")}>
                {dayApts.length} Scheduled
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
              Daily patient queue, scheduled consultation slots, and attendance status
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
          <CalendarPlus size={16} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Date Filter Strip */}
      <div style={{
        ...S.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 0,
        padding: "16px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>Schedule Date:</span>
            <input
              type="date"
              style={{ ...S.input, width: 175, padding: "7px 12px", fontWeight: 600 }}
              value={viewDate}
              onChange={e => setViewDate(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              style={{
                ...S.btn,
                ...S.btnSecondary,
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                background: viewDate === today() ? "#F0FDFA" : "#FFFFFF",
                borderColor: viewDate === today() ? "#99F6E4" : "#E2E8F0",
                color: viewDate === today() ? "#0F766E" : "#475569",
              }}
              className="btn-interactive"
              onClick={() => setViewDate(today())}
            >
              Today
            </button>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            style={{
              ...S.btn,
              ...S.btnSecondary,
              fontSize: 12.5,
              padding: "6px 14px",
              borderRadius: 8,
            }}
            className="btn-interactive"
            onClick={() => setShowCompleted(v => !v)}
          >
            {showCompleted ? "Hide Completed / Cancelled" : `Show Completed (${completedCount})`}
          </button>
        )}
      </div>

      {/* Appointments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {dayApts.length === 0 ? (
          <div style={{
            ...S.card,
            textAlign: "center",
            padding: "48px 20px",
            color: "#64748B",
            border: "1px dashed #CBD5E1",
          }}>
            <CalendarDays size={38} color="#94A3B8" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#334155" }}>
              No Appointments Scheduled for {fmtDate(viewDate)}
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, marginBottom: 18 }}>
              {showCompleted
                ? "No appointments match this date filter."
                : "All appointments for this date have been completed or cancelled."}
            </p>
            <button
              style={{ ...S.btn, ...S.btnPrimary, fontSize: 13, padding: "9px 18px" }}
              className="btn-interactive"
              onClick={() => setShowForm(true)}
            >
              <CalendarPlus size={15} />
              <span>Schedule an Appointment</span>
            </button>
          </div>
        ) : (
          dayApts.map(a => {
            const isCompleted = a.status === "completed" || a.status === "cancelled";
            const patientId = a.patientId || a.patient_id;

            return (
              <div
                key={a.id}
                style={{
                  ...S.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  marginBottom: 0,
                  opacity: isCompleted ? 0.65 : 1,
                  borderLeft: isCompleted
                    ? "4px solid #CBD5E1"
                    : a.status === "confirmed"
                    ? "4px solid #0D9488"
                    : "4px solid #F59E0B",
                }}
                className="card-hover"
              >
                {/* Time & Patient Info */}
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{
                    background: isCompleted ? "#F1F5F9" : "linear-gradient(135deg, #0B132B 0%, #1C2541 100%)",
                    color: isCompleted ? "#64748B" : "#2DD4BF",
                    padding: "8px 14px",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 80,
                    justifyContent: "center",
                  }}>
                    <Clock size={13} />
                    <span>{a.time || "OPD"}</span>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A" }}>
                        {a.patientName || a.patient_name}
                      </div>
                      <span style={S.badge(a.status === "completed" ? "green" : a.status === "cancelled" ? "red" : "blue")}>
                        {a.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#64748B", marginTop: 3 }}>
                      <span>{a.reason || "General OPD Checkup"}</span>
                      {a.contact && (
                        <>
                          <span>•</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Phone size={12} color="#0D9488" /> {a.contact}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isCompleted ? (
                    <button
                      style={{ ...S.btn, ...S.btnSecondary, fontSize: 12.5, padding: "6px 12px" }}
                      className="btn-interactive"
                      onClick={() => {
                        const pt = patients.find(p => p.id === patientId);
                        if (pt) setViewPatient({ patient: pt });
                      }}
                    >
                      <Eye size={14} />
                      <span>View File</span>
                    </button>
                  ) : (
                    <>
                      {user?.role === "doctor" && (
                        <button
                          style={{
                            ...S.btn,
                            background: "linear-gradient(135deg, #0D9488 0%, #059669 100%)",
                            color: "#FFFFFF",
                            fontSize: 12.5,
                            padding: "7px 14px",
                            borderRadius: 8,
                          }}
                          className="btn-interactive"
                          onClick={() => {
                            const pt = patients.find(p => p.id === patientId);
                            if (pt) setVisitPatient({ patient: pt, aptId: a.id });
                          }}
                        >
                          <Stethoscope size={14} />
                          <span>Start Consultation</span>
                        </button>
                      )}

                      <button
                        style={{ ...S.btn, ...S.btnSecondary, fontSize: 12.5, padding: "6px 12px" }}
                        className="btn-interactive"
                        onClick={() => {
                          const pt = patients.find(p => p.id === patientId);
                          if (pt) setViewPatient({ patient: pt });
                        }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>

                      <button
                        style={{
                          ...S.btn,
                          ...S.btnDanger,
                          fontSize: 12.5,
                          padding: "6px 12px",
                          borderRadius: 8,
                        }}
                        className="btn-interactive"
                        onClick={() => {
                          if (window.confirm(`Cancel appointment for ${a.patientName || a.patient_name}?`)) {
                            deleteAppointment(a.id);
                          }
                        }}
                      >
                        <XCircle size={14} />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
