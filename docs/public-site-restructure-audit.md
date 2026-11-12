# Public-site restructuring: Step 0 audit

Date: 2026-09-05. Status: audit complete; implementation paused under the request's instruction to stop if the repository differs substantially from its assumptions. No application code changed.

## Main finding

Parts 1 and 2 exist, but their project lifecycle is not yet suitable for the proposed public-site behavior. The existing WorkspaceProvider is mounted by ProjectWorkspace, below the global header. Browser persistence stores one project in one key and automatically opens it on provider mount. `clearProject` deletes that key. There is no separate close operation or retained-project collection.

Moving the provider above the header is straightforward. Preserving a closed project across reloads and subsequent project creation needs a deliberate migration of the existing persistence layer. Otherwise Close either reopens the project on remount, or a subsequent create/import overwrites the copy the interface promised to retain. This is the substantive architectural difference prompting the audit checkpoint.

Recommended resolution: extend the existing project storage module with saved records keyed by project ID and an active ID, migrate the current single key without deleting it until migration succeeds, and continue exposing exactly one WorkspaceProvider. Saved records are persistence, not a second React project state. Close must flush successfully before clearing the active reference. Failed saves must leave the project open. Provide a local reopen path and make Delete local copy a separate operation against the selected record.

## Current implementation inventory

Paths below are repository-relative.

| Audit item | Finding |
| --- | --- |
| Public navigation | `apps/calculator/client/src/components/SiteChrome.tsx`: About (with Updates), Impact Snapshot, Evaluate, Learn (Knowledge Base and SDGs), Imagine, Get Involved. Navigation is static and does not subscribe to Workspace state. |
| Homepage | `apps/calculator/client/src/pages/Index.tsx`: large brief-generator hero with animated pillar circles, pillar introduction, tools/resources, workflow section, fetched project examples, and Get Involved audience groups. Copy and section data are embedded in this component. |
| Brief Generator | `/brief-generator`, including trailing slash. Existing Spanish support is selected with `?lang=es`; preserve this integration. |
| Impact Snapshot | `/impact-snapshot` and `/impact-snapshot/embed`. Legacy project-scan and quick-project-scan redirects already exist. |
| Evaluate | `/calculator`, rendering `pages/Home.tsx`. This file is the evaluation tool, not the public homepage. |
| Learn | A navigation label linking to `/knowledge-base`; no `/learn` route in App.tsx. |
| Imagine | A navigation label linking to `/brief-generator`; no `/imagine` route in App.tsx. |
| Get Involved | `/#get-involved`; no independent route in App.tsx. About also contains participation copy. |
| About | `/about`, rendering `pages/About.tsx`; includes pillars, audiences, contributions, tools and roadmap content. |
| Updates | `/updates` and `/updates/:slug`, using existing MDX-backed content and fetch helpers. |
| SDGs | `/the-standard-and-the-sdgs`; `/relationship-map` redirects there. |
| Knowledge Base | Generated mdBook served under `/knowledge-base` by the production build. Not a React page. |
| Workspace | `/workspace`, `/workspace/components`, `/workspace/criteria`, `/workspace/project-file`; `/dev/project-file` also renders the Workspace. |
| Active/open project | Non-null `project` from WorkspaceProvider. Startup calls `loadProjectLocally()` and opens any valid stored project. `projectRef` supports mutations and coordinated persistence. |
| Project title | `project.project.title`, with an Untitled project fallback in WorkspaceShell. Available through `useWorkspace()` only inside its provider. |
| Header components | Live React header/footer in SiteChrome; separate Next.js header/footer in root `app/layout.tsx`; WorkspaceShell also has its own project header and tab navigation. |
| Mobile navigation | SiteChrome has a toggle with aria-controls/aria-expanded, closes on route change and Escape, and uses a separate mobile rendering of the nav items. Desktop dropdowns use group styling. New project controls should use existing Radix primitives and verified focus restoration. |
| Languages | Targeted Spanish Brief Generator and `briefChromeLocale.ts`; no site-wide bilingual router. Brief Generator sets `lang` on its main landmark. No Spanish criteria layer was found in the inspected criterion sources. |
| Canonical criteria | `packages/standard-core/src/criteria.v2.json`: version/schema/source/idStrategy, subcategories and pillars containing criteria. 56 criteria: Environment 24, Society 17, Culture 8, Finance 7. |
| Criterion scope | `appliesTo` explicitly distinguishes `project` and `designingEntity`: 39 project-only, 4 designing-entity-only, 13 both. Generated metadata preserves it. Do not substitute the Workspace assessment's project/component scope: that is a different concept. |
| Criterion links | `src/generated/criteria-meta.json` supplies generated relative URLs. Existing `getCriterionDocMeta()` in the calculator's `lib/criteria-docs.ts` prefixes the GitHub Pages docs base. Reuse or centrally reconcile this helper, rather than assembling paths in new pages. |
| Project taxonomy | Unified project metadata supports `projectTypes: string[]`; Overview currently edits comma-separated free text. Existing fixture values include exhibition, installation, print and website. Brief Generator also has project-type data, and editorial project content uses projectType. No single nine-type canonical taxonomy currently controls them all. |
| Content preservation | Keep homepage pillar descriptions, full introduction, involvement audiences and contact CTA; About roadmap and contribution copy; Updates MDX; existing project MDX and detail routes; Baselines and Footprints. |
| Conflicts | Existing `/projects` already has six project-content files and dynamic detail routing. `/projects/abierto` must precede the dynamic route if implemented separately. Root Next.js files and an older static build script are separate implementations; changing them alone would not change the configured deployment. |

