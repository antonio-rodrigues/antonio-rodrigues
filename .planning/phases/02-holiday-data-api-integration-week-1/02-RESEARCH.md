# Phase 2: Holiday Data & API Integration - Research

**Researched:** 2026-03-12
**Domain:** Vue 3 composable design, Fetch API integration, Pinia reactivity, Tailwind CSS styling
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Estratégia de Fetch da API**
- Fetch ao mount da app e reactivamente ao mudar o ano (via configStore.year)
- Durante loading: mostrar calendário sem feriados (não bloquear render)
- Fallback se API falhar: usar holiday-utils.ts local (já calcula Páscoa, Carnaval, Ascensão, Pentecostes, Corpus Christi, Sexta-feira Santa, Segunda-feira de Páscoa)
- Dados a usar da API: `date` + `localName` (já vem em Português)

**Arquitetura do Composable**
- Criar `useHolidays()` composable que encapsula: fetch da API, estado de loading, erro, fallback local, e combinação com feriados municipais
- `useHolidays()` recebe o município selecionado e devolve um mapa único de todos os feriados do ano
- Mantém `useCalendar.ts` limpo (sem lógica de fetch)

**Seletor de Município**
- Combobox com pesquisa por texto livre (filtra ao escrever)
- Localização: no header/topo da página, junto ao título
- Comportamento: atualizar calendário imediatamente ao selecionar (reactivo via configStore.selectedMunicipalityId)
- Por padrão: nenhum município selecionado (só feriados nacionais) — município é opcional

**Visual dos Feriados no DayCell**
- Feriados nacionais: `bg-red-100 text-red-700` (vermelho claro)
- Feriados municipais: `bg-orange-100 text-orange-700` (âmbar/laranja)
- Fins-de-semana: `bg-pink-50 text-pink-600` (já existente)
- Prioridade quando acumula: feriado > fim-de-semana (feriado sobrepõe estilo de fim-de-semana)

**Tooltips**
- Mostrar tooltip em feriados: nome do feriado + tipo (ex: "Dia de Portugal · Feriado Nacional" ou "São João · Feriado Municipal (Porto)")
- Implementação: atributo HTML `title` nativo no DayCell — zero dependências
- Fins-de-semana sem feriado: sem tooltip

### Claude's Discretion
- Lógica exacta de mapeamento do município selecionado ao seu feriado municipal
- Formato exacto do texto no title tooltip
- Handling de estados de loading na UI (sem spinner, mas sem crashar)

### Deferred Ideas (OUT OF SCOPE)
- Nenhuma — a discussão manteve-se dentro do escopo da Fase 2
</user_constraints>

---

## Summary

Phase 2 integrates holiday data into an already-working calendar grid. The codebase has solid foundations: `holiday-utils.ts` computes moveable Portuguese holidays, `municipalities.json` contains all 308 municipalities with their local holiday, `configStore` tracks year and selected municipality, and the `Day` interface in `useCalendar.ts` needs extension.

The primary integration challenge is the data flow chain: fetch from Nager.Date → build a `Map<string, {name, type}>` → merge with the municipality holiday calculated from `holiday-utils.ts` → pass that map into the calendar rendering layer so each `Day` object gets enriched before reaching `DayCell.vue`.

The municipalities.json schema has two holiday types: `fixed` (day/month direct) and `mobile` (base: "easter", offset: N). The mobile type requires calling `getEaster()` from `holiday-utils.ts` and applying the offset — this is the key mapping logic delegated to Claude's discretion.

**Primary recommendation:** Build `useHolidays.ts` as a standalone composable with a single `watch` on `configStore.year`, use the native `fetch` API (axios is already installed as a fallback option), return a `computed` `Map<string, HolidayEntry>` that YearGrid or a parent calls once and passes down.

---

## Standard Stack

### Core (already installed — no new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 Composition API | ^3.5.30 | Composables, reactivity | Project framework |
| Pinia | ^3.0.4 | configStore.year + selectedMunicipalityId | Project state management |
| axios | ^1.13.6 | HTTP fetch for Nager.Date | Already installed |
| date-fns | ^4.1.0 | Date arithmetic in holiday-utils | Already used |
| Tailwind CSS | ^3.4.19 | Styling classes for day cells | Project styling |

### No new packages required

