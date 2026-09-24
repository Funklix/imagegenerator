import { theme } from "@/config/theme";

export const ARTWORK_SIZE = 1080;

export type ArtworkTextSource =
  | "name"
  | "role"
  | "topic"
  | "brand"
  | "edition"
  | "eventWord"
  | "speakerLabel";

type BackgroundLayer = {
  id: string;
  type: "background";
  color: string;
};

type ShapeLayer = {
  id: string;
  type: "shape";
  shape: "circle" | "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity?: number;
  border?: { color: string; width: number };
};

export type TextLayer = {
  id: string;
  type: "text";
  source: ArtworkTextSource;
  x: number;
  y: number;
  width: number;
  color: string;
  fontFamily: "sans" | "serif";
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: number;
  uppercase?: boolean;
  stroke?: { color: string; width: number };
};

export type PortraitLayer = {
  id: string;
  type: "portrait";
  x: number;
  y: number;
  width: number;
  height: number;
};

type RuleLayer = {
  id: string;
  type: "rule";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type FooterLayer = {
  id: string;
  type: "footer";
  x: number;
  y: number;
  width: number;
  color: string;
  ruleColor: string;
  text: string;
  fontSize: number;
  badge: { x: number; y: number; size: number; label: string };
};

export type ArtworkLayer =
  | BackgroundLayer
  | ShapeLayer
  | TextLayer
  | PortraitLayer
  | RuleLayer
  | FooterLayer;

const colors = {
  background: theme.brandPrimary,
  plum: "#321b45",
  secondary: theme.brandSecondary,
  accent: theme.accent,
  text: "#fffdf8",
  muted: "rgba(255, 253, 248, 0.72)",
  ghost: "rgba(255, 253, 248, 0.16)",
  rule: "rgba(255, 253, 248, 0.38)",
} as const;

export const editorialSpeakerTemplate = {
  id: "editorial-speaker",
  size: ARTWORK_SIZE,
  colors,
  typography: {
    sans: "Arial, Helvetica, sans-serif",
    serif: 'Georgia, "Times New Roman", serif',
  },
  layers: [
    { id: "background", type: "background", color: colors.background },
    {
      id: "gold-disc",
      type: "shape",
      shape: "circle",
      x: 650,
      y: 124,
      width: 590,
      height: 590,
      color: colors.accent,
      opacity: 0.92,
    },
    {
      id: "plum-block",
      type: "shape",
      shape: "rectangle",
      x: 0,
      y: 484,
      width: 720,
      height: 422,
      color: colors.plum,
    },
    {
      id: "event-word",
      type: "text",
      source: "eventWord",
      x: 58,
      y: 167,
      width: 964,
      color: "transparent",
      fontFamily: "sans",
      fontSize: 158,
      fontWeight: 700,
      lineHeight: 158,
      letterSpacing: -8,
      stroke: { color: colors.ghost, width: 3 },
    },
    {
      id: "portrait",
      type: "portrait",
      x: 355,
      y: 176,
      width: 650,
      height: 824,
    },
    {
      id: "brand",
      type: "text",
      source: "brand",
      x: 64,
      y: 58,
      width: 480,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 28,
      letterSpacing: -0.5,
    },
    {
      id: "edition",
      type: "text",
      source: "edition",
      x: 812,
      y: 62,
      width: 204,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 20,
      letterSpacing: 2.2,
      uppercase: true,
    },
    {
      id: "speaker-label",
      type: "text",
      source: "speakerLabel",
      x: 68,
      y: 523,
      width: 260,
      color: colors.accent,
      fontFamily: "sans",
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 22,
      letterSpacing: 4,
      uppercase: true,
    },
    {
      id: "name",
      type: "text",
      source: "name",
      x: 68,
      y: 568,
      width: 650,
      color: colors.text,
      fontFamily: "serif",
      fontSize: 62,
      fontWeight: 500,
      lineHeight: 64,
      letterSpacing: -2.8,
    },
    {
      id: "role",
      type: "text",
      source: "role",
      x: 70,
      y: 710,
      width: 520,
      color: colors.muted,
      fontFamily: "sans",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 23,
    },
    {
      id: "topic-rule",
      type: "rule",
      x: 70,
      y: 772,
      width: 72,
      height: 5,
      color: colors.secondary,
    },
    {
      id: "topic",
      type: "text",
      source: "topic",
      x: 70,
      y: 802,
      width: 545,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 22,
      fontWeight: 700,
      lineHeight: 29,
    },
    {
      id: "foreground-bar",
      type: "shape",
      shape: "rectangle",
      x: 979,
      y: 385,
      width: 20,
      height: 258,
      color: colors.secondary,
    },
    {
      id: "footer",
      type: "footer",
      x: 68,
      y: 980,
      width: 944,
      color: colors.text,
      ruleColor: colors.rule,
      text: "IMPULSE, DIE WEITERBRINGEN.",
      fontSize: 14,
      badge: { x: 946, y: 997, size: 54, label: "SM" },
    },
  ] satisfies ArtworkLayer[],
} as const;

export const artwork = editorialSpeakerTemplate;

export const portraitLayer = artwork.layers.find(
  (layer): layer is PortraitLayer => layer.type === "portrait",
)!;
