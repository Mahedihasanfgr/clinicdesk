import { useState } from "react";
import { tokens } from "../styles/tokens";
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
  CheckCircle2,
  Loader2,
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
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        background: tokens.colors.slate[50],
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      {/* Left Editorial Media Panel (Split Screen on Desktop) */}
      <div
        style={{
          flex: 1.1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
        className="topbar-desktop-only"
      >
        {/* Deep Slate + Medical Teal Gradient Scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(11, 19, 43, 0.88) 0%, rgba(15, 118, 110, 0.78) 50%, rgba(15, 23, 42, 0.92) 100%)",
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Top Branding Lockup */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              boxShadow: "0 8px 20px rgba(13, 148, 136, 0.4)",
            }}
          >
            <Stethoscope size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                ClinicDesk
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  background: "linear-gradient(135deg, #2DD4BF 0%, #38BDF8 100%)",
                  color: "#0B132B",
                  padding: "2px 8px",
                  borderRadius: 999,
                }}
              >
                PRO
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(241, 245, 249, 0.75)", margin: 0 }}>
              Clinical Intelligence & Automation
            </p>
          </div>
        </div>

        {/* Center Editorial Value Prop */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "auto 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(20, 184, 166, 0.18)",
              border: "1px solid rgba(45, 212, 191, 0.35)",
              color: "#5EEAD4",
              fontSize: 12.5,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 999,
              marginBottom: 20,
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles size={14} />
            <span>Next-Generation Healthcare SaaS</span>
          </div>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            High-Performance Clinical Care. Zero Friction.
          </h1>

          <p
            style={{
              fontSize: 15.5,
              color: "rgba(226, 232, 240, 0.85)",
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            Streamline patient queues, generate compliant electronic prescriptions, and automatically dispatch branded PDFs to patient WhatsApp in real-time.
          </p>

          {/* Key Value Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { title: "Instant WhatsApp PDF Transmission", desc: "Prescriptions sent immediately upon consultation save" },
              { title: "Universal Single-Database Architecture", desc: "Zero-latency multi-clinic cloud synchronization" },
              { title: "Rapid Rx Templating & Dosing Engine", desc: "Finish standard prescriptions in less than 30 seconds" },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "1.5px solid #34D399",
                    color: "#34D399",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <CheckCircle2 size={13} strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#FFFFFF" }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(203, 213, 225, 0.75)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Quote */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "16px 20px",
            background: "rgba(11, 19, 43, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            backdropFilter: "blur(12px)",
          }}
        >
          <p style={{ fontSize: 13, color: "#E2E8F0", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
            "ClinicDesk revolutionized our daily consultations. Patient follow-up adherence grew by 45% with automatic WhatsApp delivery."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#2DD4BF" }}>Dr. S. Mehta, MD</span>
            <span style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.8)" }}>• Cardiology Specialist</span>
          </div>
        </div>
      </div>

      {/* Right Form Surface */}
      <div
        style={{
          flex: 0.9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#FFFFFF",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }} className="animate-fade">
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                boxShadow: "0 8px 24px rgba(13, 148, 136, 0.3)",
                marginBottom: 20,
              }}
            >
              <Stethoscope size={28} strokeWidth={2.4} />
            </div>

            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: tokens.colors.slate[900],
                letterSpacing: "-0.03em",
                marginBottom: 6,
              }}
            >
              Sign In to ClinicDesk
            </h2>
            <p style={{ fontSize: 14, color: tokens.colors.slate[500] }}>
              Enter your clinic ID and doctor credentials to access your clinical workspace.
            </p>
          </div>

          {/* Error Banner */}
          {err && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: tokens.colors.semantic.danger.bg,
                border: `1px solid ${tokens.colors.semantic.danger.border}`,
                borderRadius: tokens.radii.md,
                color: tokens.colors.semantic.danger.text,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{err}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Clinic Code */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tokens.colors.slate[700],
                  marginBottom: 6,
                }}
              >
                Clinic Code
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Building2
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    color: tokens.colors.slate[400],
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="e.g. dgt, apollo, myclinic"
                  value={clinicCode}
                  onChange={(e) => setClinicCode(e.target.value.toLowerCase().trim())}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    paddingLeft: 42,
                    borderRadius: tokens.radii.md,
                    border: `1px solid ${tokens.colors.slate[300]}`,
                    fontSize: 14,
                    color: tokens.colors.slate[900],
                    outline: "none",
                    boxSizing: "border-box",
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tokens.colors.slate[700],
                  marginBottom: 6,
                }}
              >
                Username or Email
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    color: tokens.colors.slate[400],
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="e.g. doctor, dr.john"
                  value={u}
                  onChange={(e) => setU(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    paddingLeft: 42,
                    borderRadius: tokens.radii.md,
                    border: `1px solid ${tokens.colors.slate[300]}`,
                    fontSize: 14,
                    color: tokens.colors.slate[900],
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: tokens.colors.slate[700] }}>
                  Password
                </label>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    color: tokens.colors.slate[400],
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    paddingLeft: 42,
                    paddingRight: 42,
                    borderRadius: tokens.radii.md,
                    border: `1px solid ${tokens.colors.slate[300]}`,
                    fontSize: 14,
                    color: tokens.colors.slate[900],
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    background: "none",
                    border: "none",
                    color: tokens.colors.slate[400],
                    cursor: "pointer",
                    padding: 4,
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
              className="btn-interactive"
              style={{
                width: "100%",
                padding: "13px 20px",
                borderRadius: tokens.radii.md,
                background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
                color: "#FFFFFF",
                fontSize: 14.5,
                fontWeight: 700,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: tokens.shadows.primaryGlow,
                marginTop: 6,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt */}
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13.5, color: tokens.colors.slate[500] }}>
            Don't have a registered clinic?{" "}
            <button
              type="button"
              onClick={onShowRegister}
              style={{
                background: "none",
                border: "none",
                color: tokens.colors.primary[600],
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
              }}
              className="btn-interactive"
            >
              Register your Clinic →
            </button>
          </div>

          {/* Trust Indicators Footer */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 24,
              borderTop: `1px solid ${tokens.colors.slate[200]}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              fontSize: 11.5,
              color: tokens.colors.slate[500],
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ShieldCheck size={14} color="#0D9488" />
              <span>256-Bit Encrypted</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Database size={14} color="#0284C7" />
              <span>PostgreSQL Cloud</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <MessageSquare size={14} color="#10B981" />
              <span>WhatsApp Daemon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
