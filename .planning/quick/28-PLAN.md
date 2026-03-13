# Quick Task 28: Fix Calendar Day Alignment

The calendar shows a +1 day shift in the day columns versus the week labels in the Portuguese locale. This is because the grid calculation is using Sunday-start logic while the labels are Monday-start.

## Problem
- April 1st 2026 (Wednesday) is shown on Thursday.
- April 5th 2026 (Sunday) is shown on Monday.
- This is exactly what happens if we use Sunday-start offset (3) with Monday-start labels.

## Strategy
- Rewrite `useCalendar.ts` to be more robust.
- Ensure `getYearData` correctly identifies the week start based on the locale.
- Use explicit date creation for months and days to avoid timezone-related shifts with `eachMonthOfInterval`.
- Pass the locale as an argument to `getYearData` to ensure reactivity and clarity.

## Tasks
1. Update `useCalendar.ts` to:
    - Use a simple loop for months.
    - Explicitly create dates with `new Date(year, month, 1)`.
    - Accept `locale` as an argument to `getYearData`.
2. Update `YearGrid.vue` to pass the locale to `getYearData`.
3. Update tests to reflect these changes.
4. Verify the fix with tests.

## State Update
- Update `STATE.md` to reflect the completion of this task.
