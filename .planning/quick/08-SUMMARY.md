# QT-17: Light/Dark Mode Toggle - SUMMARY

## Goal
- [x] Add Material Symbols Outlined link to `index.html`.
- [x] Add `theme` ('light' | 'dark') state to Pinia store with persistence.
- [x] Add a toggle button in `App.vue` next to `MunicipalitySelector`.
- [x] Implement theme application (adding/removing `dark` class to `html`).
- [x] Enable `darkMode: 'class'` in `tailwind.config.js`.
- [x] Update UI components with `dark:` classes for core colors.

## Completed Changes
- **`index.html`**: Added Google Fonts Icons stylesheet.
- **`tailwind.config.js`**: Enabled `darkMode: 'class'`.
- **`src/store/config.ts`**: Added persistent `theme` state and `toggleTheme` action.
- **`src/App.vue`**: Added Material Symbols icon button, implemented `watch` to toggle `dark` class on `<html>`, and updated header/background styles.
- **`src/style.css`**: Removed hardcoded background colors to support dynamic theme colors from Tailwind.
- **Components**: Updated `MunicipalitySelector`, `DashboardSidebar`, `MonthCard`, and `DayCell` with `dark:` classes for text, background, and hover states.

## Verification
- [x] `npm run build` completed successfully.
- [x] Theme persistence correctly implemented in store.
- [x] Dark mode logic uses `document.documentElement.classList`.
- [x] Components use appropriate Tailwind `dark:` utility classes.
