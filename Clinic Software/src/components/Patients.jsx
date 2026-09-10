import { useState, useEffect } from "react";
import { S } from "../styles/styles";
import { fmtDate } from "../utils/helpers";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";

export default function Patients({ patients, addPatient, updatePatient, addVisit, templates, user, initialSelected, clearSelected }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialSelected || null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { if (initialSelected) { setSelected(initialSelected); clearSelected(); } }, [initialSelected]);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.includes(search)
  );

  if (selected) {
    const live = patients.find(p => p.id === selected.id) || selected;
    return <PatientDetail patient={live} templates={templates} user={user}
      onBack={() => setSelected(null)}
      onAddVisit={v => addVisit(live, v)}
      onUpdatePatient={data => updatePatient(live, data)} />;
  }

  return (
    <div>
      {showAdd && <PatientForm onSave={async data => { await addPatient(data); setShowAdd(false); }} onClose={() => setShowAdd(false)} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Patients ({patients.length})</div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowAdd(true)}>+ Add Patient</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input style={{ ...S.input, maxWidth: 380 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, ID or phone..." />
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>
            {["ID","Patient","Age/Gender","Contact","Last Visit","Visits",""].map(h => <th key={h} style={S.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(p => {
              const last = [...p.visits].sort((a,b) => new Date(b.date) - new Date(a.date))[0];
              return (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelected(p)}>
                  <td style={S.td}><span style={S.badge("blue")}>{p.id}</span></td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.bloodGroup || p.blood_group}</div>
                  </td>
                  <td style={S.td}>{p.age}Y / {p.gender}</td>
                  <td style={S.td}>{p.contact}</td>
                  <td style={S.td}>{last ? fmtDate(last.date) : <span style={{ color: "#d1d5db" }}>No visits</span>}</td>
                  <td style={S.td}><span style={S.badge("green")}>{p.visits.length}</span></td>
                  <td style={S.td}><button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }} onClick={e => { e.stopPropagation(); setSelected(p); }}>View →</button></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#9ca3af", padding: 40 }}>No patients found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
