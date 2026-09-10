import { useState } from "react";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import PatientForm from "./PatientForm";
import VisitForm from "./VisitForm";
import PrintPrescription from "./PrintPrescription";
import {
  ArrowLeft,
  Edit3,
  Stethoscope,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Activity,
  Pill,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  HeartPulse
} from "lucide-react";

export default function PatientDetail({
  patient,
  templates,
  user,
  onBack,
  onAddVisit,
  onUpdatePatient,
  asModal = false,
  openVisitForm = false,
  onVisitSaved
}) {
  const [printVisit, setPrintVisit] = useState(null);
  const [editPt, setEditPt] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(openVisitForm);
  const sortedVisits = [...(patient.visits || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {printVisit && (
        <PrintPrescription
          patient={patient}
          visit={printVisit}
          onClose={() => setPrintVisit(null)}
        />
      )}

      {showVisitForm && (
        <VisitForm
          patient={patient}
          lastVisit={sortedVisits[0]}
          templates={templates}
          userRole={user.role}
          onSave={async v => {
            await onAddVisit(v);
            if (onVisitSaved) onVisitSaved();
            setShowVisitForm(false);
          }}
          onClose={() => setShowVisitForm(false)}
        />
      )}

      {editPt && (
        <PatientForm
          patient={{
            ...patient,
            bloodGroup: patient.bloodGroup || patient.blood_group,
            ongoingMedicines: patient.ongoing_medicines || patient.ongoingMedicines
          }}
          onSave={data => {
            onUpdatePatient(data);
            setEditPt(false);
          }}
          onClose={() => setEditPt(false)}
        />
      )}

      {/* Back button */}
      {!asModal && (
        <div>
          <button
            style={{
              ...S.btn,
              ...S.btnSecondary,
              padding: "7px 14px",
              fontSize: 13,
              borderRadius: 10,
            }}
            className="btn-interactive"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Patient Directory</span>
          </button>
        </div>
      )}

      {/* High-End Patient Profile Card */}
      <div style={{
        ...S.card,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        padding: "28px 32px",
        marginBottom: 0,
        position: "relative",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20,
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Avatar Initial Badge */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 6px 18px rgba(13, 148, 136, 0.3)",
              flexShrink: 0,
            }}>
              {patient.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  {patient.name} {patient.surname || ""}
                </h1>
                <span style={{
                  ...S.badge("slate"),
                  fontFamily: "monospace",
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  ID: {patient.id}
                </span>
                {(patient.bloodGroup || patient.blood_group) && (
                  <span style={S.badge("red")}>
                    Blood: {patient.bloodGroup || patient.blood_group}
                  </span>
                )}
              </div>

              {/* Demographics row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 13.5,
                color: "#64748B",
                marginTop: 6,
                flexWrap: "wrap",
              }}>
                <span>{patient.age ? `${patient.age} Years Old` : "Age not recorded"}</span>
                <span>•</span>
                <span>{patient.gender || "Gender unspecified"}</span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#0F172A", fontWeight: 600 }}>
                  <Phone size={13} color="#0D9488" /> {patient.contact}
                </span>
                {patient.email && (
                  <>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Mail size={13} color="#64748B" /> {patient.email}
                    </span>
                  </>
                )}
              </div>

              {patient.address && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748B", marginTop: 4 }}>
                  <MapPin size={13} color="#94A3B8" /> {patient.address}
                </div>
              )}

              {/* Medical Alerts Pills */}
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                {patient.allergy && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#B91C1C",
                    padding: "4px 12px",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                  }}>
                    <AlertTriangle size={14} />
                    <span>Allergies: {patient.allergy}</span>
                  </div>
                )}

                {patient.kco && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#EEF2FF",
                    border: "1px solid #C7D2FE",
                    color: "#4338CA",
                    padding: "4px 12px",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}>
                    <Activity size={14} />
                    <span>Known Condition: {patient.kco}</span>
                  </div>
                )}

                {(patient.ongoing_medicines || patient.ongoingMedicines) && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    color: "#15803D",
                    padding: "4px 12px",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}>
                    <Pill size={14} />
                    <span>Ongoing Rx: {patient.ongoing_medicines || patient.ongoingMedicines}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{ ...S.btn, ...S.btnSecondary, padding: "8px 14px", fontSize: 13 }}
              className="btn-interactive"
              onClick={() => setEditPt(true)}
            >
              <Edit3 size={14} />
              <span>Edit Details</span>
            </button>

            {user.role === "doctor" && (
              <button
                style={{ ...S.btn, ...S.btnPrimary, padding: "8px 16px", fontSize: 13 }}
                className="btn-interactive"
                onClick={() => setShowVisitForm(true)}
              >
                <Stethoscope size={15} />
                <span>+ New Consultation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visit History Section */}
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} color="#0D9488" />
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Clinical Visit Timeline
            </h2>
            <span style={S.badge("slate")}>
              {sortedVisits.length} Records
            </span>
          </div>
        </div>

        {sortedVisits.length === 0 ? (
          <div style={{
            ...S.card,
            textAlign: "center",
            padding: "48px 20px",
            color: "#64748B",
            border: "1px dashed #CBD5E1",
          }}>
            <Stethoscope size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#334155" }}>
              No Clinical Visits Recorded Yet
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, marginBottom: 18 }}>
              Click below to initiate this patient's first clinical examination and generate an Rx.
            </p>
            {user.role === "doctor" && (
              <button
                style={{ ...S.btn, ...S.btnPrimary, padding: "9px 18px", fontSize: 13.5 }}
                className="btn-interactive"
                onClick={() => setShowVisitForm(true)}
              >
                <Stethoscope size={15} />
                <span>Start Initial Consultation</span>
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {sortedVisits.map((visit, idx) => (
              <div
                key={visit.id}
                style={{
                  ...S.card,
                  borderLeft: idx === 0 ? "5px solid #0D9488" : "5px solid #CBD5E1",
                  marginBottom: 0,
                }}
              >
                {/* Visit Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  paddingBottom: 14,
                  borderBottom: "1px solid #F1F5F9",
                  marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#0F172A",
                    }}>
                      <Calendar size={16} color="#0D9488" />
                      <span>{fmtDate(visit.date)}</span>
                    </div>

                    {idx === 0 && (
                      <span style={S.badge("teal")}>
                        Latest Consultation
                      </span>
                    )}
                  </div>

                  <button
                    style={{
                      ...S.btn,
                      ...S.btnSecondary,
                      padding: "6px 14px",
                      fontSize: 12.5,
                      borderRadius: 8,
                    }}
                    className="btn-interactive"
                    onClick={() => setPrintVisit(visit)}
                  >
                    <Printer size={14} color="#0D9488" />
                    <span>Print Prescription (Rx)</span>
                  </button>
                </div>

                {/* Chief Complaint Banner */}
                {visit.chief_complaint && (
                  <div style={{
                    padding: "10px 14px",
                    background: "#F0FDFA",
                    border: "1px solid #CCFBF1",
                    borderRadius: 10,
                    fontSize: 13.5,
                    marginBottom: 16,
                  }}>
                    <strong style={{ color: "#0F766E" }}>Chief Complaint: </strong>
                    <span style={{ color: "#134E4A" }}>{visit.chief_complaint}</span>
                  </div>
                )}

                {/* Vitals Strip */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: 12,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 18,
                }}>
                  {[
                    ["Blood Pressure", visit.vitals?.bp, "mmHg"],
                    ["Blood Sugar", visit.vitals?.sugar, "mg/dL"],
                    ["Body Temp", visit.vitals?.temp, "°F"],
                    ["Weight", visit.vitals?.weight, "kg"],
                    ["Pulse Rate", visit.vitals?.pulse, "bpm"],
                  ].map(([label, val, unit]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: val ? "#0F172A" : "#94A3B8", marginTop: 2 }}>
                        {val ? `${val} ${unit}` : "—"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Symptoms & Diagnosis */}
                <div style={{ ...S.grid2, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                      Clinical Symptoms
                    </div>
                    <div style={{ fontSize: 13.5, color: "#334155", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 14px" }}>
                      {visit.symptoms || "No specific symptoms noted"}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                      Provisional Diagnosis
                    </div>
                    <div style={{ fontSize: 13.5, color: "#0F172A", fontWeight: 600, background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: 8, padding: "10px 14px" }}>
                      {visit.diagnosis || "General evaluation"}
                    </div>
                  </div>
                </div>

                {/* Prescriptions Table */}
                {visit.prescriptions && visit.prescriptions.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 12, color: "#0F766E", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                      <Pill size={14} /> Prescribed Medicines ({visit.prescriptions.length})
                    </div>
                    <div style={S.tableWrap}>
                      <table style={S.table}>
                        <thead>
                          <tr>
                            <th style={S.th}>Medicine Name</th>
                            <th style={S.th}>Dosage</th>
                            <th style={S.th}>Frequency</th>
                            <th style={S.th}>Duration</th>
                            <th style={S.th}>Instructions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visit.prescriptions.map((p, pIdx) => (
                            <tr key={pIdx} className="table-row-hover">
                              <td style={{ ...S.td, fontWeight: 700, color: "#0F172A" }}>
                                {p.medicine_name || p.name}
                              </td>
                              <td style={S.td}>{p.dosage || "—"}</td>
                              <td style={S.td}>
                                <span style={{ ...S.badge("blue"), fontSize: 11.5 }}>
                                  {p.frequency || "—"}
                                </span>
                              </td>
                              <td style={S.td}>{p.duration || "—"}</td>
                              <td style={{ ...S.td, color: "#64748B" }}>{p.instructions || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Footer Strip: Follow-up & Consultation Fee */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  paddingTop: 12,
                  borderTop: "1px solid #F1F5F9",
                  fontSize: 13,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {visit.followup_date && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#92400E",
                        background: "#FEF3C7",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 12,
                      }}>
                        <Clock size={13} />
                        <span>Follow-up: {fmtDate(visit.followup_date)} ({visit.followup_note || "Review"})</span>
                      </div>
                    )}
                  </div>

                  {visit.fee && (
                    <div style={{ fontWeight: 700, color: "#059669", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>Consultation Fee:</span>
                      <span style={{ fontSize: 15 }}>₹{parseFloat(visit.fee).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
