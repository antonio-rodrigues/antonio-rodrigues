---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
last_updated: "2026-03-13T12:55:00.000Z"
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 13
  completed_plans: 13
---

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
- [x] Phase 2: Holiday Data & API Integration - COMPLETED (2026-03-12).
- [x] Phase 3: Interactive Selection & Dashboard - COMPLETED (2026-03-12).
- [x] Phase 4: Persistence & Polish - COMPLETED (2026-03-13).
  - [x] Research: 04-RESEARCH.md - COMPLETED (2026-03-12).
  - [x] Plan 04-01: localStorage Persistence - COMPLETED (2026-03-13).
  - [x] Plan 04-02: Balance Alerts & Stat Transitions - COMPLETED (2026-03-13).
  - [x] Plan 04-03: UI Polish & Final Build Verification - COMPLETED (2026-03-13).
- [x] Quick Task QT-29: Fix MonthCard rendering (remove stray '...') - COMPLETED (2026-03-13).
- [x] Quick Task QT-28: Fix Calendar Day Alignment (PT offset shift) - COMPLETED (2026-03-13).
- [x] Quick Task QT-27: Fix TypeScript errors in MonthCard, YearGrid, and useVacationStats - COMPLETED (2026-03-13).
- [x] Quick Task QT-26: Locale-dependent first day of the week (PT=Mon, EN=Sun) - COMPLETED (2026-03-13).
- [x] Quick Task QT-25: Fix Calendar Alignment on Locale Change - COMPLETED (2026-03-13).
- [x] Quick Task QT-24: Fix Week Start for PT/EN locales - COMPLETED (2026-03-13).
- [x] Quick Task QT-23: Add i18n support (PT/EN) - COMPLETED (2026-03-13).
- [x] Quick Task QT-22: Fix absolute paths in index.html - COMPLETED (2026-03-13).
- [x] Quick Task QT-21: Add GitHub Actions workflow for Vite deployment - COMPLETED (2026-03-13).
- [x] Quick Task QT-20: Revert QT-19 - COMPLETED (2026-03-13).
- [x] Quick Task QT-19: Add Black Theme & Fix Styles - REVERTED (2026-03-13).
- [x] Quick Task QT-18: Fix Dark Theme and update #app background - COMPLETED (2026-03-13).

