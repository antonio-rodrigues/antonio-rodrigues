---
phase: 02-holiday-data-api-integration-week-1
plan: 01
subsystem: testing
tags: [typescript, vitest, vue3, holiday-types, tdd]

# Dependency graph
requires:
  - phase: 01-scaffolding
    provides: Holiday interface in src/types/holiday.ts, vitest setup, base composables
provides:
  - Extended Holiday interface with offset? and base? fields for mobile municipal holidays
  - DayCell.spec.ts Wave 0 stubs (5 it.todo tests for holiday styling contract)
  - tsconfig.json for vue-tsc type checking
  - Full test suite green (21 passing + 5 todo, exits 0)
affects:
  - 02-02 (municipality selection UI uses Holiday type)
  - 02-03 (UI integration uses DayCell spec contract)

# Tech tracking
tech-stack:
  added: [vue-tsc (tsconfig.json added to enable type checking)]
  patterns: [it.todo() for Wave 0 spec stubs, optional fields for type extension without discriminated unions]

key-files:
  created:
    - tsconfig.json
    - src/components/calendar/DayCell.spec.ts
  modified:
    - src/types/holiday.ts

key-decisions:
  - "Used optional fields (offset?: number, base?: string) on Holiday interface instead of discriminated union — avoids breaking existing consumers while enabling mobile municipality holiday resolution"
  - "Created tsconfig.json (was missing from project) to enable vue-tsc type checking for the build command"
  - "DayCell.spec.ts uses it.todo() stubs since DayCell.vue does not yet accept holiday props — useHolidays.spec.ts and MunicipalitySelector.spec.ts already exist as full implementations from prior work"

patterns-established:
  - "Wave 0 stubs: use it.todo() for contracts where implementation doesn't exist yet"
  - "Type extension: prefer optional fields over discriminated unions when existing consumers must not break"

requirements-completed:
  - FR2-holiday-integration
  - FR2-municipality-selection

# Metrics
duration: 8min
completed: 2026-03-12
---

# Phase 2 Plan 01: Wave 0 Type Fix and Spec Scaffolding Summary

**Holiday interface extended with offset/base fields for mobile municipalities; tsconfig.json created; DayCell spec stubs scaffold Wave 1 contract; full suite green (21 passing + 5 todo)**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-12T16:48:56Z
- **Completed:** 2026-03-12T16:52:30Z
- **Tasks:** 2
- **Files modified:** 3 (holiday.ts modified, tsconfig.json created, DayCell.spec.ts created)

## Accomplishments
- Extended `src/types/holiday.ts` Holiday interface with `offset?: number` and `base?: string` to support mobile municipality holiday resolution without breaking existing consumers
- Created `tsconfig.json` (was absent from project) enabling `vue-tsc --noEmit` type checking — exits 0 cleanly
- Created `src/components/calendar/DayCell.spec.ts` with 5 `it.todo()` stubs defining the holiday styling contract for Wave 1
- Discovered that `useHolidays.spec.ts`, `useHolidays.ts`, `MunicipalitySelector.spec.ts`, and `MunicipalitySelector.vue` were already fully implemented from prior work — all 21 tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Holiday type for mobile municipality entries** - `b971b2b` (feat)
2. **Task 2: Create Wave 0 spec stubs** - `198c32a` (test)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/types/holiday.ts` - Added `offset?: number` and `base?: string` to Holiday interface
- `tsconfig.json` - Created standard Vue 3 + Vite tsconfig for vue-tsc type checking
- `src/components/calendar/DayCell.spec.ts` - 5 `it.todo()` stubs for national/municipal holiday class and title attribute contract

## Decisions Made
- Used optional fields on `Holiday` interface (not discriminated union) — plan explicitly called for this simpler approach to avoid breaking existing consumers (`municipality.holiday.day`, `municipality.holiday.month` still compile)
- `tsconfig.json` missing from project was an auto-fix (Rule 3 — blocking issue) since `vue-tsc --noEmit` requires it
- `DayCell.spec.ts` uses `it.todo()` stubs per plan since `DayCell.vue` doesn't yet accept holiday-related props; the other two spec files (`useHolidays.spec.ts`, `MunicipalitySelector.spec.ts`) already existed as full working tests

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created missing tsconfig.json**
- **Found during:** Task 1 (TypeScript type check verification)
- **Issue:** `npx tsc --noEmit` / `vue-tsc --noEmit` both fail without a tsconfig.json, which was absent from the project despite the build script requiring it (`vue-tsc && vite build`)
- **Fix:** Created standard `tsconfig.json` for Vue 3 + Vite with `moduleResolution: bundler`, `noEmit: true`, `@/*` path alias
- **Files modified:** `tsconfig.json` (created)
- **Verification:** `vue-tsc --noEmit` exits 0 cleanly
- **Committed in:** `b971b2b` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was necessary for project correctness. No scope creep.

## Issues Encountered
- `npx tsc --noEmit` invoked the wrong global tsc binary (showing help instead of running). Used `./node_modules/.bin/vue-tsc --noEmit` instead for reliable type checking.
- `useHolidays.spec.ts` and `MunicipalitySelector.spec.ts` were already fully implemented with passing tests — not stubs as the plan anticipated. Plan's Task 2 only needed to create `DayCell.spec.ts`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Holiday type supports both fixed and mobile municipality entries — Wave 1 plans can proceed
- All Wave 0 spec files exist; automated verify targets are available
- `vue-tsc --noEmit` exits 0 — TypeScript type safety enforced
- `npx vitest run` exits 0 with 21 passing + 5 todo — Wave 1 plans have a green baseline

---
*Phase: 02-holiday-data-api-integration-week-1*
*Completed: 2026-03-12*
