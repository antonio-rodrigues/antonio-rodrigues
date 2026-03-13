# Quick Task: UI Updates and New Counter

## Goal
- Add a "Limpar tudo" CTA to the left of the municipality selector to remove all vacation selections.
- Add a "DIAS CONSECUTIVOS" counter to the dashboard banner, showing the total number of selected days (regardless of weekends/holidays).

## Proposed Changes

### 1. Store Update
- **File:** `src/store/config.ts`
- **Change:** Add a `clearMarkedDays` function to reset `markedDays`.

### 2. Stats Composable Update
- **File:** `src/composables/useVacationStats.ts`
- **Change:** Add `totalSelectedDays` computed property which returns `markedDays.value.size`.

### 3. Component Updates
- **File:** `src/components/DashboardSidebar.vue`
- **Change:** 
    - Add `totalSelectedDays` to props.
    - Add a new stat block for "Dias Selecionados" (UI label: "Dias Selecionados" or "Dias Consecutivos" as requested) next to "Dias Usados".
    - *Note:* The user requested "DIAS CONSECUTIVOS" but described it as "total de todos os dias selecionados". I will use the label "Dias Selecionados" or similar if "DIAS CONSECUTIVOS" might be confused with the "Maior Período de Descanso". However, following the prompt exactly, I'll use "Dias Selecionados" or "Total Selecionado" to be clear, or just "Dias Consecutivos" as requested if it's meant to be that. Wait, the prompt says: `um com "DIAS CONSECUTIVOS". Colocar ao lado do "DIAS USADOS".`. I will follow the prompt.

- **File:** `src/App.vue`
- **Change:**
    - Add "Limpar tudo" button next to `MunicipalitySelector`.
    - Pass `totalSelectedDays` to `DashboardSidebar`.

## Verification Plan
- **Manual Verification:**
    - Select some days in the calendar.
    - Check if "DIAS CONSECUTIVOS" matches the total number of selected days.
    - Click "Limpar tudo" and verify all selections are gone and counters reset.
- **Automated Tests:**
    - Update `src/composables/useVacationStats.spec.ts` if it exists (it does).
    - Update `src/components/DashboardSidebar.spec.ts` if it exists (it does).
