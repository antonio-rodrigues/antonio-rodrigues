# Quick Task: UI Refinements and Rest Period Logic Update

## Goal
Improve month labels, refine "Maior Período de Descanso" stat (logic and display), and fix mobile padding.

## Tasks

### 1. Month Card Labels
- **File:** `src/components/calendar/MonthCard.vue`
- **File:** `src/components/calendar/YearGrid.vue`
- **Change:** Pass index to `MonthCard` and display padded month number (e.g., "01 JANEIRO") in light gray.

### 2. "Maior Período de Descanso" Stat
- **File:** `src/composables/useVacationStats.ts`
- **Change:**
    - Update `longestRestPeriod` to return `{ days: number, startMonthDay: string }`.
    - `days` should reflect only *selected business days* (excluding holidays and weekends) within the longest continuous rest period.
    - `startMonthDay` should be the start of that period (formatted as "MMM dd").
- **File:** `src/components/DashboardSidebar.vue`
- **Change:**
    - Display the month/day next to the counter.
    - Change secondary label to "dias úteis consecutivos".
    - Ensure styling follows requirements (light gray for month/day).

### 3. Mobile Padding
- **File:** `src/style.css`
- **Change:** Remove padding for `#app` in mobile viewports (e.g., `< 640px`).

## Verification Plan
- **Manual:** Check month labels in the UI.
- **Manual:** Select a vacation period (e.g., Mon-Fri) and verify "Maior Período de Descanso" shows "5" and the start date.
- **Manual:** Check mobile view to ensure padding is removed.
- **Automated:** Update existing tests in `useVacationStats.spec.ts` and `DashboardSidebar.spec.ts`.
