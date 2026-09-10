import { useState } from "react";
import { S } from "../styles/styles";
import {
  UserPlus,
  Edit3,
  X,
  Phone,
  Mail,
  MapPin,
  Activity,
  AlertTriangle,
  Pill,
  Save,
  User,
  AlertCircle
} from "lucide-react";

export default function PatientForm({ patient, onSave, onClose }) {
  const [form, setForm] = useState(patient || {
    name: "",
    surname: "",
    age: "",
    gender: "Male",
    contact: "",
    email: "",
    address: "",
    bloodGroup: "",
    allergy: "",
    ongoingMedicines: "",
    kco: "",
  });

  const [err, setErr] = useState("");

  const set = k => e => {
    setErr("");
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const save = (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setErr("Patient full name and contact number are required.");
      return;
    }
    onSave(form);
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 740 }} className="animate-fade">
        {/* Modal Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "1px solid #E2E8F0",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
            }}>
              {patient ? <Edit3 size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                {patient ? "Edit Patient Information" : "Register New Patient"}
              </h2>
              <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                Enter demographics and clinical background for OPD documentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              cursor: "pointer",
            }}
            className="btn-interactive"
          >
            <X size={16} />
          </button>
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
            <AlertCircle size={18} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={save}>
          {/* Section 1: Demographics */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "#0F766E",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <User size={15} /> Personal & Contact Details
            </div>

            <div style={S.grid2}>
              <div>
                <label style={S.label}>First Name *</label>
                <input
                  style={S.input}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Patient's first name"
                  required
                />
              </div>

              <div>
                <label style={S.label}>Surname / Last Name</label>
                <input
                  style={S.input}
                  value={form.surname || ""}
                  onChange={set("surname")}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div style={{ ...S.grid3, marginTop: 14 }}>
              <div>
                <label style={S.label}>Age (Years)</label>
                <input
                  style={S.input}
                  type="number"
                  value={form.age}
                  onChange={set("age")}
                  placeholder="e.g. 32"
                />
              </div>

              <div>
                <label style={S.label}>Gender</label>
                <select style={S.input} value={form.gender} onChange={set("gender")}>
                  {["Male", "Female", "Other"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label style={S.label}>Blood Group</label>
                <select style={S.input} value={form.bloodGroup} onChange={set("bloodGroup")}>
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div style={{ ...S.grid2, marginTop: 14 }}>
              <div>
                <label style={S.label}>Contact Phone *</label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    style={{ ...S.input, paddingLeft: 36 }}
                    value={form.contact}
                    onChange={set("contact")}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={S.label}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="email"
                    style={{ ...S.input, paddingLeft: 36 }}
                    value={form.email}
                    onChange={set("email")}
                    placeholder="patient@example.com"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={S.label}>Residential Address</label>
              <div style={{ position: "relative" }}>
                <MapPin size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  style={{ ...S.input, paddingLeft: 36 }}
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Street, City, Pin Code"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Background & Medical Alerts */}
          <div style={{
            background: "#F8FAFC",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            padding: "16px 20px",
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "#0F766E",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <Activity size={15} /> Clinical Medical History & Allergies
            </div>

            <div style={S.grid2}>
              <div>
                <label style={S.label}>Known Conditions (K/C/O)</label>
                <input
                  style={S.input}
                  value={form.kco || ""}
                  onChange={set("kco")}
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                />
              </div>

              <div>
                <label style={{ ...S.label, color: "#B91C1C", display: "flex", alignItems: "center", gap: 5 }}>
                  <AlertTriangle size={14} /> Drug Allergies
                </label>
                <input
                  style={{ ...S.input, borderColor: form.allergy ? "#FCA5A5" : "#CBD5E1", background: form.allergy ? "#FFF5F5" : "#FFFFFF" }}
                  value={form.allergy || ""}
                  onChange={set("allergy")}
                  placeholder="e.g. Penicillin, Sulfa, NSAIDs"
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={S.label}>Current Ongoing Medications</label>
              <textarea
                style={{ ...S.input, height: 64, resize: "vertical" }}
                value={form.ongoingMedicines || ""}
                onChange={set("ongoingMedicines")}
                placeholder="e.g. Tab Metformin 500mg (1-0-1), Tab Telmisartan 40mg (1-0-0)"
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              style={{ ...S.btn, ...S.btnSecondary, padding: "10px 18px" }}
              onClick={onClose}
              className="btn-interactive"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...S.btn,
                ...S.btnPrimary,
                padding: "10px 22px",
                borderRadius: 10,
              }}
              className="btn-interactive"
            >
              <Save size={16} />
              <span>{patient ? "Save Patient Record" : "Register Patient"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
