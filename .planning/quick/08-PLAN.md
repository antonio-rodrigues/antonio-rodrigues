# QT-17: Light/Dark Mode Toggle

Add a theme toggle (Light/Dark mode) next to the municipality search box using Material Symbols.

## Goal
- [ ] Add Material Symbols Outlined link to `index.html`.
- [ ] Add `theme` ('light' | 'dark') state to Pinia store with persistence.
- [ ] Add a toggle button in `App.vue` next to `MunicipalitySelector`.
- [ ] Implement theme application (adding/removing `dark` class to `html`).
- [ ] Enable `darkMode: 'class'` in `tailwind.config.js`.
- [ ] Update UI components with `dark:` classes for core colors.

## Proposed Changes
### index.html
- Add `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`.

### tailwind.config.js
- Add `darkMode: 'class'`.

### src/store/config.ts
- Add `theme` state ('light' | 'dark').
- Default to 'light'.
- Save/load from `localStorage`.

### src/App.vue
- Add theme toggle button.
- Apply `dark` class to `document.documentElement` based on store state.
- Update header background/text colors for dark mode.

### src/components/calendar/YearGrid.vue (and others)
- Apply `dark:` classes to handle text/bg colors.

## Verification
- [ ] Toggle theme and verify `dark` class is applied/removed.
- [ ] Verify icons switch correctly (e.g. `light_mode` vs `dark_mode`).
- [ ] Verify UI readability in both modes.
- [ ] Verify state persists after refresh.
