import type { SpeakerDetails } from "@/components/SpeakerForm";
import {
  ARTWORK_SIZE,
  artwork,
  portraitLayer,
  type ArtworkLayer,
  type ArtworkTextSource,
  type TextLayer,
} from "@/config/artwork";
import {
  clampPortraitTransform,
  getCoveredImageDimensions,
  type PortraitTransform,
} from "@/lib/portraitTransform";

type ExportSpeakerImageOptions = {
  speaker: SpeakerDetails;
  photoUrl: string;
  portraitTransform: PortraitTransform;
};

const staticText: Record<Exclude<ArtworkTextSource, "name" | "role" | "topic">, string> = {
  brand: "Stiftungsmarktplatz",
  edition: "Dialog 2026",
  eventWord: "DIALOG",
  speakerLabel: "Speaker",
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The portrait could not be loaded."));
    image.src = source;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("The artwork could not be encoded."));
    }, "image/png");
  });
}

function layerText(source: ArtworkTextSource, speaker: SpeakerDetails) {
  if (source === "name") return speaker.name;
  if (source === "role") return `${speaker.jobTitle} · ${speaker.company}`;
  if (source === "topic") return speaker.topic;
  return staticText[source];
}

function wrapText(context: CanvasRenderingContext2D, text: string, maximumWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maximumWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawTextLayer(context: CanvasRenderingContext2D, layer: TextLayer, speaker: SpeakerDetails) {
  const family = artwork.typography[layer.fontFamily];
  context.save();
  context.textBaseline = "top";
  context.textAlign = "left";
  context.font = `${layer.fontWeight} ${layer.fontSize}px ${family}`;
  context.letterSpacing = `${layer.letterSpacing ?? 0}px`;
  const text = layer.uppercase ? layerText(layer.source, speaker).toUpperCase() : layerText(layer.source, speaker);
  const lines = wrapText(context, text, layer.width);
  lines.forEach((line, index) => {
    const y = layer.y + index * layer.lineHeight;
    if (layer.background) {
      const textWidth = context.measureText(line).width;
      context.fillStyle = layer.background.color;
      context.fillRect(
        layer.x - layer.background.paddingX,
        y - layer.background.paddingY,
        textWidth + layer.background.paddingX * 2,
        layer.fontSize + layer.background.paddingY * 2,
      );
    }
    if (layer.stroke) {
      context.strokeStyle = layer.stroke.color;
      context.lineWidth = layer.stroke.width;
      context.strokeText(line, layer.x, y);
    }
    if (layer.color !== "transparent") {
      context.fillStyle = layer.color;
      context.fillText(line, layer.x, y);
    }
  });
  context.restore();
}

function drawPortrait(context: CanvasRenderingContext2D, image: HTMLImageElement, transform: PortraitTransform) {
  const imageDimensions = { width: image.naturalWidth, height: image.naturalHeight };
  const clamped = clampPortraitTransform(transform, portraitLayer, imageDimensions);
  const covered = getCoveredImageDimensions(portraitLayer, imageDimensions);
  if (!covered) throw new Error("The portrait has invalid dimensions.");
  const width = covered.width * clamped.scale;
  const height = covered.height * clamped.scale;
  const centerX = portraitLayer.x + portraitLayer.width / 2 + clamped.x;
  const centerY = portraitLayer.y + portraitLayer.height / 2 + clamped.y;
  context.save();
  context.beginPath();
  context.rect(portraitLayer.x, portraitLayer.y, portraitLayer.width, portraitLayer.height);
  context.clip();
  context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
  context.restore();
}

function drawLayer(context: CanvasRenderingContext2D, layer: ArtworkLayer, speaker: SpeakerDetails, image: HTMLImageElement, transform: PortraitTransform) {
  if (layer.type === "background") {
    context.fillStyle = layer.color;
    context.fillRect(0, 0, ARTWORK_SIZE, ARTWORK_SIZE);
  } else if (layer.type === "shape") {
    context.save();
    context.globalAlpha = layer.opacity ?? 1;
    context.fillStyle = layer.color;
    context.beginPath();
    if (layer.shape === "circle") context.ellipse(layer.x + layer.width / 2, layer.y + layer.height / 2, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2);
    else context.rect(layer.x, layer.y, layer.width, layer.height);
    context.fill();
    if (layer.border) {
      context.strokeStyle = layer.border.color;
      context.lineWidth = layer.border.width;
      context.stroke();
    }
    context.restore();
  } else if (layer.type === "text") {
    drawTextLayer(context, layer, speaker);
  } else if (layer.type === "portrait") {
    drawPortrait(context, image, transform);
  } else if (layer.type === "rule") {
    context.fillStyle = layer.color;
    context.fillRect(layer.x, layer.y, layer.width, layer.height);
  } else {
    context.save();
    context.strokeStyle = layer.ruleColor;
    context.beginPath();
    context.moveTo(layer.x, layer.y);
    context.lineTo(layer.x + layer.width, layer.y);
    context.stroke();
    context.fillStyle = layer.color;
    context.textBaseline = "top";
    context.font = `700 ${layer.fontSize}px ${artwork.typography.sans}`;
    context.letterSpacing = `${layer.fontSize * 0.08}px`;
    context.fillText(layer.text, layer.x, layer.y + 20);
    context.fillStyle = artwork.colors.accent;
    context.fillRect(layer.badge.x, layer.badge.y, layer.badge.size, layer.badge.size);
    context.fillStyle = artwork.colors.background;
    context.font = `700 16px ${artwork.typography.sans}`;
    context.letterSpacing = "0px";
    context.textAlign = "center";
    context.fillText(layer.badge.label, layer.badge.x + layer.badge.size / 2, layer.badge.y + 18);
    context.restore();
  }
}

export function createSpeakerFilename(name: string) {
  const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `speaker-${slug || "motiv"}.png`;
}

export async function exportSpeakerImage(options: ExportSpeakerImageOptions) {
  await document.fonts.ready;
  const image = await loadImage(options.photoUrl);
  const canvas = document.createElement("canvas");
  canvas.width = ARTWORK_SIZE;
  canvas.height = ARTWORK_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");

  artwork.layers.forEach((layer) => drawLayer(context, layer, options.speaker, image, options.portraitTransform));

  const blob = await canvasToBlob(canvas);
  const objectUrl = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = createSpeakerFilename(options.speaker.name);
    link.click();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
}
