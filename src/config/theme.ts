import type { CSSProperties } from "react";

export const theme = {
  brandName: "stiftungsmarktplatz.eu",
  brandPrimary: "#24133f",
  brandSecondary: "#b28a46",
  accent: "#e9d9a7",
  background: "#f7f5f0",
  surface: "#ffffff",
  textPrimary: "#181719",
  textSecondary: "#68636c",
  border: "#dcd7cf",
} as const;

export const themeVariables = {
  "--brand-primary": theme.brandPrimary,
  "--brand-secondary": theme.brandSecondary,
  "--accent": theme.accent,
  "--background": theme.background,
  "--surface": theme.surface,
  "--text-primary": theme.textPrimary,
  "--text-secondary": theme.textSecondary,
  "--border": theme.border,
} as CSSProperties;
