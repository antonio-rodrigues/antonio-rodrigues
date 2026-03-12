# Phase 1: Project Scaffolding & Core Logic

**Objective:** Initialize the Vue 3 environment, implement the core calendar generation logic, and build a responsive 12-month grid layout.

## Wave Structure

| Wave | Plan | Objective | Autonomous |
|------|------|-----------|------------|
| 1 | [01-01](./01-01-PLAN.md) | Project scaffolding, dependencies, and core holiday data structure. | yes |
| 2 | [01-02](./01-02-PLAN.md) | TDD implementation of the core calendar generation logic (useCalendar). | yes |
| 3 | [01-03](./01-03-PLAN.md) | Responsive 12-month annual calendar grid UI. | no (has checkpoint) |

## Plan Breakdown

### [01-01: Setup & Data Structure](./01-01-PLAN.md)
- **Task 1:** Initialize Vue 3 project with Vite, Tailwind CSS, Lucide, Pinia, date-fns.
- **Task 2:** Define holiday data structure (types and `municipalities.json` sample).
- **Task 3:** Initialize configuration store (year, selected municipality, max days).

### [01-02: Core Calendar Logic](./01-02-PLAN.md)
- **Task 1:** Setup Vitest for the project.
- **Task 2:** Implement `useCalendar` composable to generate year data (12 months, days, weekday offsets) using TDD.

### [01-03: Responsive Year Grid UI](./01-03-PLAN.md)
- **Task 1:** Build `MonthCard` and `DayCell` components.
- **Task 2:** Build `YearGrid` with responsive grid layout (3/4 col desktop, 1 col mobile).
- **Task 3:** Human verification of the calendar layout and responsiveness.

## Context Budget
Each plan targets ~30-40% context to ensure high execution quality.

## Next Step
Execute Wave 1: `/gsd:execute-phase 01-scaffolding-logic --plan 01`
