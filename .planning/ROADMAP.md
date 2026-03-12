# Roadmap: Calendar Webapp

## Phase 1: Project Scaffolding & Initial Logic (Week 1)
**Goal:** Initialize the project and build the core calendar grid and data models.
**Plans:** 3 plans
- [ ] .planning/phase-1/01-01-PLAN.md — Project scaffolding, dependencies, and core holiday data structure.
- [ ] .planning/phase-1/01-02-PLAN.md — TDD implementation of the core calendar generation logic (useCalendar).
- [ ] .planning/phase-1/01-03-PLAN.md — Responsive 12-month annual calendar grid UI.

## Phase 2: Holiday Data & API Integration (Week 1)
- **Task 2.1:** Integrate Nager.Date API for national holidays.
- **Task 2.2:** Add a selection component for 308 municipalities.
- **Task 2.3:** Implement logic to combine national and regional holidays.
- **Task 2.4:** Visual styling for holidays and weekends (tooltips/indicators).

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
