import pool from "../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generatePrescriptionPDF } from "./pdfGenerator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(__dirname, "session", "clinic_context.json");

// In-memory conversation state keyed by phone number
const sessions = new Map();
const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes timeout

/**
 * Set the currently active clinic ID for WhatsApp operations
 */
export function setActiveClinicId(clinicId) {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ clinicId, updatedAt: new Date().toISOString() }));
    console.log(`📌 Active WhatsApp clinic set to ID: ${clinicId}`);
  } catch (err) {
    console.warn("Could not save clinic_context.json:", err.message);
  }
}

/**
 * Retrieves the currently active clinic details from DB
 */
export async function getActiveClinic() {
  try {
    let clinicId = null;
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
        clinicId = raw.clinicId;
      } catch {}
    }

    let clinic = null;
    if (clinicId) {
      const res = await pool.query("SELECT * FROM clinics WHERE id = $1", [clinicId]);
      if (res.rows.length > 0) clinic = res.rows[0];
    }

    if (!clinic) {
      // Fallback: pick the latest registered clinic (e.g. Dignity Healthcare 'dgt')
      const res = await pool.query("SELECT * FROM clinics ORDER BY id DESC LIMIT 1");
      if (res.rows.length > 0) clinic = res.rows[0];
    }

    return clinic;
  } catch (err) {
    console.error("Error fetching active clinic:", err.message);
    return null;
  }
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a date to human readable string (e.g., 11-Sep-2026)
 */
function formatHumanDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Main dispatcher for incoming patient WhatsApp messages
 */
