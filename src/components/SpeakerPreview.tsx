"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type PointerEvent,
  type SetStateAction,
} from "react";
import type { SpeakerDetails } from "@/components/SpeakerForm";
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
};

type Dimensions = { width: number; height: number };

function displayValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

export function SpeakerPreview({
  speaker,
  photoUrl,
  portraitTransform,
  onPortraitTransformChange,
}: SpeakerPreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const [viewport, setViewport] = useState<Dimensions>({ width: 0, height: 0 });
  const [image, setImage] = useState<Dimensions>({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const coveredImage = getCoveredImageDimensions(viewport, image);
  const displayedTransform = clampPortraitTransform(
    portraitTransform,
    viewport,
    image,
  );

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) return;

    const updateViewport = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width > 0 && height > 0) setViewport({ width, height });
    };

    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(element);
    return () => observer.disconnect();
  }, [photoUrl]);

  useEffect(() => {
    if (!coveredImage) return;

    const clamped = clampPortraitTransform(portraitTransform, viewport, image);
    if (
      clamped.x !== portraitTransform.x ||
      clamped.y !== portraitTransform.y ||
      clamped.scale !== portraitTransform.scale
    ) {
      onPortraitTransformChange(clamped);
    }
  }, [coveredImage, image, onPortraitTransformChange, portraitTransform, viewport]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!coveredImage || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.clientX;
    const deltaY = event.clientY - drag.clientY;
    drag.clientX = event.clientX;
    drag.clientY = event.clientY;

    onPortraitTransformChange((current) =>
      clampPortraitTransform(
        { ...current, x: current.x + deltaX, y: current.y + deltaY },
        viewport,
        image,
      ),
    );
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
  }
  return (
    <section className="preview-panel" aria-labelledby="preview-title">
      <div className="preview-heading">
        <div>
          <p className="section-kicker">Live-Vorschau</p>
          <h2 id="preview-title">Dein Motiv</h2>
        </div>
        <span className="format-label">1:1 Format</span>
      </div>

      <div className="artwork" aria-label="Vorschau des Speaker-Motivs">
        <div className="artwork-topline">
          <span>Stiftungs­marktplatz</span>
          <span className="artwork-edition">Dialog 2026</span>
        </div>

        <div
          ref={viewportRef}
          className={`portrait-placeholder${photoUrl ? " is-adjustable" : ""}${isDragging ? " is-dragging" : ""}`}
          aria-hidden={!photoUrl}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
        >
          {photoUrl ? (
            <div
              className="portrait-photo-frame"
              style={{
                left: `calc(50% + ${displayedTransform.x}px)`,
                top: `calc(50% + ${displayedTransform.y}px)`,
                width: coveredImage?.width,
                height: coveredImage?.height,
              }}
            >
              {/* The object URL is local and cannot use Next.js image optimization. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="portrait-photo"
                src={photoUrl}
                alt={`Portrait von ${displayValue(speaker.name, "der Speaker-Person")}`}
                draggable={false}
                onLoad={(event) =>
                  setImage({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })
                }
                style={{ transform: `scale(${displayedTransform.scale})` }}
              />
            </div>
          ) : (
            <>
              <span className="portrait-head" />
              <span className="portrait-body" />
            </>
          )}
        </div>

        <div className="artwork-copy">
          <p className="artwork-label">Speaker</p>
          <h3>{displayValue(speaker.name, "Dein Name")}</h3>
          <p className="speaker-role">
            {displayValue(speaker.jobTitle, "Dein Jobtitel")}
            <span aria-hidden="true"> · </span>
            {displayValue(speaker.company, "Dein Unternehmen")}
          </p>
          <div className="topic-rule" />
          <p className="topic">
            {displayValue(speaker.topic, "Dein Speaker-Thema")}
          </p>
        </div>

        <div className="artwork-footer">
          <span>Impulse, die weiterbringen.</span>
          <span aria-hidden="true">SM</span>
        </div>
      </div>

      <p className="preview-note">Vorschau des späteren Social-Media-Motivs</p>
    </section>
  );
}
