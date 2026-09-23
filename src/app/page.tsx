"use client";

import { useEffect, useState } from "react";
import { SpeakerForm, type SpeakerDetails } from "@/components/SpeakerForm";
import { SpeakerPreview } from "@/components/SpeakerPreview";
import { theme, themeVariables } from "@/config/theme";

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
    setPhoto({ url: URL.createObjectURL(file), fileName: file.name });
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
            onPhotoRemove={() => setPhoto(null)}
          />
          <SpeakerPreview speaker={speaker} photoUrl={photo?.url ?? null} />
        </div>
      </main>
    </div>
  );
}
