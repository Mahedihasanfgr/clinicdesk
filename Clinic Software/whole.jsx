import { useState, useEffect, useRef } from "react";

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_PATIENTS = [
  {
    id: "PT-001", name: "Anita Sharma", age: 34, gender: "Female",
    contact: "9876543210", email: "anita@email.com", address: "12 MG Road, Mumbai",
    bloodGroup: "B+", createdAt: "2024-01-10",
    visits: [
      {
        id: "V-001", date: "2024-03-15", symptoms: "Fever, headache, body ache for 3 days",
        diagnosis: "Viral fever", notes: "Advised rest and plenty of fluids",
        vitals: { bp: "118/76", sugar: "Normal", temp: "101.2°F", weight: "58 kg", pulse: "88" },
        prescription: [
          { medicine: "Paracetamol 500mg", dosage: "1 tablet", duration: "5 days", instructions: "After food, every 8 hours" },
          { medicine: "Cetirizine 10mg", dosage: "1 tablet", duration: "3 days", instructions: "At bedtime" }
        ],
        attachments: [], fee: 500
      }
    ]
  },
  {
    id: "PT-002", name: "Rajesh Kumar", age: 52, gender: "Male",
    contact: "9123456780", email: "rajesh@email.com", address: "45 Linking Road, Bandra",
    bloodGroup: "O+", createdAt: "2023-11-20",
    visits: [
      {
        id: "V-002", date: "2024-02-10", symptoms: "Persistent cough, chest congestion, mild breathlessness",
        diagnosis: "Bronchitis", notes: "Referred for chest X-ray. Follow up in 1 week.",
        vitals: { bp: "138/88", sugar: "126 mg/dL", temp: "99.8°F", weight: "78 kg", pulse: "92" },
        prescription: [
          { medicine: "Azithromycin 500mg", dosage: "1 tablet", duration: "5 days", instructions: "Once daily after food" },
          { medicine: "Salbutamol Inhaler", dosage: "2 puffs", duration: "7 days", instructions: "As needed for breathing difficulty" }
        ],
        attachments: [], fee: 700
      },
      {
        id: "V-003", date: "2024-03-01", symptoms: "Follow-up – cough improved, mild fatigue",
        diagnosis: "Recovering bronchitis", notes: "Chest clear. Advised to complete course.",
        vitals: { bp: "130/82", sugar: "118 mg/dL", temp: "98.6°F", weight: "78 kg", pulse: "78" },
        prescription: [
          { medicine: "Multivitamin", dosage: "1 tablet", duration: "30 days", instructions: "Morning after breakfast" }
        ],
        attachments: [], fee: 400
      }
    ]
  }
];

const SEED_APPOINTMENTS = [
  { id: "APT-001", patientId: "PT-001", patientName: "Anita Sharma", date: new Date().toISOString().split("T")[0], time: "10:00", reason: "Follow-up checkup", status: "confirmed" },
  { id: "APT-002", patientId: "PT-002", patientName: "Rajesh Kumar", date: new Date().toISOString().split("T")[0], time: "11:30", reason: "Sugar level review", status: "confirmed" },
  { id: "APT-003", patientId: "PT-001", patientName: "Anita Sharma", date: new Date().toISOString().split("T")[0], time: "14:00", reason: "General checkup", status: "waiting" },
];

const SEED_TEMPLATES = [
  { id: "T-001", name: "Common Cold", prescription: [{ medicine: "Paracetamol 500mg", dosage: "1 tablet", duration: "5 days", instructions: "After food, every 8 hrs" }, { medicine: "Cetirizine 10mg", dosage: "1 tablet", duration: "3 days", instructions: "At bedtime" }, { medicine: "Cough syrup", dosage: "10 ml", duration: "5 days", instructions: "3 times daily after food" }] },
  { id: "T-002", name: "Hypertension Follow-up", prescription: [{ medicine: "Amlodipine 5mg", dosage: "1 tablet", duration: "30 days", instructions: "Once daily morning" }, { medicine: "Telmisartan 40mg", dosage: "1 tablet", duration: "30 days", instructions: "Once daily morning" }] },
];

const DOCTOR_INFO = { name: "Dr. Priya Mehta", degree: "MBBS, MD (General Medicine)", clinic: "Mehta Wellness Clinic", address: "301, Harmony Plaza, Andheri West, Mumbai - 400058", phone: "022-28765432", reg: "MCI-12345" };