## Production ownership

`netlify.toml` runs `npm run build` and publishes `apps/calculator/dist/public`. The root build delegates to the calculator's Vite/Express build, which generates static content data and builds/copies the Knowledge Base. The active client router is `apps/calculator/client/src/App.tsx` (Wouter).

Implement the public redesign in that client. Do not build parallel pages in the root Next.js `app/` directory. Leave the alternate implementation intact unless its retirement becomes a separate task. Update Netlify redirects and any applicable server handling together with the client router.

## Criteria identity and translations

Stable `id` and human-facing `displayId` are deliberately different in this dataset. For example, stable E3 is displayed as E2 for Product Ingredients Transparency. Public labels should follow the current display code; translation keys, curated mappings and project references must use stable IDs. Search can accept both. Do not resolve ambiguous codes by guessing between the two namespaces.

The public index should read canonical criteria and generated metadata through one adapter. Keep scoring, detailed descriptions and evidence rules in the KB. Map `appliesTo` directly to Project / Design entity / Project + Design entity (and the corresponding Spanish labels).

Proposed `packages/standard-core/src/i18n/criteria.es.json` contains only stable-ID keyed label/summary translations. No approved complete Spanish criteria copy was found. Start with explicitly marked English fallback and an editorial-translation-needed notice, rather than publish invented translations. All 56 entries need a translation-source/review pass unless approved copy is supplied. The user's sample E3 translation must not be copied blindly: its meaning conflicts with current stable E3.

Generated metadata already has scope and URLs; the Workspace catalog currently exposes `level` rather than `appliesTo`. Extend a shared adapter without confusing organization applicability with assessment component selection. Do not use the older two-entry `criteria.ts` array as the index source.

## Proposed route map

| Route | Purpose |
| --- | --- |
| `/` | Orientation; primary brief entry; project-type chooser; blank-project creation; import; exploration links |
| `/workspace` | Existing overview |
| `/workspace/components` | Existing components |
| `/workspace/criteria` | Existing assessments |
| `/workspace/project-file` | Existing import/export/validation and separate local deletion |
| `/explore` | Curated discovery, impact links, seven design-question disclosures |
| `/explore/pillars` | Reused four-pillar introduction |
| `/explore/criteria` | English searchable index with URL-backed pillar filter |
| `/es/criteria` | Shared criteria UI, Spanish interface, explicit translation fallbacks |
| `/explore/project-types` | Nine requested types, multi-type project creation |
| `/explore/sdgs` | Existing SDG content |
| `/projects` | Abierto passport entry plus preserved existing case-study content, clearly distinguished without implying verified participation |
| `/projects/abierto` | Reusable passport shell with supported public copy |
| `/projects/:slug` | Preserve existing case-study detail URLs |
| `/about` | Reused initiative, rationale and development content |
| `/about/updates` and `/about/updates/:slug` | Existing update index/detail content |
| `/about/get-involved` | Reused participation copy, Design Impact Collaborative callout, and existing contact CTA |
| `/es/abierto/economia` | Concise Spanish economic-value invitation |
| `/es/abierto/segunda-vida` | Concise Spanish next-life invitation |
| `/es/abierto/colabora` | Concise Spanish participation invitation linking to Get Involved |

Keep Brief Generator, its Spanish query variant, calculator, snapshot/embed, Knowledge Base, Footprints and Baselines at their current URLs. A separate contact page is unnecessary initially: the repository already supplies `mailto:info@sdstandard.org`.

## Proposed file changes

Modify:

- `apps/calculator/client/src/App.tsx`: mount the existing provider above SiteChrome, add routes and legacy redirects, and manage page language/metadata consistently.
- `apps/calculator/client/src/pages/ProjectWorkspace.tsx`: remove its nested provider after lifting ownership.
- `apps/calculator/client/src/workspace/WorkspaceProvider.tsx`: close/reopen lifecycle, shared existing import/export actions, save-failure handling.
- `packages/standard-core/src/project/storage.ts` and related storage exports/tests: backward-compatible saved-project migration and active reference.
- `apps/calculator/client/src/components/SiteChrome.tsx`: one project-aware nav model for desktop/mobile, current section, accessible project menu and close dialog; retain footer/newsletter/social content.
- `apps/calculator/client/src/workspace/WorkspaceShell.tsx`, `NoProjectState.tsx`, `ProjectFileView.tsx`: consume shared actions, reuse creation/import UI, clarify local deletion.
- `apps/calculator/client/src/pages/Index.tsx`, `About.tsx`, `Projects.tsx`, update pages and SDG page: restructure/reuse content and update internal links.
- `apps/calculator/client/src/lib/criteria-docs.ts`: shared canonical KB-link handling if consolidation is needed.
- `apps/calculator/client/src/index.css`: central public-site tokens and reusable editorial layout styles.
- `netlify.toml`: permanent moved-route redirects before SPA fallback.
- Appropriate package scripts: curated validation, new tests and a scoped lint command.

