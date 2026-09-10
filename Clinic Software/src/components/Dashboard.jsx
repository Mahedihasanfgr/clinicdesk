import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";
import heroBg from "../assets/clinic_hero_banner.jpg";
import {
  Users,
  CalendarCheck,
  FileText,
  HeartPulse,
  Clock,
  UserPlus,
  CalendarPlus,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles
} from "lucide-react";

export default function Dashboard({ patients, appointments, setActive, setSelectedPatient }) {
  const todayStr = today();
  const todayApts = appointments.filter(a => (a.date || "").toString().slice(0, 10) === todayStr);
  const totalVisits = patients.reduce((s, p) => s + (p.visits?.length || 0), 0);
  
  const recentVisits = patients
    .flatMap(p => (p.visits || []).map(v => ({ ...v, patientName: p.name, patientId: p.id })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  const upcomingFollowups = patients
    .flatMap(p => (p.visits || [])
      .filter(v => v.followup_date && v.followup_date >= todayStr && v.followup_date <= in7Days.toISOString().split("T")[0])
      .map(v => ({ patientName: p.name, patientId: p.id, followup_date: v.followup_date, followup_note: v.followup_note, visitId: v.id }))
    )
    .sort((a, b) => new Date(a.followup_date) - new Date(b.followup_date));

  const stats = [
    {
      label: "Total Registered Patients",
      value: patients.length,
      icon: Users,
      color: "#0D9488",
      bg: "#F0FDFA",
      border: "#99F6E4",
      trend: "OPD Database",
      trendIcon: TrendingUp,
    },
    {
      label: "Today's Appointments",
      value: todayApts.length,
      icon: CalendarCheck,
      color: "#0284C7",
      bg: "#F0F9FF",
      border: "#BAE6FD",
      trend: `${todayApts.filter(a => a.status === 'confirmed').length} Confirmed`,
      trendIcon: CheckCircle2,
    },
    {
      label: "Clinical Encounters & Rx",
      value: totalVisits,
      icon: FileText,
      color: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      trend: "Documented Visits",
      trendIcon: HeartPulse,
    },
    {
      label: "Follow-ups Due (7 Days)",
      value: upcomingFollowups.length,
      icon: Clock,
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
      trend: `${upcomingFollowups.filter(f => f.followup_date === todayStr).length} Due Today`,
      trendIcon: AlertCircle,
    },
  ];

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* High-End Hero Welcome Banner */}
      <div style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        boxShadow: "0 10px 30px -5px rgba(11, 19, 43, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}>
        {/* Scrim overlay for high contrast readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(11, 19, 43, 0.94) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(15, 23, 42, 0.4) 100%)",
          backdropFilter: "blur(2px)",
        }} />

        <div style={{
          position: "relative",
          zIndex: 2,
          padding: "36px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          color: "#FFFFFF",
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(20, 184, 166, 0.18)",
              border: "1px solid rgba(45, 212, 191, 0.3)",
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12.5,
              fontWeight: 700,
              color: "#2DD4BF",
              marginBottom: 12,
              backdropFilter: "blur(8px)",
            }}>
              <Sparkles size={14} />
              <span>Clinical Practice Active • {fmtDate(todayStr)}</span>
            </div>

            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 8,
              lineHeight: 1.2,
            }}>
              Welcome to Your Clinical Workspace
            </h1>
            <p style={{
              fontSize: 14.5,
              color: "#CBD5E1",
              maxWidth: 540,
              lineHeight: 1.5,
            }}>
              Manage OPD patient flow, generate prescription orders, and trigger automated WhatsApp PDFs in real time.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={{
                ...S.btn,
                background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
                color: "#FFFFFF",
                padding: "11px 18px",
                borderRadius: 12,
                fontSize: 13.5,
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(13, 148, 136, 0.4)",
              }}
              className="btn-interactive"
              onClick={() => setActive("patients")}
            >
              <UserPlus size={16} />
              <span>New Patient</span>
            </button>

            <button
              style={{
                ...S.btn,
                background: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(10px)",
                padding: "11px 18px",
                borderRadius: 12,
                fontSize: 13.5,
                fontWeight: 700,
              }}
              className="btn-interactive"
              onClick={() => setActive("appointments")}
            >
              <CalendarPlus size={16} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div style={S.grid4}>
        {stats.map((s, i) => {
          const IconComponent = s.icon;
          const TrendIconComponent = s.trendIcon;

          return (
            <div key={i} style={S.statCard} className="card-hover">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", letterSpacing: "-0.01em" }}>
                  {s.label}
                </span>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                }}>
                  <IconComponent size={20} strokeWidth={2.2} />
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 10,
                }}>
                  {s.value}
                </div>

                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 600,
                  color: s.color,
                  background: s.bg,
                  padding: "3px 8px",
                  borderRadius: 6,
                }}>
                  <TrendIconComponent size={13} />
                  <span>{s.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Clinical Workbench Grid */}
      <div style={S.grid2}>
        {/* Left Column: Today's OPD Appointment Queue */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                Today's Patient Queue
              </h2>
              <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                Appointments scheduled for {fmtDate(todayStr)}
              </p>
            </div>
            <button
              style={{ ...S.btn, ...S.btnGhost, padding: "6px 12px", fontSize: 12.5, color: "#0D9488", fontWeight: 700 }}
              onClick={() => setActive("appointments")}
              className="btn-interactive"
            >
              <span>View All</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {todayApts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "#F8FAFC",
              borderRadius: 14,
              border: "1px dashed #CBD5E1",
            }}>
              <Calendar size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                No appointments scheduled today
              </div>
              <p style={{ fontSize: 12.5, color: "#64748B", marginBottom: 16 }}>
                Patients will show up here as they book or check in at reception.
              </p>
              <button
                style={{ ...S.btn, ...S.btnPrimary, fontSize: 12.5, padding: "8px 16px" }}
                onClick={() => setActive("appointments")}
                className="btn-interactive"
              >
                <CalendarPlus size={14} />
                <span>Book Appointment</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {todayApts.map(a => {
                const statusColor = a.status === "confirmed" ? "green" : a.status === "cancelled" ? "red" : "amber";
                return (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      background: "#F8FAFC",
                      borderRadius: 14,
                      border: "1px solid #E2E8F0",
                      transition: "all 0.18s ease",
                    }}
                    className="card-hover"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#0D9488",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      }}>
                        {(a.patient_name || "P").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                          {a.patient_name}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={12} color="#0D9488" /> {a.time || "OPD Walk-in"}
                          </span>
                          <span>•</span>
                          <span>{a.contact || "No Phone"}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={S.badge(statusColor)}>
                        {a.status || "Pending"}
                      </span>

                      {a.patient_id && (
                        <button
                          style={{
                            ...S.btn,
                            background: "#FFFFFF",
                            color: "#0D9488",
                            border: "1px solid #CCFBF1",
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                          className="btn-interactive"
                          onClick={() => {
                            const found = patients.find(p => p.id === a.patient_id);
                            if (found) {
                              setSelectedPatient(found);
                              setActive("patients");
                            }
                          }}
                        >
                          <Stethoscope size={13} />
                          <span>Consult</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Follow-ups Due & Recent Encounters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Upcoming Follow-ups Due Card */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Follow-ups Due (Next 7 Days)
                </h2>
                <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                  Patients scheduled for medical re-evaluation
                </p>
              </div>
              <span style={S.badge("amber")}>
                {upcomingFollowups.length} Due
              </span>
            </div>

            {upcomingFollowups.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 16px", color: "#94A3B8", fontSize: 13 }}>
                No clinical follow-ups scheduled for the upcoming week.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcomingFollowups.slice(0, 4).map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#78350F" }}>
                        {f.patientName}
                      </div>
                      <div style={{ fontSize: 12, color: "#92400E", marginTop: 1 }}>
                        {f.followup_note || "Scheduled routine check"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#B45309" }}>
                        {fmtDate(f.followup_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Prescriptions & Visits Card */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Recent Consultations
                </h2>
                <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                  Latest patient encounters documented
                </p>
              </div>
              <button
                style={{ ...S.btn, ...S.btnGhost, padding: "4px 8px", fontSize: 12, color: "#0D9488", fontWeight: 700 }}
                onClick={() => setActive("patients")}
              >
                All Records →
              </button>
            </div>

            {recentVisits.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 16px", color: "#94A3B8", fontSize: 13 }}>
                No patient consultations recorded yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentVisits.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                    className="card-hover"
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>
                        {v.patientName}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                        {v.diagnosis || v.chief_complaint || "General Consultation"}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>
                      {fmtDate(v.date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
