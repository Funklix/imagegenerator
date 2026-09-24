import type { SpeakerDetails } from "@/components/SpeakerForm";
import { ARTWORK_SIZE, artwork } from "@/config/artwork";
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
    ring.x,
    ring.y,
    ring.size / 2 - ring.border / 2,
    0,
    Math.PI * 2,
  );
  context.stroke();

  const circle = artwork.decorations.circle;
  context.fillStyle = artwork.colors.secondary;
  context.beginPath();
  context.arc(
    circle.x,
    circle.y,
    circle.size / 2,
    0,
    Math.PI * 2,
  );
  context.fill();
}

function drawPortrait(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: PortraitTransform,
) {
  const bounds = artwork.portrait;
  const imageDimensions = {
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
  const clamped = clampPortraitTransform(transform, bounds, imageDimensions);
  const covered = getCoveredImageDimensions(bounds, imageDimensions);
  if (!covered) throw new Error("The portrait has invalid dimensions.");

  const width = covered.width * clamped.scale;
  const height = covered.height * clamped.scale;
  const centerX = bounds.x + bounds.width / 2 + clamped.x;
  const centerY = bounds.y + bounds.height / 2 + clamped.y;

  context.save();
  context.beginPath();
  context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.clip();
  context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
  context.restore();
}

function drawArtworkText(context: CanvasRenderingContext2D, speaker: SpeakerDetails) {
  const size = ARTWORK_SIZE;
  const header = artwork.header;
  context.fillStyle = artwork.colors.text;
  context.textBaseline = "top";

  context.font = `700 ${header.brandFontSize}px ${artwork.typography.sans}`;
  context.fillText("Stiftungsmarktplatz", header.x, header.y);

  const edition = "DIALOG 2026";
  context.font = `700 ${header.editionFontSize}px ${artwork.typography.sans}`;
  context.letterSpacing = `${header.editionFontSize * 0.1}px`;
  const editionWidth = context.measureText(edition).width + header.editionPaddingX * 2;
  context.strokeStyle = artwork.colors.subtleText;
  context.lineWidth = 1;
  context.strokeRect(
    size - header.editionRight - editionWidth,
    header.editionTop,
    editionWidth,
    header.editionHeight,
  );
  context.fillText(
    edition,
    size - header.editionRight - editionWidth + header.editionPaddingX,
    header.y,
  );
  context.letterSpacing = "0px";

  const copyX = artwork.copy.x;
  const copyWidth = artwork.copy.width;
  let y = artwork.copy.y;
  context.fillStyle = artwork.colors.accent;
  context.font = `700 ${artwork.copy.labelFontSize}px ${artwork.typography.sans}`;
  context.letterSpacing = `${artwork.copy.labelFontSize * 0.15}px`;
  context.fillText("SPEAKER", copyX, y);
  context.letterSpacing = "0px";
  y += artwork.copy.labelLineHeight + artwork.copy.labelGap;

  context.fillStyle = artwork.colors.text;
  context.font = `${artwork.typography.name.weight} ${artwork.typography.name.size}px ${artwork.typography.serif}`;
  context.letterSpacing = `${artwork.typography.name.letterSpacing}px`;
  y =
    drawLines(
      context,
      wrapText(context, speaker.name, copyWidth),
      copyX,
      y,
      artwork.typography.name.lineHeight,
    ) + artwork.copy.nameGap;
  context.letterSpacing = "0px";

  context.font = `${artwork.typography.role.weight} ${artwork.typography.role.size}px ${artwork.typography.sans}`;
  y = drawLines(
    context,
    wrapText(context, `${speaker.jobTitle} · ${speaker.company}`, copyWidth),
    copyX,
    y,
    artwork.typography.role.lineHeight,
  ) + artwork.copy.roleGap;

  context.fillStyle = artwork.colors.secondary;
  context.fillRect(copyX, y, artwork.copy.ruleWidth, artwork.copy.ruleHeight);
  y += artwork.copy.ruleHeight + artwork.copy.ruleGap;
  context.fillStyle = artwork.colors.text;
  context.font = `${artwork.typography.topic.weight} ${artwork.typography.topic.size}px ${artwork.typography.sans}`;
  drawLines(
    context,
    wrapText(context, speaker.topic, copyWidth),
    copyX,
    y,
    artwork.typography.topic.lineHeight,
  );

  context.strokeStyle = artwork.colors.rule;
  context.beginPath();
  context.moveTo(artwork.footer.left, artwork.footer.ruleY);
  context.lineTo(size - artwork.footer.right, artwork.footer.ruleY);
  context.stroke();
  context.font = `700 ${artwork.footer.fontSize}px ${artwork.typography.sans}`;
  context.letterSpacing = `${artwork.footer.fontSize * 0.08}px`;
  context.fillText(
    "IMPULSE, DIE WEITERBRINGEN.",
    artwork.footer.left,
    artwork.footer.textY,
  );
  context.letterSpacing = "0px";

  const markSize = artwork.footer.badgeSize;
  context.fillStyle = artwork.colors.accent;
  context.fillRect(artwork.footer.badgeX, artwork.footer.badgeY, markSize, markSize);
  context.fillStyle = artwork.colors.background;
  context.font = `700 ${artwork.footer.badgeFontSize}px ${artwork.typography.sans}`;
  context.textAlign = "center";
  context.fillText("SM", artwork.footer.badgeX + markSize / 2, artwork.footer.badgeY + 15);
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
  await document.fonts.ready;
  const image = await loadImage(options.photoUrl);
  const canvas = document.createElement("canvas");
  canvas.width = ARTWORK_SIZE;
  canvas.height = ARTWORK_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");

  drawArtworkBackground(context);
  drawPortrait(context, image, options.portraitTransform);
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
