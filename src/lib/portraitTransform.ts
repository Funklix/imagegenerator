export const MIN_PORTRAIT_SCALE = 1;
export const MAX_PORTRAIT_SCALE = 1.8;

export type PortraitTransform = {
  x: number;
  y: number;
  scale: number;
};

type Dimensions = {
  width: number;
  height: number;
};

export const DEFAULT_PORTRAIT_TRANSFORM: PortraitTransform = {
  x: 0,
  y: 0,
  scale: MIN_PORTRAIT_SCALE,
};

function isValidDimensions(dimensions: Dimensions) {
  return (
    Number.isFinite(dimensions.width) &&
    Number.isFinite(dimensions.height) &&
    dimensions.width > 0 &&
    dimensions.height > 0
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getCoveredImageDimensions(
  viewport: Dimensions,
  image: Dimensions,
): Dimensions | null {
  if (!isValidDimensions(viewport) || !isValidDimensions(image)) {
    return null;
  }

  const coverScale = Math.max(
    viewport.width / image.width,
    viewport.height / image.height,
  );

  return {
    width: image.width * coverScale,
    height: image.height * coverScale,
  };
}

export function clampPortraitTransform(
  transform: PortraitTransform,
  viewport: Dimensions,
  image: Dimensions,
): PortraitTransform {
  const scale = clamp(
    Number.isFinite(transform.scale)
      ? transform.scale
      : DEFAULT_PORTRAIT_TRANSFORM.scale,
    MIN_PORTRAIT_SCALE,
    MAX_PORTRAIT_SCALE,
  );
  const coveredImage = getCoveredImageDimensions(viewport, image);

  if (!coveredImage) {
    return {
      x: Number.isFinite(transform.x) ? transform.x : 0,
      y: Number.isFinite(transform.y) ? transform.y : 0,
      scale,
    };
  }

  const maximumX = Math.max(
    0,
    (coveredImage.width * scale - viewport.width) / 2,
  );
  const maximumY = Math.max(
    0,
    (coveredImage.height * scale - viewport.height) / 2,
  );

  return {
    x: clamp(Number.isFinite(transform.x) ? transform.x : 0, -maximumX, maximumX),
    y: clamp(Number.isFinite(transform.y) ? transform.y : 0, -maximumY, maximumY),
    scale,
  };
}
