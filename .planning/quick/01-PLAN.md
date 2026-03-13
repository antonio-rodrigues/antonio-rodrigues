# Quick Task: Fix Municipality Persistence across Refresh

The selected municipality is correctly saved to `localStorage` but the search input (`MunicipalitySelector.vue`) doesn't reflect the selected value upon page refresh.

## Proposed Changes

### 1. `src/components/MunicipalitySelector.vue`
- Initialize `query` on mount based on `configStore.selectedMunicipalityId`.
- Ensure the dropdown doesn't open automatically on mount when initializing `query`.
- Fix the logic that resets the municipality when `query` is cleared.

## Verification Plan

### Manual Verification
1.  Select a municipality (e.g., "Lisboa").
2.  Refresh the page.
3.  Check if "Lisboa" is still in the search box.
4.  Check if the holiday related to the municipality is still being displayed (if implemented).
5.  Clear the search box and verify the municipality is deselected.
