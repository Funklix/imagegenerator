import type { SpeakerDetails } from "@/components/SpeakerForm";
import { ARTWORK_SIZE, artwork } from "@/config/artwork";
import {
  clampPortraitTransform,
  getCoveredImageDimensions,
  type PortraitTransform,
} from "@/lib/portraitTransform";

type Dimensions = { width: number; height: number };

type ExportSpeakerImageOptions = {
  speaker: SpeakerDetails;
  photoUrl: string;
  portraitTransform: PortraitTransform;
  previewPortrait: Dimensions;
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

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maximumWidth: number,
) {
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

function drawLines(
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + Math.max(lines.length, 1) * lineHeight;
}

function drawArtworkBackground(context: CanvasRenderingContext2D) {
  const size = ARTWORK_SIZE;
  context.fillStyle = artwork.colors.background;
  context.fillRect(0, 0, size, size);

  const ring = artwork.decorations.ring;
  context.strokeStyle = artwork.colors.accent;
  context.lineWidth = ring.border;
  context.beginPath();
  context.arc(
    size * (1 - ring.right - ring.size / 2),
    size * (ring.top + ring.size / 2),
    size * ring.size / 2 - ring.border / 2,
    0,
    Math.PI * 2,
  );
  context.stroke();

  const circle = artwork.decorations.circle;
  context.fillStyle = artwork.colors.secondary;
  context.beginPath();
  context.arc(
    size * (1 - circle.right - circle.size / 2),
    size * (1 - circle.bottom - circle.size / 2),
    size * circle.size / 2,
    0,
    Math.PI * 2,
  );
  context.fill();
}

function drawPortrait(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: PortraitTransform,
  previewPortrait: Dimensions,
) {
  const bounds = {
    x: ARTWORK_SIZE * (1 - artwork.portrait.right - artwork.portrait.width),
    y: ARTWORK_SIZE * (1 - artwork.portrait.bottom - artwork.portrait.height),
    width: ARTWORK_SIZE * artwork.portrait.width,
    height: ARTWORK_SIZE * artwork.portrait.height,
  };
  const imageDimensions = { width: image.naturalWidth, height: image.naturalHeight };
  const clamped = clampPortraitTransform(transform, previewPortrait, imageDimensions);
  const covered = getCoveredImageDimensions(bounds, imageDimensions);
  if (!covered) throw new Error("The portrait has invalid dimensions.");

  const xRatio = bounds.width / previewPortrait.width;
  const yRatio = bounds.height / previewPortrait.height;
  const width = covered.width * clamped.scale;
  const height = covered.height * clamped.scale;
  const centerX = bounds.x + bounds.width / 2 + clamped.x * xRatio;
  const centerY = bounds.y + bounds.height / 2 + clamped.y * yRatio;

  context.save();
  context.beginPath();
  context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.clip();
  context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
  context.restore();
}

function drawArtworkText(context: CanvasRenderingContext2D, speaker: SpeakerDetails) {
  const size = ARTWORK_SIZE;
  const padding = size * artwork.padding;
  context.fillStyle = artwork.colors.text;
  context.textBaseline = "top";

  context.font = `700 24px ${artwork.typography.sans}`;
  context.fillText("Stiftungsmarktplatz", padding, padding);

  const edition = "DIALOG 2026";
  context.font = `700 16px ${artwork.typography.sans}`;
  const editionWidth = context.measureText(edition).width + 36;
  context.strokeStyle = artwork.colors.subtleText;
  context.lineWidth = 1;
  context.strokeRect(size - padding - editionWidth, padding - 12, editionWidth, 42);
  context.fillText(edition, size - padding - editionWidth + 18, padding);

  const copyX = size * artwork.copy.left;
  const copyWidth = size * artwork.copy.width;
  let y = 600;
  context.fillStyle = artwork.colors.accent;
  context.font = `700 20px ${artwork.typography.sans}`;
  context.fillText("SPEAKER", copyX, y);
  y += 42;

  context.fillStyle = artwork.colors.text;
  context.font = `500 ${artwork.typography.name}px ${artwork.typography.serif}`;
  y = drawLines(context, wrapText(context, speaker.name, copyWidth), copyX, y, 50) + 8;

  context.font = `400 ${artwork.typography.role}px ${artwork.typography.sans}`;
  y = drawLines(
    context,
    wrapText(context, `${speaker.jobTitle} · ${speaker.company}`, copyWidth),
    copyX,
    y,
    19,
  ) + 20;

  context.fillStyle = artwork.colors.secondary;
  context.fillRect(copyX, y, 68, 4);
  y += 28;
  context.fillStyle = artwork.colors.text;
  context.font = `700 ${artwork.typography.topic}px ${artwork.typography.sans}`;
  drawLines(context, wrapText(context, speaker.topic, copyWidth), copyX, y, 22);

  const footerY = size * (1 - artwork.footer.bottom) - 24;
  context.strokeStyle = artwork.colors.rule;
  context.beginPath();
  context.moveTo(padding, footerY - 20);
  context.lineTo(size - padding, footerY - 20);
  context.stroke();
  context.font = `700 14px ${artwork.typography.sans}`;
  context.fillText("IMPULSE, DIE WEITERBRINGEN.", padding, footerY);

  const markSize = 48;
  context.fillStyle = artwork.colors.accent;
  context.fillRect(size - padding - markSize, footerY - 8, markSize, markSize);
  context.fillStyle = artwork.colors.background;
  context.font = `700 16px ${artwork.typography.sans}`;
  context.textAlign = "center";
  context.fillText("SM", size - padding - markSize / 2, footerY + 7);
  context.textAlign = "start";
}

export function createSpeakerFilename(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `speaker-${slug || "motiv"}.png`;
}

export async function exportSpeakerImage(options: ExportSpeakerImageOptions) {
  if (options.previewPortrait.width <= 0 || options.previewPortrait.height <= 0) {
    throw new Error("The preview portrait is not ready.");
  }

  await document.fonts.ready;
  const image = await loadImage(options.photoUrl);
  const canvas = document.createElement("canvas");
  canvas.width = ARTWORK_SIZE;
  canvas.height = ARTWORK_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");

  drawArtworkBackground(context);
  drawPortrait(context, image, options.portraitTransform, options.previewPortrait);
  drawArtworkText(context, options.speaker);

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
