# ARCHITECTURE.md

## Technical direction

Use a minimal modern web architecture.

Preferred stack:
- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- browser-based image composition
- mature canvas/image library where useful
- server-side API route only where required

## Architecture goals

Prioritize:
- simplicity
- stability
- low maintenance
- fast iteration
- privacy
- predictable rendering
- minimal infrastructure

## Frontend responsibilities

The browser should handle:
- form state
- live preview
- portrait positioning
- portrait scaling
- template composition
- text rendering
- final image generation/export where technically practical

## Server responsibilities

Server-side functionality should be minimal.

Expected server responsibility:
- proxy background-removal requests
- protect API credentials

Do not create additional backend infrastructure without a demonstrated need.

## Persistence

Default architecture contains no persistent user storage.

Do not introduce:
- database
- object storage
- image archive
- account persistence

unless explicitly approved.

## Image processing flow

Speaker image

→ client validation

→ server-side background-removal proxy

→ transparent processed image

→ return to browser

→ browser-based template composition

→ local preview

→ local image export

## Privacy principle

Do not persist uploaded speaker photos unless technically required and explicitly approved.

Process data only for the duration necessary to generate the final asset.

## Rendering

Template rendering must be deterministic.

All important layout properties should be defined in configuration rather than scattered throughout UI components.

Examples:
- canvas dimensions
- portrait bounds
- minimum scale
- maximum scale
- text positions
- font sizes
- line limits
- template assets

## Component boundaries

Prefer small focused components.

Likely structure:

src/
  app/
  components/
    SpeakerForm
    PhotoUpload
    SpeakerCanvas
    PortraitControls
    ExportControls
  lib/
    image
    template
    validation
  config/
    template
  app/api/
    remove-background

Exact structure may evolve, but architecture should remain shallow.

## Failure design

External API failures must not destroy local user input.

Users should be able to retry image processing without re-entering all text fields.

## Deployment

GitHub is the source of truth.

Vercel:
- preview deployments for branches / pull requests
- production deployment from main

Production should never depend on manual local configuration that is not documented.
