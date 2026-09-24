"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type PhotoUploadProps = {
  fileName: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export function PhotoUpload({
  fileName,
  onSelect,
  onRemove,
}: PhotoUploadProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Ungültiges Dateiformat. Bitte verwende JPG, PNG oder WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Das Bild ist zu groß. Bitte verwende eine Datei unter 10 MB.",
      );
      event.target.value = "";
      return;
    }

    setError(null);
    onSelect(file);
    event.target.value = "";
  }

  function handleRemove() {
    setError(null);
    onRemove();
  }

  return (
    <fieldset className="photo-upload" aria-describedby={error ? errorId : undefined}>
      <legend>Speaker-Foto</legend>
      <p className="photo-help">
        Lade ein Portraitfoto hoch und passe es direkt in der Vorschau an.
      </p>

      <input
        ref={inputRef}
        className="visually-hidden photo-input"
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        aria-invalid={Boolean(error)}
        aria-errormessage={error ? errorId : undefined}
      />

      {!fileName ? (
        <label className="photo-select" htmlFor={inputId}>
          Foto auswählen
        </label>
      ) : (
        <div className="photo-selection">
          <p className="photo-filename" title={fileName}>
            <span aria-hidden="true">✓</span>
            <span>{fileName}</span>
          </p>
          <div className="photo-actions">
            <label className="photo-action" htmlFor={inputId}>
              Foto ersetzen
            </label>
            <button className="photo-action" type="button" onClick={handleRemove}>
              Foto entfernen
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="photo-error" id={errorId} role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </fieldset>
  );
}
