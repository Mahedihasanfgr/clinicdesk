import { useRef } from "react";
import { createPortal } from "react-dom";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import { DOCTOR_INFO } from "../constants/doctor";
import { printPrescription } from "../utils/printPrescription";
import { Printer, X, FileText, Stethoscope, AlertTriangle, AlertCircle, Calendar } from "lucide-react";

export default function PrintPrescription({ patient, visit, onClose }) {
  const ref = useRef();

  const doPrint = () => {
    printPrescription(patient, visit);
  };

  const bloodGroup = patient.bloodGroup || patient.blood_group || "";
  const vitals = visit.vitals || {};
  const vitalsList = [];
  if (vitals.bp) vitalsList.push(`BP: ${vitals.bp} mmHg`);
  if (vitals.pulse) vitalsList.push(`Pulse: ${vitals.pulse} bpm`);
  if (vitals.temp) vitalsList.push(`Temp: ${vitals.temp} °F`);
  if (vitals.weight) vitalsList.push(`Wt: ${vitals.weight} kg`);
  if (vitals.sugar) vitalsList.push(`Sugar: ${vitals.sugar} mg/dL`);

  return createPortal(
    <div style={S.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 720, maxHeight: "calc(100vh - 48px)", overflowY: "auto", padding: "24px 20px" }}>
        {/* Modal Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 14,
            borderBottom: "1px solid #E2E8F0",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#F0FDFA",
                border: "1px solid #CCFBF1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0D9488",
              }}
            >
              <Printer size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
                Prescription Preview
              </h2>
              <span style={{ fontSize: 12, color: "#64748B" }}>
                Patient: {patient.name} {patient.surname || ""}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              cursor: "pointer",
            }}
            className="btn-interactive"
          >
            <X size={16} />
          </button>
        </div>

        {/* Paper Document Preview */}
        <div
          ref={ref}
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: 14,
            padding: "24px 20px",
            fontSize: 13.5,
            color: "#334155",
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
          }}
        >
          {/* Top Brand Accent Line */}
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg, #0D9488 0%, #0284C7 100%)",
              borderRadius: 4,
              marginBottom: 18,
            }}
          />

          {/* Letterhead Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1.5px solid #E2E8F0",
              paddingBottom: 16,
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                {DOCTOR_INFO.clinic}
              </div>
              <div style={{ color: "#0D9488", fontWeight: 700, fontSize: 13.5, marginTop: 2 }}>
                {DOCTOR_INFO.name}
              </div>
              <div style={{ color: "#475569", fontSize: 12 }}>{DOCTOR_INFO.degree}</div>
              <div style={{ color: "#64748B", fontSize: 11.5, marginTop: 4, lineHeight: 1.4 }}>
                {DOCTOR_INFO.address}<br />
                Phone: {DOCTOR_INFO.phone} &nbsp;|&nbsp; Reg: {DOCTOR_INFO.reg}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#0D9488",
                  background: "#F0FDFA",
                  border: "1.5px solid #CCFBF1",
                  padding: "2px 12px",
                  borderRadius: 10,
                  marginBottom: 4,
                }}
              >
                Rx
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                {fmtDate(visit.date)}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>
                Ref: #{visit.id || patient.id}
              </div>
            </div>
          </div>

          {/* Patient Details Card (Responsive Grid) */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                Patient Name
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>
                {patient.name} {patient.surname || ""}
              </div>
              <div style={{ fontSize: 12, color: "#475569" }}>
                {patient.age ? patient.age + " Yrs" : "—"} / {patient.gender || "—"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                Contact & Blood Group
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginTop: 2 }}>
                {patient.contact || "—"}
              </div>
              <div style={{ fontSize: 12, color: "#0D9488", fontWeight: 700 }}>
                Blood: {bloodGroup || "—"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                Patient ID
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0D9488", fontFamily: "monospace", marginTop: 2 }}>
                #{patient.id}
              </div>
              <div style={{ fontSize: 11.5, color: "#64748B" }}>OPD Consultation</div>
            </div>
          </div>

          {/* Clinical Alerts */}
          {patient.allergy && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12.5,
                color: "#991B1B",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertTriangle size={14} color="#DC2626" />
              <span><strong>Known Allergies:</strong> {patient.allergy}</span>
            </div>
          )}

          {patient.kco && (
            <div
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12.5,
                color: "#1E40AF",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertCircle size={14} color="#2563EB" />
              <span><strong>Known Medical History:</strong> {patient.kco}</span>
            </div>
          )}

          {/* Vitals Strip */}
          {vitalsList.length > 0 && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "#334155",
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {vitalsList.map((v, i) => (
                <span key={i} style={{ background: "#F1F5F9", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                  {v}
                </span>
              ))}
            </div>
          )}

          {/* Diagnosis / Complaint */}
          {(visit.chief_complaint || visit.diagnosis || visit.notes) && (
            <div
              style={{
                borderLeft: "3px solid #0D9488",
                padding: "8px 14px",
                marginBottom: 16,
                background: "#F8FAFC",
                borderRadius: "0 8px 8px 0",
              }}
            >
              {visit.chief_complaint && (
                <div style={{ fontSize: 13, color: "#1E293B", marginBottom: 3 }}>
                  <strong>Chief Complaint:</strong> {visit.chief_complaint}
                </div>
              )}
              {visit.diagnosis && (
                <div style={{ fontSize: 13, color: "#0F766E", fontWeight: 700 }}>
                  <strong>Clinical Diagnosis:</strong> {visit.diagnosis}
                </div>
              )}
              {visit.notes && (
                <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                  <strong>Doctor Notes:</strong> {visit.notes}
                </div>
              )}
            </div>
          )}

          {/* Prescribed Medicines (Card-based list for maximum mobile clarity) */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0F766E", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
              Prescribed Medicines & Regimen
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(visit.prescription || []).map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                      {i + 1}. {m.medicine}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {m.dosage && (
                        <span style={{ background: "#E2E8F0", color: "#334155", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>
                          {m.dosage}
                        </span>
                      )}
                      {m.times_per_day && (
                        <span style={{ background: "#CCFBF1", color: "#0F766E", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>
                          {m.times_per_day}x / day
                        </span>
                      )}
                      {m.days && (
                        <span style={{ background: "#EFF6FF", color: "#1E40AF", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>
                          {m.days} Days
                        </span>
                      )}
                    </div>
                  </div>
                  {m.instructions && (
                    <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>
                      Instructions: {m.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Note */}
          {visit.followup_date && (
            <div
              style={{
                marginTop: 18,
                padding: "10px 14px",
                background: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: 8,
                fontSize: 12.5,
                color: "#92400E",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={15} color="#B45309" />
              <span>
                <strong>Next Follow-up Consultation:</strong> {fmtDate(visit.followup_date)}
                {visit.followup_note ? ` (${visit.followup_note})` : ""}
              </span>
            </div>
          )}

          {/* Digital Signature & Footer */}
          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              marginTop: 24,
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>
              ClinicDesk Smart EMR &bull; Verified Electronic Prescription<br />
              Generated for patient personal records.
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ width: 140, height: 1, background: "#94A3B8", marginBottom: 6, marginLeft: "auto" }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{DOCTOR_INFO.name}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Authorized Medical Practitioner</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button style={{ ...S.btn, ...S.btnSecondary, padding: "9px 16px" }} onClick={onClose} className="btn-interactive">
            Close
          </button>
          <button style={{ ...S.btn, ...S.btnPrimary, padding: "9px 20px" }} onClick={doPrint} className="btn-interactive">
            <Printer size={16} />
            <span>Print Prescription Document</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
