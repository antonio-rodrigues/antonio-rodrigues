# Roadmap: Calendar Webapp

## Phase 1: Project Scaffolding & Initial Logic (Week 1)
**Goal:** Initialize the project and build the core calendar grid and data models.
**Plans:** 3 plans
- [x] .planning/phase-1/01-01-PLAN.md — Project scaffolding, dependencies, and core holiday data structure.
- [x] .planning/phase-1/01-02-PLAN.md — TDD implementation of the core calendar generation logic (useCalendar).
- [x] .planning/phase-1/01-03-PLAN.md — Responsive 12-month annual calendar grid UI.

## Phase 2: Holiday Data & API Integration (Week 1)
**Goal:** Integrate national holidays from Nager.Date API and municipal holidays from local JSON into the calendar, with a municipality selector UI and holiday visual styling.
**Plans:** 1/4 plans executed

Plans:
- [ ] 02-01-PLAN.md — Fix Holiday type for mobile entries + create Wave 0 spec stubs
- [ ] 02-02-PLAN.md — Implement useHolidays composable (API fetch, fallback, municipal resolution)
- [ ] 02-03-PLAN.md — Build MunicipalitySelector combobox component
- [ ] 02-04-PLAN.md — UI integration: DayCell holiday styling, tooltips, App.vue wiring

## Phase 3: Interactive Selection & Dashboard (Week 2)
- **Task 3.1:** Implement click handler to toggle "Vacation Day" status.
- **Task 3.2:** Build the real-time summary dashboard/sidebar.
- **Task 3.3:** Develop the "used work days" calculation (filtering weekends and holidays).
- **Task 3.4:** Develop the "consecutive rest days" (bridge) algorithm.

## Phase 4: Persistence & Polish (Week 2)
- **Task 4.1:** Implement `localStorage` read/write state sync.
- **Task 4.2:** Add visual alerts for exceeded vacation balances.
- **Task 4.3:** UI/UX final polish (hover states, animations, transitions).
- **Task 4.4:** Final deployment preparation and documentation.

## Success Criteria
- [ ] Render 12 months for 2026.
- [ ] Show 13 national holidays automatically.
- [ ] Show 1 regional holiday correctly for Lisbon (June 13).
- [ ] Correctly calculate "Used Work Days" (ignore weekends).
- [ ] Persist marked dates after page refresh.
