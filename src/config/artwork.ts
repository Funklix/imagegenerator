import { theme } from "@/config/theme";
import type { CSSProperties } from "react";

export const ARTWORK_SIZE = 1080;

export const artwork = {
  colors: {
    background: theme.brandPrimary,
    secondary: theme.brandSecondary,
    accent: theme.accent,
    text: "#ffffff",
    subtleText: "rgba(255, 255, 255, 0.55)",
    rule: "rgba(255, 255, 255, 0.4)",
  },
  padding: 0.075,
  portrait: { right: 0.06, bottom: 0, width: 0.47, height: 0.75 },
  copy: { left: 0.075, bottom: 0.15, width: 0.55 },
  footer: { inset: 0.075, bottom: 0.055 },
  decorations: {
    ring: { top: -0.1, right: -0.17, size: 0.6, border: 58 },
    circle: { right: -0.05, bottom: -0.19, size: 0.51 },
  },
  typography: {
    sans: "Arial, Helvetica, sans-serif",
    serif: 'Georgia, "Times New Roman", serif',
    name: 49,
    role: 13,
    topic: 17,
  },
} as const;

export const artworkCssVariables = {
  "--artwork-padding": `${artwork.padding * 100}%`,
  "--portrait-right": `${artwork.portrait.right * 100}%`,
  "--portrait-width": `${artwork.portrait.width * 100}%`,
  "--portrait-height": `${artwork.portrait.height * 100}%`,
  "--copy-left": `${artwork.copy.left * 100}%`,
  "--copy-bottom": `${artwork.copy.bottom * 100}%`,
  "--copy-width": `${artwork.copy.width * 100}%`,
  "--footer-inset": `${artwork.footer.inset * 100}%`,
  "--footer-bottom": `${artwork.footer.bottom * 100}%`,
  "--ring-top": `${artwork.decorations.ring.top * 100}%`,
  "--ring-right": `${artwork.decorations.ring.right * 100}%`,
  "--ring-size": `${artwork.decorations.ring.size * 100}%`,
  "--circle-right": `${artwork.decorations.circle.right * 100}%`,
  "--circle-bottom": `${artwork.decorations.circle.bottom * 100}%`,
  "--circle-size": `${artwork.decorations.circle.size * 100}%`,
} as CSSProperties;
