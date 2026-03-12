---
phase: 02-holiday-data-api-integration-week-1
plan: "03"
subsystem: ui-components
tags: [vue, pinia, combobox, municipality, search, tdd]
dependency_graph:
  requires: [02-01]
  provides: [MunicipalitySelector component, municipality store wiring]
  affects: [configStore.selectedMunicipalityId, useHolidays municipalHoliday computed]
tech_stack:
  added: []
  patterns: [script-setup, computed-filter, pinia-store-write, watcher-clear, vue-test-utils-mount]
key_files:
  created:
    - src/components/MunicipalitySelector.vue
    - src/components/MunicipalitySelector.spec.ts
  modified: []
decisions:
  - Used watch(query) instead of separate @input handler for clearing store — single reactive source of truth
  - isOpen controlled by watcher to avoid race conditions with blur/click
  - 150ms blur delay allows click event to fire before dropdown closes
metrics:
  duration: ~10 minutes
  completed: 2026-03-12
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 0
---

# Phase 02 Plan 03: MunicipalitySelector Component Summary

**One-liner:** Combobox component filtering 308 Portuguese municipalities with 2-char minimum, 10-result cap, wired to `configStore.selectedMunicipalityId` via Pinia.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Build MunicipalitySelector component (TDD) | a4d310a | Done |
| 2 | Fill MunicipalitySelector spec stubs with real tests | fd56ac3 | Done (inline with Task 1 TDD RED) |

## What Was Built

### MunicipalitySelector.vue

A `<script setup lang="ts">` combobox component that:
- Renders a text input bound to a `query` ref
- Filters `municipalities.json` (308 entries) case-insensitively via `.includes()`
- Shows no results when `query.length < 2`
- Caps results at 10 via `.slice(0, 10)`
- On item click: sets `configStore.selectedMunicipalityId = mun.id`, updates input display name, closes dropdown
- Watches `query` — when emptied, sets `configStore.selectedMunicipalityId = null`
- 150ms blur delay on input allows click events to register before dropdown closes

### MunicipalitySelector.spec.ts

4 tests covering all behavioral requirements:
1. Filters by partial name ('Lis' shows 'Lisboa')
2. No results when query < 2 chars
3. Store updated on municipality click
4. Store cleared to null when input emptied

## Deviations from Plan

### Auto-applied TDD adjustment

**Found during:** Task 2 planning

**Issue:** The plan described Task 2 as "fill in `it.todo()` stubs", implying a pre-existing spec file with stubs. No such file existed — the directory had no prior spec file.

**Fix:** Wrote the spec from scratch with real implementations in Task 1's TDD RED phase. Task 2's success criteria (4 passing tests, no todos) was satisfied as part of Task 1.

**Impact:** None — both tasks complete, all 4 tests green.

### Pre-existing test failure (out of scope)

**`src/composables/useHolidays.spec.ts`** fails because `useHolidays.ts` does not yet exist — it is being implemented in parallel plan 02-02. This failure predates this plan's changes and is logged to deferred-items per scope boundary rules.

## Verification

- `npx vitest run src/components/MunicipalitySelector.spec.ts` — 4 tests pass
- All previously passing test suites continue to pass (no regressions introduced)
- `src/components/MunicipalitySelector.vue` exists and exports default component

## Self-Check: PASSED

- [x] `src/components/MunicipalitySelector.vue` — FOUND
- [x] `src/components/MunicipalitySelector.spec.ts` — FOUND
- [x] Commit fd56ac3 (test RED) — FOUND
- [x] Commit a4d310a (feat GREEN) — FOUND
