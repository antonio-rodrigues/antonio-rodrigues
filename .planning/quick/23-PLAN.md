# Quick Task 23: Internationalization (i18n) Support

Add i18n support to the project with PT and EN languages, and a language switcher dropdown.

## Status
- [x] Install and configure `vue-i18n`
- [x] Create translation files (PT, EN)
- [x] Implement language switcher dropdown in `App.vue`
- [x] Replace hardcoded strings with translation keys in all components and utils
- [x] Verify i18n functionality

## Proposed Changes

### 1. i18n Configuration
- Create `src/locales/pt.json` and `src/locales/en.json`
- Create `src/i18n.ts` to initialize `vue-i18n`
- Update `src/main.ts` to use i18n

### 2. UI Updates
- Add `LanguageSelector.vue` component or add it directly to `App.vue`
- Update `App.vue` to include the language selector next to the theme switcher

### 3. Component Refactoring
- `App.vue`: Translate header, buttons, and alerts
- `DashboardSidebar.vue`: Translate labels and stats
- `MunicipalitySelector.vue`: Translate labels
- `YearGrid.vue`: Translate month names
- `MonthCard.vue`: Translate month names
- `DayCell.vue`: Translate holiday titles (if any)
- `src/utils/holiday-utils.ts`: Update `formatVacationSummary` to use i18n

## Verification Plan
- [ ] Run `npm run dev` and verify language switching
- [ ] Check all components for missing translations
- [ ] Verify that month names and stats labels change correctly
