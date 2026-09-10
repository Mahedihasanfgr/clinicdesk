import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import templateRoutes from "./routes/templates.js";
import clinicRoutes from "./routes/clinics.js";
import whatsappRoutes from "./routes/whatsapp.js";
import pool from "./db.js";
import { setupDatabase } from "./setup.js";
import { connectWhatsApp } from "./whatsapp/client.js";

async function runSetupIfNeeded() {
  try {
    await pool.query("SELECT 1 FROM clinics LIMIT 1");
    await pool.query("SELECT clinic_id FROM users LIMIT 1");
    console.log("✅ Unified single-database schema already active");
  } catch {
    console.log("⚙️ Running unified database setup...");
    await setupDatabase();
  }
}

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const allowed = origin === "http://localhost:5173" ||
    origin.endsWith(".vercel.app") ||
    origin === process.env.FRONTEND_URL ||
    !origin;
  if (allowed && origin) res.setHeader("Access-Control-Allow-Origin", origin);
  else res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "10mb" }));

// Lazy setup middleware for serverless cold starts
let isSetupComplete = false;
app.use(async (req, res, next) => {
  if (!isSetupComplete && (process.env.DATABASE_URL || process.env.DB_HOST)) {
    try {
      await runSetupIfNeeded();
      isSetupComplete = true;
    } catch (err) {
      console.error("Auto setup error:", err.message);
    }
  }
  next();
});

// Health check endpoints
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "clinic-backend", timestamp: new Date() }));
app.get("/health", (req, res) => res.json({ status: "ok", service: "clinic-backend", timestamp: new Date() }));

// Mount routes on both /api/* and root /* for flexible routing in dev and serverless
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/templates", templateRoutes);
app.use("/templates", templateRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/clinics", clinicRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/whatsapp", whatsappRoutes);

// Only listen on port in standalone/local mode; Vercel invokes app as a serverless function
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await runSetupIfNeeded();
    isSetupComplete = true;
    if (process.env.ENABLE_WHATSAPP !== "false") {
      try {
        console.log("📱 Initializing WhatsApp Web Client...");
        await connectWhatsApp();
      } catch (err) {
        console.error("⚠️ WhatsApp initialization error:", err.message);
      }
    }
  });
}

export default app;
