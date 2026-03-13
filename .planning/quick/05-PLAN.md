# Quick Task 05: UI & Logic Updates

## Objective
1.  **UI Update:** Add a light gray border and slightly rounded corners to the "Saldo de Férias" input field.
2.  **Logic Update:** Fix the "Dias Consecutivos" calculation to include holidays that fall on weekends when determining consecutive rest periods.

## Strategy
1.  **UI:** Modify `src/components/DashboardSidebar.vue` to add `border border-gray-200` to the input field.
2.  **Logic:** Modify `src/composables/useVacationStats.ts` in the `totalSelectedDays` computation. Update the logic that extends the "important" range to include weekends if the range starts on a Sunday or ends on a Saturday (due to holidays).

## Execution Plan
1.  Apply UI changes to `src/components/DashboardSidebar.vue`.
2.  Apply logic changes to `src/composables/useVacationStats.ts`.
3.  Add/Update tests in `src/composables/useVacationStats.spec.ts` to verify the logic fix.
4.  Run all tests to ensure no regressions.

## Verification
-   Visual check (manual or via unit test checking classes).
-   Unit tests for `useVacationStats` covering holiday on weekend scenario.
