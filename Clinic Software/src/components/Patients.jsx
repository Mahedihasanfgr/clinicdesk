import { useState, useEffect } from "react";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";
import {
  Users,
  UserPlus,
  Search,
  Calendar,
  Phone,
  ChevronRight,
  Filter,
  FileText,
  Clock,
  HeartPulse
} from "lucide-react";

export default function Patients({ patients, addPatient, updatePatient, addVisit, templates, user, initialSelected, clearSelected }) {
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

  const filtered = patients.filter(p => {
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
    const live = patients.find(p => p.id === selected.id) || selected;
    return (
      <PatientDetail
        patient={live}
        templates={templates}
        user={user}
        onBack={() => setSelected(null)}
        onAddVisit={v => addVisit(live, v)}
        onUpdatePatient={data => updatePatient(live, data)}
      />
    );
  }

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {showAdd && (
        <PatientForm
          onSave={async data => {
            await addPatient(data);
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Top Header Card */}
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
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
          }}>
            <Users size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                Patient Directory
              </h1>
              <span style={S.badge("teal")}>
                {patients.length} Active Profiles
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
              OPD records, clinical encounters, and digital prescription history
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
          onClick={() => setShowAdd(true)}
        >
          <UserPlus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}>
        {/* Search Input */}
        <div style={{ position: "relative", flex: 1, minWidth: 280, maxWidth: 440 }}>
          <Search size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input
            style={{ ...S.input, paddingLeft: 42, background: "#FFFFFF" }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name, ID, or mobile number..."
          />
        </div>

        {/* Blood Group Quick Filter Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginRight: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <Filter size={13} /> Blood:
          </span>
          {["All", "A+", "B+", "O+", "AB+", "A-", "B-", "O-"].map(bg => {
            const isAct = bloodFilter === bg;
            return (
              <button
                key={bg}
                onClick={() => setBloodFilter(bg)}
                style={{
                  ...S.btn,
                  padding: "5px 10px",
                  fontSize: 12,
                  fontWeight: isAct ? 700 : 500,
                  borderRadius: 8,
                  background: isAct ? "#0D9488" : "#FFFFFF",
                  color: isAct ? "#FFFFFF" : "#475569",
                  border: `1px solid ${isAct ? "#0D9488" : "#E2E8F0"}`,
                }}
                className="btn-interactive"
              >
                {bg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patients Data Table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Patient Profile</th>
              <th style={S.th}>Demographics</th>
              <th style={S.th}>Contact Phone</th>
              <th style={S.th}>Medical ID</th>
              <th style={S.th}>Last Visit</th>
              <th style={S.th}>Encounters</th>
              <th style={{ ...S.th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
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
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 100%)",
                        border: "1px solid #CCFBF1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#0D9488",
                      }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>
                          {p.name} {p.surname || ""}
                        </div>
                        {bg && (
                          <span style={{ fontSize: 11.5, color: "#0D9488", fontWeight: 700 }}>
                            Blood: {bg}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Age / Gender */}
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: "#334155" }}>
                      {p.age ? `${p.age} Yrs` : "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>
                      {p.gender || "Not specified"}
                    </div>
                  </td>

                  {/* Contact */}
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#334155", fontWeight: 500 }}>
                      <Phone size={13} color="#0D9488" />
                      <span>{p.contact}</span>
                    </div>
                  </td>

                  {/* Medical ID */}
                  <td style={S.td}>
                    <span style={{
                      ...S.badge("slate"),
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: 11.5,
                    }}>
                      {p.id}
                    </span>
                  </td>

                  {/* Last Visit */}
                  <td style={S.td}>
                    {last ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#0F172A", fontSize: 13, fontWeight: 500 }}>
                        <Calendar size={13} color="#64748B" />
                        <span>{fmtDate(last.date)}</span>
                      </div>
                    ) : (
                      <span style={{ color: "#94A3B8", fontSize: 12.5 }}>First consultation pending</span>
                    )}
                  </td>

                  {/* Visit Count */}
                  <td style={S.td}>
                    <span style={S.badge(visits.length > 0 ? "green" : "slate")}>
                      <FileText size={12} />
                      <span>{visits.length} {visits.length === 1 ? "Visit" : "Visits"}</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <button
                      style={{
                        ...S.btn,
                        ...S.btnSecondary,
                        padding: "6px 12px",
                        fontSize: 12.5,
                        borderRadius: 8,
                      }}
                      className="btn-interactive"
                      onClick={e => {
                        e.stopPropagation();
                        setSelected(p);
                      }}
                    >
                      <span>View File</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...S.td, textAlign: "center", padding: "48px 16px", color: "#64748B" }}>
                  <Users size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
                    No patient records found
                  </div>
                  <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 4 }}>
                    Try refining your search query or register a new patient profile.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
