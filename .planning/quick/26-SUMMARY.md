# Quick Task Summary: QT-26 Locale-dependent Week Start

Implemented locale-dependent first day of the week logic to support both Portuguese (Monday-start) and English (Sunday-start) preferences.

## Changes

### 1. Composables
- **useCalendar.ts**: Updated `getYearData` to calculate `firstDayOffset` dynamically using `configStore.locale`.
  - `pt`: Monday as the first day (offset = `(day + 6) % 7`).
  - `en`: Sunday as the first day (offset = `day`).

### 2. Components
- **MonthCard.vue**: Refactored `dayInitials` to be a computed property using `tm('calendar.dayInitials')` for i18n support.

### 3. Locales
- **en.json**: Added `dayInitials` array starting with Sunday: `["S", "M", "T", "W", "T", "F", "S"]`.
- **pt.json**: Added `dayInitials` array starting with Monday: `["S", "T", "Q", "Q", "S", "S", "D"]`.

### 4. Tests
- **useCalendar.spec.ts**: Updated the weekday offset test to verify correct calculation for both locales.

## Verification
- Ran all 71 tests: **All Passed**.
- Verified that `DayCell.vue` weekend color-coding (`isWeekend`) aligns correctly with the headers for both locales.
