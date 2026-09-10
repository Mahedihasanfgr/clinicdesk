import { useState, useEffect } from "react";
import { S } from "../styles/styles";

export default function WhatsAppPage() {
  const [status, setStatus] = useState("checking"); // checking | connected | disconnected
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
          setTimeout(poll, 5000); // keep polling to detect disconnects
        } else {
          setStatus("disconnected");
          setQr(data.qr || null);
          setTimeout(poll, 3000);
        }
      } catch { if (!cancelled) setTimeout(poll, 4000); }
    };
    poll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div style={S.card}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>📲 WhatsApp Connection</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
          Connect your clinic WhatsApp to send prescriptions directly to patients.
        </div>

        {status === "checking" && (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>Checking connection...</div>
        )}

        {status === "connected" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: 28 }}>✅</div>
            <div>
              <div style={{ fontWeight: 600, color: "#15803d", fontSize: 15 }}>WhatsApp Connected</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Prescriptions will be sent automatically when you save a visit.</div>
            </div>
          </div>
        )}

        {status === "disconnected" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca", marginBottom: 20, fontSize: 13, color: "#dc2626" }}>
              ⚠ WhatsApp not connected
            </div>
            {qr ? (
              <>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
                  Open WhatsApp on your phone → <strong>Linked Devices → Link a Device</strong> → Scan this QR
                </div>
                <img src={qr} alt="WhatsApp QR Code" style={{ width: 240, height: 240, borderRadius: 12, border: "1px solid #e5e7eb" }} />
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>QR refreshes automatically</div>
              </>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: 14 }}>Generating QR code...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
