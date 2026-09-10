import { S } from "../styles/styles";
import { NAV_ITEMS, DOCTOR_ONLY } from "../constants/auth";
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Receipt,
  MessageSquare,
  LogOut,
  UserCheck,
  Building2,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

// Icon mapping dictionary
const ICON_MAP = {
  dashboard: LayoutDashboard,
  patients: Users,
  appointments: CalendarDays,
  templates: FileText,
  billing: Receipt,
  whatsapp: MessageSquare,
};

export default function Sidebar({ active, setActive, user, onLogout }) {
  return (
    <aside style={S.sidebar}>
      {/* ClinicDesk Brand Header */}
      <div style={S.sideLogo}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(13, 148, 136, 0.35)",
            flexShrink: 0,
            color: "#FFFFFF",
          }}>
            <Stethoscope size={24} strokeWidth={2.3} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span>ClinicDesk</span>
              <span style={{
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: 6,
                background: "rgba(45, 212, 191, 0.2)",
                color: "#2DD4BF",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}>
                PRO
              </span>
            </div>
            <div style={{
              fontSize: 11.5,
              color: "#94A3B8",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: 2,
            }}>
              {user.clinicName || "Smart Medical EMR"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={S.sideNav}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          padding: "8px 12px 4px",
        }}>
          Clinical Menu
        </div>

        {NAV_ITEMS.filter(n => user.role === "doctor" || !DOCTOR_ONLY.includes(n.key)).map(n => {
          const isActive = active === n.key;
          const IconComp = ICON_MAP[n.key] || LayoutDashboard;

          return (
            <div
              key={n.key}
              style={S.sideItem(isActive)}
              onClick={() => setActive(n.key)}
              className="btn-interactive"
            >
              <IconComp
                size={18}
                strokeWidth={isActive ? 2.4 : 1.9}
                style={{
                  color: isActive ? "#2DD4BF" : "#94A3B8",
                  transition: "color 0.18s ease",
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, letterSpacing: "-0.01em" }}>{n.label}</span>
              {isActive && (
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#2DD4BF",
                  boxShadow: "0 0 10px #2DD4BF",
                }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile & Clinic Info Footer */}
      <div style={{
        padding: "16px 14px",
        margin: "12px",
        background: "rgba(255, 255, 255, 0.04)",
        borderRadius: 16,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: user.role === "doctor"
              ? "linear-gradient(135deg, #0D9488 0%, #059669 100%)"
              : "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            position: "relative",
            flexShrink: 0,
          }}>
            <UserCheck size={20} strokeWidth={2.2} />
            <span style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#10B981",
              border: "2px solid #0B132B",
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13.5,
              color: "#F8FAFC",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {user.name}
            </div>
            <div style={{
              fontSize: 11,
              color: "#A7F3D0",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <span style={{ textTransform: "capitalize" }}>{user.role}</span>
              <span>•</span>
              <span style={{ fontFamily: "monospace" }}>#{user.clinicCode}</span>
            </div>
          </div>
        </div>

        <button
          style={{
            ...S.btn,
            width: "100%",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            fontSize: 12.5,
            padding: "8px 12px",
            borderRadius: 10,
          }}
          className="btn-interactive"
          onClick={onLogout}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
