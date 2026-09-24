import type { CSSProperties } from "react";

export const theme = {
  brandName: "stiftungsmarktplatz.eu",
  brandPrimary: "#7b176f",
  brandSecondary: "#c7a426",
  accent: "#e7ca58",
  background: "#f7f2e6",
  backgroundStrong: "#efe3c7",
  surface: "#ffffff",
  surfaceSoft: "#fcf8ef",
  textPrimary: "#181719",
  textSecondary: "#68636c",
  border: "#dcd7cf",
  borderStrong: "#cbbfa9",
} as const;

export const themeVariables = {
  "--brand-primary": theme.brandPrimary,
  "--brand-secondary": theme.brandSecondary,
  "--accent": theme.accent,
  "--background": theme.background,
  "--background-strong": theme.backgroundStrong,
  "--surface": theme.surface,
  "--surface-soft": theme.surfaceSoft,
  "--text-primary": theme.textPrimary,
  "--text-secondary": theme.textSecondary,
  "--border": theme.border,
  "--border-strong": theme.borderStrong,
} as CSSProperties;
