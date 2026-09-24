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
  background: "#d7b83e",
  plum: "#4c277f",
  magenta: "#95146f",
  violet: "#6e358f",
  secondary: theme.brandSecondary,
  accent: "#e8cf67",
  text: "#fffdf8",
  muted: "rgba(255, 253, 248, 0.82)",
  ghost: "rgba(255, 253, 248, 0.22)",
  rule: "rgba(255, 253, 248, 0.55)",
} as const;

export const editorialSpeakerTemplate = {
  id: "editorial-speaker",
  size: ARTWORK_SIZE,
  colors,
  typography: {
    sans: '"Arial Narrow", "Roboto Condensed", Arial, Helvetica, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
  },
  layers: [
    { id: "background", type: "background", color: colors.background },
    {
      id: "violet-rail",
      type: "shape",
      shape: "rectangle",
      x: 0,
      y: 0,
      width: 32,
      height: 1080,
      color: colors.plum,
    },
    {
      id: "magenta-panel",
      type: "shape",
      shape: "rectangle",
      x: 32,
      y: 356,
      width: 654,
      height: 634,
      color: colors.magenta,
    },
    {
      id: "violet-tile",
      type: "shape",
      shape: "rectangle",
      x: 92,
      y: 119,
      width: 196,
      height: 170,
      color: colors.violet,
    },
    {
      id: "magenta-tile",
      type: "shape",
      shape: "rectangle",
      x: 306,
      y: 119,
      width: 196,
      height: 170,
      color: colors.magenta,
    },
    {
      id: "tile-disc-one",
      type: "shape",
      shape: "circle",
      x: 115,
      y: 145,
      width: 64,
      height: 64,
      color: "transparent",
      border: { color: colors.ghost, width: 3 },
    },
    {
      id: "tile-disc-two",
      type: "shape",
      shape: "circle",
      x: 157,
      y: 179,
      width: 89,
      height: 89,
      color: "transparent",
      border: { color: colors.ghost, width: 3 },
    },
    {
      id: "tile-line-one",
      type: "rule",
      x: 328,
      y: 151,
      width: 145,
      height: 3,
      color: colors.ghost,
    },
    {
      id: "tile-line-two",
      type: "rule",
      x: 328,
      y: 177,
      width: 105,
      height: 3,
      color: colors.ghost,
    },
    {
      id: "flower-one",
      type: "shape",
      shape: "circle",
      x: 845,
      y: 56,
      width: 176,
      height: 176,
      color: colors.magenta,
      opacity: 0.88,
    },
    {
      id: "flower-two",
      type: "shape",
      shape: "circle",
      x: 768,
      y: 98,
      width: 176,
      height: 176,
      color: colors.violet,
      opacity: 0.88,
    },
    {
      id: "flower-center",
      type: "shape",
      shape: "circle",
      x: 860,
      y: 130,
      width: 88,
      height: 88,
      color: colors.accent,
      border: { color: colors.text, width: 5 },
    },
    {
      id: "brand",
      type: "text",
      source: "brand",
      x: 92,
      y: 55,
      width: 480,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 27,
      fontWeight: 700,
      lineHeight: 28,
      letterSpacing: -0.5,
    },
    {
      id: "edition",
      type: "text",
      source: "edition",
      x: 534,
      y: 61,
      width: 230,
      color: colors.plum,
      fontFamily: "sans",
      fontSize: 17,
      fontWeight: 700,
      lineHeight: 20,
      letterSpacing: 2.8,
      uppercase: true,
    },
    {
      id: "event-word",
      type: "text",
      source: "eventWord",
      x: 105,
      y: 172,
      width: 430,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 51,
      fontWeight: 700,
      lineHeight: 54,
      letterSpacing: -1.5,
    },
    {
      id: "portrait",
      type: "portrait",
      x: 568,
      y: 239,
      width: 512,
      height: 751,
    },
    {
      id: "speaker-label",
      type: "text",
      source: "speakerLabel",
      x: 92,
      y: 411,
      width: 260,
      color: colors.accent,
      fontFamily: "sans",
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 22,
      letterSpacing: 4,
      uppercase: true,
    },
    {
      id: "name",
      type: "text",
      source: "name",
      x: 88,
      y: 462,
      width: 535,
      color: colors.text,
      fontFamily: "serif",
      fontSize: 72,
      fontWeight: 500,
      lineHeight: 70,
      letterSpacing: -3.2,
    },
    {
      id: "role",
      type: "text",
      source: "role",
      x: 92,
      y: 626,
      width: 430,
      color: colors.muted,
      fontFamily: "sans",
      fontSize: 19,
      fontWeight: 700,
      lineHeight: 26,
    },
    {
      id: "topic-rule",
      type: "rule",
      x: 92,
      y: 706,
      width: 76,
      height: 6,
      color: colors.accent,
    },
    {
      id: "topic",
      type: "text",
      source: "topic",
      x: 92,
      y: 741,
      width: 445,
      color: colors.text,
      fontFamily: "sans",
      fontSize: 27,
      fontWeight: 700,
      lineHeight: 34,
    },
    {
      id: "foreground-bar",
      type: "shape",
      shape: "rectangle",
      x: 1010,
      y: 316,
      width: 18,
      height: 310,
      color: colors.magenta,
    },
    {
      id: "footer",
      type: "footer",
      x: 92,
      y: 1012,
      width: 896,
      color: colors.text,
      ruleColor: colors.rule,
      text: "IMPULSE, DIE WEITERBRINGEN.",
      fontSize: 14,
      badge: { x: 932, y: 994, size: 58, label: "S" },
    },
  ] satisfies ArtworkLayer[],
} as const;

export const artwork = editorialSpeakerTemplate;

export const portraitLayer = artwork.layers.find(
  (layer): layer is PortraitLayer => layer.type === "portrait",
)!;
