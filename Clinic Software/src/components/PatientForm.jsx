import { useState } from "react";
import { S } from "../styles/styles";

export default function PatientForm({ patient, onSave, onClose }) {
  const [form, setForm] = useState(patient || {
    name: "", surname: "", age: "", gender: "Male", contact: "",
    email: "", address: "", bloodGroup: "", allergy: "", ongoingMedicines: "", kco: ""
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.name || !form.contact) return alert("Name and contact are required");
    onSave(form);
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 720 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{patient ? "Edit Patient" : "Add New Patient"}</div>

        <div style={S.grid2}>
          <div><label style={S.label}>First Name *</label><input style={S.input} value={form.name} onChange={set("name")} placeholder="First name" /></div>
          <div><label style={S.label}>Surname</label><input style={S.input} value={form.surname || ""} onChange={set("surname")} placeholder="Surname / Last name" /></div>
          <div><label style={S.label}>Age</label><input style={S.input} type="number" value={form.age} onChange={set("age")} placeholder="Age in years" /></div>
          <div>
            <label style={S.label}>Gender</label>
            <select style={S.input} value={form.gender} onChange={set("gender")}>
              {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div><label style={S.label}>Contact *</label><input style={S.input} value={form.contact} onChange={set("contact")} placeholder="Mobile number" /></div>
          <div><label style={S.label}>Email</label><input style={S.input} value={form.email} onChange={set("email")} placeholder="Email address" /></div>
          <div>
            <label style={S.label}>Blood Group</label>
            <select style={S.input} value={form.bloodGroup} onChange={set("bloodGroup")}>
              <option value="">Select</option>
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div><label style={S.label}>Address</label><input style={S.input} value={form.address} onChange={set("address")} placeholder="Full address" /></div>
        </div>

        <div style={{ marginTop: 16, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 12 }}>Medical History</div>
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Known Case Of (K/C/O)</label>
              <input style={S.input} value={form.kco || ""} onChange={set("kco")} placeholder="e.g. Diabetes, Hypertension" />
            </div>
            <div>
              <label style={S.label}>Allergy to Medicines</label>
              <input style={S.input} value={form.allergy || ""} onChange={set("allergy")} placeholder="e.g. Penicillin, Aspirin" />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={S.label}>Ongoing Medicines</label>
            <textarea style={{ ...S.input, height: 60, resize: "vertical" }} value={form.ongoingMedicines || ""} onChange={set("ongoingMedicines")} placeholder="List current medicines patient is taking..." />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save}>{patient ? "Save Changes" : "Add Patient"}</button>
        </div>
      </div>
    </div>
  );
}
