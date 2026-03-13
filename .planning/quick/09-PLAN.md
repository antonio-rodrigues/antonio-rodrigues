# QT-18: Fix Dark Theme and update #app background

The theme switcher is not applying dark mode colors correctly. Also, the `#app` background-color should change to `#F2AEBB` in Dark theme.

## Goal
- [ ] Fix dark mode color application.
- [ ] Update `#app` in `src/style.css` to use `#F2AEBB` in dark mode.
- [ ] Ensure `#app` uses `#B7BDF7` in light mode (as currently seen).

## Proposed Changes
### src/style.css
- Update `#app` selector to have `background-color: #B7BDF7` (light mode).
- Add `.dark #app` selector with `background-color: #F2AEBB` (dark mode).
- Ensure transition is smooth.

### src/App.vue
- Review the `watch` and template to ensure `dark` class is effective.
- (Optional) Remove the `bg-slate-50` from the root div if it conflicts with the user's desired `#app` background, or adjust it to be transparent in dark mode.

## Verification
- [ ] Verify `dark` class is applied to `<html>`.
- [ ] Verify `#app` background-color is `#B7BDF7` in light mode and `#F2AEBB` in dark mode.
- [ ] Verify other components (e.g. `MonthCard`) apply `dark:` classes correctly.
