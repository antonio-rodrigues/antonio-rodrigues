# Phase 3: Interactive Selection & Dashboard - Research

**Researched:** 2026-03-12
**Domain:** Vue 3 reactive state management, click interaction, computed statistics, algorithm design
**Confidence:** HIGH

---

## Summary

Phase 3 introduces the core interactive features that make the app useful: toggling vacation days by clicking, a real-time dashboard summarizing the vacation balance, a "used work days" counter (filtering out weekends and holidays), and a "consecutive rest days" (bridge day) algorithm.

The project already has a solid foundation: `useConfigStore` (Pinia) holds `year`, `selectedMunicipalityId`, and `maxVacationDays`; `useHolidays` returns a reactive `Map<string, HolidayEntry>`; `useCalendar` generates full year data; and `YearGrid` enriches days with holiday data before passing them to `MonthCard` → `DayCell`. All of Phase 3 builds directly on top of these without changing their public APIs.

The key architectural decision is where to own `markedDays` state. Because `markedDays` must be readable by both the dashboard (for calculation) and `DayCell` (for visual state), it belongs in the Pinia `config` store — the single source of truth already used by all components. The dashboard can be a new `DashboardSidebar` component (or panel below the header) consuming the store directly. Calculations (used work days, consecutive rest days) belong in a `useVacationStats` composable that accepts reactive inputs, keeping the dashboard component pure/presentational.

**Primary recommendation:** Store `markedDays` as a `ref<Set<string>>` in the config Pinia store. Implement all calculation logic in a `useVacationStats` composable. Keep DayCell and dashboard components presentational.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TASK-3.1 | Click handler to toggle "Vacation Day" status | DayCell needs `@click` emit; store needs `toggleVacationDay(dateStr)` action; Day interface needs `isVacation` field |
| TASK-3.2 | Real-time summary dashboard/sidebar | New `DashboardSidebar.vue` consuming `useVacationStats`; reactive to store changes |
| TASK-3.3 | "Used work days" calculation (exclude weekends + holidays) | `useVacationStats` composable: filter `markedDays` against weekend + holiday sets |
| TASK-3.4 | "Consecutive rest days" (bridge) algorithm | Interval-merge algorithm over vacation + weekend + holiday dates; find longest contiguous run |
</phase_requirements>

---

## Standard Stack

### Core (already installed, no new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vue | ^3.5.30 | Composition API reactivity | Already in project |
| pinia | ^3.0.4 | Global state for markedDays | Already used for config store |
| date-fns | ^4.1.0 | Date arithmetic, eachDayOfInterval | Already used throughout |
| vitest | ^4.0.18 | TDD for composable logic | Already in project, all 28 tests pass |
| @vue/test-utils | ^2.4.6 | Component click/event tests | Already in project |

### No New Dependencies Required

All Phase 3 requirements can be satisfied using the libraries already installed. Specifically:
- `date-fns/eachDayOfInterval` + `date-fns/isWeekend` handle date iteration
- Vue 3 `computed` handles reactive stat recalculation
- Pinia handles cross-component state
- Tailwind CSS handles all dashboard styling

---

## Architecture Patterns

### Recommended File Structure for Phase 3

```
src/
├── store/
│   └── config.ts              # EXTEND: add markedDays ref + toggleVacationDay()
├── composables/
│   └── useVacationStats.ts    # NEW: usedWorkDays, remainingDays, longestRestPeriod
├── components/
│   ├── calendar/
│   │   ├── DayCell.vue        # EXTEND: accept isVacation prop, emit toggle, green style
│   │   └── YearGrid.vue       # EXTEND: pass isVacation + @toggle-day to DayCell
│   └── DashboardSidebar.vue   # NEW: vacation balance summary panel
└── App.vue                    # EXTEND: add DashboardSidebar, layout shift if sidebar
```

### Pattern 1: markedDays as Set in Pinia store

**What:** `markedDays` is a `ref<Set<string>>` where each string is `'yyyy-MM-dd'`. The store exposes a `toggleVacationDay(dateStr: string)` action.

**Why Set (not Map or Array):** O(1) lookup for `has()` checks inside `computed` that iterate all 365 days. The `Day` interface already uses `'yyyy-MM-dd'` strings as keys (established in Phase 2 via `format(day.date, 'yyyy-MM-dd')`).

