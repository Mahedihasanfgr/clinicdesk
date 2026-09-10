import PDFDocument from "pdfkit";

export function generatePrescriptionPDF(patient, visit, doctorInfo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", chunk => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const W = 495;
    const FOOTER_H = 50; // space reserved at bottom for footer
    const PAGE_BOTTOM = 842 - 50 - FOOTER_H; // A4 height minus margin minus footer

    // ── Header ──────────────────────────────────────────────
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#111").text(doctorInfo.name, 50, 50);
    doc.fontSize(11).font("Helvetica").fillColor("#555").text(doctorInfo.degree, 50, 72);
    doc.fontSize(10).text(`${doctorInfo.clinic}  |  ${doctorInfo.address}`, 50, 88);
    doc.text(`Ph: ${doctorInfo.phone}  |  Reg: ${doctorInfo.reg}`, 50, 102);
    doc.moveTo(50, 118).lineTo(545, 118).lineWidth(2).strokeColor("#1a1a2e").stroke();

    // ── Patient Info ─────────────────────────────────────────
    doc.fillColor("#111").fontSize(11).font("Helvetica-Bold").text("Patient:", 50, 130);
    doc.font("Helvetica").text(`${patient.name} ${patient.surname || ""}`, 110, 130);
    doc.font("Helvetica-Bold").text("Date:", 350, 130);
    doc.font("Helvetica").text(
      new Date(visit.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      390, 130
    );
    doc.font("Helvetica").fontSize(10).fillColor("#555");
    doc.text(`${patient.age || ""}Y / ${patient.gender || ""}  |  ${patient.contact}`, 50, 148);
    doc.text(`Patient ID: ${patient.id}`, 350, 148);

    let y = 168;

    // ── Alerts ───────────────────────────────────────────────
    if (patient.kco) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#1d4ed8").text("K/C/O: ", 50, y, { continued: true });
      doc.font("Helvetica").text(patient.kco);
      y += 16;
    }
    if (patient.allergy) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#c2410c").text("Allergy: ", 50, y, { continued: true });
      doc.font("Helvetica").text(patient.allergy);
      y += 16;
    }

    doc.fillColor("#111");
    y += 4;
    doc.moveTo(50, y).lineTo(545, y).lineWidth(0.5).strokeColor("#e5e7eb").stroke();
    y += 10;

    // ── Chief Complaint ──────────────────────────────────────
    if (visit.chief_complaint && y < PAGE_BOTTOM) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#111").text("Chief Complaint: ", 50, y, { continued: true });
      doc.font("Helvetica").text(visit.chief_complaint);
      y += 18;
    }

    // ── Vitals ───────────────────────────────────────────────
    if (visit.vitals?.bp && y < PAGE_BOTTOM) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#374151").text("Vitals: ", 50, y, { continued: true });
      doc.font("Helvetica").fillColor("#555").text(
        `BP: ${visit.vitals.bp}  |  Pulse: ${visit.vitals.pulse || "-"}  |  Temp: ${visit.vitals.temp || "-"}  |  Wt: ${visit.vitals.weight || "-"}  |  Sugar: ${visit.vitals.sugar || "-"}`
      );
      y += 18;
    }

    // ── Diagnosis ────────────────────────────────────────────
    if (visit.diagnosis && y < PAGE_BOTTOM) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#111").text("Diagnosis: ", 50, y, { continued: true });
      doc.font("Helvetica").text(visit.diagnosis);
      y += 18;
    }

    if (visit.notes && y < PAGE_BOTTOM) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#111").text("Notes: ", 50, y, { continued: true });
      doc.font("Helvetica").fillColor("#555").text(visit.notes);
      y += 18;
    }

    y += 6;
    doc.moveTo(50, y).lineTo(545, y).lineWidth(0.5).strokeColor("#e5e7eb").stroke();
    y += 12;

    // ── Prescription ─────────────────────────────────────────
    if (y < PAGE_BOTTOM) {
      doc.fontSize(13).font("Helvetica-Bold").fillColor("#1a1a2e").text("Rx — Prescription", 50, y);
      y += 20;

      const cols = [50, 200, 280, 340, 400];
      const headers = ["Medicine", "Dosage", "Times/Day", "Days", "Instructions"];
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#888");
      headers.forEach((h, i) => doc.text(h, cols[i], y));
      y += 14;
      doc.moveTo(50, y).lineTo(545, y).lineWidth(0.5).strokeColor("#d1d5db").stroke();
      y += 6;

      (visit.prescription || []).forEach((rx, i) => {
        if (y + 20 > PAGE_BOTTOM) return; // skip rows that would overflow
        const bg = i % 2 === 0 ? "#f9fafb" : "#ffffff";
        doc.rect(50, y - 2, W, 18).fill(bg);
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#111").text(`${i + 1}. ${rx.medicine}`, cols[0], y, { width: 145 });
        doc.font("Helvetica").text(rx.dosage || "-", cols[1], y, { width: 75 });
        doc.text(rx.times_per_day ? `${rx.times_per_day}x` : "-", cols[2], y, { width: 55 });
        doc.text(rx.days ? `${rx.days}d` : "-", cols[3], y, { width: 55 });
        doc.fillColor("#555").text(rx.instructions || "-", cols[4], y, { width: 140 });
        y += 20;
      });

      y += 10;
    }

    // ── Follow-up ────────────────────────────────────────────
    if (visit.followup_date && y + 30 < PAGE_BOTTOM) {
      doc.moveTo(50, y).lineTo(545, y).lineWidth(0.5).strokeColor("#e5e7eb").stroke();
      y += 10;
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#111").text("Follow-up: ", 50, y, { continued: true });
      doc.font("Helvetica").text(
        new Date(visit.followup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
        (visit.followup_note ? `  -  ${visit.followup_note}` : "")
      );
      y += 18;
    }

    // ── Footer — always at fixed bottom ──────────────────────
    const footerY = 780;
    doc.moveTo(50, footerY).lineTo(545, footerY).lineWidth(0.5).strokeColor("#e5e7eb").stroke();
    doc.fontSize(9).font("Helvetica").fillColor("#888").text(`Visit ID: ${visit.id || ""}`, 50, footerY + 8);
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#111").text("Signature & Stamp", 400, footerY + 8);
    doc.font("Helvetica").fillColor("#888").text("_______________________", 400, footerY + 20);
    doc.text(doctorInfo.name, 400, footerY + 34);

    doc.end();
  });
}
