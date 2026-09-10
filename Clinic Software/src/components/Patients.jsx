import { useState, useEffect } from "react";
import { tokens } from "../styles/tokens";
import { fmtDate } from "../utils/helpers";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";
import { PageHeader, Badge, Button, EmptyState } from "./common";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Filter,
  Stethoscope,
  Eye,
  Calendar,
  CalendarCheck,
} from "lucide-react";

export default function Patients({
  patients,
  addPatient,
  updatePatient,
  addVisit,
  templates,
  user,
  initialSelected,
  clearSelected,
}) {
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("All");
  const [selected, setSelected] = useState(initialSelected || null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (initialSelected) {
      setSelected(initialSelected);
      clearSelected();
    }
  }, [initialSelected]);

  const filtered = patients.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.surname || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.contact || "").includes(search);

    const pBg = p.bloodGroup || p.blood_group || "";
    const matchesBlood = bloodFilter === "All" || pBg.toUpperCase() === bloodFilter.toUpperCase();

    return matchesSearch && matchesBlood;
  });

  if (selected) {
    const live = patients.find((p) => p.id === selected.id) || selected;
    return (
      <PatientDetail
        patient={live}
        templates={templates}
        user={user}
        onBack={() => setSelected(null)}
        onAddVisit={(v) => addVisit(live, v)}
        onUpdatePatient={(data) => updatePatient(live, data)}
      />
    );
  }

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {showAdd && (
        <PatientForm
          onSave={async (data) => {
            await addPatient(data);
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Page Header */}
      <PageHeader
        icon={Users}
        title="Patient Directory"
        count={patients.length}
        countLabel="Profiles"
        description="Comprehensive electronic health records, demographics, and prescription history"
        actions={
          <Button variant="primary" icon={UserPlus} onClick={() => setShowAdd(true)}>
            Register New Patient
          </Button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", flex: 1, minWidth: 280, maxWidth: 440 }}>
          <Search
            size={17}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: tokens.colors.slate[400],
            }}
          />
          <input
            style={{
              width: "100%",
              padding: "10px 14px",
              paddingLeft: 42,
              borderRadius: tokens.radii.md,
              border: `1px solid ${tokens.colors.slate[300]}`,
              background: "#FFFFFF",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: tokens.colors.slate[900],
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, ID, or mobile number..."
          />
        </div>

        {/* Blood Group Quick Filter Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: tokens.colors.slate[500],
              marginRight: 4,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Filter size={13} /> Blood:
          </span>
          {["All", "A+", "B+", "O+", "AB+", "A-", "B-", "O-"].map((bg) => {
            const isAct = bloodFilter === bg;
            return (
              <button
                key={bg}
                onClick={() => setBloodFilter(bg)}
                style={{
                  padding: "5px 11px",
                  fontSize: 12,
                  fontWeight: isAct ? 700 : 500,
                  borderRadius: tokens.radii.sm,
                  background: isAct ? tokens.colors.primary[600] : "#FFFFFF",
                  color: isAct ? "#FFFFFF" : tokens.colors.slate[700],
                  border: `1px solid ${isAct ? tokens.colors.primary[600] : tokens.colors.slate[300]}`,
                  cursor: "pointer",
                  transition: tokens.transitions.fast,
                }}
                className="btn-interactive"
              >
                {bg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patients Data Table / Empty State */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: tokens.radii.xl,
            border: `1px solid ${tokens.colors.slate[200]}`,
            boxShadow: tokens.shadows.sm,
          }}
        >
          <EmptyState
            icon={Users}
            color="teal"
            title={patients.length === 0 ? "No patients registered yet" : "No matching patients found"}
            description={
              patients.length === 0
                ? "Start building your clinical practice by registering your first patient."
                : `No patient records match the search filter "${search}". Try searching by another keyword or clear filters.`
            }
            actionLabel={patients.length === 0 ? "Register First Patient" : "Clear Filter"}
            actionIcon={UserPlus}
            onAction={() => {
              if (patients.length === 0) setShowAdd(true);
              else {
                setSearch("");
                setBloodFilter("All");
              }
            }}
          />
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: tokens.radii.xl,
            border: `1px solid ${tokens.colors.slate[200]}`,
            background: "#FFFFFF",
            boxShadow: tokens.shadows.sm,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={{ padding: "14px 20px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Patient Profile
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Demographics
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Contact Phone
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Medical ID
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Last Consultation
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Encounters
                </th>
                <th style={{ padding: "14px 20px", background: tokens.colors.slate[50], textAlign: "right", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const visits = p.visits || [];
                const last = [...visits].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                const bg = p.bloodGroup || p.blood_group;

                return (
                  <tr
                    key={p.id}
                    style={{ cursor: "pointer" }}
                    className="table-row-hover"
                    onClick={() => setSelected(p)}
                  >
                    {/* Name & Avatar */}
                    <td style={{ padding: "14px 20px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: tokens.radii.md,
                            background: "linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 100%)",
                            border: "1px solid #CCFBF1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 14,
                            color: tokens.colors.primary[600],
                            flexShrink: 0,
                          }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: tokens.colors.slate[900], fontSize: 14 }}>
                            {p.name} {p.surname || ""}
                          </div>
                          {bg && (
                            <span style={{ fontSize: 11.5, color: tokens.colors.primary[700], fontWeight: 700 }}>
                              Blood: {bg}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                      <div style={{ fontWeight: 600, color: tokens.colors.slate[800] }}>
                        {p.age ? `${p.age} Yrs` : "—"}
                      </div>
                      <div style={{ fontSize: 12, color: tokens.colors.slate[500] }}>
                        {p.gender || "Not specified"}
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: tokens.colors.slate[700], fontWeight: 500 }}>
                        <Phone size={13} color={tokens.colors.primary[600]} />
                        <span>{p.contact}</span>
                      </div>
                    </td>

                    {/* Medical ID */}
                    <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                      <span
                        style={{
                          fontFamily: tokens.typography.monoFont,
                          fontWeight: 700,
                          fontSize: 11.5,
                          background: tokens.colors.slate[100],
                          padding: "3px 8px",
                          borderRadius: 6,
                          color: tokens.colors.slate[600],
                          border: `1px solid ${tokens.colors.slate[200]}`,
                        }}
                      >
                        {p.id}
                      </span>
                    </td>

                    {/* Last Visit */}
                    <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                      {last ? (
                        <div>
                          <div style={{ fontWeight: 600, color: tokens.colors.slate[800], fontSize: 13 }}>
                            {fmtDate(last.date)}
                          </div>
                          <div style={{ fontSize: 11.5, color: tokens.colors.slate[500] }}>
                            {last.diagnosis || "Consultation"}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: tokens.colors.slate[400], fontSize: 12.5 }}>
                          First visit pending
                        </span>
                      )}
                    </td>

                    {/* Encounters Count */}
                    <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                      <Badge variant={visits.length > 0 ? "teal" : "slate"} size="sm">
                        {visits.length} Visits
                      </Badge>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "14px 20px", borderBottom: `1px solid ${tokens.colors.slate[100]}`, textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 8 }}>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(p);
                          }}
                        >
                          <Stethoscope size={13} />
                          <span>Consult</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
