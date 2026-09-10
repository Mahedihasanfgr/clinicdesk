import { S } from "../styles/styles";
import { today, fmtDate } from "../utils/helpers";
import {
  Receipt,
  TrendingUp,
  Calendar,
  CreditCard,
  FileCheck,
  DollarSign,
  User,
  Clock
} from "lucide-react";

export default function Billing({ patients }) {
  const allBills = (patients || []).flatMap(p =>
    (p.visits || []).filter(v => v.fee).map(v => ({
      patientName: p.name,
      patientId: p.id,
      visitId: v.id,
      date: v.date,
      diagnosis: v.diagnosis,
      fee: Number(v.fee)
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = allBills.reduce((s, b) => s + b.fee, 0);
  const thisMonthStr = today().slice(0, 7);
  const thisMonth = allBills.filter(b => (b.date || "").startsWith(thisMonthStr)).reduce((s, b) => s + b.fee, 0);
  const avgFee = allBills.length > 0 ? Math.round(total / allBills.length) : 0;

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header Banner */}
      <div style={{
        ...S.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            boxShadow: "0 4px 14px rgba(5, 150, 105, 0.3)",
          }}>
            <Receipt size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                Practice Revenue & Billing
              </h1>
              <span style={S.badge("green")}>
                {allBills.length} Invoices
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
              Consultation charges, OPD fee receipts, and practice revenue summaries
            </p>
          </div>
        </div>
      </div>

      {/* 3 Revenue Metric Cards */}
      <div style={S.grid3}>
        <div style={S.statCard} className="card-hover">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>Total OPD Revenue</span>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
              <Receipt size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#059669", letterSpacing: "-0.03em" }}>
              ₹{total.toLocaleString("en-IN")}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 6, background: "#ECFDF5", padding: "3px 8px", borderRadius: 6 }}>
              <TrendingUp size={13} />
              <span>All-time consultations</span>
            </div>
          </div>
        </div>

        <div style={S.statCard} className="card-hover">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>This Month's Collections</span>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F0FDFA", border: "1px solid #99F6E4", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D9488" }}>
              <Calendar size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>
              ₹{thisMonth.toLocaleString("en-IN")}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#0D9488", fontWeight: 600, marginTop: 6, background: "#F0FDFA", padding: "3px 8px", borderRadius: 6 }}>
              <Clock size={13} />
              <span>Current billing cycle</span>
            </div>
          </div>
        </div>

        <div style={S.statCard} className="card-hover">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>Avg Consultation Fee</span>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F9FF", border: "1px solid #BAE6FD", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284C7" }}>
              <CreditCard size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>
              ₹{avgFee.toLocaleString("en-IN")}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#0284C7", fontWeight: 600, marginTop: 6, background: "#F0F9FF", padding: "3px 8px", borderRadius: 6 }}>
              <FileCheck size={13} />
              <span>Per documented visit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Consultation Date</th>
              <th style={S.th}>Patient Profile</th>
              <th style={S.th}>Provisional Diagnosis</th>
              <th style={{ ...S.th, textAlign: "right" }}>Fee Charged</th>
            </tr>
          </thead>
          <tbody>
            {allBills.map(b => (
              <tr key={b.visitId} className="table-row-hover">
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0F172A", fontWeight: 600 }}>
                    <Calendar size={13} color="#64748B" />
                    <span>{fmtDate(b.date)}</span>
                  </div>
                </td>
                <td style={S.td}>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{b.patientName}</div>
                  <div style={{ fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>#{b.patientId}</div>
                </td>
                <td style={S.td}>
                  <span style={{ color: "#334155" }}>{b.diagnosis || "General Consultation"}</span>
                </td>
                <td style={{ ...S.td, textAlign: "right" }}>
                  <span style={{
                    fontWeight: 800,
                    fontSize: 14.5,
                    color: "#059669",
                    background: "#ECFDF5",
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: "1px solid #A7F3D0",
                  }}>
                    ₹{Number(b.fee).toLocaleString("en-IN")}
                  </span>
                </td>
              </tr>
            ))}

            {allBills.length === 0 && (
              <tr>
                <td colSpan={4} style={{ ...S.td, textAlign: "center", padding: "48px 16px", color: "#64748B" }}>
                  <Receipt size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
                    No Billing Records Found
                  </div>
                  <p style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 4 }}>
                    Fees documented during patient consultations will automatically appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
