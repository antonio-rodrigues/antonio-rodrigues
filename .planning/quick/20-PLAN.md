# Plan: Revert QT-19 - Add Black Theme and Fix Theme Styles

The user requested to revert the changes made in the last task (QT-19).

## User Requirements
- Revert all changes from the previous task.

## Proposed Changes
### 1. File Restoration
- [ ] Restore `src/store/config.ts` from HEAD.
- [ ] Restore `src/App.vue` from HEAD.
- [ ] Restore `src/style.css` from HEAD.
- [ ] Restore `src/store/config.spec.ts` from HEAD.
- [ ] Restore `.planning/STATE.md` from HEAD.

### 2. Cleanup
- [ ] Delete `.planning/quick/10-PLAN.md`.
- [ ] Delete `.planning/quick/10-SUMMARY.md`.

## Verification Plan
- [ ] Verify that `theme` type in `src/store/config.ts` only has 'light' and 'dark'.
- [ ] Verify that `src/style.css` no longer contains `.black` styles.
- [ ] Verify that `STATE.md` no longer lists QT-19.
- [ ] Run tests to ensure everything is back to normal.
