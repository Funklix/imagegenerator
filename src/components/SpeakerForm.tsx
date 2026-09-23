import { PhotoUpload } from "@/components/PhotoUpload";

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

        <div className="form-footer">
          <button type="button" disabled aria-describedby="future-step-note">
            Motiv weiter bearbeiten
            <span aria-hidden="true">→</span>
          </button>
          <p id="future-step-note" className="helper-text">
            Deine Angaben und dein Foto bleiben in diesem Schritt lokal in
            deinem Browser.
          </p>
        </div>
      </form>
    </section>
  );
}