export async function handleIncomingWhatsAppMessage(phoneRaw, incomingText, pushName, sendTextFn, sendDocFn) {
  const cleanPhone = phoneRaw.replace(/\D/g, "");
  const phone10 = cleanPhone.slice(-10);
  const text = (incomingText || "").trim();
  const lower = text.toLowerCase();

  console.log(`🤖 WhatsApp Bot received from ${cleanPhone} (${pushName}): "${text}"`);

  // Fetch clinic context
  const clinic = await getActiveClinic();
  if (!clinic) {
    console.warn("⚠️ No active clinic found for WhatsApp Chatbot.");
    return;
  }

  const clinicName = clinic.clinic_name || "Our Clinic";
  const doctorName = clinic.doctor_name?.startsWith("Dr.") ? clinic.doctor_name : `Dr. ${clinic.doctor_name || "Doctor"}`;
  const clinicAddress = clinic.address || "Main Street Clinic Road";
  const clinicPhone = clinic.phone || clinic.contact || "Clinic Helpdesk";

  // Check existing session
  let session = sessions.get(cleanPhone);
  const now = Date.now();

  // Reset expired sessions
  if (session && now - session.lastActive > SESSION_TTL_MS) {
    sessions.delete(cleanPhone);
    session = null;
  }

  // Handle global cancel / restart
  if (["cancel", "reset", "stop", "exit", "abort"].includes(lower)) {
    sessions.delete(cleanPhone);
    await sendTextFn(
      `❌ *Appointment request cancelled.*\n\nWhenever you need assistance or wish to book a consultation, simply reply with *Hi*! 🙏`
    );
    return;
  }

  // If no active session, start at GREETING / MENU
  if (!session) {
    // Check if patient already exists in DB
    let existingPatient = null;
    try {
      const ptRes = await pool.query(
        "SELECT * FROM patients WHERE clinic_id = $1 AND (contact = $2 OR contact = $3 OR contact = $4) LIMIT 1",
        [clinic.id, phone10, cleanPhone, `+91${phone10}`]
      );
      if (ptRes.rows.length > 0) existingPatient = ptRes.rows[0];
    } catch (e) {
      console.warn("Patient lookup error:", e.message);
    }

    const greetingName = existingPatient ? existingPatient.name : (pushName || "Valued Patient");

    // Direct booking triggers: "book", "appointment", "1"
    if (lower === "1" || lower.includes("book") || lower.includes("appoint")) {
      session = {
        step: "BOOKING_DATE",
        patientId: existingPatient ? existingPatient.id : null,
        patientName: existingPatient ? existingPatient.name : (pushName || ""),
        isExisting: Boolean(existingPatient),
        lastActive: now,
      };
      sessions.set(cleanPhone, session);

      // If existing patient, ask if booking for self or family
      if (existingPatient) {
        session.step = "CHOOSE_PATIENT";
        await sendTextFn(
          `👋 Welcome back, *${existingPatient.name}*!\n\nWho is this appointment for?\n\n1️⃣ For *${existingPatient.name}* (Myself)\n2️⃣ For *Someone Else* (Family member / friend)\n\n_Reply 1 or 2:_`
        );
        return;
      } else {
        session.step = "BOOKING_NAME";
        await sendTextFn(
          `🏥 *${clinicName}* — Appointment Booking\n👨‍⚕️ *${doctorName}*\n\nPlease reply with the *Patient's Full Name* to begin:`
        );
        return;
      }
    }

    // Menu option 2: Clinic Timings & Address
    if (lower === "2" || lower.includes("timing") || lower.includes("time") || lower.includes("address") || lower.includes("location")) {
      await sendTextFn(
        `🏥 *${clinicName}*\n👨‍⚕️ *Consultant*: ${doctorName}\n📍 *Address*: ${clinicAddress}\n📞 *Helpdesk*: ${clinicPhone}\n\n⏰ *OPD Consultation Timings*:\n• Morning: 10:00 AM – 01:30 PM\n• Evening: 05:30 PM – 08:30 PM\n• Mon – Sat (Sunday by prior appointment)\n\n👉 *Reply 1 to Book an Appointment* anytime!`
      );
      return;
    }

    // Menu option 3: Past Prescriptions
    if (lower === "3" || lower.includes("prescription") || lower.includes("medicine")) {
      try {
        const ptRes = await pool.query(
          "SELECT * FROM patients WHERE clinic_id = $1 AND (contact = $2 OR contact = $3 OR contact = $4) LIMIT 1",
          [clinic.id, phone10, cleanPhone, `+91${phone10}`]
        );
        if (ptRes.rows.length === 0) {
          await sendTextFn(
            `ℹ️ No previous medical records found for mobile number *${phone10}*.\n\nReply *1* to book a fresh consultation with ${doctorName}.`
          );
          return;
        }

        const patient = ptRes.rows[0];
        const vRes = await pool.query(
          `SELECT v.*, json_agg(json_build_object(
             'medicine', p.medicine, 'dosage', p.dosage, 'times_per_day', p.times_per_day, 'days', p.days, 'instructions', p.instructions
           )) FILTER (WHERE p.id IS NOT NULL) AS prescription
           FROM visits v
           LEFT JOIN prescriptions p ON p.visit_id = v.id
           WHERE v.patient_id = $1 AND v.clinic_id = $2
           GROUP BY v.id
           ORDER BY v.date DESC LIMIT 1`,
          [patient.id, clinic.id]
        );

        if (vRes.rows.length === 0 || !vRes.rows[0].prescription) {
          await sendTextFn(
            `ℹ️ No past prescription documents found for *${patient.name}*.\n\nReply *1* to book a consultation.`
          );
          return;
        }

        const latestVisit = vRes.rows[0];
        const doctorInfo = {
          clinic: clinicName,
          name: doctorName,
          degree: clinic.degree || "MBBS, General Physician",
          address: clinicAddress,
          phone: clinicPhone,
          reg: clinic.reg_no || "",
        };

        await sendTextFn(`📄 Fetching your latest prescription from *${formatHumanDate(latestVisit.date)}*...`);
        const pdfBuffer = await generatePrescriptionPDF(patient, latestVisit, doctorInfo);
        if (sendDocFn) {
          await sendDocFn(
            cleanPhone,
            pdfBuffer,
            `Prescription_${patient.name.replace(/\s+/g, "_")}.pdf`,
            `Prescription for ${patient.name} (${formatHumanDate(latestVisit.date)})`
          );
        }
        return;
      } catch (err) {
        console.error("Prescription fetch error:", err.message);
        await sendTextFn("⚠️ Unable to retrieve prescription right now. Please contact the clinic desk directly.");
        return;
      }
    }

    // Menu option 4: Reception / Help
    if (lower === "4" || lower.includes("reception") || lower.includes("help") || lower.includes("call")) {
      await sendTextFn(
        `📞 *${clinicName} Helpdesk*\n\nFor emergencies or general inquiries:\n• Phone: *${clinicPhone}*\n• Address: *${clinicAddress}*\n\nReply *1* anytime to book an appointment with ${doctorName}.`
      );
      return;
    }

    // Default: Show Main Menu
    await sendTextFn(
      `👋 *Hello ${greetingName}!* Welcome to *${clinicName}*.\nI am your virtual assistant for *${doctorName}*.\n\nHow may I help you today?\n\n1️⃣ *Book an Appointment*\n2️⃣ *Clinic Timings & Address*\n3️⃣ *View My Latest Prescription*\n4️⃣ *Contact Reception Desk*\n\n_Reply with *1*, *2*, *3*, or *4* to proceed._`
    );
    return;
  }

  // Active Session State Machine
  session.lastActive = now;

  // STEP: Choose patient (Myself vs Someone else)
  if (session.step === "CHOOSE_PATIENT") {
    if (lower === "1" || lower.includes("myself") || lower.includes("me")) {
      session.step = "BOOKING_DATE";
      await promptDateSelection(sendTextFn);
      return;
    } else {
      session.step = "BOOKING_NAME";
      session.patientId = null;
      await sendTextFn("Please enter the *Patient's Full Name*:");
      return;
    }
  }

  // STEP: Enter Patient Name
  if (session.step === "BOOKING_NAME") {
    if (text.length < 2) {
      await sendTextFn("Please enter a valid patient name (minimum 2 characters):");
      return;
    }
    session.patientName = text;
    session.step = "BOOKING_DATE";
    await promptDateSelection(sendTextFn, session.patientName);
    return;
  }

  // STEP: Choose Date
  if (session.step === "BOOKING_DATE") {
    const todayObj = new Date();
    const tomorrowObj = new Date(todayObj);
    tomorrowObj.setDate(todayObj.getDate() + 1);
    const dayAfterObj = new Date(todayObj);
    dayAfterObj.setDate(todayObj.getDate() + 2);

    let selectedDate = null;
    if (lower === "1" || lower.includes("today")) {
      selectedDate = toISODate(todayObj);
    } else if (lower === "2" || lower.includes("tomorrow")) {
      selectedDate = toISODate(tomorrowObj);
    } else if (lower === "3" || lower.includes("day after")) {
      selectedDate = toISODate(dayAfterObj);
    } else {
      // Try to parse custom date format: DD-MM-YYYY or YYYY-MM-DD
      const dateMatch = text.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
      if (dateMatch) {
        const d = dateMatch[1].padStart(2, "0");
        const m = dateMatch[2].padStart(2, "0");
        const y = dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3];
        selectedDate = `${y}-${m}-${d}`;
      }
    }

    if (!selectedDate) {
      await sendTextFn(
        `⚠️ Please choose a valid date option:\n1️⃣ Today\n2️⃣ Tomorrow\n3️⃣ Day after tomorrow\nOr type DD-MM-YYYY:`
      );
      return;
    }

    session.date = selectedDate;
    session.step = "BOOKING_TIME";

    await sendTextFn(
      `📅 Consultation Date: *${formatHumanDate(selectedDate)}*\n\n⏰ *Please choose a preferred time slot*:\n\n1️⃣ *Morning Slot* (10:30 AM)\n2️⃣ *Afternoon Slot* (12:30 PM)\n3️⃣ *Evening Slot* (06:00 PM)\n4️⃣ *Night Slot* (07:30 PM)\n\n_Reply 1, 2, 3, 4, or type specific time (e.g., 11:15 AM):_`
    );
    return;
  }

  // STEP: Choose Time Slot
  if (session.step === "BOOKING_TIME") {
    let chosenTime = null;
    if (lower === "1" || lower.includes("morning")) chosenTime = "10:30 AM";
    else if (lower === "2" || lower.includes("afternoon")) chosenTime = "12:30 PM";
    else if (lower === "3" || lower.includes("evening")) chosenTime = "06:00 PM";
    else if (lower === "4" || lower.includes("night")) chosenTime = "07:30 PM";
    else if (text.length >= 3) chosenTime = text;

    if (!chosenTime) {
      await sendTextFn("Please choose a time slot (1: Morning, 2: Afternoon, 3: Evening, 4: Night, or type your preferred time):");
      return;
    }

    session.time = chosenTime;
    session.step = "BOOKING_REASON";

    await sendTextFn(
      `⏰ Time selected: *${chosenTime}*\n\n🩺 Briefly describe your *Health Concern / Reason for Visit* (e.g., Fever, Cold, Knee Pain, Health Checkup):\n\n_(Reply *SKIP* if you prefer to discuss directly with the doctor)_`
    );
    return;
  }

  // STEP: Chief Complaint / Reason
  if (session.step === "BOOKING_REASON") {
    session.reason = lower === "skip" ? "General Consultation" : text;
    session.step = "CONFIRMATION";

    await sendTextFn(
      `📋 *Please Review Your Appointment Details*:\n\n` +
      `🏥 *Clinic*: ${clinicName}\n` +
      `👨‍⚕️ *Doctor*: ${doctorName}\n` +
      `👤 *Patient*: *${session.patientName}*\n` +
      `📅 *Date*: *${formatHumanDate(session.date)}*\n` +
      `⏰ *Time*: *${session.time}*\n` +
      `🩺 *Reason*: ${session.reason}\n\n` +
      `Reply *1* or *CONFIRM* to schedule this appointment.\n` +
      `Reply *CANCEL* to discard.`
    );
    return;
  }

  // STEP: Confirmation & Booking Finalization
  if (session.step === "CONFIRMATION") {
    if (lower === "1" || lower.includes("confirm") || lower.includes("yes") || lower.includes("ok")) {
      try {
        let finalPatientId = session.patientId;

        // If new patient, register them
        if (!finalPatientId) {
          const ptSeq = await pool.query("SELECT nextval('patient_id_seq') AS val");
          finalPatientId = `PT-${String(ptSeq.rows[0].val).padStart(4, "0")}`;
          await pool.query(
            `INSERT INTO patients (id, clinic_id, name, contact, created_at)
             VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
            [finalPatientId, clinic.id, session.patientName, phone10]
          );
        }

        // Generate Appointment ID
        const seqResult = await pool.query("SELECT nextval('appointment_id_seq') AS val");
        const aptId = `APT-${String(seqResult.rows[0].val).padStart(4, "0")}`;

        // Insert Appointment
        await pool.query(
          `INSERT INTO appointments (id, clinic_id, patient_id, patient_name, date, time, reason, status, source)
           VALUES ($1, $2, $3, $4, $5::date, $6, $7, 'confirmed', 'whatsapp')`,
          [aptId, clinic.id, finalPatientId, session.patientName, session.date, session.time, session.reason]
        );

        console.log(`✅ WhatsApp Appointment Booked: ${aptId} for ${session.patientName} on ${session.date}`);

        // Dispatch Confirmation
        await sendTextFn(
          `🎉 *APPOINTMENT CONFIRMED!*\n\n` +
          `Your appointment with *${doctorName}* is booked.\n\n` +
          `🔖 *Appointment ID*: *${aptId}*\n` +
          `👤 *Patient*: *${session.patientName}*\n` +
          `📅 *Date*: *${formatHumanDate(session.date)}*\n` +
          `⏰ *Time*: *${session.time}*\n` +
          `📍 *Clinic*: ${clinicName}\n` +
          `📌 *Address*: ${clinicAddress}\n\n` +
          `Please arrive 10 minutes prior to your time.\n` +
          `For assistance or directions, call: ${clinicPhone}.\n\n` +
          `Thank you for booking with *${clinicName}*! 🙏`
        );

        // Clear session after successful booking
        sessions.delete(cleanPhone);
        return;
      } catch (err) {
        console.error("Error saving WhatsApp appointment:", err.message);
        await sendTextFn("⚠️ An error occurred while booking your appointment. Please call our clinic desk directly.");
        sessions.delete(cleanPhone);
        return;
      }
    } else {
      await sendTextFn("Please reply *CONFIRM* (or 1) to confirm your appointment, or reply *CANCEL* to discard.");
      return;
    }
  }
}

async function promptDateSelection(sendTextFn, patientName = "") {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const namePrefix = patientName ? `For: *${patientName}*\n\n` : "";

  await sendTextFn(
    `${namePrefix}📅 *Please select your preferred consultation date*:\n\n` +
    `1️⃣ *Today* (${formatHumanDate(today)})\n` +
    `2️⃣ *Tomorrow* (${formatHumanDate(tomorrow)})\n` +
    `3️⃣ *Day after tomorrow* (${formatHumanDate(dayAfter)})\n\n` +
    `_Reply 1, 2, 3, or type a date (e.g. DD-MM-YYYY):_`
  );
}