// ─── Utilities ────────────────────────────────────────────────────────────────
let ptCounter = 3;
let visitCounter = 10;
let aptCounter = 10;

const newPatientId = () => `PT-${String(++ptCounter).padStart(3, "0")}`;
const newVisitId = () => `V-${String(++visitCounter).padStart(3, "0")}`;
const newAptId = () => `APT-${String(++aptCounter).padStart(3, "0")}`;

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

// ─── Auth ─────────────────────────────────────────────────────────────────────
const USERS = [
  { username: "doctor", password: "doc123", role: "doctor", name: "Dr. Priya Mehta" },
  { username: "reception", password: "rec123", role: "receptionist", name: "Meena Joshi" }
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const S = {
  wrap: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f2f5", color: "#1a1a2e" },
  sidebar: { width: 220, background: "#1a1a2e", color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 },
  sideLogo: { padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  sideNav: { flex: 1, padding: "12px 0", overflowY: "auto" },
  sideItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, background: active ? "rgba(100,180,255,0.15)" : "transparent", color: active ? "#64b4ff" : "rgba(255,255,255,0.7)", borderLeft: active ? "3px solid #64b4ff" : "3px solid transparent", transition: "all 0.15s" }),
  main: { marginLeft: 220, minHeight: "100vh", display: "flex", flexDirection: "column" },
  topbar: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
  content: { flex: 1, padding: 28 },
  card: { background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 20 },
  btn: { padding: "8px 18px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" },
  btnPrimary: { background: "#1a1a2e", color: "#fff" },
  btnSecondary: { background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" },
  btnDanger: { background: "#fee2e2", color: "#dc2626" },
  btnSuccess: { background: "#d1fae5", color: "#059669" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" },
  badge: (color) => ({ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: color === "green" ? "#d1fae5" : color === "blue" ? "#dbeafe" : color === "amber" ? "#fef3c7" : color === "red" ? "#fee2e2" : "#f3f4f6", color: color === "green" ? "#065f46" : color === "blue" ? "#1d4ed8" : color === "amber" ? "#92400e" : color === "red" ? "#991b1b" : "#374151" }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  statCard: { background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 },
  tableWrap: { overflowX: "auto", borderRadius: 10, border: "1px solid #e5e7eb" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "12px 16px", background: "#f9fafb", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#6b7280", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td: { padding: "12px 16px", borderBottom: "1px solid #f3f4f6", color: "#374151" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" },
  modalBox: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 680, padding: 28, position: "relative" },
  tag: { display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500, gap: 6 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function Login({ onLogin }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const submit = () => {
    const user = USERS.find(x => x.username === u && x.password === p);
    if (user) onLogin(user); else setErr("Invalid credentials. Try doctor/doc123 or reception/rec123");
  };
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: "#1a1a2e", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>🏥</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>ClinicDesk</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Digital Clinic Assistant</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>Username</label>
          <input style={S.input} value={u} onChange={e => setU(e.target.value)} placeholder="Enter username" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Enter password" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        {err && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 12, background: "#fee2e2", padding: "8px 12px", borderRadius: 8 }}>{err}</div>}
        <button style={{ ...S.btn, ...S.btnPrimary, width: "100%", padding: "12px" }} onClick={submit}>Sign In →</button>
        <div style={{ marginTop: 20, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
          Demo: doctor / doc123 &nbsp;|&nbsp; reception / rec123
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { key: "dashboard", icon: "⬛", label: "Dashboard" },
  { key: "patients", icon: "👥", label: "Patients" },
  { key: "appointments", icon: "📅", label: "Appointments" },
  { key: "templates", icon: "📋", label: "Templates" },
  { key: "billing", icon: "💰", label: "Billing" },
];
const DOCTOR_ONLY = ["templates"];

function Sidebar({ active, setActive, user, onLogout }) {
  return (
    <div style={S.sidebar}>
      <div style={S.sideLogo}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>🏥 ClinicDesk</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{user.role === "doctor" ? "Doctor Portal" : "Reception Portal"}</div>
      </div>
      <div style={S.sideNav}>
        {NAV_ITEMS.filter(n => user.role === "doctor" || !DOCTOR_ONLY.includes(n.key)).map(n => (
          <div key={n.key} style={S.sideItem(active === n.key)} onClick={() => setActive(n.key)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span>{n.label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>{user.role}</div>
        <button style={{ ...S.btn, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 12, padding: "6px 14px" }} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ patients, appointments, setActive, setSelectedPatient }) {
  const todayApts = appointments.filter(a => a.date === today());
  const totalVisits = patients.reduce((s, p) => s + p.visits.length, 0);
  const recentVisits = patients.flatMap(p => p.visits.map(v => ({ ...v, patientName: p.name, patientId: p.id }))).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>Good morning 👋</div>
        <div style={{ color: "#6b7280", fontSize: 14 }}>Here's what's happening today — {fmtDate(today())}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Patients", value: patients.length, icon: "👥", color: "#dbeafe" },
          { label: "Today's Appointments", value: todayApts.length, icon: "📅", color: "#d1fae5" },
          { label: "Total Visits", value: totalVisits, icon: "📋", color: "#fef3c7" },
          { label: "Pending Today", value: todayApts.filter(a => a.status === "waiting").length, icon: "⏳", color: "#fee2e2" },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={S.grid2}>
        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Today's Appointments</div>
          {todayApts.length === 0 ? <div style={{ color: "#9ca3af", fontSize: 14 }}>No appointments today.</div> :
            todayApts.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.patientName}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{a.time} — {a.reason}</div>
                </div>
                <span style={S.badge(a.status === "confirmed" ? "green" : a.status === "waiting" ? "amber" : "red")}>{a.status}</span>
              </div>
            ))}
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent Visits</div>
          {recentVisits.map(v => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
              onClick={() => { const p = patients.find(x => x.id === v.patientId); setSelectedPatient(p); setActive("patients"); }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{v.patientName}</div>
                <div style={{ fontSize: 13, color: "#6b7280", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.diagnosis}</div>
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{fmtDate(v.date)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT FORM (Add/Edit)
// ═══════════════════════════════════════════════════════════════════════════════
function PatientForm({ patient, onSave, onClose }) {
  const [form, setForm] = useState(patient || { name: "", age: "", gender: "Male", contact: "", email: "", address: "", bloodGroup: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => {
    if (!form.name || !form.contact) return alert("Name and contact are required");
    onSave(form);
  };
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{patient ? "Edit Patient" : "Add New Patient"}</div>
        <div style={S.grid2}>
          <div><label style={S.label}>Full Name *</label><input style={S.input} value={form.name} onChange={set("name")} placeholder="Patient full name" /></div>
          <div><label style={S.label}>Age</label><input style={S.input} type="number" value={form.age} onChange={set("age")} placeholder="Age in years" /></div>
          <div>
            <label style={S.label}>Gender</label>
            <select style={S.input} value={form.gender} onChange={set("gender")}>
              {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div><label style={S.label}>Contact *</label><input style={S.input} value={form.contact} onChange={set("contact")} placeholder="Mobile number" /></div>
          <div><label style={S.label}>Email</label><input style={S.input} value={form.email} onChange={set("email")} placeholder="Email address" /></div>
          <div>
            <label style={S.label}>Blood Group</label>
            <select style={S.input} value={form.bloodGroup} onChange={set("bloodGroup")}>
              <option value="">Select</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16 }}><label style={S.label}>Address</label><textarea style={{ ...S.input, height: 70, resize: "vertical" }} value={form.address} onChange={set("address")} placeholder="Full address" /></div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save}>{patient ? "Save Changes" : "Add Patient"}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISIT FORM
// ═══════════════════════════════════════════════════════════════════════════════
function VisitForm({ patient, lastVisit, templates, onSave, onClose, userRole }) {
  const blankRx = () => ({ medicine: "", dosage: "", duration: "", instructions: "" });
  const [form, setForm] = useState({
    date: today(), symptoms: "", diagnosis: "", notes: "",
    vitals: { bp: "", sugar: "", temp: "", weight: "", pulse: "" },
    prescription: [blankRx()], fee: 500
  });
  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setV = k => e => setForm(f => ({ ...f, vitals: { ...f.vitals, [k]: e.target.value } }));
  const setRx = (i, k) => e => setForm(f => { const p = [...f.prescription]; p[i] = { ...p[i], [k]: e.target.value }; return { ...f, prescription: p }; });
  const addRx = () => setForm(f => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = i => setForm(f => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));
  const applyTemplate = (t) => setForm(f => ({ ...f, prescription: t.prescription.map(r => ({ ...r })) }));
  const copyLast = () => { if (lastVisit) setForm(f => ({ ...f, prescription: lastVisit.prescription.map(r => ({ ...r })), diagnosis: lastVisit.diagnosis })); };
  const save = () => {
    if (!form.symptoms) return alert("Symptoms are required");
    onSave(form);
  };
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 760 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>New Visit — {patient.name}</div>
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Patient ID: {patient.id}</div>

        {/* Vitals */}
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: "#374151" }}>Vitals</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {[["bp","BP (mmHg)"],["sugar","Blood Sugar"],["temp","Temp"],["weight","Weight"],["pulse","Pulse"]].map(([k,l]) => (
            <div key={k}><label style={{ ...S.label, fontSize: 12 }}>{l}</label><input style={S.input} value={form.vitals[k]} onChange={setV(k)} placeholder={k==="bp"?"120/80":k==="temp"?"°F":""} /></div>
          ))}
        </div>

        {/* Symptoms / Diagnosis */}
        <div style={S.grid2}>
          <div>
            <label style={S.label}>Symptoms *</label>
            <textarea style={{ ...S.input, height: 90, resize: "vertical" }} value={form.symptoms} onChange={setF("symptoms")} placeholder="Describe patient symptoms..." />
          </div>
          <div>
            <label style={S.label}>Diagnosis</label>
            <textarea style={{ ...S.input, height: 90, resize: "vertical" }} value={form.diagnosis} onChange={setF("diagnosis")} placeholder="Doctor's diagnosis..." />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={S.label}>Notes</label>
          <textarea style={{ ...S.input, height: 70, resize: "vertical" }} value={form.notes} onChange={setF("notes")} placeholder="Additional notes, referrals, follow-up instructions..." />
        </div>

        {/* Prescription */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>Prescription</div>
            {userRole === "doctor" && (
              <div style={{ display: "flex", gap: 8 }}>
                {lastVisit && <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={copyLast}>⤴ Copy Last Visit</button>}
                {templates.length > 0 && (
                  <select style={{ ...S.input, width: "auto", fontSize: 12, padding: "6px 10px" }} onChange={e => { const t = templates.find(x => x.id === e.target.value); if (t) applyTemplate(t); e.target.value = ""; }}>
                    <option value="">Apply Template...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                )}
              </div>
            )}
          </div>
          {form.prescription.map((rx, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input style={S.input} value={rx.medicine} onChange={setRx(i,"medicine")} placeholder="Medicine name" />
              <input style={S.input} value={rx.dosage} onChange={setRx(i,"dosage")} placeholder="Dosage" />
              <input style={S.input} value={rx.duration} onChange={setRx(i,"duration")} placeholder="Duration" />
              <input style={S.input} value={rx.instructions} onChange={setRx(i,"instructions")} placeholder="Instructions" />
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

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save}>Save Visit</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESCRIPTION PRINT
// ═══════════════════════════════════════════════════════════════════════════════
function PrintPrescription({ patient, visit, onClose }) {
  const ref = useRef();
  const doPrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Prescription</title><style>
      body{font-family:'Segoe UI',sans-serif;padding:40px;color:#111;max-width:700px;margin:0 auto}
      h2{margin:0;font-size:20px}h3{margin:0;font-size:14px;font-weight:400;color:#666}
      .header{border-bottom:2px solid #1a1a2e;padding-bottom:16px;margin-bottom:20px}
      .section{margin-bottom:16px}.label{font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
      .val{font-size:15px;margin-top:2px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .rx{margin-top:20px;border-top:1px solid #e5e7eb;padding-top:16px}
      .med{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;padding:10px;background:#f9fafb;border-radius:8px;margin-bottom:8px;font-size:14px}
      .footer{margin-top:40px;border-top:1px solid #e5e7eb;padding-top:16px;display:flex;justify-content:space-between;font-size:13px;color:#666}
      @media print{button{display:none}}
    </style></head><body>
    <div class="header">
      <h2>${DOCTOR_INFO.name}</h2>
      <h3>${DOCTOR_INFO.degree}</h3>
      <div style="margin-top:8px;font-size:13px;color:#666">${DOCTOR_INFO.clinic} &nbsp;|&nbsp; ${DOCTOR_INFO.address}<br>📞 ${DOCTOR_INFO.phone} &nbsp;|&nbsp; Reg: ${DOCTOR_INFO.reg}</div>
    </div>
    <div class="grid">
      <div class="section"><div class="label">Patient</div><div class="val"><strong>${patient.name}</strong><br><span style="font-size:13px;color:#666">${patient.age}Y / ${patient.gender} | ${patient.contact}</span></div></div>
      <div class="section"><div class="label">Date</div><div class="val">${fmtDate(visit.date)}</div></div>
    </div>
    ${visit.vitals?.bp ? `<div class="section"><div class="label">Vitals</div><div class="val" style="font-size:13px">BP: ${visit.vitals.bp} | Pulse: ${visit.vitals.pulse} | Temp: ${visit.vitals.temp} | Weight: ${visit.vitals.weight} | Sugar: ${visit.vitals.sugar}</div></div>` : ""}
    <div class="section"><div class="label">Diagnosis</div><div class="val">${visit.diagnosis || "—"}</div></div>
    ${visit.notes ? `<div class="section"><div class="label">Notes</div><div class="val" style="font-size:14px;color:#444">${visit.notes}</div></div>` : ""}
    <div class="rx">
      <div class="label" style="margin-bottom:10px">Rx — Prescription</div>
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;padding:8px 10px;font-size:12px;font-weight:600;color:#888">
        <div>Medicine</div><div>Dosage / Duration</div><div>Instructions</div>
      </div>
      ${visit.prescription.map((m, i) => `<div class="med"><div><strong>${i + 1}. ${m.medicine}</strong></div><div>${m.dosage}<br><span style="font-size:12px;color:#666">${m.duration}</span></div><div style="font-size:13px;color:#555">${m.instructions}</div></div>`).join("")}
    </div>
    <div class="footer">
      <div>Patient ID: ${patient.id} | Visit ID: ${visit.id}</div>
      <div style="text-align:right"><strong>Signature & Stamp</strong><br><br><br>_______________________<br>${DOCTOR_INFO.name}</div>
    </div>
    </body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 640 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Prescription Preview</div>
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: 24, fontSize: 14, lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
          <div style={{ borderBottom: "2px solid #1a1a2e", paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{DOCTOR_INFO.name}</div>
            <div style={{ color: "#666", fontSize: 13 }}>{DOCTOR_INFO.degree}</div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 6 }}>{DOCTOR_INFO.clinic} | {DOCTOR_INFO.address}</div>
          </div>
          <div style={S.grid2}>
            <div><strong>Patient:</strong> {patient.name}<br /><span style={{ fontSize: 13, color: "#666" }}>{patient.age}Y / {patient.gender}</span></div>
            <div><strong>Date:</strong> {fmtDate(visit.date)}</div>
          </div>
          <div style={{ marginTop: 12 }}><strong>Diagnosis:</strong> {visit.diagnosis || "—"}</div>
          {visit.notes && <div style={{ marginTop: 8, color: "#555" }}><strong>Notes:</strong> {visit.notes}</div>}
          <div style={{ marginTop: 16, borderTop: "1px solid #ddd", paddingTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Rx</div>
            {visit.prescription.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: "3px solid #1a1a2e" }}>
                <span style={{ fontWeight: 600 }}>{m.medicine}</span> — {m.dosage}, {m.duration}<br />
                <span style={{ color: "#666", fontSize: 13 }}>{m.instructions}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Close</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={doPrint}>🖨 Print Prescription</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENT DETAIL / HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
function PatientDetail({ patient, templates, user, onBack, onAddVisit, onUpdatePatient }) {
  const [printVisit, setPrintVisit] = useState(null);
  const [editPt, setEditPt] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const sortedVisits = [...patient.visits].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      {printVisit && <PrintPrescription patient={patient} visit={printVisit} onClose={() => setPrintVisit(null)} />}
      {showVisitForm && <VisitForm patient={patient} lastVisit={sortedVisits[0]} templates={templates} userRole={user.role}
        onSave={v => { onAddVisit(v); setShowVisitForm(false); }} onClose={() => setShowVisitForm(false)} />}
      {editPt && <PatientForm patient={patient} onSave={data => { onUpdatePatient(data); setEditPt(false); }} onClose={() => setEditPt(false)} />}

      <button style={{ ...S.btn, ...S.btnSecondary, marginBottom: 20 }} onClick={onBack}>← Back to Patients</button>

      {/* Patient Header */}
      <div style={{ ...S.card, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>
            {patient.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{patient.name}</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>{patient.id} &nbsp;|&nbsp; {patient.age}Y &nbsp;|&nbsp; {patient.gender} &nbsp;|&nbsp; {patient.bloodGroup || "—"}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>📞 {patient.contact} &nbsp;|&nbsp; ✉ {patient.email || "—"}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>📍 {patient.address || "—"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 13 }} onClick={() => setEditPt(true)}>✏ Edit</button>
          {user.role === "doctor" && <button style={{ ...S.btn, ...S.btnPrimary, fontSize: 13 }} onClick={() => setShowVisitForm(true)}>+ New Visit</button>}
        </div>
      </div>

      {/* Visit History */}
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Visit History ({patient.visits.length})</div>
      {sortedVisits.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", padding: 40 }}>No visits recorded yet.</div>
      ) : sortedVisits.map((visit, idx) => (
        <div key={visit.id} style={{ ...S.card, borderLeft: idx === 0 ? "4px solid #1a1a2e" : "4px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtDate(visit.date)}</div>
              {idx === 0 && <span style={{ ...S.badge("blue"), fontSize: 11, marginTop: 4, display: "inline-block" }}>Latest Visit</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={() => setPrintVisit(visit)}>🖨 Print Rx</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, background: "#f9fafb", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
            {[["BP", visit.vitals?.bp],["Sugar", visit.vitals?.sugar],["Temp", visit.vitals?.temp],["Weight", visit.vitals?.weight],["Pulse", visit.vitals?.pulse]].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: v ? "#1a1a2e" : "#d1d5db" }}>{v || "—"}</div>
              </div>
            ))}
          </div>

          <div style={S.grid2}>
            <div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>SYMPTOMS</div>
              <div style={{ fontSize: 14 }}>{visit.symptoms}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>DIAGNOSIS</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{visit.diagnosis || "—"}</div>
            </div>
          </div>
          {visit.notes && <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>NOTES</div>
            <div style={{ fontSize: 14, color: "#555" }}>{visit.notes}</div>
          </div>}

          {visit.prescription?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>PRESCRIPTION ({visit.prescription.length} medicines)</div>
              {visit.prescription.map((rx, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 12px", background: "#f0f9ff", borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                  <div style={{ fontWeight: 600, minWidth: 160 }}>{rx.medicine}</div>
                  <div style={{ color: "#374151" }}>{rx.dosage} · {rx.duration}</div>
                  <div style={{ color: "#6b7280", marginLeft: "auto" }}>{rx.instructions}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Visit ID: {visit.id}</div>
            {visit.fee && <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>₹{visit.fee}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATIENTS LIST
// ═══════════════════════════════════════════════════════════════════════════════
function Patients({ patients, setPatients, templates, user, initialSelected, clearSelected }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialSelected || null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { if (initialSelected) { setSelected(initialSelected); clearSelected(); } }, [initialSelected]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.includes(search)
  );

  const addPatient = (data) => {
    const np = { ...data, id: newPatientId(), createdAt: today(), visits: [] };
    setPatients(ps => [...ps, np]);
    setShowAdd(false);
  };

  const updatePatient = (pt, data) => {
    setPatients(ps => ps.map(p => p.id === pt.id ? { ...p, ...data } : p));
    setSelected(p => ({ ...p, ...data }));
  };

  const addVisit = (pt, visitData) => {
    const v = { ...visitData, id: newVisitId() };
    setPatients(ps => ps.map(p => p.id === pt.id ? { ...p, visits: [...p.visits, v] } : p));
    setSelected(p => ({ ...p, visits: [...p.visits, v] }));
  };

  if (selected) {
    const live = patients.find(p => p.id === selected.id) || selected;
    return <PatientDetail patient={live} templates={templates} user={user}
      onBack={() => setSelected(null)}
      onAddVisit={v => addVisit(live, v)}
      onUpdatePatient={data => updatePatient(live, data)} />;
  }

  return (
    <div>
      {showAdd && <PatientForm onSave={addPatient} onClose={() => setShowAdd(false)} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Patients ({patients.length})</div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowAdd(true)}>+ Add Patient</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input style={{ ...S.input, maxWidth: 380 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, ID or phone..." />
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>
            {["ID","Patient","Age/Gender","Contact","Last Visit","Visits",""].map(h => <th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(p => {
              const last = p.visits.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
              return (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelected(p)}>
                  <td style={S.td}><span style={S.badge("blue")}>{p.id}</span></td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.bloodGroup}</div>
                  </td>
                  <td style={S.td}>{p.age}Y / {p.gender}</td>
                  <td style={S.td}>{p.contact}</td>
                  <td style={S.td}>{last ? fmtDate(last.date) : <span style={{ color: "#d1d5db" }}>No visits</span>}</td>
                  <td style={S.td}><span style={S.badge("green")}>{p.visits.length}</span></td>
                  <td style={S.td}><button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={e => { e.stopPropagation(); setSelected(p); }}>View →</button></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#9ca3af", padding: 40 }}>No patients found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function Appointments({ appointments, setAppointments, patients }) {
  const [showForm, setShowForm] = useState(false);
  const [viewDate, setViewDate] = useState(today());
  const [form, setForm] = useState({ patientId: "", date: today(), time: "", reason: "", status: "confirmed" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const dayApts = appointments.filter(a => a.date === viewDate).sort((a, b) => a.time.localeCompare(b.time));

  const addApt = () => {
    if (!form.patientId || !form.date || !form.time) return alert("Patient, date and time are required");
    const pt = patients.find(p => p.id === form.patientId);
    setAppointments(apts => [...apts, { ...form, id: newAptId(), patientName: pt.name }]);
    setShowForm(false); setForm({ patientId: "", date: today(), time: "", reason: "", status: "confirmed" });
  };

  const updateStatus = (id, status) => setAppointments(apts => apts.map(a => a.id === id ? { ...a, status } : a));
  const deleteApt = (id) => setAppointments(apts => apts.filter(a => a.id !== id));

  const STATUS_COLORS = { confirmed: "green", waiting: "amber", completed: "blue", cancelled: "red" };

  return (
    <div>
      {showForm && (
        <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={S.modalBox}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Book Appointment</div>
            <div style={S.grid2}>
              <div>
                <label style={S.label}>Patient *</label>
                <select style={S.input} value={form.patientId} onChange={set("patientId")}>
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
              </div>
              <div><label style={S.label}>Date *</label><input type="date" style={S.input} value={form.date} onChange={set("date")} /></div>
              <div><label style={S.label}>Time *</label><input type="time" style={S.input} value={form.time} onChange={set("time")} /></div>
              <div>
                <label style={S.label}>Status</label>
                <select style={S.input} value={form.status} onChange={set("status")}>
                  {["confirmed","waiting","completed","cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 14 }}><label style={S.label}>Reason</label><input style={S.input} value={form.reason} onChange={set("reason")} placeholder="Reason for visit" /></div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={{ ...S.btn, ...S.btnSecondary }} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={{ ...S.btn, ...S.btnPrimary }} onClick={addApt}>Book Appointment</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Appointments</div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowForm(true)}>+ Book Appointment</button>
      </div>

      <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 600 }}>View date:</div>
        <input type="date" style={{ ...S.input, width: 180 }} value={viewDate} onChange={e => setViewDate(e.target.value)} />
        <div style={{ color: "#6b7280", fontSize: 14 }}>{dayApts.length} appointment{dayApts.length !== 1 ? "s" : ""}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dayApts.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", padding: 40 }}>No appointments for this date.</div>
        ) : dayApts.map(a => (
          <div key={a.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ background: "#1a1a2e", color: "#fff", padding: "8px 14px", borderRadius: 10, fontWeight: 700, fontSize: 14, minWidth: 56, textAlign: "center" }}>{a.time}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{a.patientName}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>{a.reason || "General checkup"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select style={{ ...S.input, width: "auto", fontSize: 12, padding: "5px 10px" }} value={a.status}
                onChange={e => updateStatus(a.id, e.target.value)}>
                {["confirmed","waiting","completed","cancelled"].map(s => <option key={s}>{s}</option>)}
              </select>
              <span style={S.badge(STATUS_COLORS[a.status])}>{a.status}</span>
              <button style={{ ...S.btn, ...S.btnDanger, fontSize: 12 }} onClick={() => deleteApt(a.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
function Templates({ templates, setTemplates }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", prescription: [{ medicine: "", dosage: "", duration: "", instructions: "" }] });
  const blankRx = () => ({ medicine: "", dosage: "", duration: "", instructions: "" });
  const addRx = () => setForm(f => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = i => setForm(f => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));
  const setRx = (i, k) => e => setForm(f => { const p = [...f.prescription]; p[i] = { ...p[i], [k]: e.target.value }; return { ...f, prescription: p }; });

  const save = () => {
    if (!form.name) return alert("Template name required");
    setTemplates(ts => [...ts, { ...form, id: "T-" + Date.now() }]);
    setShowForm(false); setForm({ name: "", prescription: [blankRx()] });
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
              {t.prescription.map((rx, i) => (
                <div key={i} style={{ fontSize: 13, padding: "6px 10px", background: "#f9fafb", borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{rx.medicine}</span> — {rx.dosage}, {rx.duration}
                  <div style={{ color: "#6b7280", fontSize: 12 }}>{rx.instructions}</div>
                </div>
              ))}
              <button style={{ ...S.btn, ...S.btnDanger, fontSize: 12, marginTop: 10 }} onClick={() => setTemplates(ts => ts.filter(x => x.id !== t.id))}>Delete Template</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BILLING
// ═══════════════════════════════════════════════════════════════════════════════
function Billing({ patients }) {
  const allBills = patients.flatMap(p =>
    p.visits.filter(v => v.fee).map(v => ({
      patientName: p.name, patientId: p.id, visitId: v.id, date: v.date,
      diagnosis: v.diagnosis, fee: Number(v.fee)
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = allBills.reduce((s, b) => s + b.fee, 0);
  const thisMonth = allBills.filter(b => b.date.startsWith(today().slice(0, 7))).reduce((s, b) => s + b.fee, 0);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Billing</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={S.statCard}><div style={{ fontSize: 13, color: "#6b7280" }}>Total Revenue</div><div style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>₹{total.toLocaleString("en-IN")}</div></div>
        <div style={S.statCard}><div style={{ fontSize: 13, color: "#6b7280" }}>This Month</div><div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>₹{thisMonth.toLocaleString("en-IN")}</div></div>
        <div style={S.statCard}><div style={{ fontSize: 13, color: "#6b7280" }}>Total Invoices</div><div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>{allBills.length}</div></div>
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>{["Date","Patient","Diagnosis","Amount"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {allBills.map(b => (
              <tr key={b.visitId}>
                <td style={S.td}>{fmtDate(b.date)}</td>
                <td style={S.td}><div style={{ fontWeight: 600 }}>{b.patientName}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{b.patientId}</div></td>
                <td style={S.td}>{b.diagnosis || "—"}</td>
                <td style={S.td}><span style={{ fontWeight: 700, color: "#059669" }}>₹{Number(b.fee).toLocaleString("en-IN")}</span></td>
              </tr>
            ))}
            {allBills.length === 0 && <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", color: "#9ca3af", padding: 40 }}>No billing records yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useState(SEED_PATIENTS);
  const [appointments, setAppointments] = useState(SEED_APPOINTMENTS);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard patients={patients} appointments={appointments} setActive={setPage} setSelectedPatient={setSelectedPatient} />;
      case "patients": return <Patients patients={patients} setPatients={setPatients} templates={templates} user={user} initialSelected={selectedPatient} clearSelected={() => setSelectedPatient(null)} />;
      case "appointments": return <Appointments appointments={appointments} setAppointments={setAppointments} patients={patients} />;
      case "templates": return <Templates templates={templates} setTemplates={setTemplates} />;
      case "billing": return <Billing patients={patients} />;
      default: return null;
    }
  };

  return (
    <div style={S.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar active={page} setActive={setPage} user={user} onLogout={() => setUser(null)} />
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#1a1a2e", textTransform: "capitalize" }}>{page}</div>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>{DOCTOR_INFO.clinic} &nbsp;|&nbsp; {fmtDate(today())}</div>
        </div>
        <div style={S.content}>{renderPage()}</div>
      </div>
    </div>
  );
}