---
phase: 02-holiday-data-api-integration-week-1
plan: 02
subsystem: api
tags: [vue3, composable, pinia, date-fns, vitest, nager-date, holidays, portugal]

# Dependency graph
requires:
  - phase: 02-holiday-data-api-integration-week-1
    provides: municipalities.json with 308 entries, holiday-utils.ts with getEaster and mobile holiday functions

provides:
  - useHolidays composable returning Map<string, HolidayEntry> reactive ref
  - HolidayEntry interface (name, type, municipalityName)
  - API fetch from Nager.Date with global:true filter
  - Fallback to local holiday-utils on fetch failure
  - municipalHoliday computed resolving fixed and mobile municipal holidays
  - 5 passing unit tests covering all behaviors

affects: [02-03, YearGrid enrichment, DayCell styling, any consumer of holiday map]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Composable owns all holiday state (fetch, fallback, municipal resolution, merging)
    - Replace ref(new Map()) entirely on update — never mutate in-place (Vue 3 reactivity)
    - watch with immediate:true on configStore.year triggers fetchHolidays on mount
    - computed merges nationalHolidays + municipalHoliday so consumers get one reactive Map

key-files:
  created:
    - src/composables/useHolidays.ts
    - src/composables/useHolidays.spec.ts
  modified: []

key-decisions:
  - "Used local MunicipalHolidayRule type in useHolidays.ts to avoid Holiday interface mismatch (offset/base fields missing from holiday.ts)"
  - "buildFallbackHolidays includes all 13 Portuguese national holidays (10 fixed + 7 mobile) for complete offline coverage"
  - "vi.waitUntil used for async API tests; setTimeout(50ms) for synchronous computed tests — no nextTick needed"

patterns-established:
  - "TDD: spec written first (RED), implementation written to pass (GREEN), no refactor needed"
  - "useHolidays called once at YearGrid level; never per-month or per-day cell"

requirements-completed: [FR2-holiday-integration, FR2-municipality-selection]

# Metrics
duration: 2min
completed: 2026-03-12
---

# Phase 2 Plan 02: useHolidays Composable Summary

**Reactive `useHolidays` composable fetching Nager.Date API, filtering global holidays, falling back to local utils, and merging municipal holidays (fixed and Easter-based mobile) into a single Map<string, HolidayEntry>**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-12T16:49:23Z
- **Completed:** 2026-03-12T16:51:20Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `useHolidays.ts` composable fully implemented: API fetch, global filter, fallback, fixed/mobile municipal resolution, computed merged map
- 5 unit tests written and passing covering all plan behaviors
- Full test suite (21 tests, 4 files) passes with no regressions
- TypeScript compiles clean (`vue-tsc --noEmit`)

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): add failing tests for useHolidays composable** - `0b0975e` (test)
2. **Task 1 (GREEN): implement useHolidays composable** - `bc824ad` (feat)

_Note: Tasks 1 and 2 share these commits — tests (Task 2) were written during TDD RED phase of Task 1._

## Files Created/Modified

- `src/composables/useHolidays.ts` - Composable: fetch national holidays, fallback, municipalHoliday computed, merged holidays Map
- `src/composables/useHolidays.spec.ts` - 5 unit tests: API fetch, non-global exclusion, fallback, fixed municipal, mobile municipal

## Decisions Made

- Used a local `MunicipalHolidayRule` interface inside the composable to handle `offset` and `base` fields from `municipalities.json` without modifying `holiday.ts` (deviation rule would require architectural discussion for type changes across the codebase)
- `buildFallbackHolidays` includes all 10 fixed Portuguese national holidays plus all 7 Easter-based mobile holidays for complete offline coverage
- Used `vi.waitUntil` for async fetch tests to avoid flaky timing; `setTimeout(50ms)` adequate for synchronous computed reads

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `useHolidays()` is ready to be called in `YearGrid.vue` — returns `{ holidays, loading, error }`
- `holidays.value` is a `Map<string, HolidayEntry>` with O(1) day lookup
- Plan 02-03 can import `useHolidays` and `HolidayEntry` from `src/composables/useHolidays.ts`

---
*Phase: 02-holiday-data-api-integration-week-1*
*Completed: 2026-03-12*

## Self-Check: PASSED

- src/composables/useHolidays.ts: FOUND
- src/composables/useHolidays.spec.ts: FOUND
- .planning/phases/02-holiday-data-api-integration-week-1/02-02-SUMMARY.md: FOUND
- Commit 0b0975e (test - RED phase): FOUND
- Commit bc824ad (feat - GREEN phase): FOUND
