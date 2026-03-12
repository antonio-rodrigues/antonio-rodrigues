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
  - [x] Plan 02-02: useHolidays Composable - COMPLETED (2026-03-12).
  - [x] Plan 02-03: MunicipalitySelector Component - COMPLETED (2026-03-12).

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
- **[02-03] MunicipalitySelector watcher pattern:** Used `watch(query)` to clear `selectedMunicipalityId` on empty input — single reactive source of truth vs separate `@input` handler.
- **[02-03] isOpen state management:** Controlled via watcher to avoid race condition between blur/click events; 150ms blur delay allows click to register first.
- **[02-02] MunicipalHolidayRule local type:** Used local interface in useHolidays.ts to handle offset/base fields without modifying holiday.ts — avoids architectural cascade change.
- **[02-02] buildFallbackHolidays scope:** Includes all 13 national holidays (10 fixed + 7 mobile) for complete offline fallback coverage.

## Session Log
- **2026-03-12:** Completed 02-03-PLAN.md — MunicipalitySelector component built and tested (2 tasks, 2 files created, 4 tests green).
- **2026-03-12:** Completed 02-02-PLAN.md — useHolidays composable implemented with TDD (2 tasks, 2 files, 5 tests green, full suite 21 tests).
