import { tokens } from "../styles/tokens";
import { today, fmtDate } from "../utils/helpers";
import heroBg from "../assets/clinic_hero_banner.jpg";
import { StatCard, Card, Badge, Button, EmptyState } from "./common";
import {
  Users,
  CalendarCheck,
  FileText,
  Clock,
  UserPlus,
  CalendarPlus,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

export default function Dashboard({ patients, appointments, setActive, setSelectedPatient }) {
  const todayStr = today();
  const todayApts = appointments.filter((a) => (a.date || "").toString().slice(0, 10) === todayStr);
  const totalVisits = patients.reduce((s, p) => s + (p.visits?.length || 0), 0);

  const recentVisits = patients
    .flatMap((p) => (p.visits || []).map((v) => ({ ...v, patientName: p.name, patientId: p.id })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  const upcomingFollowups = patients
    .flatMap((p) =>
      (p.visits || [])
        .filter(
          (v) =>
            v.followup_date &&
            v.followup_date >= todayStr &&
            v.followup_date <= in7Days.toISOString().split("T")[0]
        )
        .map((v) => ({
          patientName: p.name,
          patientId: p.id,
          followup_date: v.followup_date,
          followup_note: v.followup_note,
          visitId: v.id,
        }))
    )
    .sort((a, b) => new Date(a.followup_date) - new Date(b.followup_date));

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* High-End Hero Welcome Banner */}
      <div
        style={{
          position: "relative",
          borderRadius: tokens.radii.xxl,
          overflow: "hidden",
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          boxShadow: tokens.shadows.lg,
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Scrim overlay for high contrast readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(11, 19, 43, 0.95) 0%, rgba(15, 23, 42, 0.88) 55%, rgba(15, 23, 42, 0.4) 100%)",
            backdropFilter: "blur(2px)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            color: "#FFFFFF",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(20, 184, 166, 0.18)",
                border: "1px solid rgba(45, 212, 191, 0.35)",
                padding: "5px 14px",
                borderRadius: tokens.radii.full,
                fontSize: 12.5,
                fontWeight: 700,
                color: "#2DD4BF",
                marginBottom: 12,
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles size={14} />
              <span>Clinical Operations • {fmtDate(todayStr)}</span>
            </div>

            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              Welcome to Your Clinical Workspace
            </h1>
            <p
              style={{
                fontSize: 14.5,
                color: "#CBD5E1",
                maxWidth: 540,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Manage OPD queues, record digital consultations, and transmit branded prescriptions to patient WhatsApp instantly.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button
              variant="primary"
              size="md"
              icon={UserPlus}
              onClick={() => setActive("patients")}
            >
              New Patient
            </Button>

            <button
              style={{
                background: "rgba(255, 255, 255, 0.14)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.28)",
                backdropFilter: "blur(10px)",
                padding: "10px 18px",
                borderRadius: tokens.radii.md,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        <StatCard
          title="Total Registered Patients"
          value={patients.length}
          icon={Users}
          color="teal"
          trend="OPD Active"
          trendPositive={true}
          onClick={() => setActive("patients")}
        />
        <StatCard
          title="Today's Appointments"
          value={todayApts.length}
          icon={CalendarCheck}
          color="blue"
          trend={`${todayApts.filter((a) => a.status === "confirmed").length} Confirmed`}
          trendPositive={true}
          onClick={() => setActive("appointments")}
        />
        <StatCard
          title="Clinical Consultations & Rx"
          value={totalVisits}
          icon={FileText}
          color="green"
          trend="Total Visits"
          trendPositive={true}
        />
        <StatCard
          title="Follow-ups Due (7 Days)"
          value={upcomingFollowups.length}
          icon={Clock}
          color="amber"
          trend={`${upcomingFollowups.filter((f) => f.followup_date === todayStr).length} Today`}
          trendPositive={upcomingFollowups.length > 0}
        />
      </div>

      {/* 2-Column Clinical Workbench Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 24 }} className="dashboard-grid">
        {/* Left Column: Today's OPD Appointment Queue */}
        <Card
          title="Today's Patient Queue"
          subtitle={`Appointments scheduled for ${fmtDate(todayStr)}`}
          action={
            <Button
              variant="ghost"
              size="sm"
              iconRight={ChevronRight}
              onClick={() => setActive("appointments")}
              style={{ color: tokens.colors.primary[600], fontWeight: 700 }}
            >
              View All
            </Button>
          }
        >
          {todayApts.length === 0 ? (
            <EmptyState
              icon={Calendar}
              color="teal"
              title="No patients scheduled for today"
              description="Patients will show up here in real time as they book appointments or check in at the reception desk."
              actionLabel="Book New Appointment"
              actionIcon={CalendarPlus}
              onAction={() => setActive("appointments")}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {todayApts.map((a) => {
                const statusVariant =
                  a.status === "confirmed" ? "green" : a.status === "cancelled" ? "red" : "amber";

                return (
                  <div
                    key={a.id}
                    className="card-hover"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      background: tokens.colors.slate[50],
                      borderRadius: tokens.radii.lg,
                      border: `1px solid ${tokens.colors.slate[200]}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: tokens.radii.md,
                          background: "#FFFFFF",
                          border: `1px solid ${tokens.colors.slate[200]}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 14,
                          color: tokens.colors.primary[600],
                          boxShadow: tokens.shadows.xs,
                        }}
                      >
                        {(a.patient_name || "P").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: tokens.colors.slate[900] }}>
                          {a.patient_name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: tokens.colors.slate[500],
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 2,
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={12} color={tokens.colors.primary[600]} />
                            {a.time || "OPD Walk-in"}
                          </span>
                          <span>•</span>
                          <span>{a.contact || "No Phone"}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Badge variant={statusVariant} size="sm" dot>
                        {a.status || "Pending"}
                      </Badge>

                      {a.patient_id && (
                        <button
                          style={{
                            background: "#FFFFFF",
                            color: tokens.colors.primary[600],
                            border: `1px solid ${tokens.colors.primary[200]}`,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            borderRadius: tokens.radii.md,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            cursor: "pointer",
                          }}
                          className="btn-interactive"
                          onClick={() => {
                            const found = patients.find((p) => p.id === a.patient_id);
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
        </Card>

        {/* Right Column: Follow-ups Due & Recent Consultations */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Upcoming Follow-ups Due Card */}
          <Card
            title="Follow-ups Due"
            subtitle="Patients scheduled for medical re-evaluation (7 days)"
            action={
              <Badge variant="amber" size="sm">
                {upcomingFollowups.length} Due
              </Badge>
            }
          >
            {upcomingFollowups.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  color: tokens.colors.slate[400],
                  fontSize: 13,
                }}
              >
                <Clock size={28} style={{ margin: "0 auto 8px", opacity: 0.6 }} />
                <div>No clinical follow-ups scheduled for the next 7 days.</div>
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
                      borderRadius: tokens.radii.md,
                      background: tokens.colors.semantic.warning.bg,
                      border: `1px solid ${tokens.colors.semantic.warning.border}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: tokens.colors.semantic.warning.text }}>
                        {f.patientName}
                      </div>
                      <div style={{ fontSize: 12, color: tokens.colors.semantic.warning.text, opacity: 0.85, marginTop: 1 }}>
                        {f.followup_note || "Scheduled routine check"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.colors.semantic.warning.text }}>
                        {fmtDate(f.followup_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Consultations Card */}
          <Card
            title="Recent Consultations"
            subtitle="Latest documented electronic health records"
            action={
              <Badge variant="green" size="sm">
                {recentVisits.length} Logged
              </Badge>
            }
          >
            {recentVisits.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  color: tokens.colors.slate[400],
                  fontSize: 13,
                }}
              >
                <FileCheck2 size={28} style={{ margin: "0 auto 8px", opacity: 0.6 }} />
                <div>No patient consultations documented yet.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentVisits.map((v, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: tokens.radii.md,
                      background: tokens.colors.slate[50],
                      border: `1px solid ${tokens.colors.slate[200]}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: tokens.colors.slate[900] }}>
                        {v.patientName}
                      </div>
                      <div style={{ fontSize: 12, color: tokens.colors.slate[500], marginTop: 1 }}>
                        {v.diagnosis || "General Clinical Encounter"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 11.5, color: tokens.colors.slate[500] }}>
                        {fmtDate(v.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
