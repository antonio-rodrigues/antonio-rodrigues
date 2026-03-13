# Roadmap: Calendar Webapp

## Phase 1: Project Scaffolding & Initial Logic (Week 1)
**Goal:** Initialize the project and build the core calendar grid and data models.
**Plans:** 3 plans
- [x] .planning/phase-1/01-01-PLAN.md — Project scaffolding, dependencies, and core holiday data structure.
- [x] .planning/phase-1/01-02-PLAN.md — TDD implementation of the core calendar generation logic (useCalendar).
- [x] .planning/phase-1/01-03-PLAN.md — Responsive 12-month annual calendar grid UI.

## Phase 2: Holiday Data & API Integration (Week 1)
**Goal:** Integrate national holidays from Nager.Date API and municipal holidays from local JSON into the calendar, with a municipality selector UI and holiday visual styling.
**Status: COMPLETED 2026-03-12 — 4/4 plans executed**

Plans:
- [x] 02-01-PLAN.md — Fix Holiday type for mobile entries + create Wave 0 spec stubs (COMPLETED 2026-03-12)
- [x] 02-02-PLAN.md — Implement useHolidays composable (API fetch, fallback, municipal resolution) (COMPLETED 2026-03-12)
- [x] 02-03-PLAN.md — Build MunicipalitySelector combobox component (COMPLETED 2026-03-12)
- [x] 02-04-PLAN.md — UI integration: DayCell holiday styling, tooltips, App.vue wiring (COMPLETED 2026-03-12)

## Phase 3: Interactive Selection & Dashboard (Week 2)
**Goal:** Enable users to click days to mark vacation, see a real-time dashboard with balance stats, and calculate used work days and longest rest periods.
**Status: COMPLETED 2026-03-12 — 3/3 plans executed**

Plans:
- [x] 03-01-PLAN.md — Store extension (markedDays + toggleVacationDay), DayCell vacation toggle + green styling, Wave 0 test stubs (COMPLETED 2026-03-12)
- [x] 03-02-PLAN.md — TDD: useVacationStats composable (usedWorkDays, remainingDays, isOverBudget, longestRestPeriod) (COMPLETED 2026-03-12)
- [x] 03-03-PLAN.md — DashboardSidebar component + App.vue wiring + browser verification checkpoint (COMPLETED 2026-03-12)

## Phase 4: Persistence & Polish (Week 2)
**Goal:** Persist state to localStorage, add balance alerts, and polish the UI/UX.
**Status: COMPLETED 2026-03-13 — 3/3 plans executed**

Plans:
- [x] 04-01-PLAN.md — localStorage Persistence (COMPLETED 2026-03-13)
- [x] 04-02-PLAN.md — Balance Alerts & Stat Transitions (COMPLETED 2026-03-13)
- [x] 04-03-PLAN.md — UI Polish & Final Build Verification (COMPLETED 2026-03-13)

## Success Criteria
- [x] Render 12 months for 2026.
- [x] Show 13 national holidays automatically.
- [x] Show 1 regional holiday correctly for Lisbon (June 13).
- [x] Correctly calculate "Used Work Days" (ignore weekends).
- [x] Persist marked dates after page refresh.
- [x] Visual alert when vacation budget exceeded.
