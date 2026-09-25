# Project Passports

The Workspace passport at `/workspace/passport` is a local preview. It reads the active browser project and never uploads or publishes it.

## Public fields

A reviewed publication may include:

- project title, public description, project types, purpose, location, event, locale, and last-updated date;
- hero and component image URLs, alt text, captions, and credits;
- collaborator names, roles, and credit lines;
- outcomes with value, unit, measured/estimated/intended status, source, date, and evidence note;
- component names, types, public descriptions, and public images;
- criterion IDs, scope, coverage state, and strategy titles/descriptions; and
- the “what we would improve” text.

Private project, component, and strategy notes; browser metadata; local file paths; budgets; contact details; and unpublished evidence are excluded by default.

## Publish or update a passport

1. Complete and review the Workspace preview.
2. Download the project JSON as an editorial handoff; downloading does not publish it.
3. Copy only approved public fields into a reviewed record in `content/project-passports/`.
4. Review names, credits, image rights, alt text, evidence sources, dates, and all claims.
5. Build and deploy the site. The public record changes only through a reviewed repository update and deployment.

The first record is `content/project-passports/abierto.json`, published at `https://sdstandard.org/projects/abierto`.

For an exhibit QR code, encode that exact HTTPS URL with a QR generator, export SVG for print, and test the final printed code on iOS and Android before production. Keep the stable URL unchanged when the record is updated.
