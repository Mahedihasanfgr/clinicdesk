import { useState } from "react";
import { S } from "../styles/styles";
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
  ShieldCheck
} from "lucide-react";

export default function Register({ onBack }) {
  const [form, setForm] = useState({
    clinicName: "",
    clinicCode: "",
    doctorName: "",
    email: "",
    doctorPassword: "",
    receptionPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const set = k => e => {
    setErr("");
    const val = k === "clinicCode"
      ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
      : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
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
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(11, 19, 43, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)",
          backdropFilter: "blur(4px)",
        }} />

        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 480,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(24px)",
          borderRadius: 24,
          padding: "44px 36px",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5)",
          textAlign: "center",
        }} className="animate-fade">
          
          <div style={{
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
          }}>
            <CheckCircle2 size={38} strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.02em" }}>
            Clinic Registered Successfully!
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 26, lineHeight: 1.5 }}>
            Your centralized clinical database and staff accounts have been provisioned.
          </p>

          <div style={{
            background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
            border: "1.5px dashed #34D399",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 24,
            position: "relative",
          }}>
            <div style={{ fontSize: 11.5, color: "#047857", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Your Unique Clinic Login Code
            </div>
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#065F46",
              letterSpacing: "0.08em",
              fontFamily: "monospace",
              marginBottom: 8,
            }}>
              {success}
            </div>
            <button
              onClick={copyCode}
              style={{
                ...S.btn,
                background: copied ? "#059669" : "#FFFFFF",
                color: copied ? "#FFFFFF" : "#065F46",
                border: "1px solid #A7F3D0",
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 20,
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

          <p style={{ fontSize: 13.5, color: "#475569", marginBottom: 28, lineHeight: 1.5 }}>
            Log in using clinic code <strong>{success}</strong> with your registered doctor credentials.
          </p>

          <button
            style={{
              ...S.btn,
              ...S.btnPrimary,
              width: "100%",
              padding: "13px",
              fontSize: 15,
              borderRadius: 12,
            }}
            className="btn-interactive"
            onClick={onBack}
          >
            <span>Proceed to Login</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Registration Form View
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      backgroundImage: `url(${loginBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(11, 19, 43, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)",
        backdropFilter: "blur(4px)",
      }} />

      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 580,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(24px)",
        borderRadius: 24,
        padding: "38px 36px",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
      }} className="animate-fade">

        {/* Back navigation */}
        <button
          onClick={onBack}
          style={{
            ...S.btn,
            ...S.btnGhost,
            padding: "6px 12px",
            fontSize: 13,
            marginBottom: 16,
            color: "#64748B",
          }}
          className="btn-interactive"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
            }}>
              <Stethoscope size={20} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Register Medical Practice
            </h1>
          </div>
          <p style={{ fontSize: 13.5, color: "#64748B" }}>
            Set up your clinical workspace, doctor profile, and automated database.
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
          {/* Clinic Name & Code Grid */}
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Clinic / Hospital Name *</label>
              <div style={{ position: "relative" }}>
                <Building2 size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  style={{ ...S.input, paddingLeft: 36 }}
                  placeholder="e.g. Apex Health Clinic"
                  value={form.clinicName}
                  onChange={set("clinicName")}
                  required
                />
              </div>
            </div>

            <div>
              <label style={S.label}>Clinic Code (Username prefix) *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontWeight: 700, fontSize: 13 }}>#</span>
                <input
                  style={{ ...S.input, paddingLeft: 32, fontFamily: "monospace", fontWeight: 600 }}
                  placeholder="e.g. apex"
                  value={form.clinicCode}
                  onChange={set("clinicCode")}
                  required
                />
              </div>
            </div>
          </div>

          {/* Doctor Name & Email */}
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Lead Doctor Name *</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  style={{ ...S.input, paddingLeft: 36 }}
                  placeholder="e.g. Dr. Aryan Patel"
                  value={form.doctorName}
                  onChange={set("doctorName")}
                  required
                />
              </div>
            </div>

            <div>
              <label style={S.label}>Official Doctor Email *</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="email"
                  style={{ ...S.input, paddingLeft: 36 }}
                  placeholder="doctor@apexclinic.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
            </div>
          </div>

          {/* Doctor Password & Optional Reception Password */}
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Doctor Account Password *</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="password"
                  style={{ ...S.input, paddingLeft: 36 }}
                  placeholder="At least 6 characters"
                  value={form.doctorPassword}
                  onChange={set("doctorPassword")}
                  required
                />
              </div>
            </div>

            <div>
              <label style={S.label}>Reception Password (Optional)</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="password"
                  style={{ ...S.input, paddingLeft: 36 }}
                  placeholder="Leave blank for same"
                  value={form.receptionPassword}
                  onChange={set("receptionPassword")}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
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
              marginTop: 10,
              opacity: loading ? 0.75 : 1,
            }}
            className="btn-interactive"
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
                <span>Creating Clinical Workspace...</span>
              </>
            ) : (
              <>
                <span>Complete Clinic Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: 20,
          textAlign: "center",
          fontSize: 12.5,
          color: "#64748B",
        }}>
          Already registered?{" "}
          <span
            onClick={onBack}
            style={{ color: "#0D9488", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
          >
            Sign In here
          </span>
        </div>

      </div>
    </div>
  );
}
