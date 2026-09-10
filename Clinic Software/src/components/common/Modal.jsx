import { useEffect } from "react";
import { createPortal } from "react-dom";
import { tokens } from "../../styles/tokens";
import { X } from "lucide-react";

export default function Modal({
  isOpen = true,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconBg = "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(2, 132, 199, 0.1) 100%)",
  iconColor = "#0D9488",
  maxWidth = 720,
  children,
  footer,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Lock body scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(11, 19, 43, 0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        overflowY: "auto",
        boxSizing: "border-box",
        fontFamily: tokens.typography.fontFamily,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: tokens.radii.xxl,
          width: "100%",
          maxWidth,
          boxShadow: "0 25px 50px -12px rgba(11, 19, 43, 0.35)",
          border: `1px solid ${tokens.colors.slate[200]}`,
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          margin: "auto",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || Icon || onClose) && (
          <div
            style={{
              padding: "20px 28px",
              borderBottom: `1px solid ${tokens.colors.slate[200]}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {Icon && (
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: iconBg,
                    color: iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
              )}
              <div>
                {title && (
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: tokens.colors.slate[900],
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p style={{ fontSize: 13, color: tokens.colors.slate[500], marginTop: 2, margin: 0 }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: `1px solid ${tokens.colors.slate[200]}`,
                  background: "#F8FAFC",
                  color: tokens.colors.slate[500],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: tokens.transitions.default,
                }}
                className="btn-interactive"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div
          style={{
            padding: "24px 28px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "16px 28px",
              borderTop: `1px solid ${tokens.colors.slate[200]}`,
              background: tokens.colors.slate[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
