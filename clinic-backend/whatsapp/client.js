import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode";
import qrcodeTerminal from "qrcode-terminal";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { handleIncomingWhatsAppMessage } from "./chatbot.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PATH = path.join(__dirname, "session");

let sock = null;
let isConnected = false;
let currentQR = null;

export const getConnectionStatus = () => isConnected;
export const getQRCode = () => currentQR;
export const getConnectedPhone = () => {
  if (!sock?.user?.id) return null;
  const raw = sock.user.id.split(":")[0].split("@")[0];
  return raw.replace(/\D/g, "");
};
export const getConnectedUser = () => sock?.user || null;

function clearSession() {
  if (fs.existsSync(SESSION_PATH)) {
    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
    fs.mkdirSync(SESSION_PATH);
    console.log("🗑 Session cleared — will generate new QR");
  }
}

export async function connectWhatsApp() {
  if (sock) {
    try {
      sock.ev.removeAllListeners("connection.update");
      sock.ev.removeAllListeners("creds.update");
      sock.end(undefined);
    } catch {}
  }

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
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      console.log("WhatsApp disconnected. Status:", statusCode, "Logged out:", loggedOut);
      if (loggedOut) {
        currentQR = null;
        clearSession();
      }
      setTimeout(() => {
        connectWhatsApp().catch(err => console.error("⚠️ WhatsApp reconnect error:", err.message));
      }, 3000);
    }

    if (connection === "open") {
      isConnected = true;
      currentQR = null;
      console.log("✅ WhatsApp connected & Chatbot Active!");
    }
  });

  // ── Chatbot: Handle Incoming WhatsApp Messages ───────────────────────────
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    try {
      for (const msg of messages || []) {
        // Skip messages sent by the bot/clinic itself
        if (msg.key?.fromMe) continue;

        const remoteJid = msg.key?.remoteJid || "";
        // Skip status broadcast and WhatsApp groups
        if (!remoteJid || remoteJid === "status@broadcast" || remoteJid.endsWith("@g.us")) continue;

        // Extract message content
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          "";

        if (!text.trim()) continue;

        const senderNumber = remoteJid.split("@")[0];
        const pushName = msg.pushName || "";

        // Dispatch to intelligent chatbot state machine
        await handleIncomingWhatsAppMessage(
          senderNumber,
          text,
          pushName,
          async (replyText) => {
            if (sock && isConnected) {
              await sock.sendMessage(remoteJid, { text: replyText });
            }
          },
          async (toPhone, docBuffer, fileName, caption) => {
            if (sock && isConnected) {
              await sock.sendMessage(remoteJid, {
                document: docBuffer,
                mimetype: "application/pdf",
                fileName: fileName || "Medical_Document.pdf",
                caption: caption || "Prescription Document",
              });
            }
          }
        );
      }
    } catch (err) {
      console.error("❌ Error processing incoming WhatsApp message:", err.message);
    }
  });

  return sock;
}

export async function sendWhatsAppText(phoneNumber, messageText) {
  if (!sock || !isConnected) throw new Error("WhatsApp not connected");

  let number = phoneNumber.replace(/\D/g, "");
  if (number.startsWith("0")) number = number.slice(1);
  if (!number.startsWith("91")) number = "91" + number;
  const jid = `${number}@s.whatsapp.net`;

  await sock.sendMessage(jid, { text: messageText });
  console.log(`✅ Text message sent to ${jid}`);
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
