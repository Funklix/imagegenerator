import { PhotoUpload } from "@/components/PhotoUpload";
import {
  DEFAULT_PORTRAIT_TRANSFORM,
  MAX_PORTRAIT_SCALE,
  MIN_PORTRAIT_SCALE,
  type PortraitTransform,
} from "@/lib/portraitTransform";

export type SpeakerDetails = {
  name: string;
  jobTitle: string;
  company: string;
  topic: string;
};

type SpeakerFormProps = {
  values: SpeakerDetails;
  onChange: (field: keyof SpeakerDetails, value: string) => void;
  photoFileName: string | null;
  onPhotoSelect: (file: File) => void;
  onPhotoRemove: () => void;
  portraitTransform: PortraitTransform;
  onPortraitTransformChange: (transform: PortraitTransform) => void;
  canExport: boolean;
  isExporting: boolean;
  exportError: string | null;
  onExport: () => void;
};

const fields: Array<{
  key: keyof SpeakerDetails;
  label: string;
  placeholder: string;
  autoComplete?: string;
}> = [
  {
    key: "name",
    label: "Name",
    placeholder: "Max Mustermann",
    autoComplete: "name",
  },
  {
    key: "jobTitle",
    label: "Jobtitel",
    placeholder: "Geschäftsführer",
    autoComplete: "organization-title",
  },
  {
    key: "company",
    label: "Unternehmen",
    placeholder: "Musterstiftung",
    autoComplete: "organization",
  },
  {
    key: "topic",
    label: "Speaker-Thema",
    placeholder: "Digitale Kommunikation für Stiftungen",
  },
];

export function SpeakerForm({
  values,
  onChange,
  photoFileName,
  onPhotoSelect,
  onPhotoRemove,
  portraitTransform,
  onPortraitTransformChange,
  canExport,
  isExporting,
  exportError,
  onExport,
}: SpeakerFormProps) {
  return (
    <section className="form-panel" aria-labelledby="speaker-data-title">
      <div className="section-heading">
        <span className="step-number" aria-hidden="true">
          01
        </span>
        <div>
          <p className="section-kicker">Erster Schritt</p>
          <h2 id="speaker-data-title">Speaker-Daten</h2>
        </div>
      </div>

      <form onSubmit={(event) => event.preventDefault()}>
        <div className="field-list">
          {fields.map((field) => (
            <div className="field" key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              <input
                id={field.key}
                name={field.key}
                type="text"
                value={values[field.key]}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete ?? "off"}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            </div>
          ))}
        </div>

        <PhotoUpload
          fileName={photoFileName}
          onSelect={onPhotoSelect}
          onRemove={onPhotoRemove}
        />

        {photoFileName && (
          <div className="portrait-controls">
            <label htmlFor="portrait-scale">Bildgröße</label>
            <input
              id="portrait-scale"
              type="range"
              min={MIN_PORTRAIT_SCALE}
              max={MAX_PORTRAIT_SCALE}
              step="0.01"
              value={portraitTransform.scale}
              onChange={(event) =>
                onPortraitTransformChange({
                  ...portraitTransform,
                  scale: Number(event.target.value),
                })
              }
            />
            <p className="portrait-help">
              Ziehe dein Foto im Motiv an die gewünschte Position.
            </p>
            <button
              className="portrait-reset"
              type="button"
              onClick={() =>
                onPortraitTransformChange(DEFAULT_PORTRAIT_TRANSFORM)
              }
            >
              Position zurücksetzen
            </button>
          </div>
        )}

        <div className="form-footer">
          <button
            type="button"
            disabled={!canExport || isExporting}
            aria-describedby={
              exportError
                ? "export-requirements privacy-note export-error"
                : "export-requirements privacy-note"
            }
            onClick={onExport}
          >
            {isExporting ? "Motiv wird erstellt …" : "Motiv herunterladen"}
            <span aria-hidden="true">↓</span>
          </button>
          {exportError && (
            <p id="export-error" className="export-error" role="alert">
              {exportError}
            </p>
          )}
          <p id="export-requirements" className="visually-hidden">
            Für den Download werden alle Speaker-Daten und ein vollständig
            geladenes Foto benötigt.
          </p>
          <p id="privacy-note" className="helper-text">
            Deine Angaben und dein Foto bleiben in diesem Schritt lokal in
            deinem Browser.
          </p>
        </div>
      </form>
    </section>
  );
}
