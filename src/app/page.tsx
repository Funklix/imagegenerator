"use client";

import { useState } from "react";
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

  function updateSpeaker(field: keyof SpeakerDetails, value: string) {
    setSpeaker((current) => ({ ...current, [field]: value }));
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
            Trage deine Speaker-Daten ein. Im nächsten Schritt ergänzt du dein
            Foto und erhältst dein fertiges Social-Media-Motiv.
          </p>
        </section>

        <div className="workspace">
          <SpeakerForm values={speaker} onChange={updateSpeaker} />
          <SpeakerPreview speaker={speaker} />
        </div>
      </main>
    </div>
  );
}
