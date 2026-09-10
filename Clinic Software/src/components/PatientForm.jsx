import { useState } from "react";
import { tokens } from "../styles/tokens";
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
  AlertCircle,
} from "lucide-react";
import { Button, Input, Select, Modal } from "./common";

export default function PatientForm({ patient, onSave, onClose }) {
  const [form, setForm] = useState(
    patient || {
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
    }
  );

  const [err, setErr] = useState("");

  const set = (k) => (e) => {
    setErr("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const save = (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setErr("Patient full name and contact mobile number are required.");
      return;
    }
    onSave(form);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={patient ? "Edit Patient Information" : "Register New Patient"}
      subtitle="Enter demographics and clinical background for OPD documentation"
      icon={patient ? Edit3 : UserPlus}
      maxWidth={760}
    >

        {/* Error Alert */}
        {err && (
          <div
            style={{
              background: tokens.colors.semantic.danger.bg,
              border: `1px solid ${tokens.colors.semantic.danger.border}`,
              color: tokens.colors.semantic.danger.text,
              padding: "12px 16px",
              borderRadius: tokens.radii.md,
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            className="animate-fade"
          >
            <AlertCircle size={18} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Section 1: Demographics */}
          <div
            style={{
              background: tokens.colors.slate[50],
              borderRadius: tokens.radii.xl,
              border: `1px solid ${tokens.colors.slate[200]}`,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: tokens.colors.primary[700],
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <User size={16} />
              <span>1. Personal Demographics</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input
                label="First Name *"
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Rahul"
                required
              />
              <Input
                label="Last Name / Surname"
                value={form.surname || ""}
                onChange={set("surname")}
                placeholder="e.g. Sharma"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 14 }}>
              <Input
                label="Age (Years)"
                type="number"
                value={form.age}
                onChange={set("age")}
                placeholder="e.g. 34"
              />
              <Select
                label="Gender"
                value={form.gender}
                onChange={set("gender")}
                options={["Male", "Female", "Other"]}
              />
              <Select
                label="Blood Group"
                value={form.bloodGroup}
                onChange={set("bloodGroup")}
                options={[
                  { value: "", label: "Select Blood Group" },
                  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
                ]}
              />
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div
            style={{
              background: tokens.colors.slate[50],
              borderRadius: tokens.radii.xl,
              border: `1px solid ${tokens.colors.slate[200]}`,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: tokens.colors.primary[700],
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Phone size={16} />
              <span>2. Contact Details & Address</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input
                label="Contact Mobile * (For WhatsApp PDF)"
                icon={Phone}
                value={form.contact}
                onChange={set("contact")}
                placeholder="10-digit phone number"
                required
              />
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="patient@example.com"
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <Input
                label="Residential Address"
                icon={MapPin}
                value={form.address}
                onChange={set("address")}
                placeholder="Street address, City, State, Postal Code"
              />
            </div>
          </div>

          {/* Section 3: Clinical Background & Allergies */}
          <div
            style={{
              background: tokens.colors.slate[50],
              borderRadius: tokens.radii.xl,
              border: `1px solid ${tokens.colors.slate[200]}`,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: tokens.colors.primary[700],
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Activity size={16} />
              <span>3. Clinical History & Medical Alerts</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: tokens.colors.slate[700], marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={15} color="#D97706" /> Known Drug & Environmental Allergies
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: tokens.radii.md,
                    border: "1px solid #FCD34D",
                    background: "#FFFBEB",
                    fontSize: 13.5,
                    color: "#92400E",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  value={form.allergy}
                  onChange={set("allergy")}
                  placeholder="e.g. Penicillin, Sulfa drugs, Peanuts (or leave empty if None)"
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: tokens.colors.slate[700], marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Pill size={15} color="#0D9488" /> Ongoing Regular Medications
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: tokens.radii.md,
                    border: `1px solid ${tokens.colors.slate[300]}`,
                    background: "#FFFFFF",
                    fontSize: 13.5,
                    color: tokens.colors.slate[900],
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  value={form.ongoingMedicines}
                  onChange={set("ongoingMedicines")}
                  placeholder="e.g. Metformin 500mg OD, Telmisartan 40mg OD"
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: tokens.colors.slate[700], marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Activity size={15} color="#0284C7" /> Known Medical Conditions (K/C/O)
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: tokens.radii.md,
                    border: `1px solid ${tokens.colors.slate[300]}`,
                    background: "#FFFFFF",
                    fontSize: 13.5,
                    color: tokens.colors.slate[900],
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  value={form.kco}
                  onChange={set("kco")}
                  placeholder="e.g. Type 2 Diabetes (5 yrs), Hypertension, Asthma"
                />
              </div>
            </div>
          </div>

          {/* Form Sticky Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              paddingTop: 16,
              borderTop: `1px solid ${tokens.colors.slate[200]}`,
            }}
          >
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save}>
              {patient ? "Update Patient Profile" : "Save Patient Profile"}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
