---
phase: 04-persistence-and-polish-week-2
type: execute
wave: 1
depends_on:
  - "03-03"
files_modified:
  - .planning/STATE.md
  - .planning/ROADMAP.md
autonomous: true
---

# Phase 4: Persistence & Polish (Week 2)

**Goal:** Persist application state to `localStorage`, implement budget alerts, add UI transitions, and perform final build verification.

## Context
The application is functionally complete but loses state on refresh. This phase bridges the gap between a prototype and a production-ready tool by adding data durability, better error/limit feedback, and "premium" UI polish.

## Waves & Dependency Map

| Wave | Plan | Title | Dependencies | Files Modified |
|------|------|-------|--------------|----------------|
| 1 | 04-01 | localStorage Persistence | 03-03 | src/store/config.ts, src/store/config.spec.ts |
| 2 | 04-02 | Balance Alerts & Stat Transitions | 04-01 | src/components/DashboardSidebar.vue, src/components/DashboardSidebar.spec.ts |
| 3 | 04-03 | UI Polish & Final Build Verification | 04-02 | src/components/calendar/DayCell.vue, src/App.vue, README.md |

## Success Criteria
- [ ] Marked vacation days persist after browser refresh.
- [ ] Selected municipality persists after browser refresh.
- [ ] Prominent warning banner appears when vacation budget is exceeded.
- [ ] Stats and dropdowns animate smoothly.
- [ ] Production build (`npm run build`) completes without errors.
- [ ] Responsive layout is verified on mobile and desktop.

## Verification
Full suite `npm test -- --run` must be green, including restored persistence tests in `src/store/config.spec.ts`.
Manual verification of `localStorage` behavior and UI transitions.
