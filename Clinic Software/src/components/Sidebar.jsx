import { tokens } from "../styles/tokens";
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
  X,
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

export default function Sidebar({ active, setActive, user, onLogout, isOpen, onClose }) {
  const handleItemClick = (key) => {
    setActive(key);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 19, 43, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 90,
          }}
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? "open" : ""}`}
        style={{
          width: 260,
          background: "linear-gradient(180deg, #0B132B 0%, #111C44 100%)",
          color: tokens.colors.slate[50],
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "4px 0 24px rgba(11, 19, 43, 0.4)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: tokens.typography.fontFamily,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
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
              }}
            >
              <Stethoscope size={24} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.025em",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>ClinicDesk</span>
                <span
                  style={{
                    fontSize: 9.5,
                    padding: "2px 6px",
                    borderRadius: 6,
                    background: "rgba(45, 212, 191, 0.2)",
                    color: "#2DD4BF",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                  }}
                >
                  PRO
                </span>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "#94A3B8",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: 2,
                }}
              >
                {user.clinicName || "Smart Medical Workspace"}
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="mobile-menu-btn"
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: "16px 12px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "8px 12px 4px",
            }}
          >
            Clinical Workspace
          </div>

          {NAV_ITEMS.filter((n) => user.role === "doctor" || !DOCTOR_ONLY.includes(n.key)).map((n) => {
            const isActive = active === n.key;
            const IconComp = ICON_MAP[n.key] || LayoutDashboard;

            return (
              <div
                key={n.key}
                onClick={() => handleItemClick(n.key)}
                className="btn-interactive"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  borderRadius: tokens.radii.lg,
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(20, 184, 166, 0.22) 0%, rgba(2, 132, 199, 0.16) 100%)"
                    : "transparent",
                  color: isActive ? "#2DD4BF" : "rgba(241, 245, 249, 0.72)",
                  border: isActive ? "1px solid rgba(45, 212, 191, 0.35)" : "1px solid transparent",
                  boxShadow: isActive ? "0 2px 12px rgba(20, 184, 166, 0.18)" : "none",
                  transition: tokens.transitions.default,
                }}
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
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#2DD4BF",
                      boxShadow: "0 0 10px #2DD4BF",
                    }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div
          style={{
            padding: "16px 14px",
            margin: "12px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: tokens.radii.xl,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background:
                  user.role === "doctor"
                    ? "linear-gradient(135deg, #0D9488 0%, #059669 100%)"
                    : "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                position: "relative",
                flexShrink: 0,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <UserCheck size={18} />}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#10B981",
                  border: "2px solid #0B132B",
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13.5,
                  color: "#F8FAFC",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#A7F3D0",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{user.role}</span>
                <span>•</span>
                <span style={{ fontFamily: tokens.typography.monoFont }}>#{user.clinicCode}</span>
              </div>
            </div>
          </div>

          <button
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#FCA5A5",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "8px 12px",
              borderRadius: tokens.radii.md,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: tokens.transitions.fast,
            }}
            className="btn-interactive"
            onClick={onLogout}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
