# Plan - Sticky Header and Mobile Visibility

Implement sticky header and dashboard panels, with mobile-specific visibility for the vacation summary.

## User Requirements
- Title + Municipality Selector + Stats Banner + Selected Days must be fixed/sticky at the top.
- Mobile: Keep panels fixed but hide "Selected Days" section.

## Proposed Changes

### 1. `src/App.vue`
- Wrap `<header>` and `<DashboardSidebar>` in a sticky container.
- Add `sticky top-0 z-10 bg-slate-50 shadow-sm` to the container.
- Adjust padding/margins to ensure it looks good when stuck.
- Add a wrapper for the `main` content to avoid jumping when sticky kicks in (though `sticky` doesn't usually cause jumping like `fixed` does, but we need to ensure background colors match).

### 2. `src/components/DashboardSidebar.vue`
- Add `hidden lg:flex` (or similar) to the "Summary Panel" to hide it on mobile.
- Maybe optimize the "Stats Panel" for mobile to be more compact if it's going to be sticky.

## Verification Plan
- [ ] Verify sticky behavior on desktop (scroll down, header stays).
- [ ] Verify sticky behavior on mobile.
- [ ] Verify "Selected Days" (Summary Panel) is hidden on mobile.
- [ ] Verify "Selected Days" is visible on desktop.
- [ ] Run existing tests to ensure no regressions.
