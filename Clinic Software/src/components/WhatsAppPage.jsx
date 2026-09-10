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

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch("/api/whatsapp/status", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.connected) {
          setStatus("connected");
          setQr(null);
          setTimeout(poll, 5000);
        } else {
          setStatus("disconnected");
          setQr(data.qr || null);
          setTimeout(poll, 3000);
        }
      } catch {
        if (!cancelled) setTimeout(poll, 4000);
      }
    };
    poll();
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
              gap: 10,
              padding: "12px 16px",
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 12,
              marginBottom: 24,
              color: "#92400E",
              fontSize: 13,
            }}>
              <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
              <span>
                WhatsApp daemon is currently waiting for device authorization.
              </span>
            </div>

            {qr ? (
              <div style={{ textAlign: "center" }}>
                {/* 3 Step Instructions */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 24,
                  fontSize: 12.5,
                  color: "#334155",
                  fontWeight: 600,
                  textAlign: "left",
                  background: "#F8FAFC",
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                }}>
                  <div>
                    <span style={{ color: "#0D9488", fontWeight: 800 }}>1.</span> Open WhatsApp
                  </div>
                  <div>➔</div>
                  <div>
                    <span style={{ color: "#0D9488", fontWeight: 800 }}>2.</span> Linked Devices
                  </div>
                  <div>➔</div>
                  <div>
                    <span style={{ color: "#0D9488", fontWeight: 800 }}>3.</span> Scan QR Code
                  </div>
                </div>

                {/* QR Container */}
                <div style={{
                  display: "inline-block",
                  padding: 16,
                  background: "#FFFFFF",
                  border: "2px solid #E2E8F0",
                  borderRadius: 20,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
                  marginBottom: 12,
                }}>
                  <img
                    src={qr}
                    alt="WhatsApp Pairing QR"
                    style={{ width: 240, height: 240, display: "block", borderRadius: 8 }}
                  />
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#64748B",
                }}>
                  <RefreshCw size={12} className="animate-spin" style={{ animation: "spin 2s linear infinite" }} />
                  <span>QR refreshes dynamically. Keep this screen open to pair.</span>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "36px 16px",
                color: "#64748B",
              }}>
                <Smartphone size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
                  Generating Secure Pairing Key...
                </div>
                <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 4 }}>
                  Ensure your backend server is running locally to handle WhatsApp Web sockets.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
