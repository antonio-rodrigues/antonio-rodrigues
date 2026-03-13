# Research: Phase 4 - Persistence & Polish

## Persistence Strategy
The application state needs to persist across page reloads. Currently, `markedDays` (vacation days) and `selectedMunicipalityId` are lost on refresh.

### Pinia Store Persistence
- **State to Persist:**
  - `selectedMunicipalityId: string | null`
  - `markedDays: Set<string>`
  - `maxVacationDays: number` (if we allow users to change it later, good to persist now).
- **Implementation:**
  - Use `localStorage`.
  - Since `markedDays` is a `Set`, we must serialize it to an `Array` for storage and reconstruct the `Set` on load.
  - Option A: Manual `watch` in `useConfigStore`.
  - Option B: `pinia-plugin-persistedstate`.
  - **Decision:** Manual `watch` is preferred for this small project to avoid extra dependencies and handle the `Set` serialization explicitly without complex plugin configuration.

## Visual Alerts for Balance
- **Current State:** `DashboardSidebar` shows `remainingDays` in red if `isOverBudget` is true.
- **Enhancement:**
  - Add a dedicated alert banner in `DashboardSidebar` or above the calendar when the budget is exceeded.
  - Use a warning icon (Lucide `AlertTriangle`).
  - Message: "Excedeu o seu saldo de férias!" (Portuguese).

## UI/UX Polish
- **Hover States:** Enhance `DayCell` hover states to clearly indicate interactability.
- **Transitions:** Add smooth transitions for:
  - Municipality selection (fade in/out results).
  - Stat changes in the dashboard.
  - Month layout shifts (if any).
- **Responsive Layout:**
  - Verify 12-month grid on ultra-wide screens.
  - Verify mobile card layout on small screens.
- **Empty States:** Ensure the dashboard looks good before any holidays or vacations are selected.

## Deployment Preparation
- **Build Check:** Run `npm run build` to ensure production assets are generated correctly.
- **Documentation:** Finalize `README.md` (if needed) or update project docs.
- **Environment Variables:** None currently, but verify if API URLs should be configurable.

## Next Steps
- [ ] Create 04-01-PLAN.md: localStorage Persistence.
- [ ] Create 04-02-PLAN.md: Balance Alerts & Stat Transitions.
- [ ] Create 04-03-PLAN.md: UI Polish & Final Build Verification.
