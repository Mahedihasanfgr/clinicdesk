import { DOCTOR_INFO } from "../constants/doctor";
import { fmtDate } from "./helpers";

export const printPrescription = (patient, visit) => {
  const w = window.open("", "_blank");
  if (!w) return;

  const bloodGroup = patient.bloodGroup || patient.blood_group || "";
  const vitals = visit.vitals || {};
  const vitalsList = [];
  if (vitals.bp) vitalsList.push(`BP: <strong>${vitals.bp}</strong> mmHg`);
  if (vitals.pulse) vitalsList.push(`Pulse: <strong>${vitals.pulse}</strong> bpm`);
  if (vitals.temp) vitalsList.push(`Temp: <strong>${vitals.temp}</strong> °F`);
  if (vitals.weight) vitalsList.push(`Wt: <strong>${vitals.weight}</strong> kg`);
  if (vitals.sugar) vitalsList.push(`Sugar: <strong>${vitals.sugar}</strong> mg/dL`);

  w.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prescription — ${patient.name} ${patient.surname || ""}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      padding: 32px 28px;
      max-width: 760px;
      margin: 0 auto;
      line-height: 1.45;
    }
    
    /* Top Decorative Accent */
    .top-accent {
      height: 4px;
      background: linear-gradient(90deg, #0D9488 0%, #0284C7 100%);
      border-radius: 4px;
      margin-bottom: 20px;
    }

    /* Clinic & Doctor Header */
    .header {
      display: flex;
      justifyContent: space-between;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 18px;
      border-bottom: 1.5px solid #E2E8F0;
      margin-bottom: 18px;
    }
    .clinic-title { font-size: 20px; font-weight: 800; color: #0F172A; letter-spacing: -0.02em; }
    .doc-name { font-size: 14.5px; font-weight: 700; color: #0D9488; margin-top: 2px; }
    .doc-degree { font-size: 12px; color: #475569; }
    .clinic-details { font-size: 12px; color: #64748B; margin-top: 4px; line-height: 1.4; }

    .rx-badge-container {
      text-align: right;
      flex-shrink: 0;
    }
    .rx-symbol {
      display: inline-block;
      font-size: 26px;
      font-weight: 900;
      color: #0D9488;
      background: #F0FDFA;
      border: 1.5px solid #CCFBF1;
      padding: 2px 14px;
      border-radius: 12px;
      margin-bottom: 4px;
    }
    .rx-date { font-size: 12px; font-weight: 700; color: #334155; }
    .rx-id { font-size: 11px; color: #94A3B8; font-family: monospace; }

    /* Patient Details Card */
    .pt-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: 1.5fr 1.2fr 1fr;
      gap: 12px;
    }
    .field-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #64748B; letter-spacing: 0.4px; }
    .field-val { font-size: 13.5px; font-weight: 700; color: #0F172A; margin-top: 2px; }
    .field-sub { font-size: 12px; color: #475569; }

    /* Clinical Alerts */
    .alert-box {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12.5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .alert-danger { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }
    .alert-info { background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; }

    /* Vitals Strip */
    .vitals-strip {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 12px;
      color: #334155;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    /* Diagnosis & Complaint */
    .clinical-note-box {
      border-left: 3px solid #0D9488;
      padding: 6px 14px;
      margin-bottom: 18px;
      background: #F8FAFC;
      border-radius: 0 8px 8px 0;
    }
    .note-row { font-size: 13px; color: #1E293B; margin-bottom: 3px; }
    .note-row strong { color: #0F172A; }

    /* Rx Prescription Table */
    .rx-section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0F766E;
      margin-bottom: 10px;
    }
    .rx-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
      margin-bottom: 20px;
    }
    .rx-table th {
      background: #0F766E;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      text-align: left;
    }
    .rx-table td {
      padding: 11px 12px;
      font-size: 13px;
      border-bottom: 1px solid #F1F5F9;
      color: #1E293B;
    }
    .rx-table tr:nth-child(even) td { background: #F8FAFC; }
    .rx-table tr:last-child td { border-bottom: none; }
    .med-name { font-weight: 700; color: #0F172A; font-size: 13.5px; }
    .med-freq { color: #0D9488; font-weight: 600; }

    /* Follow-up Box */
    .followup-box {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 13px;
      color: #92400E;
      margin-bottom: 28px;
    }

    /* Footer & Signature */
    .footer {
      border-top: 1.5px solid #E2E8F0;
      padding-top: 18px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
    }
    .footer-left { font-size: 11px; color: #94A3B8; line-height: 1.5; }
    .footer-right { text-align: right; }
    .sig-line { width: 160px; height: 1px; background: #94A3B8; margin-bottom: 6px; margin-left: auto; }
    .sig-name { font-size: 13px; font-weight: 700; color: #0F172A; }
    .sig-role { font-size: 11px; color: #64748B; }

    /* Mobile Responsive Optimizations */
    @media screen and (max-width: 640px) {
      body { padding: 16px 12px; }
      .header { flex-direction: column; align-items: flex-start; }
      .rx-badge-container { text-align: left; margin-top: 8px; }
      .pt-card { grid-template-columns: 1fr; gap: 8px; }
      .footer { flex-direction: column; align-items: flex-start; }
      .footer-right { text-align: left; margin-top: 20px; }
      .sig-line { margin-left: 0; }
      
      /* Transform table to card list on small screens */
      .rx-table thead { display: none; }
      .rx-table, .rx-table tbody, .rx-table tr, .rx-table td {
        display: block;
        width: 100%;
      }
      .rx-table tr {
        border-bottom: 2px solid #E2E8F0;
        padding: 10px 12px;
      }
      .rx-table td {
        padding: 4px 0;
        border: none !important;
      }
      .rx-table td::before {
        font-weight: 700;
        color: #64748B;
        font-size: 11px;
        text-transform: uppercase;
        display: inline-block;
        width: 90px;
      }
      .rx-table td:nth-child(1)::before { content: "Item: "; }
      .rx-table td:nth-child(2)::before { content: "Medicine: "; }
      .rx-table td:nth-child(3)::before { content: "Dosage: "; }
      .rx-table td:nth-child(4)::before { content: "Frequency: "; }
      .rx-table td:nth-child(5)::before { content: "Duration: "; }
      .rx-table td:nth-child(6)::before { content: "Timing: "; }
    }

    @media print {
      body { padding: 20px; max-width: 100%; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="top-accent"></div>

  <div class="header">
    <div>
      <div class="clinic-title">${DOCTOR_INFO.clinic}</div>
      <div class="doc-name">${DOCTOR_INFO.name}</div>
      <div class="doc-degree">${DOCTOR_INFO.degree}</div>
      <div class="clinic-details">
        ${DOCTOR_INFO.address}<br/>
        Phone: ${DOCTOR_INFO.phone} &nbsp;|&nbsp; Reg No: ${DOCTOR_INFO.reg}
      </div>
    </div>

    <div class="rx-badge-container">
      <div class="rx-symbol">Rx</div>
      <div class="rx-date">${fmtDate(visit.date)}</div>
      <div class="rx-id">Ref: #${visit.id || patient.id}</div>
    </div>
  </div>

  <div class="pt-card">
    <div>
      <div class="field-label">Patient Name</div>
      <div class="field-val">${patient.name} ${patient.surname || ""}</div>
      <div class="field-sub">${patient.age ? patient.age + " Yrs" : "—"} / ${patient.gender || "—"}</div>
    </div>
    <div>
      <div class="field-label">Contact & Blood Group</div>
      <div class="field-val">${patient.contact || "—"}</div>
      <div class="field-sub">Blood Group: <strong>${bloodGroup || "—"}</strong></div>
    </div>
    <div>
      <div class="field-label">Patient ID</div>
      <div class="field-val" style="font-family: monospace; color: #0D9488;">#${patient.id}</div>
      <div class="field-sub">OPD Record</div>
    </div>
  </div>

  ${patient.allergy ? `
    <div class="alert-box alert-danger">
      <strong>⚠️ Known Allergies:</strong> ${patient.allergy}
    </div>
  ` : ""}

  ${patient.kco ? `
    <div class="alert-box alert-info">
      <strong>ℹ️ Known Conditions (K/C/O):</strong> ${patient.kco}
    </div>
  ` : ""}

  ${vitalsList.length > 0 ? `
    <div class="vitals-strip">
      ${vitalsList.map(v => `<span>${v}</span>`).join(" &nbsp;|&nbsp; ")}
    </div>
  ` : ""}

  ${(visit.chief_complaint || visit.diagnosis || visit.notes) ? `
    <div class="clinical-note-box">
      ${visit.chief_complaint ? `<div class="note-row"><strong>Chief Complaint:</strong> ${visit.chief_complaint}</div>` : ""}
      ${visit.diagnosis ? `<div class="note-row"><strong>Clinical Diagnosis:</strong> <span style="font-weight: 700; color: #0F766E;">${visit.diagnosis}</span></div>` : ""}
      ${visit.notes ? `<div class="note-row" style="color: #64748B;"><strong>Clinical Notes:</strong> ${visit.notes}</div>` : ""}
    </div>
  ` : ""}

  <div class="rx-section-title">Prescribed Medications</div>
  <table class="rx-table">
    <thead>
      <tr>
        <th style="width: 32px;">#</th>
        <th>Medicine & Strength</th>
        <th>Dosage</th>
        <th>Frequency</th>
        <th>Duration</th>
        <th>Timing & Advice</th>
      </tr>
    </thead>
    <tbody>
      ${(visit.prescription || []).map((m, i) => `
        <tr>
          <td style="font-weight: 700; color: #64748B;">${i + 1}</td>
          <td class="med-name">${m.medicine}</td>
          <td>${m.dosage || "—"}</td>
          <td class="med-freq">${m.times_per_day ? m.times_per_day + "x / day" : "—"}</td>
          <td>${m.days ? m.days + " Days" : "—"}</td>
          <td style="color: #475569;">${m.instructions || "As directed"}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  ${visit.followup_date ? `
    <div class="followup-box">
      <strong>📅 Follow-up Consultation:</strong> ${fmtDate(visit.followup_date)} ${visit.followup_note ? `(${visit.followup_note})` : ""}
    </div>
  ` : ""}

  <div class="footer">
    <div class="footer-left">
      <strong>ClinicDesk Smart EMR</strong> &bull; Digitally Generated Prescription<br/>
      For medical emergencies, please visit the nearest hospital emergency facility.
    </div>

    <div class="footer-right">
      <div class="sig-line"></div>
      <div class="sig-name">${DOCTOR_INFO.name}</div>
      <div class="sig-role">Authorized Medical Practitioner</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      // Auto-trigger print dialog on desktop
      if (window.innerWidth > 640) {
        window.print();
      }
    };
  </script>
</body>
</html>`);
  w.document.close();
};
