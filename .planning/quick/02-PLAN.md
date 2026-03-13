# Quick Task: Desktop Layout Improvements & Vacation Summary

Enhance the desktop experience by aligning the search box, making vacation balance editable, and adding a summary panel for selected dates.

## Proposed Changes

### 1. `src/store/config.ts`
- Persist `maxVacationDays` in `localStorage`.
- Initialize `maxVacationDays` from saved state (default 22).

### 2. `src/utils/holiday-utils.ts`
- Added `formatVacationSummary(markedDays: string[])` helper to group selected days by month in Portuguese (JAN, FEV, etc.).

### 3. `src/App.vue`
- Aligned `MunicipalitySelector` to the right on desktop using Tailwind classes.
- Passed `markedDays` array and `update:max-vacation-days` event to `DashboardSidebar`.

### 4. `src/components/DashboardSidebar.vue`
- Transformed "Saldo de Férias" display into a numeric input field.
- Added a new panel to display the summarized vacation dates grouped by month.
- Responsive layout: Grid with 4 columns on desktop (3 for stats, 1 for summary).

## Verification Plan

### Automated Tests
- `npm test src/components/DashboardSidebar.spec.ts`
- `npm test src/utils/holiday-utils.spec.ts`
- Verified all 59 tests pass (including fix for `MunicipalitySelector.spec.ts`).

### Manual Verification
1.  Verify the search box is on the right of the header on desktop.
2.  Change "Saldo de Férias" from 22 to 25 and verify "Dias Restantes" updates.
3.  Refresh page and verify 25 is still there.
4.  Select some days in different months and verify the summary panel shows them correctly (e.g., "FEV: 16, 18").
