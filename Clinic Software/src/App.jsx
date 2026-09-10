import { useState, useEffect } from "react";
import { S } from "./styles/styles";
import { DOCTOR_INFO } from "./constants/doctor";
import { fmtDate, today } from "./utils/helpers";
import {
  apiGetPatients, apiAddPatient, apiUpdatePatient, apiAddVisit,
  apiGetAppointments, apiAddAppointment, apiUpdateAppointment, apiDeleteAppointment,
  apiGetTemplates, apiAddTemplate, apiDeleteTemplate
} from "./api";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Patients from "./components/Patients";
import Appointments from "./components/Appointments";
import Templates from "./components/Templates";
import Billing from "./components/Billing";
import WhatsAppPage from "./components/WhatsAppPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([apiGetPatients(), apiGetAppointments(), apiGetTemplates()])
      .then(([p, a, t]) => {
        setPatients(Array.isArray(p) ? p : []);
        setAppointments(Array.isArray(a) ? a : []);
        setTemplates(Array.isArray(t) ? t : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPatients([]); setAppointments([]); setTemplates([]);
  };

  // Patients
  const addPatient = async (data) => {
    const saved = await apiAddPatient(data);
    if (saved.error) throw new Error(saved.error);
    setPatients(ps => [...ps, { ...saved, visits: [] }]);
    return saved;
  };

  const updatePatient = async (pt, data) => {
    const updated = await apiUpdatePatient(pt.id, data);
    setPatients(ps => ps.map(p => p.id === pt.id ? { ...p, ...updated, visits: p.visits } : p));
    return updated;
  };

  const addVisit = async (pt, visitData) => {
    const saved = await apiAddVisit(pt.id, visitData);
    if (saved.error) throw new Error(saved.error);
    const updated = await apiGetPatients();
    setPatients(updated);
    // Auto-send PDF via WhatsApp if connected
    if (pt.contact) {
      try {
        const fullVisit = updated.find(p => p.id === pt.id)?.visits?.slice(-1)[0] || saved;
        await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify({ patient: pt, visit: { ...visitData, ...fullVisit } }),
        });
      } catch { /* silent — WhatsApp not connected is fine */ }
    }
    return saved;
  };

  // Appointments
  const addAppointment = async (data) => {
    const saved = await apiAddAppointment(data);
    setAppointments(apts => [...apts, saved]);
  };

  const updateAppointment = async (id, status) => {
    await apiUpdateAppointment(id, status);
    setAppointments(apts => apts.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = async (id) => {
    await apiDeleteAppointment(id);
    setAppointments(apts => apts.filter(a => a.id !== id));
  };

  // Templates
  const addTemplate = async (data) => {
    await apiAddTemplate(data);
    setTemplates(ts => [...ts, data]);
  };

  const deleteTemplate = async (id) => {
    await apiDeleteTemplate(id);
    setTemplates(ts => ts.filter(t => t.id !== id));
  };

  if (!user) {
    if (showRegister) return <Register onBack={() => setShowRegister(false)} />;
    return <Login onLogin={setUser} onShowRegister={() => setShowRegister(true)} />;
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16
      }}>
        <div style={{
          width: 52,
          height: 52,
          border: "4px solid #CCFBF1",
          borderTopColor: "#0D9488",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Loading Clinical Workspace...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard patients={patients} appointments={appointments} setActive={setPage} setSelectedPatient={setSelectedPatient} />;
      case "patients": return <Patients patients={patients} addPatient={addPatient} updatePatient={updatePatient} addVisit={addVisit} templates={templates} user={user} initialSelected={selectedPatient} clearSelected={() => setSelectedPatient(null)} />;
      case "appointments": return <Appointments appointments={appointments} addAppointment={addAppointment} updateAppointment={updateAppointment} deleteAppointment={deleteAppointment} patients={patients} addPatient={addPatient} addVisit={addVisit} templates={templates} user={user} />;
      case "templates": return <Templates templates={templates} addTemplate={addTemplate} deleteTemplate={deleteTemplate} />;
      case "billing": return <Billing patients={patients} />;
      case "whatsapp": return <WhatsAppPage />;
      default: return null;
    }
  };

  return (
    <div style={S.wrap}>
      <Sidebar active={page} setActive={setPage} user={user} onLogout={handleLogout} />
      <div style={S.main}>
        {/* Medical Topbar Header */}
        <div style={S.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#0D9488", fontSize: 14, fontWeight: 700 }}>🩺 Clinical Portal</span>
            <span style={{ color: "#CBD5E1" }}>/</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", textTransform: "capitalize", letterSpacing: "-0.01em" }}>
              {page}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              color: "#047857"
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block", boxShadow: "0 0 6px #10B981" }} />
              <span>🏥 {user.clinicName || DOCTOR_INFO.clinic}</span>
              <span style={{ color: "#0D9488" }}>({user.clinicCode})</span>
            </div>

            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>
              📅 {fmtDate(today())}
            </div>
          </div>
        </div>

        <div style={S.content}>{renderPage()}</div>
      </div>
    </div>
  );
}
