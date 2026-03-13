# QT-27: Fix TypeScript Errors

Fix three identified TypeScript errors to ensure a clean build.

## Tasks

### 1. Fix `MonthCard.vue`
- The template uses `t()` but the script only destructures `tm`.
- Add `t` back to `useI18n()` destructuring.

### 2. Fix `YearGrid.vue`
- `_locale` is declared but never read.
- Remove the declaration. If reactivity check is still desired, just access the property without assigning: `configStore.locale`.

### 3. Fix `useVacationStats.ts`
- `pt` is imported from `date-fns/locale` but never used.
- Remove the import.

## Verification
- Run `npm run type-check` (if script exists) or `npx vue-tsc --noEmit`.
- Run `npm test` to ensure no regressions.