All libraries needed are already in `package.json`. This phase is purely implementation of logic using the existing stack.

**Installation:**
```bash
# No new packages — all dependencies already installed
```

---

## Architecture Patterns

### Data Flow (top to bottom)

```
Nager.Date API
      ↓  (fetch on mount + watch year)
useHolidays.ts
      ├─ builds Map<dateString, {name, type: 'national'|'municipal'}>
      ├─ fallback: holiday-utils.ts (if API fails)
      └─ merges municipal holiday from municipalities.json
            ↓
YearGrid.vue  (calls useHolidays, passes holiday map to MonthCard)
      ↓
MonthCard.vue  (enriches each Day with isHoliday/holidayName/holidayType)
      ↓
DayCell.vue  (applies Tailwind class + title attribute)
```

### Pattern 1: useHolidays Composable

**What:** Composable that owns all holiday state and logic.
**When to use:** Called once in YearGrid (or App.vue), result passed down as props.

```typescript
// src/composables/useHolidays.ts
import { ref, computed, watch } from 'vue'
import { useConfigStore } from '../store/config'
import municipalitiesData from '../data/municipalities.json'
import { getEaster } from '../utils/holiday-utils'
import { format, addDays } from 'date-fns'

export interface HolidayEntry {
  name: string
  type: 'national' | 'municipal'
  municipalityName?: string
}

export function useHolidays() {
  const configStore = useConfigStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nationalHolidays = ref<Map<string, HolidayEntry>>(new Map())

  async function fetchHolidays(year: number) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PT`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Array<{ date: string; localName: string; global: boolean }> = await res.json()
      const map = new Map<string, HolidayEntry>()
      // Only global: true holidays apply nationwide (exclude PT-20 Azores, PT-30 Madeira)
      data
        .filter(h => h.global)
        .forEach(h => map.set(h.date, { name: h.localName, type: 'national' }))
      nationalHolidays.value = map
    } catch {
      error.value = 'API indisponível — a usar feriados locais'
      nationalHolidays.value = buildFallbackHolidays(year)
    } finally {
      loading.value = false
    }
  }

  // Fallback builds national holidays from holiday-utils.ts
  function buildFallbackHolidays(year: number): Map<string, HolidayEntry> { /* ... */ }

  // Municipality holiday computed from selected municipality
  const municipalHoliday = computed<{ dateStr: string; entry: HolidayEntry } | null>(() => {
    if (!configStore.selectedMunicipalityId) return null
    const mun = municipalitiesData.find(m => m.id === configStore.selectedMunicipalityId)
    if (!mun) return null
    // resolve date based on holiday.type: 'fixed' or 'mobile'
    // ...
    return { dateStr, entry: { name: mun.holiday.name, type: 'municipal', municipalityName: mun.name } }
  })

  // Final merged map: national + optional municipal
  const holidays = computed<Map<string, HolidayEntry>>(() => {
    const merged = new Map(nationalHolidays.value)
    if (municipalHoliday.value) {
      merged.set(municipalHoliday.value.dateStr, municipalHoliday.value.entry)
    }
    return merged
  })

  watch(() => configStore.year, (year) => fetchHolidays(year), { immediate: true })

  return { holidays, loading, error }
}
```

### Pattern 2: Enriched Day Interface

**What:** Extend the existing `Day` interface in `useCalendar.ts` without breaking existing consumers.
**When to use:** Pass enriched days from YearGrid downward, DayCell reads optional holiday fields.

```typescript
// Extend Day in useCalendar.ts
export interface Day {
  date: Date
  dayOfMonth: number
  isWeekend: boolean
  isHoliday?: boolean
  holidayName?: string
  holidayType?: 'national' | 'municipal'
}
```

YearGrid enriches the month data after calling `useHolidays()`:

```typescript
// In YearGrid.vue <script setup>
const { holidays } = useHolidays()

