import { useState, useEffect } from "react";
import { S } from "../styles/styles";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Smartphone,
  Sparkles,
  RefreshCw,
  Send,
  ShieldCheck,
  FileText
} from "lucide-react";

export default function WhatsAppPage() {
  const [status, setStatus] = useState("checking");
  const [qr, setQr] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    setIsRefreshing(true);
    try {
      let data = null;

      // 1. Try proxied / local /api/whatsapp/status
      try {
        const res = await fetch(`/api/whatsapp/status?t=${Date.now()}`);
        if (res.ok) data = await res.json();
      } catch {}

      // 2. Fallback to direct localhost:5000
      if (!data || (!data.connected && !data.qr)) {
        try {
          const localRes = await fetch(`http://localhost:5000/api/whatsapp/status?t=${Date.now()}`);
          if (localRes.ok) {
            const localData = await localRes.json();
            if (localData.qr || localData.connected) {
              data = localData;
            }
          }
        } catch {}
      }

      setLastChecked(new Date().toLocaleTimeString());

      if (data && data.connected) {
        setStatus("connected");
        setQr(null);
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
    let cancelled = false;
    const runPoll = async () => {
      if (cancelled) return;
      await fetchStatus();
      if (!cancelled) {
        setTimeout(runPoll, 3500);
      }
    };
    runPoll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="animate-fade" style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header Card */}
      <div style={{
        ...S.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
          }}>
            <MessageSquare size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                WhatsApp Clinical Automation
              </h1>
              <span style={S.badge(status === "connected" ? "green" : "amber")}>
                {status === "connected" ? "Online & Linked" : "Pairing Required"}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
              Automatically transmit prescription PDFs and follow-up alerts to patient mobiles
            </p>
          </div>
        </div>
      </div>

      {/* Main Connection Card */}
      <div style={{ ...S.card, padding: "32px 36px", marginBottom: 0 }}>
        {status === "checking" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: 12,
            color: "#64748B",
          }}>
            <RefreshCw size={28} className="animate-spin" style={{ animation: "spin 1s linear infinite", color: "#0D9488" }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>Checking WhatsApp Gateway Status...</div>
          </div>
        )}

        {status === "connected" && (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#ECFDF5",
              border: "2px solid #A7F3D0",
              color: "#059669",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.2)",
            }}>
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#065F46", marginBottom: 6 }}>
              WhatsApp Gateway Connected
            </h2>
            <p style={{ fontSize: 14, color: "#047857", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.5 }}>
              Your clinic number is actively linked. Every time you save a consultation, ClinicDesk automatically dispatches a branded PDF prescription to the patient's phone.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: 14,
              padding: "16px 20px",
              textAlign: "left",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#166534", fontWeight: 600 }}>
                <FileText size={16} color="#059669" />
                <span>Instant PDF Dispatch</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#166534", fontWeight: 600 }}>
                <ShieldCheck size={16} color="#059669" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        )}

        {status === "disconnected" && (
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              padding: "12px 16px",
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 12,
              marginBottom: 24,
              color: "#92400E",
              fontSize: 13,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
                <span>
                  {qr ? "Pairing QR active — scan with WhatsApp" : "Connecting to local WhatsApp daemon..."}
                </span>
              </div>
              <button
                type="button"
                onClick={fetchStatus}
                disabled={isRefreshing}
                style={{
                  ...S.btn,
                  ...S.btnSecondary,
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 8,
                  gap: 6,
                }}
                className="btn-interactive"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} style={isRefreshing ? { animation: "spin 1s linear infinite" } : {}} />
                <span>{isRefreshing ? "Checking..." : "Refresh QR"}</span>
              </button>
            </div>

            {/* 3 Step Instructions */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
              fontSize: 12.5,
              color: "#334155",
              fontWeight: 600,
              background: "#F8FAFC",
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
            }}>
              <div>
                <span style={{ color: "#0D9488", fontWeight: 800 }}>1.</span> Open WhatsApp
              </div>
              <div style={{ color: "#94A3B8" }}>➔</div>
              <div>
                <span style={{ color: "#0D9488", fontWeight: 800 }}>2.</span> Linked Devices
              </div>
              <div style={{ color: "#94A3B8" }}>➔</div>
              <div>
                <span style={{ color: "#0D9488", fontWeight: 800 }}>3.</span> Scan QR Code
              </div>
            </div>

            {qr ? (
              <div style={{ textAlign: "center" }}>
                {/* QR Container */}
                <div style={{
                  display: "inline-block",
                  padding: 16,
                  background: "#FFFFFF",
                  border: "2px solid #0D9488",
                  borderRadius: 20,
                  boxShadow: "0 10px 30px rgba(13, 148, 136, 0.15)",
                  marginBottom: 14,
                }}>
                  <img
                    src={qr}
                    alt="WhatsApp Pairing QR"
                    style={{ width: 250, height: 250, display: "block", borderRadius: 10 }}
                  />
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#64748B",
                  marginBottom: 16,
                }}>
                  <RefreshCw size={12} className="animate-spin" style={{ animation: "spin 3s linear infinite" }} />
                  <span>Daemon active. Auto-refreshes every 3.5s {lastChecked ? `(Last checked ${lastChecked})` : ""}</span>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "36px 20px",
                background: "#F8FAFC",
                borderRadius: 16,
                border: "1px dashed #CBD5E1",
                marginBottom: 20,
              }}>
                <Smartphone size={36} color="#0D9488" style={{ marginBottom: 12, opacity: 0.8 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>
                  Initializing WhatsApp Daemon...
                </div>
                <p style={{ fontSize: 13, color: "#64748B", maxWidth: 380, margin: "0 auto 16px" }}>
                  The backend is establishing a secure pairing session with WhatsApp Web servers.
                </p>
                <button
                  type="button"
                  onClick={fetchStatus}
                  style={{
                    ...S.btn,
                    ...S.btnPrimary,
                    fontSize: 12.5,
                    padding: "8px 18px",
                  }}
                  className="btn-interactive"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} style={isRefreshing ? { animation: "spin 1s linear infinite" } : {}} />
                  <span>Check Status Now</span>
                </button>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <a
                href="http://localhost:5000/api/whatsapp/qr?view=html"
                target="_blank"
                rel="noreferrer"
                style={{
                  ...S.btn,
                  ...S.btnSecondary,
                  fontSize: 12.5,
                  padding: "6px 14px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
                className="btn-interactive"
              >
                <QrCode size={14} color="#0D9488" />
                <span>Open Standalone QR Window (New Tab)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
