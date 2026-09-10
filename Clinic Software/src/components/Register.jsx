import { useState } from "react";
import { S } from "../styles/styles";
import { apiRegisterClinic } from "../api";

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

  const set = k => e => {
    setErr("");
    const val = k === "clinicCode"
      ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")
      : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
  };

  const submit = async (e) => {
    if (e) e.preventDefault();
    const { clinicName, clinicCode, doctorName, email, doctorPassword } = form;
    if (!clinicName || !clinicCode || !doctorName || !email || !doctorPassword) {
      return setErr("All fields except reception password are required");
    }
    if (clinicCode.length < 3) return setErr("Clinic code must be at least 3 characters");
    setLoading(true);
    const res = await apiRegisterClinic(form);
    setLoading(false);
    if (res.success) {
      setSuccess(res.clinicCode);
    } else {
      setErr(res.error || "Registration failed");
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        background: "radial-gradient(circle at 50% 30%, #0F766E 0%, #0F172A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        boxSizing: "border-box"
      }}>
        <div style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "44px 36px",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
          textAlign: "center",
          margin: "auto"
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
            fontSize: 36,
            marginBottom: 20
          }}>
            🩺
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Clinic Registered!</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Your clinical workspace has been created successfully.</p>
          
          <div style={{
            background: "#F0FDF4",
            border: "1.5px dashed #34D399",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 28
          }}>
            <div style={{ fontSize: 12, color: "#047857", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Your Clinic Login Code
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#059669", letterSpacing: 2 }}>{success}</div>
          </div>

          <p style={{ fontSize: 14, color: "#475569", marginBottom: 28, lineHeight: 1.5 }}>
            Use clinic code <strong>{success}</strong> along with your registered email or username <strong>doctor</strong> to sign in.
          </p>

          <button style={{ ...S.btn, ...S.btnPrimary, width: "100%", padding: "14px", fontSize: 15, borderRadius: 12 }} onClick={onBack}>
            Proceed to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "radial-gradient(circle at 50% 30%, #0F766E 0%, #0F172A 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        margin: "auto"
      }} className="animate-fade">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60,
            height: 60,
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            borderRadius: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 20px rgba(13, 148, 136, 0.3)",
            marginBottom: 14,
            fontSize: 28
          }}>
            🏥
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Register Clinic</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Create a secure, multi-tenant medical workspace</p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={S.label}>Clinic Name *</label>
            <input style={S.input} value={form.clinicName} onChange={set("clinicName")} placeholder="e.g. SRV Wellness Clinic" />
          </div>

          <div>
            <label style={S.label}>
              Clinic Code * <span style={{ fontWeight: 400, color: "#94A3B8" }}>(used at login)</span>
            </label>
            <input style={S.input} value={form.clinicCode} onChange={set("clinicCode")} placeholder="e.g. srv" />
            {form.clinicCode && (
              <div style={{ fontSize: 12, color: "#0D9488", marginTop: 4, fontWeight: 600 }}>
                Portal Code: <code>{form.clinicCode}</code>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={S.label}>Doctor's Full Name *</label>
              <input style={S.input} value={form.doctorName} onChange={set("doctorName")} placeholder="Dr. Akbar" />
            </div>
            <div>
              <label style={S.label}>Email *</label>
              <input style={S.input} type="email" value={form.email} onChange={set("email")} placeholder="akbar@clinic.com" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={S.label}>Doctor Password *</label>
              <input style={S.input} type="password" value={form.doctorPassword} onChange={set("doctorPassword")} placeholder="••••••••" />
            </div>
            <div>
              <label style={S.label}>
                Reception Pass <span style={{ fontWeight: 400, color: "#94A3B8" }}>(optional)</span>
              </label>
              <input style={S.input} type="password" value={form.receptionPassword} onChange={set("receptionPassword")} placeholder="reception123" />
            </div>
          </div>

          {err && (
            <div style={{
              color: "#B91C1C",
              fontSize: 13,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              padding: "10px 14px",
              borderRadius: 10
            }}>
              ⚠️ {err}
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
              marginTop: 12
            }}
            className="btn-interactive"
            disabled={loading}
          >
            {loading ? "Creating Workspace..." : "Create Clinic Workspace →"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 14, color: "#64748B" }}>
          Already registered?{" "}
          <button
            type="button"
            style={{ background: "none", border: "none", color: "#0D9488", fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0 }}
            onClick={onBack}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
