import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";

export default function Billing({ patients }) {
  const allBills = patients.flatMap(p =>
    p.visits.filter(v => v.fee).map(v => ({
      patientName: p.name, patientId: p.id, visitId: v.id, date: v.date,
      diagnosis: v.diagnosis, fee: Number(v.fee)
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = allBills.reduce((s, b) => s + b.fee, 0);
  const thisMonth = allBills.filter(b => b.date.startsWith(today().slice(0, 7))).reduce((s, b) => s + b.fee, 0);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Billing</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={S.statCard}><div style={{ fontSize: 13, color: "#6b7280" }}>Total Revenue</div><div style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>₹{total.toLocaleString("en-IN")}</div></div>
        <div style={S.statCard}><div style={{ fontSize: 13, color: "#6b7280" }}>This Month</div><div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>₹{thisMonth.toLocaleString("en-IN")}</div></div>
        <div style={S.statCard}><div style={{ fontSize: 13, color: "#6b7280" }}>Total Invoices</div><div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e" }}>{allBills.length}</div></div>
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>{["Date","Patient","Diagnosis","Amount"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {allBills.map(b => (
              <tr key={b.visitId}>
                <td style={S.td}>{fmtDate(b.date)}</td>
                <td style={S.td}><div style={{ fontWeight: 600 }}>{b.patientName}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{b.patientId}</div></td>
                <td style={S.td}>{b.diagnosis || "—"}</td>
                <td style={S.td}><span style={{ fontWeight: 700, color: "#059669" }}>₹{Number(b.fee).toLocaleString("en-IN")}</span></td>
              </tr>
            ))}
            {allBills.length === 0 && <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", color: "#9ca3af", padding: 40 }}>No billing records yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