## Quick Tasks Completed
| Task | Description | Date |
|------|-------------|------|
| [QT-33] Add Google AdSense | Added the Google AdSense script to the `<head>` of `index.html` as requested. | 2026-03-13 |
| [QT-32] SEO Optimization | Optimized the single-page app for SEO by adding meta tags (OG, Twitter), JSON-LD structured data, and a sitemap generator. Refactored `App.vue` with semantic HTML5 tags (`<header>`, `<main>`, `<section>`, `<footer>`) and improved accessibility with ARIA labels. | 2026-03-13 |
| [QT-31] Remove Holiday Line Padding | Removed `space-y-4` from the dashboard sidebar container to eliminate the forced top margin on the holiday indicator line, resulting in a tighter layout. | 2026-03-13 |
| [QT-30] Holiday Indicator in Dashboard | Added a dynamic holiday indicator line below the stats grid that shows the holiday name and type on hover (desktop) or touch (mobile, 3s auto-clear). Improved store with `hoveredHoliday` state and unique date-based clearing logic for touch robustness. | 2026-03-13 |
| [QT-29] Fix MonthCard Rendering | Removed stray '...' literal from the grid in `MonthCard.vue` that was causing day alignment issues. | 2026-03-13 |
| [QT-28] Fix Calendar Day Alignment | Resolved +1 day shift in PT locale by making `getYearData` accept `locale` as an explicit argument, ensuring synchronization between grid calculation and i18n labels. Refactored `useCalendar` for robustness. | 2026-03-13 |
| [QT-27] Fix TypeScript Errors | Restored `t` in `MonthCard.vue`, removed unused `_locale` in `YearGrid.vue`, and removed unused `pt` import in `useVacationStats.ts`. Verified with `vue-tsc`. | 2026-03-13 |
| [QT-26] Locale-dependent Week Start | Implemented locale-dependent first day of the week (PT=Monday, EN=Sunday). Updated `useCalendar` for dynamic `firstDayOffset`, localized `dayInitials` in `MonthCard.vue`, and added i18n keys. | 2026-03-13 |
| [QT-25] Fix Calendar Alignment | Ensured `enrichedMonths` in `YearGrid.vue` explicitly depends on `configStore.locale` to trigger re-calculation of weekday offsets when the language changes. | 2026-03-13 |
| [QT-24] Fix Week Start (PT/EN) | Configured EN locale to start on Sunday and PT locale to start on Monday. Updated `useCalendar` to calculate `firstDayOffset` dynamically based on the current locale from the config store. | 2026-03-13 |
| [QT-23] Add i18n support (PT/EN) | Integrated `vue-i18n` with PT/EN locales. Replaced hardcoded strings in all components and utils. Added a language switcher in the header and synced it with Pinia store for persistence. | 2026-03-13 |
| [QT-22] Fix absolute paths in index.html | Changed `/vite.svg` to `vite.svg` and `/src/main.ts` to `./src/main.ts` in root `index.html` to ensure relative paths on GitHub Pages deployment. | 2026-03-13 |
| [QT-21] Add GitHub Actions workflow | Created `.github/workflows/deploy.yml` for Vite deployment and set `base: './'` in `vite.config.ts` to fix GitHub Pages artifact errors and asset loading. | 2026-03-13 |
| [QT-20] Revert QT-19 | Reverted all changes from task QT-19 (Black Theme) as requested. | 2026-03-13 |
| [QT-19] Add Black Theme & Fix Styles | (REVERTED) Added a 3rd theme ('black') and fixed backgrounds. | 2026-03-13 |
| [QT-18] Fix Dark Theme & #app BG | Fixed dark mode application by applying `dark` class to `html` and `#app`. Updated `#app` background-color to `#F2AEBB` in dark mode. | 2026-03-13 |
| [QT-16] Background color to #app | Added `background-color: darkmagenta;` to the main `#app` selector in `src/style.css`. | 2026-03-13 |
| [QT-15] Validated Year Selector | Added a validated (4-digit, >=1900) year input next to the title with confirmation on change and robust API data verification. | 2026-03-13 |
| [QT-14] Sticky Header & Mobile | Implemented sticky header and stats banner with backdrop-blur. Hidden "Selected Days" on mobile and compacted stats for better UX. | 2026-03-13 |
| [QT-13] Fix unused imports | Removed unused Vue `computed` and `date-fns` `addDays` from `src/store/config.ts` to resolve TS6133 warnings. | 2026-03-13 |
| [QT-01] Fix PostCSS ESM Error | Converted `postcss.config.js` to ESM syntax for compatibility with `"type": "module"`. | 2026-03-12 |
| [QT-02] Fix store.year type error | Used `storeToRefs` in `App.vue` to correctly pass reactive refs to `useVacationStats`. | 2026-03-12 |
| [QT-03] Optimize holiday fetching | Centralized Nager.Date API calls in Pinia store to prevent redundant simultaneous requests on startup. | 2026-03-13 |
| [QT-04] Fix municipality persistence | Initialized search input on mount and added focus-based dropdown control to ensure selected municipality persists across refresh. | 2026-03-13 |
| [QT-05] Desktop UI & Summary Panel | Aligned search to right, made vacation balance editable/persistent, and added month-grouped vacation summary panel. | 2026-03-13 |
| [QT-06] Clear All & Total Selected Counter | Added "Limpar tudo" button to reset selections and "DIAS CONSECUTIVOS" counter to show total marked days regardless of type. | 2026-03-13 |
| [QT-07] Fix Clear All Button Reset | Exported `clearMarkedDays` from the Pinia store to ensure the "Limpar tudo" button correctly resets selected vacation days. | 2026-03-13 |
| [QT-08] Refactor "Dias Consecutivos" | Updated "Dias Consecutivos" counter to include weekends and holidays within the selected vacation intervals, matching user requirements. | 2026-03-13 |
| [QT-09] Expand "Dias Consecutivos" | Refined "Dias Consecutivos" to include adjacent weekends when the rest block starts on Monday or ends on Friday (even if triggered by a holiday). | 2026-03-13 |
| [QT-10] UI Refinements & Rest Period Logic | Added month numbering, updated "Maior Período de Descanso" to show start date and count only business days, and removed mobile padding. | 2026-03-13 |
| [QT-11] Clear All Confirmation | Added a confirmation dialog to the 'Limpar tudo' button to prevent accidental clearing of all vacation data. | 2026-03-13 |
| [QT-12] UI & Logic: Weekend Holidays | Added border/rounded corners to "Saldo de Férias" input and updated "Dias Consecutivos" to include weekends even if holiday-triggered. | 2026-03-13 |


## Milestones
- **Milestone 1:** Calendar Scaffolding (100%)
- **Milestone 2:** Holiday Integration (100%)
- **Milestone 3:** Core Interactivity (100%)
- **Milestone 4:** Full Application (100%)

