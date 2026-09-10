import { tokens } from "../../styles/tokens";
import Badge from "./Badge";

export default function PageHeader({
  icon: Icon,
  iconColor = "#0D9488",
  iconBg = "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(2, 132, 199, 0.1) 100%)",
  title,
  count,
  countLabel = "Total",
  description,
  actions,
  children,
  className = "",
  style = {},
}) {
  return (
    <div
      className={className}
      style={{
        background: tokens.colors.surface.card,
        borderRadius: tokens.radii.xl,
        border: `1px solid ${tokens.colors.slate[200]}`,
        padding: "24px 28px",
        marginBottom: 24,
        boxShadow: tokens.shadows.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {Icon && (
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: iconBg,
              border: "1px solid rgba(13, 148, 136, 0.2)",
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(13, 148, 136, 0.15)",
              flexShrink: 0,
            }}
          >
            <Icon size={24} strokeWidth={2.2} />
          </div>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1
              style={{
                fontSize: 21,
                fontWeight: 800,
                color: tokens.colors.slate[900],
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              {title}
            </h1>
            {count !== undefined && (
              <Badge variant="teal" size="sm">
                {count} {countLabel}
              </Badge>
            )}
          </div>
          {description && (
            <p
              style={{
                fontSize: 13.5,
                color: tokens.colors.slate[500],
                marginTop: 3,
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {(actions || children) && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
