---
phase: 3
slug: interactive-selection-dashboard-week-2
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 |
| **Config file** | vite.config.ts (implicit — no vitest.config.ts) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | TASK-3.1 | unit | `npx vitest run src/store/config.spec.ts` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | TASK-3.1 | unit | `npx vitest run src/components/calendar/DayCell.spec.ts` | ✅ extend | ⬜ pending |
| 3-01-03 | 01 | 1 | TASK-3.1 | unit | `npx vitest run src/components/calendar/DayCell.spec.ts` | ✅ extend | ⬜ pending |
| 3-01-04 | 01 | 1 | TASK-3.1 | unit | `npx vitest run src/components/calendar/DayCell.spec.ts` | ✅ extend | ⬜ pending |
| 3-02-01 | 02 | 0 | TASK-3.2 | unit | `npx vitest run src/components/DashboardSidebar.spec.ts` | ❌ W0 | ⬜ pending |
| 3-03-01 | 02 | 0 | TASK-3.3 | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | ❌ W0 | ⬜ pending |
| 3-03-02 | 02 | 0 | TASK-3.3 | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | ❌ W0 | ⬜ pending |
| 3-03-03 | 02 | 0 | TASK-3.3 | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | ❌ W0 | ⬜ pending |
| 3-03-04 | 02 | 0 | TASK-3.3 | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | ❌ W0 | ⬜ pending |
| 3-04-01 | 02 | 0 | TASK-3.4 | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | ❌ W0 | ⬜ pending |
| 3-04-02 | 02 | 0 | TASK-3.4 | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/composables/useVacationStats.spec.ts` — stubs for TASK-3.3 and TASK-3.4 (new file)
- [ ] `src/store/config.spec.ts` — stubs for TASK-3.1 store action (new file)
- [ ] `src/components/DashboardSidebar.spec.ts` — stubs for TASK-3.2 rendering (new file)
- [ ] Extend `src/components/calendar/DayCell.spec.ts` — add vacation toggle and green style test stubs

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dashboard layout renders correctly on mobile | TASK-3.2 | Visual/responsive layout | Resize browser to 375px width; confirm summary panel is readable |
| Clicking holiday shows cursor-not-allowed | TASK-3.1 | CSS cursor state | Hover over a red holiday cell; confirm cursor changes to not-allowed |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
