// Design Tokens for ClinicDesk — Unified Single Source of Truth
// Standardized on 4/8px base grid, Plus Jakarta Sans / Inter typography, and refined medical palette

export const tokens = {
  colors: {
    // Primary: Refined Medical Teal & Blue Accent
    primary: {
      50: "#F0FDFA",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#14B8A6",
      600: "#0D9488", // Brand base
      700: "#0F766E", // Deep teal
      800: "#115E59",
      900: "#134E4A",
      950: "#042F2E",
    },
    // Secondary / Accent: Sky Blue & Emerald
    accent: {
      sky: "#0284C7",
      skyLight: "#E0F2FE",
      emerald: "#10B981",
      emeraldLight: "#ECFDF5",
      indigo: "#6366F1",
      indigoLight: "#EEF2FF",
    },
    // Neutral Slate Scale (10 steps)
    slate: {
      50: "#F8FAFC",  // Canvas background
      100: "#F1F5F9", // Soft card background / subtle divide
      200: "#E2E8F0", // Border default
      300: "#CBD5E1", // Input border / active border
      400: "#94A3B8", // Placeholder / subtle text
      500: "#64748B", // Muted description text
      600: "#475569", // Label text
      700: "#334155", // Subtitle / secondary heading
      800: "#1E293B", // Card title / dark surface
      900: "#0F172A", // Main body heading
      950: "#0B132B", // Deep sidebar midnight
    },
    // Semantic Status Tokens
    semantic: {
      success: {
        bg: "#ECFDF5",
        text: "#065F46",
        border: "#A7F3D0",
        solid: "#10B981",
      },
      warning: {
        bg: "#FFFBEB",
        text: "#92400E",
        border: "#FDE68A",
        solid: "#F59E0B",
      },
      danger: {
        bg: "#FEF2F2",
        text: "#991B1B",
        border: "#FECACA",
        solid: "#EF4444",
      },
      info: {
        bg: "#F0F9FF",
        text: "#075985",
        border: "#BAE6FD",
        solid: "#0EA5E9",
      },
      purple: {
        bg: "#F5F3FF",
        text: "#5B21B6",
        border: "#DDD6FE",
        solid: "#8B5CF6",
      },
    },
    surface: {
      canvas: "#F8FAFC",
      card: "#FFFFFF",
      sidebar: "#0B132B",
      sidebarActive: "rgba(20, 184, 166, 0.16)",
      topbar: "rgba(255, 255, 255, 0.92)",
    },
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    scale: {
      display: { fontSize: "30px", fontWeight: "800", letterSpacing: "-0.03em", lineHeight: "1.2" },
      h1: { fontSize: "24px", fontWeight: "800", letterSpacing: "-0.025em", lineHeight: "1.25" },
      h2: { fontSize: "19px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1.3" },
      h3: { fontSize: "16px", fontWeight: "700", letterSpacing: "-0.015em", lineHeight: "1.4" },
      h4: { fontSize: "14.5px", fontWeight: "600", letterSpacing: "-0.01em", lineHeight: "1.4" },
      body: { fontSize: "14px", fontWeight: "400", lineHeight: "1.5" },
      bodyMedium: { fontSize: "14px", fontWeight: "500", lineHeight: "1.5" },
      small: { fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" },
      caption: { fontSize: "11px", fontWeight: "600", letterSpacing: "0.04em", textTransform: "uppercase" },
    },
  },

  shadows: {
    xs: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
    sm: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
    md: "0 4px 14px -2px rgba(15, 23, 42, 0.07), 0 2px 6px -2px rgba(15, 23, 42, 0.04)",
    lg: "0 10px 25px -3px rgba(15, 23, 42, 0.1), 0 4px 10px -4px rgba(15, 23, 42, 0.05)",
    xl: "0 20px 35px -5px rgba(15, 23, 42, 0.15), 0 10px 15px -6px rgba(15, 23, 42, 0.08)",
    primaryGlow: "0 4px 16px rgba(13, 148, 136, 0.32)",
    cardHover: "0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 3px 8px -2px rgba(15, 23, 42, 0.04)",
  },

  radii: {
    sm: "8px",
    md: "10px",  // Inputs, small buttons
    lg: "14px",  // Regular buttons, dropdowns
    xl: "18px",  // Cards, stat blocks
    xxl: "24px", // Modals, hero cards
    full: "9999px", // Pills, badges, avatars
  },

  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
  },

  transitions: {
    fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    default: "200ms cubic-bezier(0.16, 1, 0.3, 1)",
    smooth: "280ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};
