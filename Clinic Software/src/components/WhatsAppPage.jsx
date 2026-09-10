import { useState, useEffect } from "react";
import { tokens } from "../styles/tokens";
import { PageHeader, Badge, Button, Card } from "./common";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Smartphone,
  RefreshCw,
  ShieldCheck,
  FileText,
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
                  {qr ? "Pairing QR active — scan with WhatsApp" : "Connecting to local WhatsApp daemon..."}
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
                  <span>Daemon active. Auto-refreshes every 3.5s {lastChecked ? `(Checked ${lastChecked})` : ""}</span>
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
                  Initializing WhatsApp Daemon...
                </div>
                <p style={{ fontSize: 13, color: tokens.colors.slate[500], maxWidth: 380, margin: "0 auto 16px" }}>
                  The backend is establishing a secure pairing session with WhatsApp Web servers.
                </p>
                <Button variant="primary" size="md" icon={RefreshCw} onClick={fetchStatus} loading={isRefreshing}>
                  Check Status Now
                </Button>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <a
                href="http://localhost:5000/api/whatsapp/qr?view=html"
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12.5,
                  color: tokens.colors.primary[700],
                  fontWeight: 600,
                  background: tokens.colors.primary[50],
                  border: `1px solid ${tokens.colors.primary[200]}`,
                  padding: "8px 16px",
                  borderRadius: tokens.radii.md,
                }}
                className="btn-interactive"
              >
                <QrCode size={15} color={tokens.colors.primary[600]} />
                <span>Open Standalone QR Window (New Tab)</span>
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
