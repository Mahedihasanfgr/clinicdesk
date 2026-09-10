import { tokens } from "../../styles/tokens";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  color = "teal",
  padding = "48px 24px",
  style = {},
}) {
  const colorMap = {
    teal: { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
    blue: { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
    green: { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
    amber: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
    purple: { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  };

  const current = colorMap[color] || colorMap.teal;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding,
        ...style,
      }}
    >
      {Icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: current.bg,
            border: `1.5px solid ${current.border}`,
            color: current.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            boxShadow: tokens.shadows.sm,
          }}
        >
          <Icon size={28} strokeWidth={2} />
        </div>
      )}
      {title && (
        <h4
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: tokens.colors.slate[800],
            letterSpacing: "-0.015em",
            marginBottom: 6,
          }}
        >
          {title}
        </h4>
      )}
      {description && (
        <p
          style={{
            fontSize: 13.5,
            color: tokens.colors.slate[500],
            maxWidth: 380,
            lineHeight: 1.5,
            margin: "0 auto 20px",
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" icon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