const enrichedMonths = computed(() => {
  const raw = getYearData(configStore.year)
  return raw.map(month => ({
    ...month,
    days: month.days.map(day => {
      const key = format(day.date, 'yyyy-MM-dd')
      const holiday = holidays.value.get(key)
      return holiday
        ? { ...day, isHoliday: true, holidayName: holiday.name, holidayType: holiday.type }
        : day
    })
  }))
})
```

### Pattern 3: Municipality Combobox

**What:** Inline `<input>` with filtered dropdown list, pure Vue, zero UI library.
**When to use:** In App.vue header, next to the title.

Key logic: filter 308 municipalities by text match on `name` (case-insensitive), show district as secondary label, clear to null means "no municipality".

```typescript
const query = ref('')
const filtered = computed(() =>
  query.value.length < 2
    ? []
    : municipalitiesData.filter(m =>
        m.name.toLowerCase().includes(query.value.toLowerCase())
      ).slice(0, 10) // cap at 10 results
)
```

### Pattern 4: Mobile Holiday Resolver

**What:** Resolve municipalities.json `type: "mobile"` holidays.
**When to use:** Inside `municipalHoliday` computed in `useHolidays.ts`.

```typescript
function resolveMunicipalHolidayDate(holiday: MunicipalHoliday, year: number): string {
  if (holiday.type === 'fixed') {
    return format(new Date(year, holiday.month - 1, holiday.day), 'yyyy-MM-dd')
  }
  // type === 'mobile', base === 'easter'
  const easter = getEaster(year)
  const resolved = addDays(easter, holiday.offset)
  return format(resolved, 'yyyy-MM-dd')
}
```

Note: `municipalities.json` has `holiday.offset` on mobile entries but the `Holiday` type in `holiday.ts` does not include `offset` — the type needs updating or a local type override.

### Pattern 5: DayCell Styling with Priority

**What:** Apply holiday class over weekend class when both conditions are true.
**When to use:** In DayCell.vue `:class` binding.

```html
<div
  :class="[
    day.isHoliday && day.holidayType === 'national' ? 'bg-red-100 text-red-700' :
    day.isHoliday && day.holidayType === 'municipal' ? 'bg-orange-100 text-orange-700' :
    day.isWeekend ? 'bg-pink-50 text-pink-600' :
    'bg-gray-50 text-gray-700'
  ]"
  :title="day.isHoliday ? day.holidayName : undefined"
