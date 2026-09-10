import { DOCTOR_INFO } from "../constants/doctor";
import { fmtDate } from "./helpers";

export const printPrescription = (patient, visit) => {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>Prescription - ${patient.name}</title><style>
    body{font-family:'Segoe UI',sans-serif;padding:40px;color:#111;max-width:700px;margin:0 auto}
    h2{margin:0;font-size:20px}h3{margin:0;font-size:14px;font-weight:400;color:#666}
    .header{border-bottom:2px solid #1a1a2e;padding-bottom:16px;margin-bottom:20px}
    .section{margin-bottom:16px}
    .label{font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
    .val{font-size:15px;margin-top:2px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .rx{margin-top:20px;border-top:1px solid #e5e7eb;padding-top:16px}
    .rx-header{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr 2fr;gap:8px;padding:8px 10px;font-size:12px;font-weight:600;color:#888}
    .med{display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr 2fr;gap:8px;padding:10px;background:#f9fafb;border-radius:8px;margin-bottom:6px;font-size:14px}
    .footer{margin-top:40px;border-top:1px solid #e5e7eb;padding-top:16px;display:flex;justify-content:space-between;font-size:13px;color:#666}
    @media print{button{display:none}}
  </style></head><body>
  <div class="header">
    <h2>${DOCTOR_INFO.name}</h2>
    <h3>${DOCTOR_INFO.degree}</h3>
    <div style="margin-top:8px;font-size:13px;color:#666">${DOCTOR_INFO.clinic} &nbsp;|&nbsp; ${DOCTOR_INFO.address}<br>📞 ${DOCTOR_INFO.phone} &nbsp;|&nbsp; Reg: ${DOCTOR_INFO.reg}</div>
  </div>
  <div class="grid">
    <div class="section"><div class="label">Patient</div><div class="val"><strong>${patient.name} ${patient.surname || ""}</strong><br><span style="font-size:13px;color:#666">${patient.age || ""}Y / ${patient.gender || ""} | ${patient.contact}</span></div></div>
    <div class="section"><div class="label">Date</div><div class="val">${fmtDate(visit.date)}</div></div>
  </div>
  ${visit.chief_complaint ? `<div class="section"><div class="label">Chief Complaint</div><div class="val">${visit.chief_complaint}</div></div>` : ""}
  ${visit.vitals?.bp ? `<div class="section"><div class="label">Vitals</div><div class="val" style="font-size:13px">BP: ${visit.vitals.bp} | Pulse: ${visit.vitals.pulse} | Temp: ${visit.vitals.temp} | Weight: ${visit.vitals.weight} | Sugar: ${visit.vitals.sugar}</div></div>` : ""}
  <div class="section"><div class="label">Diagnosis</div><div class="val">${visit.diagnosis || "—"}</div></div>
  ${visit.notes ? `<div class="section"><div class="label">Notes</div><div class="val" style="font-size:14px;color:#444">${visit.notes}</div></div>` : ""}
  <div class="rx">
    <div class="label" style="margin-bottom:10px">Rx — Prescription</div>
    <div class="rx-header"><div>Medicine</div><div>Dosage</div><div>Times/Day</div><div>Days</div><div>Instructions</div></div>
    ${(visit.prescription || []).map((m, i) => `
      <div class="med">
        <div><strong>${i + 1}. ${m.medicine}</strong></div>
        <div>${m.dosage || "—"}</div>
        <div>${m.times_per_day ? m.times_per_day + "x" : "—"}</div>
        <div>${m.days ? m.days + " days" : "—"}</div>
        <div style="font-size:13px;color:#555">${m.instructions || "—"}</div>
      </div>`).join("")}
  </div>
  <div class="footer">
    <div>Patient ID: ${patient.id} | Visit ID: ${visit.id || ""}</div>
    <div style="text-align:right"><strong>Signature & Stamp</strong><br><br><br>_______________________<br>${DOCTOR_INFO.name}</div>
  </div>
  <script>window.onload = function(){ window.print(); }</script>
  </body></html>`);
  w.document.close();
};
