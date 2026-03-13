# Quick Task: Fix "Clear all" button not resetting selected days

The "Limpar tudo" (Clear all) button in `App.vue` calls `store.clearMarkedDays`, but this function is not exported from the `useConfigStore` in `src/store/config.ts`.

## User Review Required

> [!IMPORTANT]
> None. This is a straightforward bug fix.

## Proposed Changes

### `src/store/config.ts`

- Export `clearMarkedDays` from the `useConfigStore` return object.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure existing tests pass.
- I should add a test case for `clearMarkedDays` in `src/store/config.spec.ts` if it doesn't exist.

### Manual Verification
- Select some days in the calendar.
- Click "Limpar tudo".
- Verify that all selected days are cleared.