>
```

### Anti-Patterns to Avoid

- **Calling `useHolidays()` inside MonthCard or DayCell:** Creates one watcher per month/day cell. Call once in YearGrid or App.vue only.
- **Storing holidays as a raw array:** A `Map<string, HolidayEntry>` gives O(1) lookup per day; array `.find()` inside the render loop is O(n×m).
- **Fetching per-month instead of per-year:** Nager.Date returns the full year; no need to split requests.
- **Using `reactive()` for the holidays map:** Use `ref(new Map())` and replace the entire map on update to trigger Vue's reactivity.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Easter calculation | Custom algorithm | `getEaster()` in holiday-utils.ts | Already implemented, tested, correct |
| Mobile holiday offsets | Manual date arithmetic | `addDays(getEaster(year), offset)` with date-fns | date-fns handles edge cases |
| HTTP requests | fetch wrapper with retries | Plain `fetch()` or `axios` (already installed) | Single request, no retry needed |
| Combobox filtering | Fuzzy-search library | Native `.includes()` on string | 308 items, linear search is sufficient |
| Portuguese month names | Lookup table | `date-fns/locale/pt` (already in useCalendar.ts) | Already imported |

---

## Common Pitfalls

### Pitfall 1: API returns non-global holidays for Azores/Madeira

**What goes wrong:** The API response includes `global: false` holidays for PT-20 (Azores) and PT-30 (Madeira). If not filtered, calendar users on the mainland see regional holidays they shouldn't.
**Why it happens:** Nager.Date returns all county-level entries for Portugal in one response.
**How to avoid:** Filter with `.filter(h => h.global)` before building the map.
**Warning signs:** 17+ holidays appearing for mainland Portugal (mainland has 13 national holidays).

### Pitfall 2: Holiday type interface mismatch

**What goes wrong:** `municipalities.json` mobile entries have an `offset` field and a `base` field that do not exist in the `Holiday` interface in `holiday.ts` (`Holiday` only has `day`, `month`, `type`, `name`).
**Why it happens:** Phase 1 defined the type for fixed holidays; mobile entries were added to the JSON but the TypeScript type was not extended.
**How to avoid:** Extend `Holiday` type before writing `useHolidays.ts`, or use a local discriminated union type in the composable.
**Warning signs:** TypeScript compiler errors on `holiday.offset` access.

### Pitfall 3: Vue reactivity lost when mutating a Map

**What goes wrong:** `nationalHolidays.value.set(...)` does not trigger Vue 3 reactivity updates when the ref holds a Map and you mutate it in place.
**Why it happens:** Vue 3's `ref()` wraps the Map but `.set()` on the inner Map object does not trigger the reactive dependency.
**How to avoid:** Replace the entire Map: `nationalHolidays.value = new Map([...entries])` — or use Vue 3's reactive collections with `shallowRef`.
**Warning signs:** Calendar doesn't re-render after API response arrives.

### Pitfall 4: YearGrid hardcodes year 2026

**What goes wrong:** Current `YearGrid.vue` calls `getYearData(2026)` with a hardcoded value. Changing year in configStore has no effect on the rendered calendar.
**Why it happens:** Phase 1 hardcoded the year as a placeholder.
**How to avoid:** Replace with `getYearData(configStore.year)` inside a `computed`, and make `enrichedMonths` reactive to `configStore.year` changes.
**Warning signs:** Year selector UI updates the store but calendar still shows 2026.

### Pitfall 5: Combobox state not wired to configStore

**What goes wrong:** Municipality combobox updates local component state but never writes to `configStore.selectedMunicipalityId`, so `useHolidays()` never reacts.
**Why it happens:** Easy to forget to wire the selection to the store; the combobox can appear to work (filters visually) while the calendar ignores it.
**How to avoid:** On item selection, set `configStore.selectedMunicipalityId = mun.id`. On clear, set to `null`.
**Warning signs:** Selecting a municipality shows no change in calendar highlighting.

---

## Code Examples

### Nager.Date API — verified response shape (2026/PT)

```typescript
// Source: Live API call to https://date.nager.at/api/v3/PublicHolidays/2026/PT
interface NagerHoliday {
  date: string        // "2026-01-01" — YYYY-MM-DD
  localName: string   // "Ano Novo" — already in Portuguese
  name: string        // "New Year's Day" — English
  countryCode: string // "PT"
  fixed: boolean
  global: boolean     // true = nationwide; false = Azores/Madeira only
  counties: string[] | null  // e.g. ["PT-20"] for Azores
  launchYear: number | null
  types: string[]     // ["Public"]
}
// Mainland filter: .filter(h => h.global)
```

### Municipalities JSON — two holiday shapes

```typescript
// Fixed holiday (most municipalities)
{
  "id": "abrantes",
  "name": "Abrantes",
  "district": "Santarém",
  "holiday": { "type": "fixed", "day": 14, "month": 6, "name": "São Vicente" }
}

// Mobile holiday (Easter-based)
{
  "id": "agueda",
  "name": "Águeda",
  "district": "Aveiro",
  "holiday": { "type": "mobile", "base": "easter", "offset": 39, "name": "Quinta-feira da Ascensão" }
}
// Resolve: addDays(getEaster(year), holiday.offset)
```

### DayCell tooltip format (Claude's discretion — recommendation)

```
National: "Dia de Portugal · Feriado Nacional"
Municipal: "São João · Feriado Municipal (Porto)"
```

Implemented as native `title` attribute:
```html
:title="day.holidayType === 'national'
  ? `${day.holidayName} · Feriado Nacional`
  : `${day.holidayName} · Feriado Municipal (${municipalityName})`"
