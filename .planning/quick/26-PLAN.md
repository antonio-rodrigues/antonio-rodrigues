# QT-26: Locale-dependent first day of the week

The user wants the first day of the week to be locale-dependent:
- PT: Monday
- EN: Sunday

This involves:
1. Updating `useCalendar.ts` to calculate `firstDayOffset` based on the locale.
2. Updating `MonthCard.vue` to display day initials according to the locale.
3. Ensuring color-coding for weekends is correct (it should be since it's date-based, but must align with headers).

## Tasks

### 1. Update `useCalendar.ts`
- Use `configStore.locale` to decide the offset logic.
- For `en`: offset = `firstDay` (Sunday = 0).
- For `pt`: offset = `(firstDay + 6) % 7` (Monday = 0).

### 2. Update `MonthCard.vue`
- Update `dayInitials` to be reactive to the locale.
- Use `t('calendar.dayInitials')` from i18n or define locally based on locale.

### 3. Verify
- Run existing tests.
- Add/Update tests for `useCalendar.ts`.
