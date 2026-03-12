---
phase: 2
slug: holiday-data-api-integration-week-1
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.18 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 0 | Type fix (Holiday offset/base) | unit | `npx vitest run src/utils/holiday-utils.spec.ts` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 0 | useHolidays spec stubs | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 0 | DayCell spec stubs | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-04 | 01 | 0 | MunicipalitySelector spec stubs | component | `npx vitest run src/components/MunicipalitySelector.spec.ts` | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 1 | useHolidays — API fetch national | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 1 | useHolidays — fallback when API fails | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ W0 | ⬜ pending |
| 2-02-03 | 02 | 1 | useHolidays — fixed municipal holiday | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ W0 | ⬜ pending |
| 2-02-04 | 02 | 1 | useHolidays — mobile municipal holiday (Easter+offset) | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ W0 | ⬜ pending |
| 2-03-01 | 03 | 1 | MunicipalitySelector filters by partial name | component | `npx vitest run src/components/MunicipalitySelector.spec.ts` | ❌ W0 | ⬜ pending |
| 2-03-02 | 03 | 1 | MunicipalitySelector updates configStore | component | `npx vitest run src/components/MunicipalitySelector.spec.ts` | ❌ W0 | ⬜ pending |
| 2-04-01 | 04 | 2 | DayCell bg-red-100 for national holiday | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ W0 | ⬜ pending |
| 2-04-02 | 04 | 2 | DayCell bg-orange-100 for municipal holiday | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ W0 | ⬜ pending |
| 2-04-03 | 04 | 2 | DayCell title attribute for holiday | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/composables/useHolidays.spec.ts` — stubs for composable logic, API mock, fallback, municipality resolution
- [ ] `src/components/calendar/DayCell.spec.ts` — stubs for holiday class application and tooltip
- [ ] `src/components/MunicipalitySelector.spec.ts` — stubs for combobox filtering and store wiring

*Existing: `src/composables/useCalendar.spec.ts`, `src/utils/holiday-utils.spec.ts` — both pass, no changes needed for Phase 2.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Calendar visually shows holiday colors in browser | Visual styling | DOM rendering requires visual inspection | Open app, check a known holiday date (e.g. 2026-01-01) shows red background |
| Tooltip appears on hover over holiday | Tooltip UX | Native `title` attribute behavior varies by OS/browser | Hover over holiday day cell, verify tooltip text format |
| Year switching loads new holidays from API | End-to-end flow | Requires live API + year selector interaction | Change year in UI, verify holidays update accordingly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
