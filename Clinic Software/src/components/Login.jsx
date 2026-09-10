import { useState } from "react";
import { S } from "../styles/styles";
import { apiLogin } from "../api";
import loginBg from "../assets/medical_login_bg.jpg";
import {
  Stethoscope,
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Database,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function Login({ onLogin, onShowRegister }) {
  const [clinicCode, setClinicCode] = useState("");
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!clinicCode.trim()) {
      setErr("Please enter your clinic code");
      return;
    }
    if (!u.trim()) {
      setErr("Please enter your username or email");
      return;
    }
    if (!p) {
      setErr("Please enter your password");
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
      setErr(res.error || "Invalid credentials. Please verify your clinic code, username, and password.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      backgroundImage: `url(${loginBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",
    }}>
      {/* Cinematic Dark Gradient Scrim */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(11, 19, 43, 0.82) 0%, rgba(15, 23, 42, 0.90) 100%)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }} />

      {/* Main Glassmorphic Login Card */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 440,
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 24,
        padding: "40px 36px",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
      }} className="animate-fade">

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            borderRadius: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px -4px rgba(13, 148, 136, 0.4)",
            marginBottom: 16,
            color: "#FFFFFF",
          }}>
            <Stethoscope size={32} strokeWidth={2.2} />
          </div>

          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-0.03em",
            marginBottom: 6,
          }}>
            ClinicDesk
          </h1>
          <p style={{
            fontSize: 13.5,
            color: "#64748B",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}>
            <Sparkles size={14} color="#0D9488" /> Intelligent Clinical Workspace & EMR
          </p>
        </div>

        {/* Error Alert */}
        {err && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#B91C1C",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 13,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }} className="animate-fade">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Clinic Code Field */}
          <div>
            <label style={S.label}>Clinic Code</label>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                pointerEvents: "none",
                display: "flex",
              }}>
                <Building2 size={18} />
              </div>
              <input
                style={{
                  ...S.input,
                  paddingLeft: 42,
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                  textTransform: "lowercase",
                }}
                placeholder="e.g. cityclinic"
                value={clinicCode}
                onChange={(e) => {
                  setErr("");
                  setClinicCode(e.target.value.toLowerCase().trim());
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Username / Email */}
          <div>
            <label style={S.label}>Doctor / Staff Username</label>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                pointerEvents: "none",
                display: "flex",
              }}>
                <User size={18} />
              </div>
              <input
                style={{ ...S.input, paddingLeft: 42 }}
                placeholder="doctor or registered email"
                value={u}
                onChange={(e) => {
                  setErr("");
                  setU(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={S.label}>Password</label>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                pointerEvents: "none",
                display: "flex",
              }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                style={{ ...S.input, paddingLeft: 42, paddingRight: 40 }}
                placeholder="Enter your password"
                value={p}
                onChange={(e) => {
                  setErr("");
                  setP(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  padding: 4,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...S.btn,
              ...S.btnPrimary,
              width: "100%",
              padding: "13px 20px",
              fontSize: 15,
              borderRadius: 12,
              marginTop: 6,
              opacity: loading ? 0.75 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
            className="btn-interactive"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: "spin 0.8s linear infinite" }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Clinical Workspace</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            New Practice
          </span>
          <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
        </div>

        {/* Register CTA */}
        <button
          onClick={onShowRegister}
          style={{
            ...S.btn,
            ...S.btnSecondary,
            width: "100%",
            padding: "11px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color: "#0F766E",
            background: "#F0FDFA",
            border: "1px solid #99F6E4",
          }}
          className="btn-interactive"
        >
          Register New Medical Clinic →
        </button>

        {/* Trust Badges */}
        <div style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          fontSize: 11.5,
          color: "#64748B",
          fontWeight: 600,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck size={14} color="#0D9488" /> 256-Bit Encrypted
          </span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Database size={14} color="#0284C7" /> Cloud Synchronized
          </span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MessageSquare size={14} color="#10B981" /> WhatsApp Ready
          </span>
        </div>

      </div>
    </div>
  );
}