**When to use:** Any time a day's vacation status must be read or written.

```typescript
// src/store/config.ts — EXTENSION
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const year = ref(2026)
  const selectedMunicipalityId = ref<string | null>(null)
  const maxVacationDays = ref(22)
  const markedDays = ref<Set<string>>(new Set())

  function toggleVacationDay(dateStr: string) {
    if (markedDays.value.has(dateStr)) {
      markedDays.value.delete(dateStr)
    } else {
      markedDays.value.add(dateStr)
    }
    // Trigger reactivity — Set mutations are not auto-tracked in Vue 3
    markedDays.value = new Set(markedDays.value)
  }

  return { year, selectedMunicipalityId, maxVacationDays, markedDays, toggleVacationDay }
})
```

**CRITICAL reactivity note:** Vue 3's reactivity does NOT track `.add()` and `.delete()` mutations on a `Set` stored inside a `ref`. You must replace the ref value to trigger updates: `markedDays.value = new Set(markedDays.value)`. This is a known Vue 3 limitation. Confidence: HIGH (verified pattern in Vue 3 docs).

### Pattern 2: DayCell click → store toggle

**What:** DayCell accepts an `isVacation` prop and emits `toggle-day` with the date string. The parent (MonthCard or YearGrid via prop-drilling) handles the emit and calls `store.toggleVacationDay`.

**Alternative (equally valid):** DayCell directly accesses `useConfigStore()` inside the component, eliminating prop/emit boilerplate. Given the project already injects `useConfigStore` in `YearGrid.vue`, direct store access in DayCell is simpler and consistent.

**Recommended approach:** Direct store access in DayCell — simpler, avoids prop-drilling through MonthCard, consistent with how `YearGrid` already uses the store.

```typescript
// DayCell.vue — EXTENSION
import { computed } from 'vue'
import { format } from 'date-fns'
import { useConfigStore } from '../../store/config'

const props = defineProps<{ day: Day }>()
const store = useConfigStore()

const dateStr = computed(() => format(props.day.date, 'yyyy-MM-dd'))
const isVacation = computed(() => store.markedDays.has(dateStr.value))

function handleClick() {
  // Only workdays can be toggled (not weekends, not holidays)
  if (!props.day.isWeekend && !props.day.isHoliday) {
    store.toggleVacationDay(dateStr.value)
  }
}
```

**Vacation color:** Use `bg-green-100 text-green-700` consistent with the existing color scheme (red=national holiday, orange=municipal, pink=weekend, green=vacation).

**Priority order for CSS classes:** Vacation overrides regular workday but does NOT override holiday or weekend. Decision: if a day is both a holiday and vacation-marked (user clicked it anyway), holiday wins visually. This is conceptually correct — you cannot "use" a vacation day on a holiday.

### Pattern 3: useVacationStats composable

**What:** Pure function composable that takes reactive inputs and returns computed stats.

**When to use:** All calculation logic belongs here, not in the dashboard component.

```typescript
// src/composables/useVacationStats.ts — NEW
import { computed } from 'vue'
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend } from 'date-fns'
import type { ComputedRef } from 'vue'
import type { Map as HolidayMap } from '../composables/useHolidays' // HolidayEntry map

export function useVacationStats(
  year: ComputedRef<number> | { value: number },
  markedDays: ComputedRef<Set<string>> | { value: Set<string> },
  holidays: ComputedRef<Map<string, unknown>> | { value: Map<string, unknown> },
  maxVacationDays: ComputedRef<number> | { value: number }
) {
  // Used work days = marked days that are NOT weekends and NOT holidays
  const usedWorkDays = computed(() => {
    let count = 0
    for (const dateStr of markedDays.value) {
      const date = new Date(dateStr)
      if (!isWeekend(date) && !holidays.value.has(dateStr)) {
        count++
      }
    }
    return count
  })

  const remainingDays = computed(() => maxVacationDays.value - usedWorkDays.value)
  const isOverBudget = computed(() => usedWorkDays.value > maxVacationDays.value)

  // Consecutive rest days = longest unbroken run of (vacation OR weekend OR holiday)
  const longestRestPeriod = computed(() => {
    const start = startOfYear(new Date(year.value, 0, 1))
    const end = endOfYear(new Date(year.value, 0, 1))
    const allDays = eachDayOfInterval({ start, end })

    let maxRun = 0
    let currentRun = 0

    for (const date of allDays) {
      const dateStr = format(date, 'yyyy-MM-dd')
      const isRest =
        isWeekend(date) ||
        holidays.value.has(dateStr) ||
        markedDays.value.has(dateStr)

      if (isRest) {
        currentRun++
        if (currentRun > maxRun) maxRun = currentRun
      } else {
        currentRun = 0
      }
    }

    return maxRun
  })

  return { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod }
}
```

