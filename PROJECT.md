# PROJECT.md

## Product

Speaker Image Generator

A small event tool that allows speakers to create a branded social-media asset from a predefined event template.

## Primary user flow

1. Open the web app
2. Enter speaker information
3. Upload speaker photo
4. Automatically remove photo background
5. Place speaker portrait into the fixed event template
6. Preview final artwork
7. Adjust portrait position
8. Adjust portrait scale within defined limits
9. Download final image
10. Optionally use native device sharing

## Speaker fields

Initial fields:
- Name
- Job title
- Company
- Speaker topic

Additional fields may only be added after explicit approval.

## MVP scope

Included:
- one event template
- one speaker photo
- automatic background removal
- fixed text layout
- constrained portrait movement
- constrained portrait scaling
- live preview
- one predefined export format
- PNG download
- responsive desktop/mobile UI
- native sharing if easily supported
- error handling
- loading states

## Explicitly out of scope

Do not implement:
- authentication
- user accounts
- database
- saved projects
- admin dashboard
- CMS
- arbitrary template editing
- free text positioning
- font selection
- color editing
- filters
- rotation controls
- layer controls
- multiple design systems
- social account integrations
- LinkedIn OAuth
- Instagram OAuth
- direct social API publishing
- analytics platform
- image history
- asset library

## Product principle

This is not a general-purpose design application.

The user should only make the small adjustments required to produce a correct speaker image.

## Success criterion

A speaker with no design knowledge should be able to:

Open link → enter information → upload photo → adjust portrait → download polished event image

within a few minutes and without instructions.
