import { tokens } from "../../styles/tokens";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "teal",
  trend,
  trendPositive = true,
  onClick,
  style = {},
}) {
  const colorMap = {
    teal: {
      bg: "#F0FDFA",
      text: "#0F766E",
      border: "#CCFBF1",
      glow: "rgba(13, 148, 136, 0.12)",
      iconBg: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
      iconColor: "#FFFFFF",
    },
    blue: {
      bg: "#F0F9FF",
      text: "#0369A1",
      border: "#E0F2FE",
      glow: "rgba(2, 132, 199, 0.12)",
      iconBg: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
      iconColor: "#FFFFFF",
    },
    green: {
      bg: "#ECFDF5",
      text: "#047857",
      border: "#D1FAE5",
      glow: "rgba(16, 185, 129, 0.12)",
      iconBg: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      iconColor: "#FFFFFF",
    },
    amber: {
      bg: "#FFFBEB",
      text: "#B45309",
      border: "#FEF3C7",
      glow: "rgba(245, 158, 11, 0.12)",
      iconBg: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      iconColor: "#FFFFFF",
    },
    purple: {
      bg: "#F5F3FF",
      text: "#6D28D9",
      border: "#EDE9FE",
      glow: "rgba(139, 92, 246, 0.12)",
      iconBg: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      iconColor: "#FFFFFF",
    },
  };

  const current = colorMap[color] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`card-hover ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: tokens.colors.surface.card,
        borderRadius: tokens.radii.xl,
        border: `1px solid ${tokens.colors.slate[200]}`,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: tokens.shadows.sm,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: tokens.colors.slate[500],
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: tokens.colors.slate[900],
              marginTop: 6,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: current.iconBg,
              color: current.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${current.glow}`,
              flexShrink: 0,
            }}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12.5 }}>
        {subtitle && (
          <span style={{ color: tokens.colors.slate[500] }}>
            {subtitle}
          </span>
        )}
        {trend && (
          <span
            style={{
              fontWeight: 600,
              color: trendPositive ? tokens.colors.semantic.success.text : tokens.colors.semantic.danger.text,
              background: trendPositive ? tokens.colors.semantic.success.bg : tokens.colors.semantic.danger.bg,
              padding: "2px 8px",
              borderRadius: tokens.radii.full,
              border: `1px solid ${trendPositive ? tokens.colors.semantic.success.border : tokens.colors.semantic.danger.border}`,
            }}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
