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

router.get("/status", (req, res) => {
  res.json({ connected: getConnectionStatus(), qr: getQRCode() });
});

// Direct browser test or <img> loader: http://localhost:5000/api/whatsapp/qr
router.get("/qr", (req, res) => {
  const qr = getQRCode();
  const connected = getConnectionStatus();

  if (connected) {
    if (req.headers.accept?.includes("text/html")) {
      return res.send(`<!DOCTYPE html><html><head><title>WhatsApp Connected</title></head><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0F172A;color:#34D399;"><div style="text-align:center;"><h2>✅ WhatsApp is already linked & online!</h2><p style="color:#94A3B8;">Prescriptions will be transmitted automatically.</p></div></body></html>`);
    }
    return res.status(200).json({ connected: true });
  }

  if (!qr) {
    if (req.headers.accept?.includes("text/html")) {
      return res.send(`<!DOCTYPE html><html><head><title>Generating WhatsApp QR...</title><meta http-equiv="refresh" content="3"></head><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0F172A;color:#F8FAFC;"><div style="text-align:center;"><h2>⏳ Initializing WhatsApp Pairing...</h2><p style="color:#94A3B8;">Connecting to WhatsApp Web daemon. Auto-refreshing in 3 seconds...</p></div></body></html>`);
    }
    return res.status(503).send("QR not ready yet");
  }

  // Browser navigation requesting HTML
  if (req.query.view === 'html' || (req.headers.accept?.includes("text/html") && !req.query.raw)) {
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <title>ClinicDesk - WhatsApp QR Pairing</title>
  <meta http-equiv="refresh" content="20">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0F172A; color: #F8FAFC; }
    .card { background: #1E293B; border: 1px solid #334155; border-radius: 24px; padding: 36px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); max-width: 380px; }
    img { width: 250px; height: 250px; border-radius: 16px; background: white; padding: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    h2 { margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #38BDF8; }
    p { font-size: 13.5px; color: #94A3B8; margin: 0 0 20px; line-height: 1.5; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #34D399; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; margin-bottom: 18px; }
    .steps { text-align: left; background: #0F172A; padding: 14px 18px; border-radius: 12px; margin-bottom: 22px; font-size: 12.5px; color: #CBD5E1; }
    .steps div { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">WhatsApp Clinical Gateway</div>
    <h2>Scan with WhatsApp</h2>
    <p>Link your clinic phone to send prescription PDFs directly to patient mobiles.</p>
    <div class="steps">
      <div><b>1.</b> Open WhatsApp on your phone</div>
      <div><b>2.</b> Tap <b>Linked Devices</b> &gt; <b>Link a Device</b></div>
      <div><b>3.</b> Point camera at this screen</div>
    </div>
    <img src="${qr}" alt="WhatsApp QR Code" />
    <p style="margin-top: 18px; font-size: 12px; color: #64748B;">Auto-refreshes every 20 seconds</p>
  </div>
</body>
</html>`);
  }

  // Raw PNG stream for <img src="..."> tags
  try {
    const base64Data = qr.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": imgBuffer.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    res.end(imgBuffer);
  } catch (err) {
    res.status(500).send("Error rendering QR code");
  }
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
