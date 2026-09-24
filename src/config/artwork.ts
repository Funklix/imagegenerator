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
  background: "#21122f",
  plum: "#32133f",
  magenta: "#a71978",
  violet: "#6f3b91",
  secondary: theme.brandSecondary,
  accent: "#e1bd45",
  text: "#fffdf8",
  muted: "rgba(255, 253, 248, 0.78)",
  ghost: "rgba(255, 253, 248, 0.16)",
  rule: "rgba(255, 253, 248, 0.42)",
} as const;

export const boldSpeakerTemplate = {
  id: "bold-speaker",
  size: ARTWORK_SIZE,
  colors,
  typography: {
    sans: '"Arial Narrow", "Roboto Condensed", Arial, Helvetica, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
  },
  layers: [
    { id: "background", type: "background", color: colors.background },
    {
      id: "gold-stage",
      type: "shape",
      shape: "circle",
      x: 340,
      y: -155,
      width: 900,
      height: 900,
      color: colors.accent,
    },
    {
      id: "event-word",
      type: "text",
      source: "eventWord",
      x: 42,
      y: 174,
      width: 990,
      color: "transparent",
      fontFamily: "sans",
      fontSize: 158,
      fontWeight: 700,
      lineHeight: 158,
      letterSpacing: -7,
      stroke: { color: colors.violet, width: 4 },
    },
    {
      id: "brand",
      type: "text",
      source: "brand",
      x: 54,
      y: 48,
      width: 480,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 30,
      letterSpacing: -0.8,
    },
    {
      id: "edition",
      type: "text",
      source: "edition",
      x: 54,
      y: 89,
      width: 260,
      color: colors.accent,
      fontFamily: "sans",
      fontSize: 17,
      fontWeight: 700,
      lineHeight: 20,
      letterSpacing: 3.4,
      uppercase: true,
    },
    {
      id: "portrait",
      type: "portrait",
      x: 170,
      y: 78,
      width: 910,
      height: 1002,
    },
    {
      id: "information-field",
      type: "shape",
      shape: "rectangle",
      x: 0,
      y: 688,
      width: 850,
      height: 392,
      color: colors.plum,
    },
    {
      id: "speaker-label-field",
      type: "shape",
      shape: "rectangle",
      x: 54,
      y: 660,
      width: 188,
      height: 50,
      color: colors.magenta,
    },
    {
      id: "speaker-label",
      type: "text",
      source: "speakerLabel",
      x: 72,
      y: 674,
      width: 160,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 20,
      letterSpacing: 3.6,
      uppercase: true,
    },
    {
      id: "name",
      type: "text",
      source: "name",
      x: 52,
      y: 730,
      width: 750,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 70,
      letterSpacing: -3.4,
      uppercase: true,
    },
    {
      id: "role",
      type: "text",
      source: "role",
      x: 56,
      y: 880,
      width: 730,
      color: colors.muted,
      fontFamily: "sans",
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 25,
      letterSpacing: 0.2,
    },
    {
      id: "topic-rule",
      type: "rule",
      x: 56,
      y: 928,
      width: 66,
      height: 7,
      color: colors.accent,
    },
    {
      id: "topic",
      type: "text",
      source: "topic",
      x: 56,
      y: 952,
      width: 730,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 27,
      fontWeight: 700,
      lineHeight: 32,
    },
    {
      id: "footer",
      type: "footer",
      x: 875,
      y: 986,
      width: 151,
      color: colors.text,
      ruleColor: colors.ghost,
      text: "IMPULSE",
      fontSize: 12,
      badge: { x: 968, y: 1008, size: 58, label: "S" },
    },
  ] satisfies ArtworkLayer[],
} as const;

export const artwork = boldSpeakerTemplate;

export const portraitLayer = artwork.layers.find(
  (layer): layer is PortraitLayer => layer.type === "portrait",
)!;
