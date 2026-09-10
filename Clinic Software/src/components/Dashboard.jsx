import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";

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
      label: "Total OPD Patients",
      value: patients.length,
      icon: "🏥",
      color: "#0D9488",
      bg: "#F0FDF4",
      border: "#99F6E4",
      trend: "Registered Records"
    },
    {
      label: "Today's Appointments",
      value: todayApts.length,
      icon: "📅",
      color: "#0284C7",
      bg: "#F0F9FF",
      border: "#BAE6FD",
      trend: `${todayApts.filter(a => a.status === 'confirmed').length} Confirmed`
    },
    {
      label: "Encounters & Prescriptions",
      value: totalVisits,
      icon: "💊",
      color: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      trend: "Clinical Visits"
    },
    {
      label: "Follow-ups Due (7d)",
      value: upcomingFollowups.length,
      icon: "🩺",
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
      trend: `${upcomingFollowups.filter(f => f.followup_date === todayStr).length} Due Today`
    },
  ];

  return (
    <div className="animate-fade">
      {/* Hero Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #064E3B 0%, #0F172A 100%)",
        borderRadius: 20,
        padding: "32px 36px",
        marginBottom: 28,
        color: "#FFFFFF",
        boxShadow: "0 10px 25px -5px rgba(6, 78, 59, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          right: "-5%",
          top: "-50%",
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
          borderRadius: "50%"
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 255, 255, 0.12)", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#34D399", marginBottom: 12 }}>
            <span>🩺 Doctor Overview • {fmtDate(todayStr)}</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Welcome to Clinical Dashboard 👋
          </h1>
          <p style={{ fontSize: 14, color: "#D1D5DB", maxWidth: 520 }}>
            Here is your daily medical overview. You have {todayApts.length} patient appointment(s) scheduled today.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 2 }}>
          <button
            style={{
              ...S.btn,
              background: "#FFFFFF",
              color: "#064E3B",
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 12
            }}
            className="btn-interactive"
            onClick={() => setActive("patients")}
          >
            <span>➕</span> New Patient OPD
          </button>
          <button
            style={{
              ...S.btn,
              ...S.btnPrimary,
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 12
            }}
            className="btn-interactive"
            onClick={() => setActive("appointments")}
          >
            <span>📅</span> Book Appointment
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard} className="card-hover">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: s.bg,
                border: `1px solid ${s.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: s.color, background: s.bg, padding: "3px 10px", borderRadius: 12, border: `1px solid ${s.border}` }}>
                {s.trend}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", marginTop: 12 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        {/* Today's Appointments */}
        <div style={S.card} className="card-hover">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Today's Appointments</h3>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Scheduled OPD visits for today</p>
            </div>
            <button style={{ ...S.btn, ...S.btnSecondary, padding: "6px 14px", fontSize: 12 }} onClick={() => setActive("appointments")}>
              View All →
            </button>
          </div>

          {todayApts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", background: "#F8FAFC", borderRadius: 14, border: "1px dashed #CBD5E1" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>No appointments scheduled for today</div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Click book appointment to add new patient consultations.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {todayApts.map(a => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
                      color: "#FFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      {(a.patientName || a.patient_name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{a.patientName || a.patient_name}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                        ⏰ {a.time} • {a.reason || "General Consultation"}
                      </div>
                    </div>
                  </div>
                  <span style={S.badge(a.status === "confirmed" ? "green" : a.status === "waiting" ? "amber" : "blue")}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div style={S.card} className="card-hover">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Upcoming Follow-ups</h3>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Patients due in the next 7 days</p>
            </div>
            <span style={S.badge("amber")}>{upcomingFollowups.length} Pending</span>
          </div>

          {upcomingFollowups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 16px", background: "#F8FAFC", borderRadius: 14, border: "1px dashed #CBD5E1" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🩺</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>No upcoming follow-ups</div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Follow-up reminders will appear here after patient visits.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingFollowups.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    const p = patients.find(x => x.id === f.patientId);
                    setSelectedPatient(p);
                    setActive("patients");
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      color: "#B45309",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      🩺
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{f.patientName}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{f.followup_note || "Scheduled Follow-up"}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={S.badge(f.followup_date === todayStr ? "red" : "slate")}>
                      {f.followup_date === todayStr ? "Due Today" : fmtDate(f.followup_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Encounters / Prescriptions */}
      <div style={S.card} className="card-hover">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Recent Clinical Encounters & Prescriptions</h3>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Latest patient consultations and diagnosis history</p>
          </div>
          <button style={{ ...S.btn, ...S.btnSecondary, padding: "6px 14px", fontSize: 12 }} onClick={() => setActive("patients")}>
            Manage OPD Patients →
          </button>
        </div>

        {recentVisits.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 16px", background: "#F8FAFC", borderRadius: 14, border: "1px dashed #CBD5E1" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💊</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>No clinical visits recorded yet</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Add clinical visits and prescriptions from the Patients directory.</div>
          </div>
        ) : (
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Patient Name</th>
                  <th style={S.th}>Visit Date</th>
                  <th style={S.th}>Diagnosis / Complaint</th>
                  <th style={S.th}>Fee</th>
                  <th style={{ ...S.th, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map(v => (
                  <tr key={v.id} style={{ transition: "background 0.15s" }}>
                    <td style={S.td}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{v.patientName}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>OPD: {v.patientId}</div>
                    </td>
                    <td style={S.td}>
                      <span style={S.badge("teal")}>{fmtDate(v.date)}</span>
                    </td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600, color: "#334155" }}>{v.diagnosis || v.chief_complaint || "Routine Checkup"}</div>
                      {v.notes && <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{v.notes}</div>}
                    </td>
                    <td style={S.td}>
                      <span style={{ fontWeight: 700, color: "#059669" }}>₹{v.fee || 0}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: "right" }}>
                      <button
                        style={{ ...S.btn, ...S.btnSecondary, padding: "5px 12px", fontSize: 12 }}
                        onClick={() => {
                          const p = patients.find(x => x.id === v.patientId);
                          setSelectedPatient(p);
                          setActive("patients");
                        }}
                      >
                        View Record →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
