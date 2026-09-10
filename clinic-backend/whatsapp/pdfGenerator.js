import PDFDocument from "pdfkit";

/**
 * Generates an executive, high-readability A4 clinical prescription PDF
 * meticulously formatted for crystal-clear readability on mobile devices (WhatsApp)
 * as well as laser printing.
 */
export function generatePrescriptionPDF(patient = {}, visit = {}, doctorInfo = {}) {
  return new Promise((resolve, reject) => {
    // Standard A4 dimensions: 595.28 x 841.89 points
    const doc = new PDFDocument({ margin: 40, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", chunk => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const PAGE_W = 595.28;
    const PAGE_H = 841.89;
    const MARGIN = 40;
    const CONTENT_W = PAGE_W - (MARGIN * 2); // 515.28 pt
    const FOOTER_Y = 765;
    const PAGE_MAX_Y = 745;

    // ── 1. Top Decorative Brand Bar ──────────────────────────────────────────
    doc.rect(0, 0, PAGE_W, 7).fill("#0D9488"); // Primary Medical Teal
    doc.rect(0, 7, PAGE_W, 2).fill("#14B8A6"); // Bright Teal Accent

    // ── 2. Header: Clinic & Doctor Credentials ──────────────────────────────
    let y = 28;

    const clinicTitle = doctorInfo.clinic || "Clinical Health Centre";
    const rawDocName = doctorInfo.name || "Practicing Physician";
    const doctorName = rawDocName.startsWith("Dr.") ? rawDocName : `Dr. ${rawDocName}`;
    const doctorDegree = doctorInfo.degree || "MBBS, General Physician";
    const regNo = doctorInfo.reg || doctorInfo.regNo || doctorInfo.registration_number || "";

    // Clinic Title
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#0F172A").text(clinicTitle, MARGIN, y);
    y += 20;

    // Doctor Name & Degree
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#0D9488").text(doctorName, MARGIN, y, { continued: true });
    doc.font("Helvetica").fillColor("#475569").text(`  •  ${doctorDegree}`);
    y += 15;

    // Contact Details & Reg No
    const contactParts = [
      doctorInfo.address,
      doctorInfo.phone ? `Ph: ${doctorInfo.phone}` : null,
      regNo ? `Reg No: ${regNo}` : null,
    ].filter(Boolean);

    doc.fontSize(8.5).font("Helvetica").fillColor("#64748B").text(contactParts.join("   |   "), MARGIN, y, { width: 375 });

    // Top-Right: Consultation & Rx Monogram Card
    const rxBoxX = PAGE_W - MARGIN - 110;
    const rxBoxY = 24;
    doc.roundedRect(rxBoxX, rxBoxY, 110, 56, 6).fillAndStroke("#F0FDFA", "#99F6E4");

    doc.fontSize(22).font("Helvetica-Bold").fillColor("#0D9488").text("Rx", rxBoxX + 12, rxBoxY + 7);

    const rawDate = visit.date || visit.visit_date;
    const visitDate = rawDate ? new Date(rawDate) : new Date();
    const dateFormatted = !isNaN(visitDate.getTime())
      ? visitDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "Today";

    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0F766E").text("CONSULTATION", rxBoxX + 12, rxBoxY + 32);
    doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#1E293B").text(dateFormatted, rxBoxX + 12, rxBoxY + 42);

    y = 88;
    doc.moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).lineWidth(0.75).strokeColor("#E2E8F0").stroke();
    y += 10;

    // ── 3. Patient Information Card ─────────────────────────────────────────
    const ptCardH = 48;
    doc.roundedRect(MARGIN, y, CONTENT_W, ptCardH, 6).fillAndStroke("#F8FAFC", "#CBD5E1");

    const ptCol1 = MARGIN + 12;
    const ptCol2 = MARGIN + 210;
    const ptCol3 = MARGIN + 370;

    // Col 1: Patient Name
    doc.fontSize(7).font("Helvetica-Bold").fillColor("#64748B").text("PATIENT NAME", ptCol1, y + 8);
    const fullName = [patient.name, patient.surname].filter(Boolean).join(" ") || "Valued Patient";
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#0F172A").text(fullName, ptCol1, y + 20, { width: 190, ellipsis: true });
    if (patient.id) {
      doc.fontSize(7.5).font("Helvetica").fillColor("#64748B").text(`Patient ID: #${patient.id}`, ptCol1, y + 34);
    }

    // Col 2: Demographics
    doc.fontSize(7).font("Helvetica-Bold").fillColor("#64748B").text("AGE / GENDER / BLOOD", ptCol2, y + 8);
    const ageStr = patient.age ? `${patient.age} Yrs` : "—";
    const genderStr = patient.gender || "—";
    const bloodStr = patient.bloodGroup || patient.blood_group || "";
    const demoLine = bloodStr ? `${ageStr} • ${genderStr} • ${bloodStr}` : `${ageStr} • ${genderStr}`;
    doc.fontSize(9.5).font("Helvetica-Bold").fillColor("#334155").text(demoLine, ptCol2, y + 20, { width: 155 });

    // Col 3: Contact Number
    doc.fontSize(7).font("Helvetica-Bold").fillColor("#64748B").text("CONTACT MOBILE", ptCol3, y + 8);
    const contactStr = patient.contact || patient.phone || "—";
    doc.fontSize(9.5).font("Helvetica-Bold").fillColor("#0D9488").text(contactStr, ptCol3, y + 20);

    y += ptCardH + 8;

    // ── 4. Clinical Alerts (Allergy / KCO) - Using Vector Badges (No garbled emojis)
    if (patient.allergy && patient.allergy.trim()) {
      doc.roundedRect(MARGIN, y, CONTENT_W, 22, 4).fillAndStroke("#FEF2F2", "#FECACA");
      
      // Red Badge
      doc.roundedRect(MARGIN + 6, y + 4, 82, 14, 3).fill("#DC2626");
      doc.fontSize(7).font("Helvetica-Bold").fillColor("#FFFFFF").text("ALLERGY ALERT", MARGIN + 10, y + 7);

      // Allergy Text
      doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#991B1B").text(patient.allergy, MARGIN + 94, y + 6, { width: CONTENT_W - 100, ellipsis: true });
      y += 26;
    }

    if (patient.kco && patient.kco.trim()) {
      doc.roundedRect(MARGIN, y, CONTENT_W, 22, 4).fillAndStroke("#EFF6FF", "#BFDBFE");

      // Blue Badge
      doc.roundedRect(MARGIN + 6, y + 4, 118, 14, 3).fill("#2563EB");
      doc.fontSize(7).font("Helvetica-Bold").fillColor("#FFFFFF").text("MEDICAL HISTORY (K/C/O)", MARGIN + 10, y + 7);

      // Condition Text
      doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#1E40AF").text(patient.kco, MARGIN + 130, y + 6, { width: CONTENT_W - 136, ellipsis: true });
      y += 26;
    }

    // ── 5. Clinical Findings & Vitals Strip ──────────────────────────────────
    const v = visit.vitals || {};
    const vitalsList = [];
    const bpVal = v.bp || visit.bp;
    const pulseVal = v.pulse || visit.pulse;
    const tempVal = v.temp || v.temperature || visit.temp || visit.temperature;
    const weightVal = v.weight || visit.weight;
    const sugarVal = v.sugar || visit.sugar;

    if (bpVal) vitalsList.push(`BP: ${bpVal} mmHg`);
    if (pulseVal) vitalsList.push(`Pulse: ${pulseVal} bpm`);
    if (tempVal) vitalsList.push(`Temp: ${tempVal} °F`);
    if (weightVal) vitalsList.push(`Wt: ${weightVal} kg`);
    if (sugarVal) vitalsList.push(`Sugar: ${sugarVal} mg/dL`);

    const complaint = visit.chief_complaint || visit.complaint || visit.symptoms || "";
    const diagnosis = visit.diagnosis || "";

    if (complaint || diagnosis || vitalsList.length > 0) {
      let cardHeight = 36;
      if (complaint && diagnosis) cardHeight = 48;
      if (vitalsList.length > 0 && (complaint || diagnosis)) cardHeight = 56;

      doc.roundedRect(MARGIN, y, CONTENT_W, cardHeight, 6).fillAndStroke("#FFFFFF", "#E2E8F0");

      let subY = y + 8;
      if (diagnosis) {
        doc.fontSize(8).font("Helvetica-Bold").fillColor("#0D9488").text("DIAGNOSIS: ", MARGIN + 12, subY, { continued: true });
        doc.fontSize(9).font("Helvetica-Bold").fillColor("#0F172A").text(diagnosis);
        subY += 16;
      }

      if (complaint) {
        doc.fontSize(8).font("Helvetica-Bold").fillColor("#64748B").text("CHIEF COMPLAINT: ", MARGIN + 12, subY, { continued: true });
        doc.fontSize(8.5).font("Helvetica").fillColor("#334155").text(complaint, { width: 340 });
        subY += 14;
      }

      if (vitalsList.length > 0) {
        doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0F766E").text("VITALS:  ", MARGIN + 12, subY, { continued: true });
        doc.font("Helvetica").fillColor("#475569").text(vitalsList.join("    •    "));
      }

      y += cardHeight + 10;
    }

    // ── 6. Prescribed Medications Table (High-Contrast Mobile Responsive Layout)
    const prescriptionList = visit.prescription || visit.medicines || [];

    // Header Label
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0F172A").text("PRESCRIBED MEDICATIONS", MARGIN, y);
    y += 15;

    // Table Header Bar
    const headerH = 22;
    doc.roundedRect(MARGIN, y, CONTENT_W, headerH, 4).fill("#0F766E");

    const colX = {
      no: MARGIN + 6,
      med: MARGIN + 28,
      dosage: MARGIN + 270,
      duration: PAGE_W - MARGIN - 75,
    };

    doc.fontSize(8).font("Helvetica-Bold").fillColor("#FFFFFF");
    doc.text("#", colX.no, y + 6);
    doc.text("MEDICINE & SPECIFIC INSTRUCTIONS", colX.med, y + 6);
    doc.text("DOSAGE & FREQUENCY", colX.dosage, y + 6);
    doc.text("DURATION", colX.duration, y + 6, { width: 70, align: "right" });

    y += headerH;

    // Render Prescription Items
    if (prescriptionList.length === 0) {
      doc.rect(MARGIN, y, CONTENT_W, 28).fill("#F8FAFC");
      doc.fontSize(9).font("Helvetica").fillColor("#94A3B8").text("No medications prescribed for this consultation.", MARGIN + 12, y + 9);
      y += 32;
    } else {
      prescriptionList.forEach((rx, idx) => {
        // Prevent collision with footer
        if (y + 36 > PAGE_MAX_Y) return;

        const rxName = rx.medicine || rx.name || "—";
        const rxDosage = rx.dosage || "";
        const rxTiming = rx.times_per_day || rx.frequency || rx.timing || "";
        const rawDays = rx.days || rx.duration || "";
        const rxDuration = rawDays ? (String(rawDays).toLowerCase().includes("day") ? rawDays : `${rawDays} Days`) : "";
        const rxInst = rx.instructions || rx.instruction || rx.notes || "";

        const hasSubLine = Boolean(rxInst);
        const rowH = hasSubLine ? 34 : 26;
        const isEven = idx % 2 === 0;

        // Row background & bottom separator
        doc.rect(MARGIN, y, CONTENT_W, rowH).fill(isEven ? "#F8FAFC" : "#FFFFFF");
        doc.moveTo(MARGIN, y + rowH).lineTo(PAGE_W - MARGIN, y + rowH).lineWidth(0.5).strokeColor("#E2E8F0").stroke();

        // Line 1: Index, Medicine Name, Dosage & Timing, Duration
        const line1Y = y + 6;
        doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#64748B").text(`${idx + 1}`, colX.no, line1Y);
        doc.fontSize(9.5).font("Helvetica-Bold").fillColor("#0F172A").text(rxName, colX.med, line1Y, { width: 235, ellipsis: true });

        // Dosage & Frequency together
        const dosageTiming = [rxDosage, rxTiming].filter(Boolean).join("  •  ") || "As directed";
        doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#0D9488").text(dosageTiming, colX.dosage, line1Y, { width: 145, ellipsis: true });

        // Duration (Right aligned)
        doc.fontSize(9).font("Helvetica-Bold").fillColor("#1E293B").text(rxDuration || "—", colX.duration, line1Y, { width: 70, align: "right" });

        // Line 2 (if instructions exist)
        if (hasSubLine) {
          const line2Y = y + 19;
          doc.fontSize(7.5).font("Helvetica").fillColor("#64748B").text("Instructions: ", colX.med, line2Y, { continued: true });
          doc.font("Helvetica-Oblique").fillColor("#334155").text(rxInst, { width: CONTENT_W - 50, ellipsis: true });
        }

        y += rowH;
      });
    }

    y += 12;

    // ── 7. Follow-up Consultation & General Advice ──────────────────────────
    const followDate = visit.followup_date || visit.next_followup;
    if (followDate && y + 32 < PAGE_MAX_Y) {
      const followBoxH = 28;
      doc.roundedRect(MARGIN, y, CONTENT_W, followBoxH, 6).fillAndStroke("#FFFBEB", "#FDE68A");

      // Follow-up Badge
      doc.roundedRect(MARGIN + 8, y + 6, 88, 16, 3).fill("#D97706");
      doc.fontSize(7).font("Helvetica-Bold").fillColor("#FFFFFF").text("NEXT FOLLOW-UP", MARGIN + 12, y + 10);

      const fDateObj = new Date(followDate);
      const fDateText = !isNaN(fDateObj.getTime())
        ? fDateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : followDate;
      const fNoteText = visit.followup_note ? `  (${visit.followup_note})` : "";

      doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#92400E").text(`${fDateText}${fNoteText}`, MARGIN + 102, y + 9);

      y += followBoxH + 10;
    }

    if (visit.notes && visit.notes.trim() && y + 32 < PAGE_MAX_Y) {
      doc.roundedRect(MARGIN, y, CONTENT_W, 30, 6).fillAndStroke("#F8FAFC", "#E2E8F0");
      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#475569").text("GENERAL ADVICE & INSTRUCTIONS: ", MARGIN + 10, y + 8, { continued: true });
      doc.font("Helvetica").fillColor("#1E293B").text(visit.notes, { width: CONTENT_W - 20 });
      y += 38;
    }

    // ── 8. Doctor Signature & Official Endorsement (Fixed Footer) ─────────────
    doc.moveTo(MARGIN, FOOTER_Y - 12).lineTo(PAGE_W - MARGIN, FOOTER_Y - 12).lineWidth(0.5).strokeColor("#CBD5E1").stroke();

    // Left: Clinic EMR Watermark
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#0D9488").text("ClinicDesk Smart EMR", MARGIN, FOOTER_Y);
    doc.fontSize(7).font("Helvetica").fillColor("#64748B").text("Electronically Generated & Digitally Authenticated Medical Prescription", MARGIN, FOOTER_Y + 11);
    doc.fontSize(6.5).font("Helvetica").fillColor("#94A3B8").text("Valid under Telemedicine & Digital EMR Practice Guidelines. Report emergencies to nearest hospital.", MARGIN, FOOTER_Y + 22);

    // Right: Doctor Signature Stamp
    const sigW = 180;
    const sigX = PAGE_W - MARGIN - sigW;
    doc.fontSize(7).font("Helvetica-Bold").fillColor("#64748B").text("AUTHORIZED MEDICAL PRACTITIONER", sigX, FOOTER_Y, { width: sigW, align: "right" });
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#0F172A").text(doctorName, sigX, FOOTER_Y + 11, { width: sigW, align: "right" });
    if (regNo) {
      doc.fontSize(7.5).font("Helvetica").fillColor("#0D9488").text(`Registration: ${regNo}`, sigX, FOOTER_Y + 23, { width: sigW, align: "right" });
    }

    doc.end();
  });
}
