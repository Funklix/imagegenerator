"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEvent,
  type SetStateAction,
} from "react";
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

type SpeakerPreviewProps = {
  speaker: SpeakerDetails;
  photoUrl: string | null;
  portraitTransform: PortraitTransform;
  onPortraitTransformChange: Dispatch<SetStateAction<PortraitTransform>>;
  onPhotoReadyChange: (ready: boolean) => void;
};

type Dimensions = { width: number; height: number };

const staticText: Record<Exclude<ArtworkTextSource, "name" | "role" | "topic">, string> = {
  brand: "Stiftungsmarktplatz",
  edition: "Dialog 2026",
  eventWord: "DIALOG",
  speakerLabel: "Speaker",
};

function displayValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

function layerText(source: ArtworkTextSource, speaker: SpeakerDetails) {
  if (source === "name") return displayValue(speaker.name, "Dein Name");
  if (source === "role") {
    return `${displayValue(speaker.jobTitle, "Dein Jobtitel")} · ${displayValue(speaker.company, "Dein Unternehmen")}`;
  }
  if (source === "topic") return displayValue(speaker.topic, "Dein Speaker-Thema");
  return staticText[source];
}

function geometryStyle(layer: { x: number; y: number; width: number; height?: number }) {
  return { left: layer.x, top: layer.y, width: layer.width, height: layer.height };
}

function textStyle(layer: TextLayer): CSSProperties {
  const paddingX = layer.background?.paddingX ?? 0;
  const paddingY = layer.background?.paddingY ?? 0;

  return {
    left: layer.x - paddingX,
    top: layer.y - paddingY,
    width: layer.width + paddingX * 2,
    color: layer.color,
    fontFamily: artwork.typography[layer.fontFamily],
    fontSize: layer.fontSize,
    fontWeight: layer.fontWeight,
    lineHeight: `${layer.lineHeight}px`,
    letterSpacing: layer.letterSpacing,
    textTransform: layer.uppercase ? "uppercase" : undefined,
    WebkitTextStroke: layer.stroke
      ? `${layer.stroke.width}px ${layer.stroke.color}`
      : undefined,
  };
}

function textContent(layer: TextLayer, speaker: SpeakerDetails) {
  const text = layerText(layer.source, speaker);

  if (!layer.background) return text;

  return (
    <span
      className="text-highlight"
      style={{
        background: layer.background.color,
        padding: `${layer.background.paddingY}px ${layer.background.paddingX}px`,
      }}
    >
      {text}
    </span>
  );
}

export function SpeakerPreview({
  speaker,
  photoUrl,
  portraitTransform,
  onPortraitTransformChange,
  onPhotoReadyChange,
}: SpeakerPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; clientX: number; clientY: number } | null>(null);
  const [displayScale, setDisplayScale] = useState(0);
  const [image, setImage] = useState<Dimensions>({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const coveredImage = getCoveredImageDimensions(portraitLayer, image);
  const displayedTransform = clampPortraitTransform(portraitTransform, portraitLayer, image);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const updateViewport = () => {
      const { width } = element.getBoundingClientRect();
      if (width > 0) setDisplayScale(width / ARTWORK_SIZE);
    };
    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!coveredImage) return;
    const clamped = clampPortraitTransform(portraitTransform, portraitLayer, image);
    if (clamped.x !== portraitTransform.x || clamped.y !== portraitTransform.y || clamped.scale !== portraitTransform.scale) {
      onPortraitTransformChange(clamped);
    }
  }, [coveredImage, image, onPortraitTransformChange, portraitTransform]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!coveredImage || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY };
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || displayScale <= 0) return;
    const deltaX = (event.clientX - drag.clientX) / displayScale;
    const deltaY = (event.clientY - drag.clientY) / displayScale;
    drag.clientX = event.clientX;
    drag.clientY = event.clientY;
    onPortraitTransformChange((current) =>
      clampPortraitTransform({ ...current, x: current.x + deltaX, y: current.y + deltaY }, portraitLayer, image),
    );
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  }

  function renderLayer(layer: ArtworkLayer) {
    if (layer.type === "background") {
      return <div key={layer.id} className="template-layer background-layer" style={{ background: layer.color }} />;
    }
    if (layer.type === "shape") {
      return (
        <div key={layer.id} className="template-layer shape-layer" style={{ ...geometryStyle(layer), borderRadius: layer.shape === "circle" ? "50%" : undefined, background: layer.color, opacity: layer.opacity, border: layer.border ? `${layer.border.width}px solid ${layer.border.color}` : undefined }} />
      );
    }
    if (layer.type === "text") {
      return <div key={layer.id} className="template-layer text-layer" style={textStyle(layer)}>{textContent(layer, speaker)}</div>;
    }
    if (layer.type === "rule") {
      return <div key={layer.id} className="template-layer rule-layer" style={{ ...geometryStyle(layer), background: layer.color }} />;
    }
    if (layer.type === "footer") {
      return (
        <div key={layer.id} className="template-layer footer-layer" style={{ ...geometryStyle(layer), color: layer.color, borderColor: layer.ruleColor, fontSize: layer.fontSize }}>
          <span>{layer.text}</span>
          <span className="footer-badge" style={{ left: layer.badge.x - layer.x, top: layer.badge.y - layer.y, width: layer.badge.size, height: layer.badge.size }}>{layer.badge.label}</span>
        </div>
      );
    }
    return (
      <div key={layer.id} className={`template-layer portrait-layer${photoUrl ? " is-adjustable" : ""}${isDragging ? " is-dragging" : ""}`} style={geometryStyle(layer)} aria-hidden={!photoUrl} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}>
        {photoUrl ? (
          <div className="portrait-photo-frame" style={{ left: `calc(50% + ${displayedTransform.x}px)`, top: `calc(50% + ${displayedTransform.y}px)`, width: coveredImage?.width, height: coveredImage?.height }}>
            {/* Object URLs are local and cannot use Next.js image optimization. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="portrait-photo" src={photoUrl} alt={`Portrait von ${displayValue(speaker.name, "der Speaker-Person")}`} draggable={false} onLoad={(event) => { setImage({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }); onPhotoReadyChange(true); }} onError={() => onPhotoReadyChange(false)} style={{ transform: `scale(${displayedTransform.scale})` }} />
          </div>
        ) : <><span className="portrait-head" /><span className="portrait-body" /></>}
      </div>
    );
  }

  return (
    <section className="preview-panel" aria-labelledby="preview-title">
      <div className="preview-heading"><div><p className="section-kicker">Live-Vorschau</p><h2 id="preview-title">Dein Motiv</h2></div><span className="format-label">1:1 Format</span></div>
      <div ref={wrapperRef} className="artwork-wrapper">
        <div className="artwork" style={{ width: ARTWORK_SIZE, height: ARTWORK_SIZE, transform: `scale(${displayScale})` }} aria-label="Vorschau des Speaker-Motivs">
          {artwork.layers.map(renderLayer)}
        </div>
      </div>
      <p className="preview-note">Freigestellte PNGs wirken im Motiv besonders stark.</p>
    </section>
  );
}
