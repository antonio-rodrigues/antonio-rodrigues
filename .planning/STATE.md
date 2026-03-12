# State: Calendar Webapp

## Project Initialization
- [x] Initial research on Nager.Date API and PT municipalities.
- [x] Created `GEMINI.md`.
- [x] Created `.planning/config.json`.
- [x] Created `.planning/PROJECT.md`.
- [x] Created `.planning/REQUIREMENTS.md`.
- [x] Created `.planning/ROADMAP.md`.
- [x] Created `.planning/STATE.md`.

## Current Focus
- [x] Phase 1: Project Scaffolding & Initial Logic - COMPLETED.
- [/] Phase 2: Holiday Data & API Integration - IN PROGRESS.
  - [ ] Plan 02-01: Integrated Holiday Data (API + local JSON).
  - [ ] Plan 02-02: Municipality Selection UI.
  - [ ] Plan 02-03: UI Integration & Tooltips.

## Quick Tasks Completed
| Task | Description | Date |
|------|-------------|------|
| [QT-01] Fix PostCSS ESM Error | Converted `postcss.config.js` to ESM syntax for compatibility with `"type": "module"`. | 2026-03-12 |

## Milestones
- **Milestone 1:** Calendar Scaffolding (100%)
- **Milestone 2:** Holiday Integration (0%)
- **Milestone 3:** Core Interactivity (0%)
- **Milestone 4:** Full Application (0%)

## Key Decisions
- **Framework:** Vue 3 (Composition API) was chosen over React as per user preference.
- **Styling:** Tailwind CSS will be used for rapid mobile-first grid development.
- **Data Source:** Nager.Date API for national holidays; static mapping for 308 municipal holidays.
- **Target Year:** Default to 2026.
