import { useState, useEffect } from "react";
import { tokens } from "../styles/tokens";
import { PageHeader, Badge, Button, Card, Input } from "./common";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  RefreshCw,
  ShieldCheck,
  FileText,
  Bot,
  CalendarCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { apiSetWhatsAppClinic, apiTestWhatsAppBot, apiGetWhatsAppBotStatus } from "../api";

export default function WhatsAppPage() {
  const [status, setStatus] = useState("checking");
  const [qr, setQr] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [botStats, setBotStats] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I am your ClinicDesk Virtual Assistant. Patients can message this number to book appointments, view consultation timings, or fetch their latest prescriptions.",
    },
  ]);
  const [testInput, setTestInput] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [phoneInfo, setPhoneInfo] = useState({ phone: null, formattedPhone: null, directChatLink: null });

  const syncBotClinic = async () => {
    try {
      await apiSetWhatsAppClinic();
      const stats = await apiGetWhatsAppBotStatus();
      if (stats) setBotStats(stats);
    } catch {}
  };

  const handleSendTestMessage = async (e) => {
    if (e) e.preventDefault();
    if (!testInput.trim() || testLoading) return;

    const userMsg = testInput.trim();
    setTestInput("");
    setChatHistory((h) => [...h, { sender: "user", text: userMsg }]);
    setTestLoading(true);

    try {
      const res = await apiTestWhatsAppBot(userMsg, "919876543210");
      if (res && res.replies && res.replies.length > 0) {
        res.replies.forEach((r) => {
          setChatHistory((h) => [...h, { sender: "bot", text: r.content || `[Sent Document: ${r.fileName}]` }]);
        });
      } else {
        setChatHistory((h) => [
          ...h,
          { sender: "bot", text: "✅ Message received and processed by chatbot engine." },
        ]);
      }
    } catch (err) {
      setChatHistory((h) => [
        ...h,
        { sender: "bot", text: "⚠️ Error simulating chatbot response: " + (err.message || "Network error") },
      ]);
    } finally {
      setTestLoading(false);
    }
  };

  const BASE = import.meta.env.VITE_API_URL || "/api";

  const fetchStatus = async () => {
    setIsRefreshing(true);
    try {
      let data = null;

      // Use configured API base URL (works both locally and on deployed version)
      try {
        const res = await fetch(`${BASE}/whatsapp/status?t=${Date.now()}`);
        if (res.ok) data = await res.json();
      } catch {}

      setLastChecked(new Date().toLocaleTimeString());

      if (data && data.connected) {
        setStatus("connected");
        setQr(null);
        if (data.phone) {
          setPhoneInfo({
            phone: data.phone,
            formattedPhone: data.formattedPhone,
            directChatLink: data.directChatLink,
          });
        }
      } else if (data && data.qr) {
        setStatus("disconnected");
        setQr(data.qr);
      } else {
        setStatus("disconnected");
      }
    } catch {
      setStatus("disconnected");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    syncBotClinic();
    let cancelled = false;
    const runPoll = async () => {
      if (cancelled) return;
      await fetchStatus();
      if (!cancelled) {
        setTimeout(runPoll, 3500);
      }
    };
    runPoll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Page Header */}
      <PageHeader
        icon={MessageSquare}
        iconColor="#10B981"
        iconBg="linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)"
        title="WhatsApp Clinical Gateway"
        description="Automatically transmit prescription PDFs and follow-up alerts to patient mobiles"
        actions={
          <Badge variant={status === "connected" ? "green" : "amber"} size="md" dot>
            {status === "connected" ? "Online & Linked" : "Pairing Required"}
          </Badge>
        }
      />

      {/* Main Connection Card */}
      <Card style={{ padding: "32px 36px" }}>
        {status === "checking" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              gap: 12,
              color: tokens.colors.slate[500],
            }}
          >
            <RefreshCw
              size={28}
              className="animate-spin"
              style={{ animation: "spin 1s linear infinite", color: tokens.colors.primary[600] }}
            />
            <div style={{ fontSize: 14, fontWeight: 600 }}>Checking WhatsApp Gateway Status...</div>
          </div>
        )}

        {status === "connected" && (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: tokens.colors.semantic.success.bg,
                border: `2px solid ${tokens.colors.semantic.success.border}`,
                color: tokens.colors.semantic.success.solid,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
              }}
            >
              <CheckCircle2 size={38} strokeWidth={2.5} />
            </div>

            <h2 style={{ fontSize: 21, fontWeight: 800, color: tokens.colors.semantic.success.text, marginBottom: 6 }}>
              WhatsApp Gateway Connected
            </h2>
            <p
              style={{
                fontSize: 14,
                color: tokens.colors.semantic.success.text,
                maxWidth: 440,
                margin: "0 auto 24px",
                lineHeight: 1.5,
                opacity: 0.9,
              }}
            >
              Your clinic mobile number is actively linked. Every time you save an OPD consultation, ClinicDesk automatically dispatches a branded PDF prescription to the patient.
            </p>

            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 16,
                padding: "20px 24px",
                margin: "24px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                textAlign: "left",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#15803D", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Linked Clinic WhatsApp Number
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#166534", marginTop: 4 }}>
                  {phoneInfo.formattedPhone || (phoneInfo.phone ? `+${phoneInfo.phone}` : "Online & Active")}
                </div>
                <div style={{ fontSize: 13, color: "#16A34A", marginTop: 4 }}>
                  Patients message <strong>"Hi"</strong> or <strong>"Book"</strong> to this number to schedule appointments.
                </div>
              </div>

              {phoneInfo.directChatLink && (
                <a
                  href={phoneInfo.directChatLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#16A34A",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 13.5,
                    padding: "11px 20px",
                    borderRadius: 10,
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
                  }}
                  className="btn-interactive"
                >
                  <MessageSquare size={16} />
                  <span>Open Chat on WhatsApp</span>
                </a>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                background: tokens.colors.semantic.success.bg,
                border: `1px solid ${tokens.colors.semantic.success.border}`,
                borderRadius: tokens.radii.lg,
                padding: "16px 20px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: tokens.colors.semantic.success.text, fontWeight: 600 }}>
                <FileText size={16} color="#059669" />
                <span>Instant PDF Dispatch</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: tokens.colors.semantic.success.text, fontWeight: 600 }}>
                <ShieldCheck size={16} color="#059669" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        )}

        {status === "disconnected" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                padding: "12px 16px",
                background: tokens.colors.semantic.warning.bg,
                border: `1px solid ${tokens.colors.semantic.warning.border}`,
                borderRadius: tokens.radii.md,
                marginBottom: 24,
                color: tokens.colors.semantic.warning.text,
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
                <span>
                  {qr ? "Pairing QR active — scan with WhatsApp" : "Connecting to WhatsApp Gateway..."}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={fetchStatus}
                loading={isRefreshing}
              >
                Refresh QR
              </Button>
            </div>

            {/* 3 Step Instructions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
                fontSize: 12.5,
                color: tokens.colors.slate[700],
                fontWeight: 600,
                background: tokens.colors.slate[50],
                padding: "14px 18px",
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.slate[200]}`,
              }}
            >
              <div>
                <span style={{ color: tokens.colors.primary[600], fontWeight: 800 }}>1.</span> Open WhatsApp
              </div>
              <div style={{ color: tokens.colors.slate[400] }}>➔</div>
              <div>
                <span style={{ color: tokens.colors.primary[600], fontWeight: 800 }}>2.</span> Linked Devices
              </div>
              <div style={{ color: tokens.colors.slate[400] }}>➔</div>
              <div>
                <span style={{ color: tokens.colors.primary[600], fontWeight: 800 }}>3.</span> Scan QR Code
              </div>
            </div>

            {qr ? (
              <div style={{ textAlign: "center" }}>
                {/* QR Container */}
                <div
                  style={{
                    display: "inline-block",
                    padding: 16,
                    background: "#FFFFFF",
                    border: `2px solid ${tokens.colors.primary[600]}`,
                    borderRadius: tokens.radii.xl,
                    boxShadow: "0 10px 30px rgba(13, 148, 136, 0.15)",
                    marginBottom: 14,
                  }}
                >
                  <img
                    src={qr}
                    alt="WhatsApp Pairing QR"
                    style={{ width: 250, height: 250, display: "block", borderRadius: 10 }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 12,
                    color: tokens.colors.slate[500],
                    marginBottom: 16,
                  }}
                >
                  <RefreshCw size={12} className="animate-spin" style={{ animation: "spin 3s linear infinite" }} />
                  <span>Gateway active. Auto-refreshes every 3.5s {lastChecked ? `(Checked ${lastChecked})` : ""}</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 20px",
                  background: tokens.colors.slate[50],
                  borderRadius: tokens.radii.lg,
                  border: `1px dashed ${tokens.colors.slate[300]}`,
                  marginBottom: 20,
                }}
              >
                <Smartphone size={36} color={tokens.colors.primary[600]} style={{ marginBottom: 12, opacity: 0.8 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: tokens.colors.slate[800], marginBottom: 4 }}>
                  Initializing WhatsApp Gateway...
                </div>
                <p style={{ fontSize: 13, color: tokens.colors.slate[500], maxWidth: 380, margin: "0 auto 16px" }}>
                  Establishing a secure pairing connection with WhatsApp for automated prescription delivery.
                </p>
                <Button variant="primary" size="md" icon={RefreshCw} onClick={fetchStatus} loading={isRefreshing}>
                  Check Status Now
                </Button>
              </div>
            )}


          </div>
        )}
      </Card>

      {/* ── Chatbot Assistant Feature Suite ───────────────────────────────────── */}
      <Card style={{ padding: "30px 34px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: tokens.radii.lg,
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981",
              }}
            >
              <Bot size={24} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: tokens.colors.slate[900], display: "flex", alignItems: "center", gap: 8 }}>
                <span>WhatsApp Patient Appointment Assistant</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(16, 185, 129, 0.12)", color: "#059669", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  ONLINE
                </span>
              </div>
              <p style={{ fontSize: 13, color: tokens.colors.slate[500], margin: "2px 0 0" }}>
                Patients can message your clinic WhatsApp number to schedule appointments and view medical records.
              </p>
            </div>
          </div>

          {botStats && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: tokens.colors.slate[400], textTransform: "uppercase" }}>Booked Via WhatsApp</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#059669" }}>{botStats.totalWhatsAppAppointments || 0} Appointments</div>
              </div>
            </div>
          )}
        </div>

        {/* 3 Value Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginBottom: 28 }}>
          <div style={{ padding: "18px 20px", borderRadius: tokens.radii.lg, border: `1px solid ${tokens.colors.slate[200]}`, background: tokens.colors.slate[50] }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <CalendarCheck size={18} color="#059669" />
              <div style={{ fontSize: 14, fontWeight: 800, color: tokens.colors.slate[900] }}>Conversational Booking</div>
            </div>
            <p style={{ fontSize: 12.5, color: tokens.colors.slate[600], margin: 0, lineHeight: 1.5 }}>
              Guides patients through date, time slots, and chief complaints step-by-step, booking directly into your schedule.
            </p>
          </div>

          <div style={{ padding: "18px 20px", borderRadius: tokens.radii.lg, border: `1px solid ${tokens.colors.slate[200]}`, background: tokens.colors.slate[50] }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Smartphone size={18} color="#0284C7" />
              <div style={{ fontSize: 14, fontWeight: 800, color: tokens.colors.slate[900] }}>Clinic Hours & Info</div>
            </div>
            <p style={{ fontSize: 12.5, color: tokens.colors.slate[600], margin: 0, lineHeight: 1.5 }}>
              Answers inquiries about doctor consultation timings, clinic location, and reception contacts instantly.
            </p>
          </div>

          <div style={{ padding: "18px 20px", borderRadius: tokens.radii.lg, border: `1px solid ${tokens.colors.slate[200]}`, background: tokens.colors.slate[50] }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <FileText size={18} color="#7C3AED" />
              <div style={{ fontSize: 14, fontWeight: 800, color: tokens.colors.slate[900] }}>Prescription Retrieval</div>
            </div>
            <p style={{ fontSize: 12.5, color: tokens.colors.slate[600], margin: 0, lineHeight: 1.5 }}>
              Registered patients can request and receive their latest prescription PDF directly on WhatsApp.
            </p>
          </div>
        </div>

        {/* Live Simulator Header */}
        <div style={{ borderTop: `1px solid ${tokens.colors.slate[200]}`, paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="#0D9488" />
              <div style={{ fontSize: 14, fontWeight: 800, color: tokens.colors.slate[900] }}>
                Interactive Chatbot Simulator (Test directly in browser)
              </div>
            </div>
            <span style={{ fontSize: 12, color: tokens.colors.slate[500] }}>Simulates message flow from patient phone</span>
          </div>

          {/* Chat Window */}
          <div
            style={{
              background: "#0F172A",
              borderRadius: tokens.radii.lg,
              border: "1px solid #1E293B",
              overflow: "hidden",
              boxShadow: tokens.shadows.md,
            }}
          >
            {/* Chat header */}
            <div style={{ background: "#1E293B", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #334155" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#F8FAFC" }}>ClinicDesk WhatsApp Assistant</span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: "auto" }}>Patient: +91 98765 43210</span>
            </div>

            {/* Messages body */}
            <div style={{ padding: 18, maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatHistory.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "82%",
                    background: m.sender === "user" ? "#065F46" : "#1E293B",
                    color: m.sender === "user" ? "#ECFDF5" : "#F8FAFC",
                    padding: "10px 14px",
                    borderRadius: 12,
                    borderBottomRightRadius: m.sender === "user" ? 2 : 12,
                    borderBottomLeftRadius: m.sender === "bot" ? 2 : 12,
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {m.text}
                </div>
              ))}
              {testLoading && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "#1E293B",
                    color: "#94A3B8",
                    padding: "8px 14px",
                    borderRadius: 12,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <RefreshCw size={12} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                  <span>Assistant typing...</span>
                </div>
              )}
            </div>

            {/* Quick Reply Pills */}
            <div style={{ background: "#1E293B", padding: "8px 14px", borderTop: "1px solid #334155", display: "flex", gap: 6, overflowX: "auto" }}>
              {["Hi", "1 (Book)", "Today", "10:30 AM", "Mild fever", "CONFIRM", "Cancel"].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    const clean = pill.split(" ")[0];
                    setTestInput(clean);
                  }}
                  style={{
                    background: "#334155",
                    color: "#E2E8F0",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendTestMessage} style={{ background: "#0F172A", padding: 12, display: "flex", gap: 10, borderTop: "1px solid #1E293B" }}>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type patient message (e.g. 'Hi', '1', 'Fever', 'CONFIRM')..."
                style={{
                  flex: 1,
                  background: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "8px 14px",
                  color: "#F8FAFC",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={testLoading || !testInput.trim()}
                style={{
                  background: "#10B981",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: testLoading || !testInput.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: testLoading || !testInput.trim() ? 0.6 : 1,
                }}
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}

