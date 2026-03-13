# Quick Task: Fix Tests and Sync Documentation

## Objective
Resolve 12 failing tests in `DashboardSidebar.spec.ts` and `useHolidays.spec.ts` and update `ROADMAP.md` and `REQUIREMENTS.md` to reflect the completed state of Phase 4.

## Proposed Changes

### 1. `src/components/DashboardSidebar.spec.ts`
- Import `createPinia` from `pinia`.
- Add `createPinia()` to the `global.plugins` array in `mountOptions`.

### 2. `src/composables/useHolidays.spec.ts`
- Update the expectation in the "returns national holidays from API" test to include the `date` field.

### 3. `.planning/ROADMAP.md`
- Mark Phase 4 as COMPLETED and check off all its plans.
- Update success criteria as completed.

### 4. `.planning/REQUIREMENTS.md`
- Check off all fulfilled requirements (FR5, FR6, FR7).

## Execution Plan
1. **Step 1: Fix Tests**
   - Apply fixes to `DashboardSidebar.spec.ts` and `useHolidays.spec.ts`.
   - Run tests to verify.
2. **Step 2: Sync Documentation**
   - Update `ROADMAP.md` and `REQUIREMENTS.md`.
3. **Step 3: Update STATE.md**
   - Record the fix as QT-34.

## Verification Strategy
- Run `npm test` and ensure all tests pass.
- Verify `dist/index.html` after a build to ensure no regressions in SEO/AdSense.
