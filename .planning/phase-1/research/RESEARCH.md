# Phase 1: Project Initialization & Core Logic - Research

**Researched:** 2025-05-14
**Domain:** Frontend Architecture (Vue 3), Calendar Logic, Portugal Holiday Data
**Confidence:** HIGH

## Summary
Phase 1 focuses on setting up a robust Vue 3 environment with Vite, Tailwind CSS, and Lucide, while implementing the core calendar generation and holiday mapping logic. The primary challenge is handling the 308 Portuguese municipalities, as standard APIs (like Nager.Date) only cover national and district-level (ISO 3166-2) holidays. A custom local data strategy for the 308 municipalities is required.

**Primary recommendation:** Use `date-fns` for calendar generation to ensure reliability (leap years, DST, month lengths) and bundle a pre-generated `municipalities.json` for the 308 local holidays.

## User Constraints
(No CONTEXT.md found. Using requirements from PROJECT.md and REQUIREMENTS.md)

### Locked Decisions
- Framework: Vue 3 (Composition API)
- Build Tool: Vite
- Styling: Tailwind CSS
- Icons: Lucide-vue-next
- API for National Holidays: Nager.Date

### Claude's Discretion
- Calendar logic library: `date-fns` recommended for modularity and performance.
- Local storage for persistence.
- Data structure for 308 municipalities.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vue` | 3.4+ | Framework | Reactive UI with Composition API. |
| `vite` | 5.x | Build Tool | Extremely fast HMR and optimized builds. |
| `tailwindcss`| 3.4 | Styling | Utility-first, perfect for responsive grids. |
| `date-fns` | 3.x | Date Logic | Modular, immutable, and easy to tree-shake. |
| `lucide-vue-next`| Latest | Icons | Clean, lightweight icon set. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `axios` | Latest | API Fetching | Standard for Nager.Date holiday fetching. |
| `pinia` | 2.x | State Management| Recommended for `markedDays` and `config`. |

**Installation:**
```bash
npm create vite@latest calendar -- --template vue-ts
cd calendar
npm install tailwindcss postcss autoprefixer lucide-vue-next date-fns axios pinia
npx tailwindcss init -p
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/          # Global CSS (Tailwind)
├── components/
│   ├── calendar/    # MonthCard.vue, DayCell.vue, YearGrid.vue
│   └── ui/          # Tooltips, Selects (Radix-like or custom)
├── composables/     # useCalendar.ts, useHolidays.ts
├── data/            # municipalities.json, national-holidays.json (cache)
├── store/           # pinia stores (vacation.ts, config.ts)
├── utils/           # date-utils.ts, holiday-calculator.ts
└── App.vue
```

### Pattern 1: Calendar Generation (Composable)
Encapsulate logic in a `useCalendar` hook.
**Example:**
```typescript
import { eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export function useCalendar(year: number) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1))
  }).map(monthDate => {
    return {
      name: format(monthDate, 'MMMM'),
      days: eachDayOfInterval({
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate)
      })
    };
  });
  return { months };
}
```

### Pattern 2: Responsive 12-Month Grid
Use Tailwind's grid for fluid layout adjustment.
```html
<!-- Parent Container -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
  <MonthCard v-for="month in months" :month="month" />
</div>
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date Math | Native `Date` + / - | `date-fns` | Handles edge cases (DST, month lengths) reliably. |
| National Holidays | Manual List | Nager.Date API | National holidays (like Easter/Corpus Christi) move every year. |
| Icons | SVG components | `lucide-vue-next` | Optimized, consistent, and easy to theme. |

## Common Pitfalls

### Pitfall 1: Week Start Day
**What goes wrong:** `getDay()` returns 0 for Sunday, but Portuguese calendars usually start on Monday.
**How to avoid:** Map `(day + 6) % 7` to shift Sunday to index 6, or use `date-fns/locale/pt` which defines Monday as the first day of the week.

### Pitfall 2: API Rate Limiting / Offline use
**What goes wrong:** Fetching Nager.Date on every refresh can be slow or fail offline.
**How to avoid:** Cache holiday data in `localStorage` once fetched for a specific year.

### Pitfall 3: 308 Municipality Holidays
**What goes wrong:** Nager.Date only provides 20 subdivisions (Districts).
**How to avoid:** Maintain a local `municipalities.json` for the 308 concelhos. Most have fixed dates; a few are mobile (e.g., *Segunda-feira de Pascoela*).

## Code Examples

### Holiday Calculation Utility
```typescript
// utils/holiday.ts
export function isEasterRelated(baseDate: Date, offset: number): Date {
  // Logic to calculate date relative to Easter (e.g. Corpus Christi is Easter + 60 days)
  // date-fns addDays(getEaster(year), offset)
}

export const FIXED_MUNICIPAL_HOLIDAYS = {
  "lisboa": { day: 13, month: 5, label: "Santo António" }, // Month is 0-indexed
  "porto": { day: 24, month: 5, label: "São João" },
};
```

## Holiday Data Structure (308 Municipalities)

Recommended schema for `src/data/municipalities.json`:
```json
[
  {
    "id": "PT-LIS",
    "name": "Lisboa",
    "district": "Lisboa",
    "holiday": { "type": "fixed", "day": 13, "month": 6, "name": "Santo António" }
  },
  {
    "id": "PT-POR",
    "name": "Porto",
    "district": "Porto",
    "holiday": { "type": "fixed", "day": 24, "month": 6, "name": "São João" }
  },
  {
    "id": "PT-ALM",
    "name": "Almada",
    "district": "Setúbal",
    "holiday": { "type": "mobile", "offset": 40, "base": "easter", "name": "Quinta-feira da Ascensão" }
  }
]
```

## Validation Architecture

> Skip this section entirely if workflow.nyquist_validation is false in .planning/config.json

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm run test:ui` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| T1.2 | Generate 2026 calendar with correct start days | Unit | `npx vitest run tests/calendar.spec.ts` | ❌ Wave 0 |
| T1.4 | Resolve municipal holiday for Lisbon (Jun 13) | Unit | `npx vitest run tests/holiday.spec.ts` | ❌ Wave 0 |

## Sources

### Primary (HIGH confidence)
- [Nager.Date API Docs](https://date.nager.at/Api) - National holiday source.
- [date-fns Docs](https://date-fns.org/docs/) - Calendar logic reference.
- [Portugal Administrative Divisions (CAOP)](https://dados.gov.pt/) - Source for 308 municipalities.

### Secondary (MEDIUM confidence)
- [Python-holidays GitHub](https://github.com/vacanza/python-holidays/blob/master/holidays/countries/portugal.py) - Logic reference for mobile Portuguese holidays.

## Metadata
**Confidence breakdown:**
- Standard stack: HIGH - Vue/Vite/Tailwind is the industry standard for 2024/2025.
- Architecture: HIGH - Composition API + Pinia is robust for this scale.
- Pitfalls: HIGH - Known issues with Portuguese week starts and regional holidays identified.

**Research date:** 2025-05-14
**Valid until:** 2025-11-14 (Stable stack)
