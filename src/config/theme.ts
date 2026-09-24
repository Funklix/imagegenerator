import type { CSSProperties } from "react";

export const theme = {
  brandName: "stiftungsmarktplatz.eu",
  brandPrimary: "#7b176f",
  brandSecondary: "#c7a426",
  accent: "#e7ca58",
  background: "#f7f2e6",
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
