import { useRef } from "react";
import { createPortal } from "react-dom";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import { DOCTOR_INFO } from "../constants/doctor";
import { Printer, X, FileText, Stethoscope } from "lucide-react";

export default function PrintPrescription({ patient, visit, onClose }) {
  const ref = useRef();

  const doPrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Prescription — ${patient.name}</title><style>
      body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #0F172A; max-width: 720px; margin: 0 auto; }
      h2 { margin: 0; font-size: 22px; color: #0F172A; font-weight: 800; }
      h3 { margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #0D9488; }
      .header { border-bottom: 2px solid #0F172A; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
      .section { margin-bottom: 16px; }
      .label { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
      .val { font-size: 14.5px; margin-top: 3px; font-weight: 500; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .rx-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      .rx-table th { text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; text-transform: uppercase; color: #475569; }
      .rx-table td { padding: 10px; border-bottom: 1px solid #F1F5F9; font-size: 13.5px; }
      .footer { margin-top: 48px; border-top: 1px solid #E2E8F0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 12px; color: #64748B; }
      @media print { button { display: none; } }
    </style></head><body>
    <div class="header">
      <div>
        <h2>${DOCTOR_INFO.name}</h2>
        <h3>${DOCTOR_INFO.degree}</h3>
        <div style="margin-top: 6px; font-size: 12.5px; color: #475569;">
          <strong>${DOCTOR_INFO.clinic}</strong><br/>
          ${DOCTOR_INFO.address}<br/>
          Phone: ${DOCTOR_INFO.phone} | Reg No: ${DOCTOR_INFO.reg}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 24px; font-weight: 900; color: #0D9488;">Rx</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Date: ${fmtDate(visit.date)}</div>
      </div>
    </div>

    <div class="grid" style="background: #F8FAFC; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
      <div>
        <div class="label">Patient Profile</div>
        <div class="val"><strong>${patient.name} ${patient.surname || ""}</strong></div>
        <div style="font-size: 12.5px; color: #64748B; margin-top: 2px;">
          ${patient.age || "—"}Y / ${patient.gender || "—"} | ${patient.contact}
        </div>
      </div>
      <div>
        <div class="label">Patient ID</div>
        <div class="val" style="font-family: monospace; font-weight: 700;">#${patient.id}</div>
        ${visit.vitals?.bp ? `<div style="font-size: 12.5px; color: #475569; margin-top: 2px;">BP: ${visit.vitals.bp} mmHg | Pulse: ${visit.vitals.pulse || "—"}</div>` : ""}
      </div>
    </div>

    ${visit.chief_complaint ? `<div class="section"><div class="label">Chief Complaint</div><div class="val">${visit.chief_complaint}</div></div>` : ""}
    ${visit.diagnosis ? `<div class="section"><div class="label">Diagnosis</div><div class="val" style="font-weight: 700; color: #0F172A;">${visit.diagnosis}</div></div>` : ""}

    <div style="margin-top: 24px;">
      <div class="label" style="color: #0D9488; font-size: 12px;">Prescribed Medication Order</div>
      <table class="rx-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Instructions</th>
          </tr>
        </thead>
        <tbody>
          ${(visit.prescription || []).map((m, i) => `
            <tr>
              <td style="font-weight: 700; color: #64748B;">${i + 1}</td>
              <td style="font-weight: 700; color: #0F172A;">${m.medicine}</td>
              <td>${m.dosage || "—"}</td>
              <td>${m.times_per_day || "—"}</td>
              <td>${m.days || "—"}</td>
              <td style="color: #475569;">${m.instructions || "—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    ${visit.followup_date ? `
      <div style="margin-top: 24px; padding: 10px 14px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; font-size: 13px; color: #92400E;">
        <strong>Follow-up Scheduled:</strong> ${fmtDate(visit.followup_date)} ${visit.followup_note ? `(${visit.followup_note})` : ""}
      </div>
    ` : ""}

    <div class="footer">
      <div>Generated via ClinicDesk Smart EMR</div>
      <div style="text-align: right;">
        <br/><br/>
        <strong>____________________________</strong><br/>
        ${DOCTOR_INFO.name}<br/>
        <span style="font-size: 11px;">Authorized Medical Practitioner</span>
      </div>
    </div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return createPortal(
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 700, maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 14,
          borderBottom: "1px solid #E2E8F0",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#F0FDFA",
              border: "1px solid #CCFBF1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0D9488",
            }}>
              <Printer size={18} />
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Prescription Document Preview
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
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

        {/* Paper Preview */}
        <div ref={ref} style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "24px 28px",
          fontSize: 13.5,
          color: "#334155",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #0F172A", paddingBottom: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{DOCTOR_INFO.name}</div>
              <div style={{ color: "#0D9488", fontWeight: 700, fontSize: 13 }}>{DOCTOR_INFO.degree}</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>{DOCTOR_INFO.clinic} • {DOCTOR_INFO.address}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#0D9488" }}>Rx</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{fmtDate(visit.date)}</div>
            </div>
          </div>

          <div style={{ ...S.grid2, marginBottom: 14 }}>
            <div>
              <strong>Patient:</strong> {patient.name} {patient.surname || ""}<br />
              <span style={{ fontSize: 12.5, color: "#64748B" }}>{patient.age}Y / {patient.gender} • {patient.contact}</span>
            </div>
            <div>
              <strong>Patient ID:</strong> #{patient.id}<br />
              <span style={{ fontSize: 12.5, color: "#64748B" }}>Diagnosis: {visit.diagnosis || "—"}</span>
            </div>
          </div>

          <div style={{ marginTop: 12, borderTop: "1px solid #E2E8F0", paddingTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0F766E", textTransform: "uppercase", marginBottom: 8 }}>
              Prescribed Medicines
            </div>
            {(visit.prescription || []).map((m, i) => (
              <div key={i} style={{ marginBottom: 6, paddingLeft: 10, borderLeft: "3px solid #0D9488" }}>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{m.medicine}</span>
                <span style={{ color: "#64748B" }}> — {m.dosage} ({m.times_per_day}), {m.days}</span>
                {m.instructions && <div style={{ fontSize: 12, color: "#64748B" }}>Instructions: {m.instructions}</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
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
