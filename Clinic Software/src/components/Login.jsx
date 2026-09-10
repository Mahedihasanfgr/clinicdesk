import { useState } from "react";
import { S } from "../styles/styles";
import { apiLogin } from "../api";

export default function Login({ onLogin, onShowRegister }) {
  const [clinicCode, setClinicCode] = useState("");
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!clinicCode.trim()) {
      setErr("Clinic code is required");
      return;
    }
    setLoading(true);
    setErr("");
    const res = await apiLogin(u, p, clinicCode);
    setLoading(false);
    if (res.token) {
      localStorage.setItem("token", res.token);
      onLogin(res.user);
    } else {
      setErr(res.error || "Invalid credentials. Check your clinic code, username/email, and password.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "radial-gradient(circle at 50% 30%, #0F766E 0%, #0F172A 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      {/* Decorative Medical Background Elements */}
      <div style={{
        position: "absolute",
        top: "-15%",
        left: "15%",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
        filter: "blur(50px)",
        pointerEvents: "none"
      }} />

      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "44px 38px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        position: "relative",
        zIndex: 10,
        margin: "auto"
      }} className="animate-fade">
        
        {/* Medical Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 68,
            height: 68,
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            borderRadius: 20,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(13, 148, 136, 0.35)",
            marginBottom: 16
          }}>
            <span style={{ fontSize: 32 }}>🏥</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>ClinicDesk</h1>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#ECFDF5",
            color: "#047857",
            padding: "3px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            marginTop: 8
          }}>
            <span>🩺</span> Smart EMR & Prescription Suite
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Clinic Code</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...S.input, paddingLeft: 40 }}
                value={clinicCode}
                onChange={e => setClinicCode(e.target.value)}
                placeholder="e.g. srv or mehta_clinic"
              />
              <span style={{ position: "absolute", left: 14, top: 11, fontSize: 16 }}>🏥</span>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Username or Email</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...S.input, paddingLeft: 40 }}
                value={u}
                onChange={e => setU(e.target.value)}
                placeholder="doctor, reception, or registered email"
              />
              <span style={{ position: "absolute", left: 14, top: 11, fontSize: 16 }}>👨‍⚕️</span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={S.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...S.input, paddingLeft: 40 }}
                type="password"
                value={p}
                onChange={e => setP(e.target.value)}
                placeholder="••••••••"
              />
              <span style={{ position: "absolute", left: 14, top: 11, fontSize: 16 }}>🔑</span>
            </div>
          </div>

          {err && (
            <div style={{
              color: "#B91C1C",
              fontSize: 13,
              marginBottom: 20,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              padding: "10px 14px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>⚠️</span>
              <span>{err}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...S.btn,
              ...S.btnPrimary,
              width: "100%",
              padding: "13px",
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 12,
            }}
            className="btn-interactive"
            disabled={loading}
          >
            {loading ? "Verifying Credentials..." : "Sign In to Clinic Portal →"}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #E2E8F0", fontSize: 14, color: "#64748B", textAlign: "center" }}>
          Don't have a clinic account?{" "}
          <button
            type="button"
            style={{ background: "none", border: "none", color: "#0D9488", fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0 }}
            onClick={onShowRegister}
          >
            Register Clinic
          </button>
        </div>
      </div>
    </div>
  );
}
