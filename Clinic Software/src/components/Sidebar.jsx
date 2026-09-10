import { S } from "../styles/styles";
import { NAV_ITEMS, DOCTOR_ONLY } from "../constants/auth";

export default function Sidebar({ active, setActive, user, onLogout }) {
  return (
    <div style={S.sidebar}>
      {/* Medical Brand Logo */}
      <div style={S.sideLogo}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            background: "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
            flexShrink: 0,
            fontSize: 22
          }}>
            🏥
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>ClinicDesk</div>
            <div style={{ fontSize: 11, color: "#34D399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
              🩺 {user.role === "doctor" ? "Doctor Portal" : "Reception Portal"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div style={S.sideNav}>
        {NAV_ITEMS.filter(n => user.role === "doctor" || !DOCTOR_ONLY.includes(n.key)).map(n => {
          const isActive = active === n.key;
          return (
            <div
              key={n.key}
              style={S.sideItem(isActive)}
              onClick={() => setActive(n.key)}
              className="btn-interactive"
            >
              <span style={{ fontSize: 18, opacity: isActive ? 1 : 0.75 }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {isActive && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 8px #34D399" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div style={{
        padding: "16px 18px",
        margin: "12px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: 14,
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: user.role === "doctor" ? "linear-gradient(135deg, #0D9488 0%, #059669 100%)" : "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontWeight: 800,
            fontSize: 15
          }}>
            👨‍⚕️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "#A7F3D0", textTransform: "capitalize", fontWeight: 600 }}>
              {user.role} • {user.clinicCode}
            </div>
          </div>
        </div>
        <button
          style={{
            ...S.btn,
            width: "100%",
            background: "rgba(239, 68, 68, 0.15)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            fontSize: 12,
            padding: "8px 12px"
          }}
          className="btn-interactive"
          onClick={onLogout}
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );
}
