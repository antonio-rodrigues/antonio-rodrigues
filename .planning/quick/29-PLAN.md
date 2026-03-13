# Quick Task: Fix MonthCard rendering (remove stray '...')

The `MonthCard.vue` component contains a stray `...` literal inside the grid, which acts as a grid item and shifts the alignment of days, causing the calendar to render incorrectly as shown in `month-card-wrong.jpg`.

## User Request
"Ainda não está resolvido: o render do card aparece como na imagem ./month-card-wrong.jpg. Deve aparecer como na imagem ./month-card-good.jpg"

## Proposed Changes

### `src/components/calendar/MonthCard.vue`
- Remove the stray `...` literal between the day headers and the empty leading cells.

## Verification Plan

### Automated Tests
- Run existing tests to ensure no regressions: `npm run test` or `vitest`.
- Check `MonthCard.vue` tests if they exist.

### Manual Verification
- Verify that the card now looks like `month-card-good.jpg`.
