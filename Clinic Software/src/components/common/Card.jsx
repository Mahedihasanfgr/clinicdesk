import { tokens } from "../../styles/tokens";

export default function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  iconColor = tokens.colors.primary[600],
  iconBg = tokens.colors.primary[50],
  hoverable = false,
  padding = "24px 28px",
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={`${hoverable ? "card-hover" : ""} ${className}`}
      style={{
        background: tokens.colors.surface.card,
        borderRadius: tokens.radii.xl,
        border: `1px solid ${tokens.colors.slate[200]}`,
        boxShadow: tokens.shadows.sm,
        padding,
        marginBottom: 24,
        position: "relative",
        ...style,
      }}
      {...props}
    >
      {(title || action || Icon) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: subtitle ? 4 : 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {Icon && (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: tokens.radii.md,
                  background: iconBg,
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
              </div>
            )}
            <div>
              {title && (
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: tokens.colors.slate[900],
                    letterSpacing: "-0.015em",
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: 13,
                    color: tokens.colors.slate[500],
                    marginTop: 2,
                    margin: 0,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
