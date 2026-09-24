"use client";

import { useCallback, useEffect, useState } from "react";
import { SpeakerForm, type SpeakerDetails } from "@/components/SpeakerForm";
import { SpeakerPreview } from "@/components/SpeakerPreview";
import { theme, themeVariables } from "@/config/theme";
import {
  DEFAULT_PORTRAIT_TRANSFORM,
  type PortraitTransform,
} from "@/lib/portraitTransform";
import { exportSpeakerImage } from "@/lib/exportSpeakerImage";

const initialSpeaker: SpeakerDetails = {
  name: "Max Mustermann",
  jobTitle: "Geschäftsführer",
  company: "Musterstiftung",
  topic: "Digitale Kommunikation für Stiftungen",
};

export default function Home() {
  const [speaker, setSpeaker] = useState<SpeakerDetails>(initialSpeaker);
  const [photo, setPhoto] = useState<{ url: string; fileName: string } | null>(
    null,
  );
  const [portraitTransform, setPortraitTransform] = useState<PortraitTransform>(
    DEFAULT_PORTRAIT_TRANSFORM,
  );
  const [isPhotoReady, setIsPhotoReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photo) {
        URL.revokeObjectURL(photo.url);
      }
    };
  }, [photo]);

  function updateSpeaker(field: keyof SpeakerDetails, value: string) {
    setSpeaker((current) => ({ ...current, [field]: value }));
  }

  function selectPhoto(file: File) {
    setExportError(null);
    setIsPhotoReady(false);
    setPhoto({ url: URL.createObjectURL(file), fileName: file.name });
    setPortraitTransform(DEFAULT_PORTRAIT_TRANSFORM);
  }

  function removePhoto() {
    setExportError(null);
    setIsPhotoReady(false);
    setPhoto(null);
    setPortraitTransform(DEFAULT_PORTRAIT_TRANSFORM);
  }

  const handlePhotoReadyChange = useCallback((ready: boolean) => {
    setIsPhotoReady(ready);
  }, []);

  const hasRequiredDetails = Object.values(speaker).every(
    (value) => value.trim().length > 0,
  );
  const canExport = Boolean(
    photo &&
      isPhotoReady &&
      hasRequiredDetails,
  );

  async function handleExport() {
    if (!photo || !canExport || isExporting) return;
    setIsExporting(true);
    setExportError(null);
    try {
      await exportSpeakerImage({
        speaker,
        photoUrl: photo.url,
        portraitTransform,
      });
    } catch {
      setExportError(
        "Das Motiv konnte nicht erstellt werden. Bitte versuche es erneut.",
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="app-shell" style={themeVariables}>
      <header className="site-header">
        <div className="header-inner">
          <div className="wordmark">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>{theme.brandName}</span>
          </div>
          <p className="context-label">Speaker Asset Generator</p>
        </div>
      </header>

      <main className="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">Social-Media-Motiv</p>
          <h1 id="page-title">Dein Speaker-Motiv erstellen</h1>
          <p className="intro-copy">
            Trage deine Speaker-Daten ein und ergänze dein Foto für eine direkte
            Vorschau deines Social-Media-Motivs.
          </p>
        </section>

        <div className="workspace">
          <SpeakerForm
            values={speaker}
            onChange={updateSpeaker}
            photoFileName={photo?.fileName ?? null}
            onPhotoSelect={selectPhoto}
            onPhotoRemove={removePhoto}
            portraitTransform={portraitTransform}
            onPortraitTransformChange={setPortraitTransform}
            canExport={canExport}
            isExporting={isExporting}
            exportError={exportError}
            onExport={handleExport}
          />
          <SpeakerPreview
            speaker={speaker}
            photoUrl={photo?.url ?? null}
            portraitTransform={portraitTransform}
            onPortraitTransformChange={setPortraitTransform}
            onPhotoReadyChange={handlePhotoReadyChange}
          />
        </div>
      </main>
    </div>
  );
}
