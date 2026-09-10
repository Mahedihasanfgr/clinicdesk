import express from "express";
import auth from "../middleware.js";
import { sendWhatsAppPDF, getConnectionStatus, getQRCode } from "../whatsapp/client.js";
import { generatePrescriptionPDF } from "../whatsapp/pdfGenerator.js";

const router = express.Router();

const DOCTOR_INFO = {
  name: process.env.DOCTOR_NAME || "Doctor",
  degree: process.env.DOCTOR_DEGREE || "",
  clinic: process.env.CLINIC_NAME || "Clinic",
  address: process.env.CLINIC_ADDRESS || "",
  phone: process.env.CLINIC_PHONE || "",
  reg: process.env.DOCTOR_REG || "",
};

router.get("/status", auth, (req, res) => {
  res.json({ connected: getConnectionStatus(), qr: getQRCode() });
});

// No auth — for direct browser test: http://localhost:5000/api/whatsapp/qr
router.get("/qr", (req, res) => {
  const qr = getQRCode();
  if (!qr) return res.send(getConnectionStatus() ? "✅ Already connected" : "No QR yet — wait a few seconds and refresh");
  res.send(`<img src="${qr}" style="width:300px">`);
});

router.post("/send", auth, async (req, res) => {
  const { patient, visit } = req.body;
  console.log(`📤 Send request — patient: ${patient?.name}, contact: ${patient?.contact}, connected: ${getConnectionStatus()}`);
  try {
    if (!getConnectionStatus()) return res.status(503).json({ error: "WhatsApp not connected" });
    if (!patient?.contact) return res.status(400).json({ error: "Patient has no contact number" });

    const doctorInfo = {
      name: req.user?.name || DOCTOR_INFO.name,
      degree: process.env.DOCTOR_DEGREE || DOCTOR_INFO.degree,
      clinic: req.user?.clinicName || DOCTOR_INFO.clinic,
      address: process.env.CLINIC_ADDRESS || DOCTOR_INFO.address,
      phone: process.env.CLINIC_PHONE || DOCTOR_INFO.phone,
      reg: process.env.DOCTOR_REG || DOCTOR_INFO.reg,
    };
    const pdfBuffer = await generatePrescriptionPDF(patient, visit, doctorInfo);
    console.log(`📄 PDF generated: ${pdfBuffer.length} bytes`);
    await sendWhatsAppPDF(patient.contact, pdfBuffer, patient.name);
    console.log(`✅ PDF sent to ${patient.contact}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Send error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
