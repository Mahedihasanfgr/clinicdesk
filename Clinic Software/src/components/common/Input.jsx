import { tokens } from "../../styles/tokens";

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  iconRight,
  id,
  className = "",
  style = {},
  containerStyle = {},
  ...props
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...containerStyle }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: tokens.colors.slate[700],
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {Icon && (
          <div
            style={{
              position: "absolute",
              left: 12,
              color: error ? tokens.colors.semantic.danger.solid : tokens.colors.slate[400],
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          style={{
            width: "100%",
            padding: "10px 14px",
            paddingLeft: Icon ? 38 : 14,
            paddingRight: iconRight ? 38 : 14,
            borderRadius: tokens.radii.md,
            border: `1px solid ${error ? tokens.colors.semantic.danger.solid : tokens.colors.slate[300]}`,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            background: "#FFFFFF",
            color: tokens.colors.slate[900],
            fontFamily: tokens.typography.fontFamily,
            transition: tokens.transitions.fast,
            ...style,
          }}
          className={className}
          {...props}
        />
        {iconRight && (
          <div
            style={{
              position: "absolute",
              right: 12,
              display: "flex",
              alignItems: "center",
            }}
          >
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: tokens.colors.semantic.danger.text, fontWeight: 500 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ fontSize: 12, color: tokens.colors.slate[400] }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
