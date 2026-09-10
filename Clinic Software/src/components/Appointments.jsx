import { useState } from "react";
import { tokens } from "../styles/tokens";
import { today, fmtDate } from "../utils/helpers";
import PatientDetail from "./PatientDetail";
import VisitForm from "./VisitForm";
import { PageHeader, Badge, Button, EmptyState, Input, Select, Modal } from "./common";
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  Stethoscope,
  Eye,
  XCircle,
  X,
  Phone,
  AlertCircle,
  Calendar,
  Users,
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
  user,
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

  const set = (k) => (e) => {
    setErr("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };
  const setPt = (k) => (e) => {
    setErr("");
    setNewPt((f) => ({ ...f, [k]: e.target.value }));
  };

  const allDayApts = appointments.filter((a) => (a.date || "").toString().slice(0, 10) === viewDate);
  const completedCount = allDayApts.filter((a) => a.status === "completed" || a.status === "cancelled").length;
  const dayApts = allDayApts
    .filter((a) => (showCompleted ? true : a.status !== "completed" && a.status !== "cancelled"))
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
        patientName = patients.find((p) => p.id === patientId)?.name || "";
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
        <Modal
          isOpen={true}
          onClose={closeForm}
          title="Schedule Patient Appointment"
          subtitle="Book consultation slot and notify patient via WhatsApp"
          icon={CalendarPlus}
          iconBg="linear-gradient(135deg, #0284C7 0%, #0D9488 100%)"
          maxWidth={660}
        >

            {err && (
              <div
                style={{
                  background: tokens.colors.semantic.danger.bg,
                  border: `1px solid ${tokens.colors.semantic.danger.border}`,
                  color: tokens.colors.semantic.danger.text,
                  padding: "10px 14px",
                  borderRadius: tokens.radii.md,
                  fontSize: 13,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            {/* Mode Switcher */}
            <div
              style={{
                display: "flex",
                background: tokens.colors.slate[100],
                padding: 4,
                borderRadius: tokens.radii.md,
                width: "fit-content",
                marginBottom: 20,
              }}
            >
              {["existing", "new"].map((m) => {
                const isAct = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    style={{
                      padding: "8px 18px",
                      borderRadius: tokens.radii.sm,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      background: isAct ? "#FFFFFF" : "transparent",
                      color: isAct ? tokens.colors.primary[600] : tokens.colors.slate[500],
                      boxShadow: isAct ? tokens.shadows.xs : "none",
                      transition: tokens.transitions.fast,
                    }}
                    onClick={() => {
                      setMode(m);
                      setErr("");
                    }}
                  >
                    {m === "existing" ? "Existing Directory Patient" : "New Patient Quick Intake"}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mode === "existing" ? (
                <div>
                  <Select
                    label="Select Patient *"
                    value={form.patientId}
                    onChange={set("patientId")}
                    required
                  >
                    <option value="">Choose registered patient...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.surname || ""} — {p.contact} (#{p.id})
                      </option>
                    ))}
                  </Select>
                </div>
              ) : (
                <div
                  style={{
                    background: tokens.colors.slate[50],
                    borderRadius: tokens.radii.lg,
                    padding: "16px 18px",
                    border: `1px solid ${tokens.colors.slate[200]}`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 12.5,
                      color: tokens.colors.primary[700],
                      marginBottom: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Quick Patient Details
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input label="Full Name *" value={newPt.name} onChange={setPt("name")} placeholder="Patient name" required />
                    <Input label="Mobile Phone *" value={newPt.contact} onChange={setPt("contact")} placeholder="Mobile number" required />
                    <Input label="Age" type="number" value={newPt.age} onChange={setPt("age")} placeholder="Age in years" />
                    <Select label="Gender" value={newPt.gender} onChange={setPt("gender")} options={["Male", "Female", "Other"]} />
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Appointment Date *" type="date" value={form.date} onChange={set("date")} required />
                <Input label="Time Slot *" type="time" value={form.time} onChange={set("time")} required />
              </div>

              <Input
                label="Consultation Purpose / Chief Complaint"
                value={form.reason}
                onChange={set("reason")}
                placeholder="e.g. Routine fever checkup, Follow-up consultation, Knee pain..."
              />

              <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "flex-end" }}>
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={CalendarPlus} loading={saving}>
                  Confirm Appointment
                </Button>
              </div>
            </form>
        </Modal>
      )}

      {/* Start Visit Modal directly */}
      {visitPatient && (
        <VisitForm
          patient={visitPatient.patient}
          lastVisit={[...(visitPatient.patient.visits || [])].sort((a, b) => new Date(b.date) - new Date(a.date))[0]}
          templates={templates}
          userRole={user?.role}
          onSave={async (v) => {
            await addVisit(visitPatient.patient, v);
            await updateAppointment(visitPatient.aptId, "completed");
            setVisitPatient(null);
          }}
          onClose={() => setVisitPatient(null)}
        />
      )}

      {/* View Patient Modal */}
      {viewPatient && (
        <Modal
          isOpen={true}
          onClose={() => setViewPatient(null)}
          title={`Patient Record — ${viewPatient.patient.name} ${viewPatient.patient.surname || ""}`}
          subtitle="Clinical chart and prescription history"
          icon={Users}
          maxWidth={960}
        >
          <PatientDetail
            asModal
            patient={viewPatient.patient}
            openVisitForm={false}
            templates={templates}
            user={user}
            onBack={() => setViewPatient(null)}
            onAddVisit={async (v) => {
              await addVisit(viewPatient.patient, v);
            }}
            onVisitSaved={() => setViewPatient(null)}
            onUpdatePatient={(data) => data}
          />
        </Modal>
      )}

      {/* Page Header */}
      <PageHeader
        icon={CalendarDays}
        iconColor="#0284C7"
        iconBg="linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)"
        title="Appointment Schedule"
        count={dayApts.length}
        countLabel="Slots"
        description="Daily patient queue, consultation slots, and clinic visit attendance"
        actions={
          <Button variant="primary" icon={CalendarPlus} onClick={() => setShowForm(true)}>
            Book Appointment
          </Button>
        }
      />

      {/* Date Filter Strip */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: tokens.radii.xl,
          border: `1px solid ${tokens.colors.slate[200]}`,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          boxShadow: tokens.shadows.xs,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: tokens.colors.slate[900] }}>
              Schedule Date:
            </span>
            <input
              type="date"
              style={{
                padding: "7px 12px",
                fontWeight: 600,
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.slate[300]}`,
                color: tokens.colors.slate[900],
                outline: "none",
                fontSize: 13.5,
              }}
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: tokens.radii.sm,
                background: viewDate === today() ? "#F0FDFA" : "#FFFFFF",
                borderColor: viewDate === today() ? "#99F6E4" : tokens.colors.slate[200],
                color: viewDate === today() ? "#0F766E" : tokens.colors.slate[600],
                border: "1px solid",
                cursor: "pointer",
              }}
              className="btn-interactive"
              onClick={() => setViewDate(today())}
            >
              Today
            </button>
          </div>
        </div>

        {completedCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCompleted((v) => !v)}
          >
            {showCompleted ? "Hide Completed / Cancelled" : `Show Completed (${completedCount})`}
          </Button>
        )}
      </div>

      {/* Appointments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {dayApts.length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: tokens.radii.xl,
              border: `1px solid ${tokens.colors.slate[200]}`,
              boxShadow: tokens.shadows.sm,
            }}
          >
            <EmptyState
              icon={Calendar}
              color="blue"
              title={`No appointments scheduled for ${fmtDate(viewDate)}`}
              description={
                showCompleted
                  ? "No scheduled visits match this date filter."
                  : "All appointments for this date have been completed or cancelled."
              }
              actionLabel="Schedule an Appointment"
              actionIcon={CalendarPlus}
              onAction={() => setShowForm(true)}
            />
          </div>
        ) : (
          dayApts.map((a) => {
            const isCompleted = a.status === "completed" || a.status === "cancelled";
            const patientId = a.patientId || a.patient_id;

            return (
              <div
                key={a.id}
                className="card-hover"
                style={{
                  background: "#FFFFFF",
                  borderRadius: tokens.radii.lg,
                  border: `1px solid ${tokens.colors.slate[200]}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  boxShadow: tokens.shadows.xs,
                  opacity: isCompleted ? 0.65 : 1,
                  borderLeft: isCompleted
                    ? "4px solid #CBD5E1"
                    : a.status === "confirmed"
                    ? "4px solid #0D9488"
                    : "4px solid #F59E0B",
                }}
              >
                {/* Time & Patient Info */}
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div
                    style={{
                      background: isCompleted
                        ? tokens.colors.slate[100]
                        : "linear-gradient(135deg, #0B132B 0%, #111C44 100%)",
                      color: isCompleted ? tokens.colors.slate[500] : "#2DD4BF",
                      padding: "8px 14px",
                      borderRadius: tokens.radii.md,
                      fontWeight: 800,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      minWidth: 84,
                      justifyContent: "center",
                    }}
                  >
                    <Clock size={13} />
                    <span>{a.time || "OPD"}</span>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: tokens.colors.slate[900] }}>
                        {a.patientName || a.patient_name}
                      </div>
                      <Badge
                        variant={a.status === "completed" ? "green" : a.status === "cancelled" ? "red" : "blue"}
                        size="sm"
                        dot
                      >
                        {a.status}
                      </Badge>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12.5,
                        color: tokens.colors.slate[500],
                        marginTop: 3,
                      }}
                    >
                      <span>{a.reason || "General OPD Checkup"}</span>
                      {a.contact && (
                        <>
                          <span>•</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Phone size={12} color={tokens.colors.primary[600]} /> {a.contact}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isCompleted ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => {
                        const pt = patients.find((p) => p.id === patientId);
                        if (pt) setViewPatient({ patient: pt });
                      }}
                    >
                      View File
                    </Button>
                  ) : (
                    <>
                      {user?.role === "doctor" && (
                        <button
                          style={{
                            background: "linear-gradient(135deg, #0D9488 0%, #059669 100%)",
                            color: "#FFFFFF",
                            fontSize: 12.5,
                            fontWeight: 700,
                            padding: "7px 14px",
                            borderRadius: tokens.radii.md,
                            border: "none",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: tokens.shadows.primaryGlow,
                          }}
                          className="btn-interactive"
                          onClick={() => {
                            const pt = patients.find((p) => p.id === patientId);
                            if (pt) setVisitPatient({ patient: pt, aptId: a.id });
                          }}
                        >
                          <Stethoscope size={14} />
                          <span>Start Consultation</span>
                        </button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                          const pt = patients.find((p) => p.id === patientId);
                          if (pt) setViewPatient({ patient: pt });
                        }}
                      >
                        View
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        icon={XCircle}
                        onClick={() => {
                          if (window.confirm(`Cancel appointment for ${a.patientName || a.patient_name}?`)) {
                            deleteAppointment(a.id);
                          }
                        }}
                      >
                        Cancel
                      </Button>
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
