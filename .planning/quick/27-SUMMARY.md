# Quick Task Summary: QT-27 Fix TypeScript Errors

Fixed three TypeScript errors to ensure a clean build with `vue-tsc`.

## Changes

### 1. Components
- **MonthCard.vue**: Added `t` back to `useI18n()` destructuring to fix `Property 't' does not exist` error in the template.
- **YearGrid.vue**: Removed unused `const _locale` declaration while maintaining reactive property access.

### 2. Composables
- **useVacationStats.ts**: Removed unused `import { pt } from 'date-fns/locale'`.

## Verification
- Ran `npx vue-tsc --noEmit`: **Success** (no errors).
- Ran all 71 unit tests: **All Passed**.
