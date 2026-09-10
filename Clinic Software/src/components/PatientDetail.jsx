import { useState } from "react";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import PatientForm from "./PatientForm";
import VisitForm from "./VisitForm";
import PrintPrescription from "./PrintPrescription";

export default function PatientDetail({ patient, templates, user, onBack, onAddVisit, onUpdatePatient, asModal = false, openVisitForm = false, onVisitSaved }) {
  const [printVisit, setPrintVisit] = useState(null);
  const [editPt, setEditPt] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(openVisitForm);
  const sortedVisits = [...patient.visits].sort((a, b) => new Date(b.date) - new Date(a.date));

  const content = (
    <div>
      {printVisit && <PrintPrescription patient={patient} visit={printVisit} onClose={() => setPrintVisit(null)} />}
      {showVisitForm && (
        <VisitForm patient={patient} lastVisit={sortedVisits[0]} templates={templates} userRole={user.role}
          onSave={async v => { await onAddVisit(v); if (onVisitSaved) onVisitSaved(); setShowVisitForm(false); }}
          onClose={() => setShowVisitForm(false)} />
      )}
      {editPt && (
        <PatientForm patient={{ ...patient, bloodGroup: patient.bloodGroup || patient.blood_group, ongoingMedicines: patient.ongoing_medicines || patient.ongoingMedicines }}
          onSave={data => { onUpdatePatient(data); setEditPt(false); }}
          onClose={() => setEditPt(false)} />
      )}

      {!asModal && (
        <button style={{ ...S.btn, ...S.btnSecondary, marginBottom: 20 }} onClick={onBack}>← Back to Patients</button>
      )}

      {/* Patient Header */}
      <div style={{ ...S.card, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>
            {patient.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{patient.name} {patient.surname || ""}</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>
              {patient.id} &nbsp;|&nbsp; {patient.age}Y &nbsp;|&nbsp; {patient.gender} &nbsp;|&nbsp; {patient.bloodGroup || patient.blood_group || "—"}
            </div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>📞 {patient.contact} &nbsp;|&nbsp; ✉ {patient.email || "—"}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>📍 {patient.address || "—"}</div>
            {patient.kco && <div style={{ fontSize: 13, marginTop: 6, color: "#1d4ed8", fontWeight: 500 }}>K/C/O: {patient.kco}</div>}
            {patient.allergy && <div style={{ fontSize: 13, marginTop: 2, color: "#c2410c", fontWeight: 500 }}>⚠️ Allergy: {patient.allergy}</div>}
            {(patient.ongoing_medicines || patient.ongoingMedicines) && (
              <div style={{ fontSize: 13, marginTop: 2, color: "#15803d", fontWeight: 500 }}>
                Ongoing: {patient.ongoing_medicines || patient.ongoingMedicines}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 13 }} onClick={() => setEditPt(true)}>✏ Edit</button>
          {user.role === "doctor" && (
            <button style={{ ...S.btn, ...S.btnPrimary, fontSize: 13 }} onClick={() => setShowVisitForm(true)}>+ New Visit</button>
          )}
        </div>
      </div>

      {/* Visit History */}
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Visit History ({patient.visits.length})</div>
      {sortedVisits.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", color: "#9ca3af", padding: 40 }}>No visits recorded yet.</div>
      ) : sortedVisits.map((visit, idx) => (
        <div key={visit.id} style={{ ...S.card, borderLeft: idx === 0 ? "4px solid #1a1a2e" : "4px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{fmtDate(visit.date)}</div>
              {idx === 0 && <span style={{ ...S.badge("blue"), fontSize: 11, marginTop: 4, display: "inline-block" }}>Latest Visit</span>}
            </div>
            <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={() => setPrintVisit(visit)}>🖨 Print Rx</button>
          </div>

          {/* Chief Complaint */}
          {visit.chief_complaint && (
            <div style={{ marginBottom: 12, padding: "8px 14px", background: "#f0f9ff", borderRadius: 8, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>Chief Complaint: </span>{visit.chief_complaint}
            </div>
          )}

          {/* Vitals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, background: "#f9fafb", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
            {[["BP", visit.vitals?.bp],["Sugar", visit.vitals?.sugar],["Temp", visit.vitals?.temp],["Weight", visit.vitals?.weight],["Pulse", visit.vitals?.pulse]].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: v ? "#1a1a2e" : "#d1d5db" }}>{v || "—"}</div>
              </div>
            ))}
          </div>

          <div style={S.grid2}>
            <div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>SYMPTOMS</div>
              <div style={{ fontSize: 14 }}>{visit.symptoms || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>DIAGNOSIS</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{visit.diagnosis || "—"}</div>
            </div>
          </div>
          {visit.notes && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>NOTES</div>
              <div style={{ fontSize: 14, color: "#555" }}>{visit.notes}</div>
            </div>
          )}

          {/* Prescription */}
          {visit.prescription?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>PRESCRIPTION ({visit.prescription.length} medicines)</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr", gap: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>
                {["Medicine","Dosage","Times/Day","Days","Instructions"].map(h => <div key={h}>{h}</div>)}
              </div>
              {visit.prescription.map((rx, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr", gap: 8, padding: "8px 12px", background: i % 2 === 0 ? "#f0f9ff" : "#f9fafb", borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{rx.medicine}</div>
                  <div style={{ color: "#374151" }}>{rx.dosage || "—"}</div>
                  <div style={{ color: "#374151" }}>{rx.times_per_day ? `${rx.times_per_day}x` : rx.duration || "—"}</div>
                  <div style={{ color: "#374151" }}>{rx.days ? `${rx.days} days` : "—"}</div>
                  <div style={{ color: "#6b7280" }}>{rx.instructions || "—"}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Visit ID: {visit.id}</div>
            {visit.fee && <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>₹{visit.fee}</div>}
          </div>
        </div>
      ))}
    </div>
  );

  if (asModal) {
    return (
      <div style={{ ...S.modal, alignItems: "flex-start" }} onClick={e => e.target === e.currentTarget && onBack()}>
        <div style={{ ...S.modalBox, maxWidth: 860, marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Patient Profile</div>
            <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 13 }} onClick={onBack}>✕ Close</button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
