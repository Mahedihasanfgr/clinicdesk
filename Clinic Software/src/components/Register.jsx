import { useState } from "react";
import { tokens } from "../styles/tokens";
import { apiRegisterClinic } from "../api";
import loginBg from "../assets/medical_login_bg.jpg";
import {
  Stethoscope,
  Building2,
  User,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Phone,
  MapPin,
  Award,
} from "lucide-react";

export default function Register({ onBack }) {
  const [form, setForm] = useState({
    clinicName: "",
    clinicCode: "",
    doctorName: "",
    doctorDegree: "",
    phone: "",
    address: "",
    email: "",
    doctorPassword: "",
    receptionPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const set = (k) => (e) => {
    setErr("");
    const val =
      k === "clinicCode"
        ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
        : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const copyCode = () => {
    if (!success) return;
    navigator.clipboard.writeText(success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const submit = async (e) => {
    if (e) e.preventDefault();
    const { clinicName, clinicCode, doctorName, email, doctorPassword } = form;
    if (!clinicName || !clinicCode || !doctorName || !email || !doctorPassword) {
      return setErr("Please fill in all required fields (Clinic details, Doctor name, Email, Password)");
    }
    if (clinicCode.length < 3) return setErr("Clinic code must be at least 3 characters");
    setLoading(true);
    const res = await apiRegisterClinic(form);
    setLoading(false);
    if (res.success) {
      setSuccess(res.clinicCode);
    } else {
      setErr(res.error || "Registration failed. Please check your details.");
    }
  };

  // Success Confirmation View
  if (success) {
    return (
      <div
        style={{
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
          fontFamily: tokens.typography.fontFamily,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(11, 19, 43, 0.88) 0%, rgba(15, 23, 42, 0.94) 100%)",
            backdropFilter: "blur(4px)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 480,
            background: "#FFFFFF",
            borderRadius: tokens.radii.xxl,
            padding: "44px 36px",
            boxShadow: tokens.shadows.xl,
            textAlign: "center",
          }}
          className="animate-fade"
        >
          <div
            style={{
              width: 72,
              height: 72,
              background: "#ECFDF5",
              border: "2px solid #A7F3D0",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#059669",
              marginBottom: 20,
              boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)",
            }}
          >
            <CheckCircle2 size={38} strokeWidth={2.5} />
          </div>

          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: tokens.colors.slate[900],
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Clinic Registered Successfully!
          </h2>
          <p style={{ fontSize: 14, color: tokens.colors.slate[500], marginBottom: 26, lineHeight: 1.5 }}>
            Your clinical workspace and doctor credentials are fully configured and ready to use.
          </p>

          <div
            style={{
              background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
              border: "1.5px dashed #34D399",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                color: "#047857",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              Your Unique Clinic Code
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#065F46",
                letterSpacing: "0.08em",
                fontFamily: tokens.typography.monoFont,
                marginBottom: 8,
              }}
            >
              {success}
            </div>
            <button
              onClick={copyCode}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: copied ? "#059669" : "#FFFFFF",
                color: copied ? "#FFFFFF" : "#065F46",
                border: "1px solid #A7F3D0",
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: tokens.radii.full,
                cursor: "pointer",
              }}
              className="btn-interactive"
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Code
                </>
              )}
            </button>
          </div>

          <p style={{ fontSize: 13.5, color: tokens.colors.slate[600], marginBottom: 28, lineHeight: 1.5 }}>
            Use clinic code <strong style={{ color: tokens.colors.slate[900] }}>{success}</strong> to sign in.
          </p>

          <button
            style={{
              width: "100%",
              padding: "13px",
              fontSize: 15,
              borderRadius: tokens.radii.md,
              background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
              color: "#FFFFFF",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: tokens.shadows.primaryGlow,
            }}
            className="btn-interactive"
            onClick={onBack}
          >
            <span>Proceed to Sign In</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Registration Form View (Split Screen)
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
      {/* Left Media Panel */}
      <div
        style={{
          flex: 0.9,
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(11, 19, 43, 0.9) 0%, rgba(15, 118, 110, 0.8) 50%, rgba(15, 23, 42, 0.94) 100%)",
            backdropFilter: "blur(2px)",
          }}
        />

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
              Onboard Your Clinic in Under 2 Minutes
            </p>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 10, maxWidth: 480, margin: "auto 0" }}>
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
            }}
          >
            <Sparkles size={14} />
            <span>Instant Cloud Provisioning</span>
          </div>

          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            Equip Your Practice with Modern Clinical Tools
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "rgba(226, 232, 240, 0.85)",
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            One centralized account manages doctor prescriptions, reception queues, WhatsApp automations, and billing records seamlessly.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Instant setup with zero complex configuration or installation",
              "Unlimited patient records and prescription templates",
              "WhatsApp gateway ready for mobile PDF alerts",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "#E2E8F0", fontSize: 13.5 }}>
                <CheckCircle2 size={16} color="#34D399" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 10, fontSize: 12, color: "rgba(226, 232, 240, 0.7)" }}>
          HIPAA & ISO 27001 standard data encryption across all clinical records.
        </div>
      </div>

      {/* Right Form Surface */}
      <div
        style={{
          flex: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          background: "#FFFFFF",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }} className="animate-fade">
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: tokens.colors.slate[500],
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 24,
              padding: 0,
            }}
            className="btn-interactive"
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </button>

          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: tokens.colors.slate[900],
                letterSpacing: "-0.025em",
                marginBottom: 6,
              }}
            >
              Register Your Clinic
            </h2>
            <p style={{ fontSize: 13.5, color: tokens.colors.slate[500] }}>
              Set up your practice workspace, doctor profile, and secure login code.
            </p>
          </div>

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

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Section 1: Clinic Identity */}
            <div
              style={{
                background: tokens.colors.slate[50],
                borderRadius: tokens.radii.lg,
                padding: "16px 18px",
                border: `1px solid ${tokens.colors.slate[200]}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tokens.colors.primary[700],
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 12,
                }}
              >
                1. Clinic Identity
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dignity Healthcare"
                    value={form.clinicName}
                    onChange={set("clinicName")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Clinic Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. dgt, apollo"
                    value={form.clinicCode}
                    onChange={set("clinicCode")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                      fontFamily: tokens.typography.monoFont,
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Doctor Profile */}
            <div
              style={{
                background: tokens.colors.slate[50],
                borderRadius: tokens.radii.lg,
                padding: "16px 18px",
                border: `1px solid ${tokens.colors.slate[200]}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tokens.colors.primary[700],
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 12,
                }}
              >
                2. Doctor & Admin Details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Manjur Ahmed"
                    value={form.doctorName}
                    onChange={set("doctorName")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Doctor Degree / Speciality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD (General Medicine)"
                    value={form.doctorDegree}
                    onChange={set("doctorDegree")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Clinic Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={form.phone}
                    onChange={set("phone")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. doctor@clinic.com"
                    value={form.email}
                    onChange={set("email")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Passwords */}
            <div
              style={{
                background: tokens.colors.slate[50],
                borderRadius: tokens.radii.lg,
                padding: "16px 18px",
                border: `1px solid ${tokens.colors.slate[200]}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tokens.colors.primary[700],
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 12,
                }}
              >
                3. Security Passwords
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Doctor Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.doctorPassword}
                    onChange={set("doctorPassword")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: tokens.colors.slate[700], display: "block", marginBottom: 5 }}>
                    Reception Staff Password
                  </label>
                  <input
                    type="password"
                    placeholder="Optional staff key"
                    value={form.receptionPassword}
                    onChange={set("receptionPassword")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: tokens.radii.md,
                      border: `1px solid ${tokens.colors.slate[300]}`,
                      fontSize: 13.5,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
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
                  <span>Provisioning Clinic Environment...</span>
                </>
              ) : (
                <>
                  <span>Complete Clinic Registration</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