## Key Decisions
- **Framework:** Vue 3 (Composition API) was chosen over React as per user preference.
- **Styling:** Tailwind CSS will be used for rapid mobile-first grid development.
- **Data Source:** Nager.Date API for national holidays; static mapping for 308 municipal holidays.
- **Target Year:** Default to 2026.
- **[03-03] DashboardSidebar presentational pattern:** Used props-based design for DashboardSidebar, keeping it pure and making it trivial to test without mocking composables.
- **[03-02] longestRestPeriod algorithm:** Implemented as a single pass through the year's days, incrementing a counter for each vacation/weekend/holiday and tracking the maximum; efficient and reactive.
- **[03-01] DayCell toggle guard:** Restrict vacation marking to workdays only — holidays and weekends are naturally rest days and shouldn't count toward the vacation balance.
- [03-01] Store markedDays as Set: Used a `Set<string>` in the Pinia store for marked vacation days to ensure O(1) lookups during calendar rendering.
- **[QT-02] storeToRefs in App.vue:** Explicitly used `storeToRefs` to pass reactive dependencies to `useVacationStats` — this ensures the composable remains reactive when store state changes, avoiding common Pinia property unwrapping pitfalls.
- [02-03] MunicipalitySelector watcher pattern: Used `watch(query)` to clear `selectedMunicipalityId` on empty input — single reactive source of truth vs separate `@input` handler.
- **[02-03] isOpen state management:** Controlled via watcher to avoid race condition between blur/click events; 150ms blur delay allows click to register first.
- **[02-02] MunicipalHolidayRule local type:** Used local interface in useHolidays.ts to handle offset/base fields without modifying holiday.ts — avoids architectural cascade change.
- **[02-02] buildFallbackHolidays scope:** Includes all 13 national holidays (10 fixed + 7 mobile) for complete offline fallback coverage.
- **[02-01] Holiday type optional fields:** Used `offset?: number` and `base?: string` on Holiday interface (not discriminated union) to support mobile municipalities without breaking existing consumers.
- **[02-01] tsconfig.json required:** Project was missing tsconfig.json — added standard Vue 3 + Vite config to enable vue-tsc type checking.
- **[02-04] Holiday enrichment in YearGrid, not useCalendar:** Keeps calendar composable pure; enrichment is a rendering concern that belongs in the view layer.
- **[02-04] Native title tooltip:** Avoids external library dependency; meets accessibility baseline without added complexity.
- **[04-01] localStorage Serialization:** Pinia store uses `watch` with a conversion to `Array` for the `markedDays` Set; initialization deserializes it back to a `Set`.
- **[QT-03] Holiday Fetching Singleton:** Moved national holiday fetching and state into `useConfigStore` to ensure it only happens once per app lifecycle (or year change), preventing redundant simultaneous API calls from multiple components using `useHolidays`.
- **[QT-04] Municipality Initialization & Focus Pattern:** Initialized `query` in `onMounted` from store state and added `isFocused` tracking to `MunicipalitySelector` — this ensures the search box is populated on refresh without accidentally triggering the dropdown via the `query` watcher.
- [QT-05] Vacation Summary Formatting: Implemented `formatVacationSummary` utility to group ISO dates by month with Portuguese abbreviations (FEV, MAR, etc.) and leading-zero days, providing a concise overview of the vacation plan.
- **[QT-11] Native confirm dialog for destructive action:** Used `window.confirm` for the "Limpar tudo" button to provide a simple, effective safety check before clearing all application state, prioritizing UX safety with minimal complexity.
- **[QT-12] Expanded weekend logic for "Dias Consecutivos":** Refined the calculation in `useVacationStats` to handle cases where a holiday falls on a Saturday or Sunday, ensuring the entire weekend is included if it's adjacent to a holiday or selected day within a rest block.

## Session Log
- **2026-03-13:** Completed Quick Task QT-24: Fixed week start logic for PT (Monday) and EN (Sunday) locales.
- **2026-03-13:** Planned quick task QT-13: Fix unused imports in config.ts.
- **2026-03-13:** Completed quick task QT-12: updated "Saldo de Férias" UI and fixed "Dias Consecutivos" holiday-weekend logic.
- **2026-03-13:** Completed quick task QT-11: added confirmation dialog to "Limpar tudo" button in `App.vue`.
- **2026-03-13:** Planned confirmation dialog for "Limpar tudo" button (QT-11).
- **2026-03-13:** Optimized holiday fetching to prevent simultaneous API calls by centralizing state in the Pinia store. Refactored `useHolidays` to consume shared state instead of managing its own. Verified with full test suite.
- **2026-03-13:** Completed Phase 4 — Persistence & Polish.
 Implemented `localStorage` sync for Pinia store, added budget alerts (AlertTriangle), smooth CSS transitions for stats and dropdowns, and UI polish (hover scale/shadow) for calendar cells. Verified with production build and full unit test suite (3 plans, 6 files modified, all tests green).
- **2026-03-12:** Completed Phase 3 — Interactive Selection & Dashboard. Implemented vacation toggling in DayCell, created useVacationStats composable with TDD (used days, balance, longest rest period), and built the responsive DashboardSidebar (3 tasks, 5 files modified, 53 tests green).
- **2026-03-12:** Completed 02-04-PLAN.md — Phase 2 holiday integration wired end-to-end; YearGrid enrichedMonths computed, DayCell holiday classes + tooltips, MunicipalitySelector in App.vue header; browser-verified by user (4 tasks, 5 files modified, 28 tests green).
