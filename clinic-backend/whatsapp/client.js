import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode";
import qrcodeTerminal from "qrcode-terminal";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = path.join(__dirname, "session");

let sock = null;
let isConnected = false;
let currentQR = null;

export const getConnectionStatus = () => isConnected;
export const getQRCode = () => currentQR;

function clearSession() {
  if (fs.existsSync(SESSION_PATH)) {
    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
    fs.mkdirSync(SESSION_PATH);
    console.log("🗑 Session cleared — will generate new QR");
  }
}

export async function connectWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ["ClinicDesk", "Chrome", "1.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      currentQR = await qrcode.toDataURL(qr);
      console.log("\n📱 Scan this QR with WhatsApp:\n");
      qrcodeTerminal.generate(qr, { small: true });
      console.log("\n✅ QR also available at: http://localhost:5000/api/whatsapp/qr\n");
    }

    if (connection === "close") {
      isConnected = false;
      currentQR = null;
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      console.log("WhatsApp disconnected. Status:", statusCode, "Logged out:", loggedOut);
      if (loggedOut) {
        clearSession();
      }
      setTimeout(() => {
        connectWhatsApp().catch(err => console.error("⚠️ WhatsApp reconnect error:", err.message));
      }, 3000);
    }

    if (connection === "open") {
      isConnected = true;
      currentQR = null;
      console.log("✅ WhatsApp connected!");
    }
  });

  return sock;
}

export async function sendWhatsAppPDF(phoneNumber, pdfBuffer, patientName) {
  if (!sock || !isConnected) throw new Error("WhatsApp not connected");

  // Format number — remove leading 0, add country code 91 for India
  let number = phoneNumber.replace(/\D/g, "");
  if (number.startsWith("0")) number = number.slice(1);
  if (!number.startsWith("91")) number = "91" + number;
  const jid = `${number}@s.whatsapp.net`;

  await sock.sendMessage(jid, {
    document: pdfBuffer,
    mimetype: "application/pdf",
    fileName: `Prescription_${(patientName || "Patient").replace(/\s+/g, "_")}.pdf`,
    caption: `Prescription from ClinicDesk for ${patientName || "Patient"}`
  });

  console.log(`✅ PDF sent to ${jid}`);
}
