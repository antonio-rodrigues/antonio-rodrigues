# Plan: Optimize Holiday Fetching

The goal is to prevent multiple simultaneous calls to `https://date.nager.at/api/v3/PublicHolidays/` when the application starts. This is currently happening because `useHolidays()` is called in both `App.vue` and `YearGrid.vue`, and each instance sets up its own `watch` on `configStore.year` with `immediate: true`.

## Proposed Changes

### 1. Refactor `src/composables/useHolidays.ts`
- Move the state (`nationalHolidays`, `loading`, `error`) and the fetching logic (`fetchHolidays`) out of the `useHolidays` function so it's shared across all calls.
- Use a flag to ensure the `watch` on `configStore.year` is only initialized once.
- Maintain reactivity by keeping the state in `ref`s.

## Verification Plan

### Automated Tests
- Run existing tests: `npm run test` or `vitest src/composables/useHolidays.spec.ts`.
- Ensure tests still pass.

### Manual Verification
- Monitor network traffic in the browser console (if I could) or use a temporary console log to verify only one call is made.
- Since I cannot run a browser, I will rely on the code structure and tests.
- I will add a temporary `console.log` during development to verify, and then remove it. (Wait, I can't even see the logs easily unless I run the app, which I won't).
- I'll add a test case to `useHolidays.spec.ts` if possible to mock the fetch and count the calls.

## Steps

1.  Modify `src/composables/useHolidays.ts` to move state and `fetchHolidays` to module scope.
2.  Ensure `watch` is only called once.
3.  Update tests if necessary.
