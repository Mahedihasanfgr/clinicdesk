import { tokens } from "../../styles/tokens";

export default function Select({
  label,
  error,
  options = [],
  children,
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
      <select
        id={id}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: tokens.radii.md,
          border: `1px solid ${error ? tokens.colors.semantic.danger.solid : tokens.colors.slate[300]}`,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          background: "#FFFFFF",
          color: tokens.colors.slate[900],
          fontFamily: tokens.typography.fontFamily,
          cursor: "pointer",
          transition: tokens.transitions.fast,
          ...style,
        }}
        className={className}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
      </select>
      {error && (
        <span style={{ fontSize: 12, color: tokens.colors.semantic.danger.text, fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
