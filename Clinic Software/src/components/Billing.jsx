import { tokens } from "../styles/tokens";
import { today, fmtDate } from "../utils/helpers";
import { PageHeader, StatCard, Badge, EmptyState } from "./common";
import {
  Receipt,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export default function Billing({ patients }) {
  const allBills = (patients || [])
    .flatMap((p) =>
      (p.visits || [])
        .filter((v) => v.fee)
        .map((v) => ({
          patientName: p.name,
          patientId: p.id,
          visitId: v.id,
          date: v.date,
          diagnosis: v.diagnosis,
          fee: Number(v.fee),
        }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = allBills.reduce((s, b) => s + b.fee, 0);
  const thisMonthStr = today().slice(0, 7);
  const thisMonth = allBills
    .filter((b) => (b.date || "").startsWith(thisMonthStr))
    .reduce((s, b) => s + b.fee, 0);
  const avgFee = allBills.length > 0 ? Math.round(total / allBills.length) : 0;

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Header */}
      <PageHeader
        icon={Receipt}
        iconColor="#059669"
        iconBg="linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)"
        title="Practice Revenue & Invoicing"
        count={allBills.length}
        countLabel="Transactions"
        description="Consultation charges, OPD fee receipts, and practice revenue summaries"
      />

      {/* 3 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <StatCard
          title="Total Practice Revenue"
          value={`₹${total.toLocaleString("en-IN")}`}
          icon={Receipt}
          color="green"
          trend="All Time Invoiced"
          trendPositive={true}
        />
        <StatCard
          title="This Month's Collections"
          value={`₹${thisMonth.toLocaleString("en-IN")}`}
          icon={Calendar}
          color="teal"
          trend={`${new Date().toLocaleString("default", { month: "short" })} Billing`}
          trendPositive={true}
        />
        <StatCard
          title="Average Consultation Fee"
          value={`₹${avgFee.toLocaleString("en-IN")}`}
          icon={CreditCard}
          color="blue"
          trend="Per Encounter"
          trendPositive={true}
        />
      </div>

      {/* Transactions Table / Empty State */}
      {allBills.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: tokens.radii.xl,
            border: `1px solid ${tokens.colors.slate[200]}`,
            boxShadow: tokens.shadows.sm,
          }}
        >
          <EmptyState
            icon={Receipt}
            color="green"
            title="No billing transactions recorded yet"
            description="Consultation fees entered when creating patient prescriptions will appear here with automated receipt logs."
          />
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: tokens.radii.xl,
            border: `1px solid ${tokens.colors.slate[200]}`,
            background: "#FFFFFF",
            boxShadow: tokens.shadows.sm,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={{ padding: "14px 20px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Receipt / Invoice ID
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Patient Name
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Consultation Date
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Clinical Encounter / Diagnosis
                </th>
                <th style={{ padding: "14px 18px", background: tokens.colors.slate[50], textAlign: "left", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Amount
                </th>
                <th style={{ padding: "14px 20px", background: tokens.colors.slate[50], textAlign: "right", fontWeight: 700, fontSize: 12, color: tokens.colors.slate[500], borderBottom: `1px solid ${tokens.colors.slate[200]}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {allBills.map((b, idx) => (
                <tr key={idx} className="table-row-hover">
                  <td style={{ padding: "14px 20px", borderBottom: `1px solid ${tokens.colors.slate[100]}` }}>
                    <span
                      style={{
                        fontFamily: tokens.typography.monoFont,
                        fontWeight: 700,
                        fontSize: 12,
                        background: tokens.colors.slate[100],
                        padding: "3px 8px",
                        borderRadius: 6,
                        color: tokens.colors.slate[700],
                      }}
                    >
                      INV-{(b.visitId || b.date).toString().slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}`, fontWeight: 700, color: tokens.colors.slate[900] }}>
                    {b.patientName}
                  </td>
                  <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}`, color: tokens.colors.slate[600] }}>
                    {fmtDate(b.date)}
                  </td>
                  <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}`, color: tokens.colors.slate[700] }}>
                    {b.diagnosis || "OPD Consultation"}
                  </td>
                  <td style={{ padding: "14px 18px", borderBottom: `1px solid ${tokens.colors.slate[100]}`, fontWeight: 800, color: "#065F46", fontSize: 14 }}>
                    ₹{b.fee.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 20px", borderBottom: `1px solid ${tokens.colors.slate[100]}`, textAlign: "right" }}>
                    <Badge variant="green" size="sm" dot>
                      Paid & Cleared
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
