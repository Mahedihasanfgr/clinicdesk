import { useRef } from "react";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import { DOCTOR_INFO } from "../constants/doctor";

export default function PrintPrescription({ patient, visit, onClose }) {
  const ref = useRef();

  const doPrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Prescription</title><style>
      body{font-family:'Segoe UI',sans-serif;padding:40px;color:#111;max-width:700px;margin:0 auto}
      h2{margin:0;font-size:20px}h3{margin:0;font-size:14px;font-weight:400;color:#666}
      .header{border-bottom:2px solid #1a1a2e;padding-bottom:16px;margin-bottom:20px}
      .section{margin-bottom:16px}.label{font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
      .val{font-size:15px;margin-top:2px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .rx{margin-top:20px;border-top:1px solid #e5e7eb;padding-top:16px}
      .med{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;padding:10px;background:#f9fafb;border-radius:8px;margin-bottom:8px;font-size:14px}
      .footer{margin-top:40px;border-top:1px solid #e5e7eb;padding-top:16px;display:flex;justify-content:space-between;font-size:13px;color:#666}
      @media print{button{display:none}}
    </style></head><body>
    <div class="header">
      <h2>${DOCTOR_INFO.name}</h2>
      <h3>${DOCTOR_INFO.degree}</h3>
      <div style="margin-top:8px;font-size:13px;color:#666">${DOCTOR_INFO.clinic} &nbsp;|&nbsp; ${DOCTOR_INFO.address}<br>📞 ${DOCTOR_INFO.phone} &nbsp;|&nbsp; Reg: ${DOCTOR_INFO.reg}</div>
    </div>
    <div class="grid">
      <div class="section"><div class="label">Patient</div><div class="val"><strong>${patient.name}</strong><br><span style="font-size:13px;color:#666">${patient.age}Y / ${patient.gender} | ${patient.contact}</span></div></div>
      <div class="section"><div class="label">Date</div><div class="val">${fmtDate(visit.date)}</div></div>
    </div>
    ${visit.vitals?.bp ? `<div class="section"><div class="label">Vitals</div><div class="val" style="font-size:13px">BP: ${visit.vitals.bp} | Pulse: ${visit.vitals.pulse} | Temp: ${visit.vitals.temp} | Weight: ${visit.vitals.weight} | Sugar: ${visit.vitals.sugar}</div></div>` : ""}
    <div class="section"><div class="label">Diagnosis</div><div class="val">${visit.diagnosis || "—"}</div></div>
    ${visit.notes ? `<div class="section"><div class="label">Notes</div><div class="val" style="font-size:14px;color:#444">${visit.notes}</div></div>` : ""}
    <div class="rx">
      <div class="label" style="margin-bottom:10px">Rx — Prescription</div>
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;padding:8px 10px;font-size:12px;font-weight:600;color:#888">
        <div>Medicine</div><div>Dosage / Duration</div><div>Instructions</div>
      </div>
      ${visit.prescription.map((m, i) => `<div class="med"><div><strong>${i + 1}. ${m.medicine}</strong></div><div>${m.dosage}<br><span style="font-size:12px;color:#666">${m.duration}</span></div><div style="font-size:13px;color:#555">${m.instructions}</div></div>`).join("")}
    </div>
    <div class="footer">
      <div>Patient ID: ${patient.id} | Visit ID: ${visit.id}</div>
      <div style="text-align:right"><strong>Signature & Stamp</strong><br><br><br>_______________________<br>${DOCTOR_INFO.name}</div>
    </div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 640 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Prescription Preview</div>
        <div ref={ref} style={{ background: "#f9fafb", borderRadius: 10, padding: 24, fontSize: 14, lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
          <div style={{ borderBottom: "2px solid #1a1a2e", paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{DOCTOR_INFO.name}</div>
            <div style={{ color: "#666", fontSize: 13 }}>{DOCTOR_INFO.degree}</div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 6 }}>{DOCTOR_INFO.clinic} | {DOCTOR_INFO.address}</div>
          </div>
          <div style={S.grid2}>
            <div><strong>Patient:</strong> {patient.name}<br /><span style={{ fontSize: 13, color: "#666" }}>{patient.age}Y / {patient.gender}</span></div>
            <div><strong>Date:</strong> {fmtDate(visit.date)}</div>
          </div>
          <div style={{ marginTop: 12 }}><strong>Diagnosis:</strong> {visit.diagnosis || "—"}</div>
          {visit.notes && <div style={{ marginTop: 8, color: "#555" }}><strong>Notes:</strong> {visit.notes}</div>}
          <div style={{ marginTop: 16, borderTop: "1px solid #ddd", paddingTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Rx</div>
            {visit.prescription.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: "3px solid #1a1a2e" }}>
                <span style={{ fontWeight: 600 }}>{m.medicine}</span> — {m.dosage}, {m.duration}<br />
                <span style={{ color: "#666", fontSize: 13 }}>{m.instructions}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Close</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={doPrint}>🖨 Print Prescription</button>
        </div>
      </div>
    </div>
  );
}
