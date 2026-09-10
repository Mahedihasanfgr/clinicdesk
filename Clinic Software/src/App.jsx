import { useState, useEffect } from "react";
import { S } from "./styles/styles";
import { tokens } from "./styles/tokens";
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
import {
  Stethoscope,
  Activity,
  Building2,
  Calendar,
  Clock,
  Menu,
  ChevronRight,
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

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
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0B132B 0%, #111C44 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          color: "#FFFFFF",
          fontFamily: tokens.typography.fontFamily,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 30px rgba(13, 148, 136, 0.4)",
            position: "relative",
          }}
        >
          <Stethoscope size={32} color="#FFF" />
          <div
            style={{
              position: "absolute",
              inset: -4,
              border: "2px solid #2DD4BF",
              borderRadius: 24,
              opacity: 0.6,
              animation: "pulseSubtle 1.8s infinite",
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 6 }}>
            Synchronizing Clinical Records
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8" }}>
            Loading clinical workspace for #{user.clinicCode}...
          </div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard patients={patients} appointments={appointments} setActive={setPage} setSelectedPatient={setSelectedPatient} />;
      case "patients":
        return <Patients patients={patients} addPatient={addPatient} updatePatient={updatePatient} addVisit={addVisit} templates={templates} user={user} initialSelected={selectedPatient} clearSelected={() => setSelectedPatient(null)} />;
      case "appointments":
        return <Appointments appointments={appointments} addAppointment={addAppointment} updateAppointment={updateAppointment} deleteAppointment={deleteAppointment} patients={patients} addPatient={addPatient} addVisit={addVisit} templates={templates} user={user} />;
      case "templates":
        return <Templates templates={templates} addTemplate={addTemplate} deleteTemplate={deleteTemplate} />;
      case "billing":
        return <Billing patients={patients} />;
      case "whatsapp":
        return <WhatsAppPage />;
      default:
        return null;
    }
  };

  return (
    <div style={S.wrap}>
      <Sidebar
        active={page}
        setActive={setPage}
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main" style={S.main}>
        {/* Topbar Toolbar Header */}
        <header style={S.topbar}>
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-menu-btn"
              style={{
                display: "none",
                background: "#FFFFFF",
                border: `1px solid ${tokens.colors.slate[200]}`,
                borderRadius: tokens.radii.sm,
                padding: "6px 8px",
                cursor: "pointer",
                color: tokens.colors.slate[700],
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: tokens.colors.primary[600],
                  fontSize: 13.5,
                  fontWeight: 700,
                }}
              >
                <Activity size={16} />
                <span>Workspace</span>
              </div>
              <ChevronRight size={14} color={tokens.colors.slate[300]} />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: tokens.colors.slate[900],
                  textTransform: "capitalize",
                  letterSpacing: "-0.02em",
                }}
              >
                {page}
              </span>
            </div>
          </div>

          {/* Right Status Indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Clinic Chip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F0FDFA",
                border: "1px solid #CCFBF1",
                padding: "6px 14px",
                borderRadius: tokens.radii.full,
                fontSize: 12.5,
                fontWeight: 700,
                color: "#0F766E",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                  boxShadow: "0 0 6px #10B981",
                }}
              />
              <Building2 size={14} color="#0D9488" />
              <span>{user.clinicName || DOCTOR_INFO.clinic}</span>
              <span
                style={{
                  color: "#0D9488",
                  background: "rgba(13, 148, 136, 0.1)",
                  padding: "2px 7px",
                  borderRadius: 10,
                  fontFamily: tokens.typography.monoFont,
                  fontSize: 11,
                }}
              >
                #{user.clinicCode}
              </span>
            </div>

            {/* Date & Live Clock Pill */}
            <div
              className="topbar-desktop-only"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#FFFFFF",
                border: `1px solid ${tokens.colors.slate[200]}`,
                padding: "6px 14px",
                borderRadius: tokens.radii.full,
                fontSize: 12.5,
                color: tokens.colors.slate[600],
                fontWeight: 600,
                boxShadow: tokens.shadows.xs,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={14} color={tokens.colors.slate[400]} />
                {fmtDate(today())}
              </span>
              <span style={{ color: tokens.colors.slate[200] }}>|</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: tokens.colors.slate[900], fontWeight: 700 }}>
                <Clock size={14} color="#0D9488" />
                {currentTime}
              </span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main style={S.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