```

Note: `municipalityName` needs to come through as a prop or be looked up from the municipality store.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Options API | Composition API (`<script setup>`) | Vue 3 | Composables are idiomatic; use `<script setup lang="ts">` in all new components |
| Inline API calls in components | Composable pattern | Phase architecture decision | All fetch logic in `useHolidays.ts`, not in components |
| Vuex for state | Pinia | Vue ecosystem standard (2022+) | Already using Pinia; continue with `useConfigStore()` |

---

## Open Questions

1. **Where exactly should `useHolidays()` be called?**
   - What we know: Needs to be called in a component that has access to Pinia (any component below `<App>`). YearGrid is the logical owner since it builds the month data.
   - What's unclear: Whether to call it in App.vue and pass `holidays` as a prop, or call it inside YearGrid.
   - Recommendation: Call in YearGrid.vue since it already builds month data; it can enrich days inline in a `computed`. This avoids prop-drilling through App.vue while keeping App.vue simple.

2. **How to pass `municipalityName` to DayCell for tooltip?**
   - What we know: DayCell receives `day: Day`. `Day` can be extended with `holidayMunicipalityName?: string`.
   - What's unclear: Whether to store municipality name in the merged HolidayEntry (cleaner) or look it up in DayCell.
   - Recommendation: Store `municipalityName` inside `HolidayEntry` when merging. DayCell then reads it directly from `day.holidayMunicipalityName` without needing store access.

3. **Does the `Holiday` type in `holiday.ts` need to be a discriminated union?**
   - What we know: Mobile holidays in JSON have `base` and `offset`; fixed holidays have `day` and `month`. Current type has all four optional fields with no discrimination.
   - What's unclear: Whether Phase 3/4 will extend this type further.
   - Recommendation: For Phase 2, add `offset?: number; base?: string` to the existing `Holiday` interface — minimal change, avoids refactoring cascade.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Behavior | Test Type | Automated Command | File Exists? |
|----------|-----------|-------------------|--------------|
| `useHolidays()` returns correct national holidays for 2026 (mocked API) | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ Wave 0 |
| Fallback builds correct dates when API fails | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ Wave 0 |
| Municipal fixed holiday resolves correct date | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ Wave 0 |
| Municipal mobile holiday resolves correct date (Águeda = Easter+39) | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ Wave 0 |
| Holidays map has national holiday overriding weekend | unit | `npx vitest run src/composables/useHolidays.spec.ts` | ❌ Wave 0 |
| DayCell renders `bg-red-100` for national holiday | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ Wave 0 |
| DayCell renders `bg-orange-100` for municipal holiday | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ Wave 0 |
| DayCell renders native title attribute for holiday | component | `npx vitest run src/components/calendar/DayCell.spec.ts` | ❌ Wave 0 |
| Municipality combobox filters by partial name ("Lis" → Lisboa) | component | `npx vitest run src/components/MunicipalitySelector.spec.ts` | ❌ Wave 0 |
| Selecting municipality updates configStore.selectedMunicipalityId | component | `npx vitest run src/components/MunicipalitySelector.spec.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/composables/useHolidays.spec.ts` — covers composable logic, API mock, fallback, municipality resolution
- [ ] `src/components/calendar/DayCell.spec.ts` — covers holiday class application and tooltip
- [ ] `src/components/MunicipalitySelector.spec.ts` — covers combobox filtering and store wiring

*(Existing: `src/composables/useCalendar.spec.ts`, `src/utils/holiday-utils.spec.ts` — both pass, no changes needed for Phase 2)*

---

## Sources

### Primary (HIGH confidence)

- Live API call to `https://date.nager.at/api/v3/PublicHolidays/2026/PT` — confirmed response shape, field names, `global` filter
- `/Users/arodri06/repos/arod/calendar/src/data/municipalities.json` — confirmed fixed vs mobile holiday schema with `offset` and `base` fields
- `/Users/arodri06/repos/arod/calendar/src/utils/holiday-utils.ts` — confirmed all moveable holiday functions available for fallback
- `/Users/arodri06/repos/arod/calendar/src/store/config.ts` — confirmed `year` and `selectedMunicipalityId` as reactive refs
- `/Users/arodri06/repos/arod/calendar/src/types/holiday.ts` — confirmed current type shape and gap (no `offset`/`base` fields)
- `/Users/arodri06/repos/arod/calendar/src/composables/useCalendar.ts` — confirmed `Day` interface structure; year is hardcoded
- `/Users/arodri06/repos/arod/calendar/vitest.config.ts` — confirmed jsdom environment, globals: true, @/ alias

### Secondary (MEDIUM confidence)

- Vue 3 Map reactivity behavior: replacing ref Map vs mutating — aligns with Vue 3 reactivity documentation on ref vs reactive

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed installed in package.json
- Architecture: HIGH — composable patterns derived from reading existing codebase code
- API response shape: HIGH — verified by live API call
- Data schema (municipalities.json): HIGH — read directly from file
- Pitfalls: HIGH — derived from reading actual existing code (hardcoded year, type mismatch confirmed by reading files)

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (Nager.Date API shape is stable; Vue 3 APIs stable)
