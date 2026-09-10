import { tokens } from "../../styles/tokens";

export default function Badge({
  children,
  variant = "teal",
  dot = false,
  size = "md",
  className = "",
  style = {},
  ...props
}) {
  const variantMap = {
    teal: { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4", dotColor: "#0D9488" },
    green: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0", dotColor: "#10B981" },
    blue: { bg: "#F0F9FF", text: "#075985", border: "#BAE6FD", dotColor: "#0284C7" },
    amber: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dotColor: "#F59E0B" },
    red: { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA", dotColor: "#EF4444" },
    purple: { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE", dotColor: "#8B5CF6" },
    slate: { bg: "#F1F5F9", text: "#334155", border: "#E2E8F0", dotColor: "#64748B" },
  };

  const current = variantMap[variant] || variantMap.teal;

  const sizeStyles = {
    sm: { padding: "2px 8px", fontSize: "11px", height: "20px" },
    md: { padding: "4px 10px", fontSize: "12px", height: "24px" },
    lg: { padding: "6px 14px", fontSize: "13px", height: "28px" },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: tokens.radii.full,
        fontWeight: 600,
        background: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...currentSize,
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: current.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
