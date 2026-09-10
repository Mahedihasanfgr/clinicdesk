import { tokens } from "../../styles/tokens";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = "",
  style = {},
  ...props
}) {
  const sizeStyles = {
    sm: { padding: "6px 12px", fontSize: "12.5px", borderRadius: tokens.radii.sm, gap: 6 },
    md: { padding: "9px 16px", fontSize: "13.5px", borderRadius: tokens.radii.md, gap: 8 },
    lg: { padding: "12px 22px", fontSize: "15px", borderRadius: tokens.radii.lg, gap: 10 },
  };

  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, #0D9488 0%, #0284C7 100%)",
      color: "#FFFFFF",
      border: "none",
      boxShadow: tokens.shadows.primaryGlow,
    },
    secondary: {
      background: "#FFFFFF",
      color: tokens.colors.slate[700],
      border: `1px solid ${tokens.colors.slate[300]}`,
      boxShadow: tokens.shadows.xs,
    },
    danger: {
      background: tokens.colors.semantic.danger.bg,
      color: tokens.colors.semantic.danger.text,
      border: `1px solid ${tokens.colors.semantic.danger.border}`,
      boxShadow: "none",
    },
    success: {
      background: tokens.colors.semantic.success.bg,
      color: tokens.colors.semantic.success.text,
      border: `1px solid ${tokens.colors.semantic.success.border}`,
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: tokens.colors.slate[600],
      border: "1px solid transparent",
      boxShadow: "none",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      disabled={disabled || loading}
      className={`btn-interactive ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: tokens.transitions.fast,
        fontFamily: tokens.typography.fontFamily,
        ...currentSize,
        ...currentVariant,
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
      )}
      <span>{children}</span>
      {!loading && IconRight && (
        <IconRight size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
      )}
    </button>
  );
}