Create (proposed names):

- Public pages: `Explore.tsx`, `Pillars.tsx`, `CriteriaIndex.tsx`, `ProjectTypes.tsx`, `ProjectPassport.tsx`, `GetInvolved.tsx`, `AbiertoInvitation.tsx`.
- Shared components: page introduction, editorial section, criterion row/filter bar, project/contributor presentation, project actions/dialogs where existing components cannot be extracted.
- Shared data: canonical public-criteria adapter, project-type catalog, seven-question mapping and passport content.
- `packages/standard-core/src/i18n/criteria.es.json` and editorial status documentation.
- Curated-data validation tests and browser tests for navigation, persistence, import, filters, routes, mobile and keyboard behavior.

## Migration and redirects

Proposed redirects, not yet added:

- `/updates` -> `/about/updates`; `/updates/:slug` -> `/about/updates/:slug`.
- `/the-standard-and-the-sdgs` and `/relationship-map` -> `/explore/sdgs`.
- Optional compatibility aliases `/learn` -> `/explore`, `/imagine` -> `/brief-generator`, `/get-involved` -> `/about/get-involved`. These are not all existing routes; label them aliases, not moved pages.
- Handle `/#get-involved` in the browser, since fragments do not reach the server. Preserve behavior by forwarding to the new participation page.
- Preserve existing snapshot redirects and tool URLs.
- Preserve trailing slashes/query strings appropriately, including Spanish Brief Generator and criterion filters.

Do not redirect `/knowledge-base` to Explore: it remains a separate generated resource with existing inbound links.

## Abierto and project-content limitations

`content/updates/abierto-de-diseno-cdmx-2026.mdx` supports an installation introduction, Mexico City context, event dates September 25–October 4, 2026, and opening/participation details to be confirmed. These are repository copy, not independently reverified event details.

`packages/standard-core/examples/abierto-project.v0.1.json` is explicitly loaded as a development fixture by Workspace UI. It includes completion statuses and strategy notes used to exercise the model. Its completed goals are not verified public outcomes. Do not promote these statuses into the passport as evidence.

No collaborator roles were found in the inspected content sources. The names suggested in the request are potential collaborators, not confirmed role assignments. Omit unverified roles/results or mark sections in development. The public passport can ship with supported overview and prominent in-development sections, but should not claim the fixture proves delivery.

Existing case studies must remain accessible. The gallery already exists, so Abierto is the first new passport-format project, not the first repository project.

## Design review and proposed refinements

The repository `.agents` directory has no skill files. The available installed `C:/Users/alex_/.agents/skills/design-taste-frontend/SKILL.md` was consulted instead. No visual implementation has been performed or reviewed yet.

Preserve Plus Jakarta Sans from current CSS, warm cream surfaces, green action color, shared PILLAR_COLORS, existing max-width/breakpoint conventions, Lucide icons and Radix-based accessible controls. No new UI framework is needed.

Consolidate repeated hard-coded public colors into central tokens without changing tool theming. Replace repeated shadowed, bordered card layouts on public pages with editorial spacing, readable line lengths and aligned rows. Give Home one primary start action, distinct continue controls and quieter exploration links. Use a compact list for 56 criteria, with mobile rows preserving ID/title/summary/scope hierarchy. Use restrained pillar color indicators with text labels. Use disclosures for seven questions. QR landing pages should have compact branding and one main invitation/action.

Review desktop and mobile project menus with truncation, focus restoration, generous tap targets and keyboard access. Respect reduced motion; do not expand the animated hero treatment. Retain source content when moving sections, including existing participation audiences and contact links.

## Validation plan and current status

Existing scripts include standard-core tests/check, calculator workspace persistence tests, snapshot-import tests, Brief Generator tests and calculator TypeScript check. The calculator/root packages do not currently define a lint command; Brief Generator has its own ESLint configuration. Browser navigation tests need infrastructure rather than merely another invocation of existing unit tests.

Required new coverage: migrate old storage; preserve closed records; avoid auto-reopening after close; save failure keeps project active; create/import after close preserves earlier records; local deletion remains distinct; global nav title updates; file picker/import preview; query-backed filters; all 56 IDs; scope mapping; generated URLs; stable-ID Spanish lookup/fallback; all seven curated mappings; type creation without automatic criteria; legacy URLs; desktop/mobile keyboard operation.

Run the requested tests/type/lint/build checkpoint after steps 1–8, then continue only if stable. Production build includes mdBook, so verify that prerequisite as well. Manually check the requested route/state matrix and both narrow/wide layouts.

No tests, type check, lint or production build were run during this read-only architecture audit. No redirects, UI pages, translations or application changes were implemented. The only new file is this report.

Recommended next implementation step: resolve the single-slot storage lifecycle by extending the existing storage/provider, then execute the requested sequence against the active Vite client, preserving existing case studies and treating Abierto fixture values as development data.