### Pattern 4: DashboardSidebar component

**What:** Presentational component that shows vacation balance summary. Connects to store and stats composable.

**Layout options:**
1. Sticky sidebar to the right of the calendar grid (requires App.vue layout change to flex/grid)
2. Fixed bar below the header, above the calendar (simpler, no layout change)

**Recommended:** Fixed panel below the header (option 2). The existing `App.vue` header + `YearGrid` structure requires minimal change. The sidebar approach would need a significant layout refactor and risks mobile breakage.

```html
<!-- DashboardSidebar output shape (pseudo) -->
<div class="max-w-7xl mx-auto px-4 mb-6">
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-wrap gap-6">
    <!-- Vacation Balance -->
    <!-- Used Work Days -->
    <!-- Longest Rest Period -->
  </div>
</div>
```

### Anti-Patterns to Avoid

- **Direct mutation of `markedDays.value.add()`** without reassignment: Vue 3 won't detect the change. Always reassign: `markedDays.value = new Set(markedDays.value)`.
- **Counting all markedDays as "used days":** Must filter out weekends and holidays. Users can't consume vacation days on non-workdays.
- **Toggling holidays or weekends:** DayCell click handler must guard against clicking non-workdays. If the user clicks a holiday, nothing should happen (or visual indication it's not toggleable).
- **Computing longestRestPeriod inside the component:** Keep in composable for testability.
- **Using `reactive()` for markedDays instead of `ref()`:** A `ref(new Set())` is simpler to replace (reactivity trigger) than a `reactive()` object wrapping a set.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date iteration for rest period | Custom loop with Date math | `date-fns/eachDayOfInterval` | Handles month boundaries, DST, leap years |
| Weekend detection | `date.getDay() === 0 \|\| 6` | `date-fns/isWeekend` | Correct, tested, readable |
| Year boundaries | Manual Jan 1 / Dec 31 | `date-fns/startOfYear` + `date-fns/endOfYear` | DST-safe |
| Date string formatting | Template literals | `date-fns/format(date, 'yyyy-MM-dd')` | Consistent with existing codebase |

**Key insight:** `date-fns` is already used throughout the project. All date operations should route through it. The `eachDayOfInterval` + `isWeekend` combination is the correct tool for the consecutive rest days algorithm — iterating 365 dates is negligible cost inside a `computed`.

---

## Common Pitfalls

### Pitfall 1: Vue 3 Set/Map Reactivity

**What goes wrong:** `markedDays.value.add('2026-06-01')` mutates the Set in-place but Vue's reactive system does not track `.add()` or `.delete()` on a `Set` inside a `ref`. The UI will not update.

**Why it happens:** Vue 3 `ref()` wraps primitives and objects; for Set/Map, only assignment to `.value` triggers watchers.

**How to avoid:** Always reassign: `markedDays.value = new Set(markedDays.value)` after every mutation in `toggleVacationDay`.

**Warning signs:** Clicking a day appears to do nothing visually, but console.log shows the Set has changed.

### Pitfall 2: Vacation Day Counted on Holidays/Weekends

**What goes wrong:** User marks Christmas Day as vacation. The `usedWorkDays` counter increments by 1 even though it's a holiday.

**Why it happens:** The counter iterates `markedDays` without checking the holiday map.

**How to avoid:** In `usedWorkDays` computed, filter: only count if `!isWeekend(date) && !holidays.value.has(dateStr)`.

**Warning signs:** Marking a red (holiday) cell increments the used days counter.

### Pitfall 3: Consecutive Rest Period Algorithm — Year Boundary

**What goes wrong:** A rest period starting Dec 29 and wrapping into Jan 1 of the next year is not counted correctly.

**Why it happens:** Iterating only within the selected year misses the wrap.

**How to avoid:** For Phase 3, only count within the selected year. This is explicitly the spec. Document the limitation. The spec says "largest block of continuous rest" — reasonably interpreted as within the displayed year. Confidence: MEDIUM (spec is silent on boundary; this is the simpler interpretation).

### Pitfall 4: DayCell click fired on padding cells

**What goes wrong:** The empty cells (firstDayOffset padding) in MonthCard might receive click events if the grid is not carefully structured.

**Why it happens:** MonthCard renders empty `<div>` cells for the offset — these do not have a `day` prop so no toggle is possible, but the click area might overlap.

**How to avoid:** The padding cells are `<div class="h-8"></div>` with no event handlers — this is already safe. No action needed.

### Pitfall 5: isVacation visual state not reactive

**What goes wrong:** User clicks a day, the store updates, but the DayCell color doesn't change because `isVacation` was computed at render time without reactivity.

**Why it happens:** If `isVacation` is not wrapped in `computed()`, it won't re-evaluate when `markedDays` changes.

**How to avoid:** Always use `const isVacation = computed(() => store.markedDays.has(dateStr.value))` in DayCell — never a plain `let`.

---

## Code Examples

### Toggle action in Pinia store

```typescript
// Source: Vue 3 Reactivity docs + Pinia docs pattern
function toggleVacationDay(dateStr: string) {
  const next = new Set(markedDays.value)
  if (next.has(dateStr)) {
    next.delete(dateStr)
  } else {
    next.add(dateStr)
  }
  markedDays.value = next  // assignment triggers Vue reactivity
}
```

### usedWorkDays calculation

```typescript
// Source: date-fns isWeekend, project's existing Map<string, HolidayEntry> pattern
const usedWorkDays = computed(() => {
  let count = 0
  for (const dateStr of markedDays.value) {
    const date = new Date(dateStr + 'T00:00:00')  // explicit local time parsing
    if (!isWeekend(date) && !holidays.value.has(dateStr)) {
      count++
    }
  }
  return count
})
```

**Note on date parsing:** `new Date('2026-06-01')` parses as UTC midnight, which in negative-UTC-offset timezones can shift to the previous day. Use `new Date('2026-06-01T00:00:00')` to force local time parsing. Confidence: HIGH (JavaScript Date spec).

### Consecutive rest period (linear scan)

```typescript
// Source: standard interval scan — O(N) where N = days in year (~365)
const longestRestPeriod = computed(() => {
  const allDays = eachDayOfInterval({
    start: startOfYear(new Date(year.value, 0, 1)),
    end: endOfYear(new Date(year.value, 0, 1))
  })

  let maxRun = 0
  let currentRun = 0

  for (const date of allDays) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const isRest =
      isWeekend(date) ||
      holidays.value.has(dateStr) ||
      markedDays.value.has(dateStr)

    if (isRest) {
      currentRun++
      maxRun = Math.max(maxRun, currentRun)
    } else {
      currentRun = 0
    }
  }

  return maxRun
})
```

### DayCell vacation visual priority

```typescript
// CSS class priority (in :class binding):
// 1. isVacation → bg-green-100 text-green-700
// 2. isHoliday (national) → bg-red-100 text-red-700
// 3. isHoliday (municipal) → bg-orange-100 text-orange-700
// 4. isWeekend → bg-pink-50 text-pink-600
// 5. workday → bg-gray-50 text-gray-700
//
// Note: holidays take visual priority over vacation to prevent
// user confusion (holidays are "free" — don't waste vacation days on them)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vuex for global state | Pinia (already in project) | Vue 3 era | Simpler, typed, composable-friendly |
| Vuex modules | Pinia stores per domain | 2021+ | config.ts already follows this |
| `reactive({})` for collections | `ref(new Set())` with reassign | Vue 3.0+ | Must use reassignment to trigger reactivity |

---

## Open Questions

1. **Dashboard layout: sidebar vs. top panel**
   - What we know: Current App.vue has header + main (YearGrid only). No sidebar currently.
   - What's unclear: Whether user prefers a sticky sidebar or a top summary bar.
   - Recommendation: Default to a horizontal summary strip below the header (simpler, mobile-friendly). Can be changed in Phase 4 polish.

2. **Can users toggle holidays/weekends?**
   - What we know: FR3 says "click any day to toggle its status as Vacation Day". FR3/FR4 say used days excludes weekends and holidays.
   - What's unclear: Should clicking a holiday do nothing, or add it to markedDays (but not count toward used days)?
   - Recommendation: Prevent toggling entirely on holidays and weekends (guard in click handler, add `cursor-not-allowed` visual cue on hover). This is cleaner UX and avoids confusing state. Confidence: MEDIUM (spec interpretation).

3. **Year boundary for consecutive rest period**
   - What we know: Spec says "largest block of continuous rest" — no cross-year mention.
   - What's unclear: Does a Dec 28–Jan 3 bridge across years count?
   - Recommendation: Constrain to the displayed year only. Simpler, testable, and meets the stated goal. Confidence: MEDIUM.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | vite.config.ts (implicit) — no vitest.config.ts, uses default |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --reporter=verbose` |

Current suite: 28 tests, all passing across 5 spec files.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TASK-3.1 | `toggleVacationDay` adds/removes dateStr from markedDays | unit | `npx vitest run src/store/config.spec.ts` | Wave 0 |
| TASK-3.1 | DayCell shows green bg when isVacation | unit | `npx vitest run src/components/calendar/DayCell.spec.ts` | Exists (extend) |
| TASK-3.1 | DayCell click calls toggleVacationDay | unit | `npx vitest run src/components/calendar/DayCell.spec.ts` | Exists (extend) |
| TASK-3.1 | Clicking holiday does NOT toggle | unit | `npx vitest run src/components/calendar/DayCell.spec.ts` | Exists (extend) |
| TASK-3.2 | DashboardSidebar renders correct used/remaining/longest values | unit | `npx vitest run src/components/DashboardSidebar.spec.ts` | Wave 0 |
| TASK-3.3 | `usedWorkDays` excludes weekends | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | Wave 0 |
| TASK-3.3 | `usedWorkDays` excludes holidays | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | Wave 0 |
| TASK-3.3 | `remainingDays` = maxVacationDays - usedWorkDays | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | Wave 0 |
| TASK-3.3 | `isOverBudget` true when used > max | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | Wave 0 |
| TASK-3.4 | `longestRestPeriod` counts vacation + weekend + holiday contiguously | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | Wave 0 |
| TASK-3.4 | `longestRestPeriod` resets at workday boundary | unit | `npx vitest run src/composables/useVacationStats.spec.ts` | Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/composables/useVacationStats.spec.ts` — covers TASK-3.3 and TASK-3.4 (new file)
- [ ] `src/store/config.spec.ts` — covers TASK-3.1 store action (new file)
- [ ] `src/components/DashboardSidebar.spec.ts` — covers TASK-3.2 rendering (new file)
- [ ] Extend `src/components/calendar/DayCell.spec.ts` — add vacation toggle and green style tests

---

## Sources

### Primary (HIGH confidence)

- Vue 3 Reactivity docs: `ref()` with Set/Map requires reassignment for reactivity trigger
- Pinia docs: `defineStore` composition API pattern (matches existing `config.ts`)
- date-fns v4 docs: `eachDayOfInterval`, `isWeekend`, `startOfYear`, `endOfYear`, `format` — all used in existing codebase
- Existing codebase analysis: `useConfigStore`, `useHolidays`, `YearGrid`, `DayCell`, `MonthCard` — all read directly

### Secondary (MEDIUM confidence)

- `new Date('yyyy-MM-dd')` UTC vs. local time parsing: JavaScript specification (ECMAScript) — date-only strings parse as UTC; appending `T00:00:00` forces local interpretation

### Tertiary (LOW confidence)

- Spec interpretation: "toggling holidays/weekends" and "year boundary for consecutive rest" — these are judgment calls derived from reading FR3/FR4 without explicit user confirmation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in project, versions confirmed from package.json
- Architecture: HIGH — patterns match existing codebase conventions (store-first, composable logic, computed stats)
- Pitfalls: HIGH — Vue 3 Set reactivity trap is well-documented; others derived from direct codebase analysis
- Algorithm correctness: HIGH — linear scan for longest run is standard, date-fns handles edge cases

**Research date:** 2026-03-12
**Valid until:** 2026-06-12 (stable libraries, 90-day estimate)
