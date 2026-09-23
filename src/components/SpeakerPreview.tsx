import type { SpeakerDetails } from "@/components/SpeakerForm";

type SpeakerPreviewProps = {
  speaker: SpeakerDetails;
  photoUrl: string | null;
};

function displayValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

export function SpeakerPreview({ speaker, photoUrl }: SpeakerPreviewProps) {
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

        <div className="portrait-placeholder" aria-hidden={!photoUrl}>
          {photoUrl ? (
            // The object URL is local and cannot use Next.js image optimization.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="portrait-photo"
              src={photoUrl}
              alt={`Portrait von ${displayValue(speaker.name, "der Speaker-Person")}`}
            />
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
