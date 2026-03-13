# Quick Task 06: Validated Year Selector next to Title - SUMMARY

## Changes
- **Store**: Added `checkHolidaysExist` to `useConfigStore` to verify holiday data availability before switching years.
- **Store**: Updated `fetchHolidays` to return a `Promise<boolean>` for API success status.
- **App.vue**: Added a year input field next to the main title.
- **App.vue**: Implemented `handleYearChange` with:
  - 4-digit and >= 1900 validation.
  - Confirmation prompt: "Todas as seleções actuais serão descartadas. Confirma? (SIM / NÃO)".
  - "Limpar tudo" (clear marked days) on confirmation.
  - Revert logic if API data is missing for the target year.
- **Tests**: Added unit tests for `checkHolidaysExist` in `config.spec.ts`.

## Verification
- [x] Unit tests for store passed.
- [x] Manual logic check: year validation, confirmation, and data-driven revert.
