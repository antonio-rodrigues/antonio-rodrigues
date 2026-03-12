---
phase: 02-holiday-data-api-integration-week-1
verified: 2026-03-12T17:06:00Z
status: passed
score: 16/16 must-haves verified
re_verification: false
human_verification:
  - test: "National holiday red styling in browser"
    expected: "January 1 (Ano Novo) shows bg-red-100 background with tooltip 'Ano Novo · Feriado Nacional'"
    why_human: "DayCell class binding verified in unit tests, but visual rendering and native title tooltip visibility require browser confirmation"
  - test: "Municipal holiday orange styling in browser after selecting Lisboa"
    expected: "June 13 shows bg-orange-100 background with tooltip 'Santo António · Feriado Municipal (Lisboa)'"
    why_human: "Requires real API fetch + reactive municipal holiday chain to render correctly in a live browser"
  - test: "Municipality selector search flow in browser"
    expected: "Typing 'Lis' in header input opens dropdown showing Lisboa; selecting it updates calendar immediately"
    why_human: "isOpen state toggled by watcher — blur/click interaction and dropdown visibility are DOM-timing concerns not fully exercisable in jsdom"
  - test: "Single API request on load"
    expected: "Browser DevTools Network tab shows exactly one request to date.nager.at on initial load (not per-month)"
    why_human: "Network call count cannot be verified without live browser DevTools"
---

# Phase 2: Holiday Data & API Integration Verification Report

**Phase Goal:** Integrate national holidays from Nager.Date API and municipal holidays from local JSON into the calendar, with a municipality selector UI and holiday visual styling.
**Verified:** 2026-03-12T17:06:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | TypeScript accepts `holiday.offset` and `holiday.base` on Holiday entries | VERIFIED | `src/types/holiday.ts` line 10-11: `offset?: number` and `base?: string` present; `vue-tsc --noEmit` exits 0 |
| 2 | `useHolidays()` returns national holidays from Nager.Date API (global:true only) | VERIFIED | `useHolidays.spec.ts` test "returns national holidays from API" passes; "excludes non-global entries" passes — 28/28 test suite green |
| 3 | `useHolidays()` falls back to local holidays when API fails | VERIFIED | `useHolidays.spec.ts` test "falls back when API fails" passes; `buildFallbackHolidays` covers 10 fixed + 7 mobile PT holidays |
| 4 | `useHolidays()` resolves Abrantes fixed municipal holiday to 2026-06-14 | VERIFIED | `useHolidays.spec.ts` test "resolves fixed municipal holiday" passes; `resolveMunicipalHolidayDate` handles `type==='fixed'` path |
| 5 | `useHolidays()` resolves Águeda mobile holiday to Easter 2026 + 39 days | VERIFIED | `useHolidays.spec.ts` test "resolves mobile municipal holiday" passes; addDays(getEaster, offset) path verified |
| 6 | National holidays render with `bg-red-100 text-red-700` in DayCell | VERIFIED | `DayCell.spec.ts` test "applies bg-red-100 text-red-700 for national holiday" passes; `:class` ternary chain in DayCell.vue correct |
| 7 | Municipal holidays render with `bg-orange-100 text-orange-700` in DayCell | VERIFIED | `DayCell.spec.ts` test "applies bg-orange-100 text-orange-700 for municipal holiday" passes |
| 8 | Holiday overrides weekend styling (holiday wins priority) | VERIFIED | `DayCell.spec.ts` test "holiday overrides weekend — national holiday on weekend shows bg-red-100" passes; ternary chain checks `isHoliday` before `isWeekend` |
| 9 | DayCell shows native title tooltip for national holiday | VERIFIED | `DayCell.spec.ts` test "has title attribute with holiday name for national holiday" passes; `:title` attribute binding present in DayCell.vue lines 21-25 |
| 10 | DayCell shows native title tooltip for municipal holiday with municipality name | VERIFIED | `DayCell.spec.ts` test "has title attribute with municipality name for municipal holiday" passes |
| 11 | Typing 'Lis' in MunicipalitySelector shows Lisboa | VERIFIED | `MunicipalitySelector.spec.ts` test "filters municipalities by partial name match" passes; computed `filtered` slices at 10 |
| 12 | Typing 1 character shows no results (2-char minimum) | VERIFIED | `MunicipalitySelector.spec.ts` test "no results when query < 2 chars" passes; `query.value.length < 2` guard in computed |
| 13 | Selecting a municipality sets `configStore.selectedMunicipalityId` | VERIFIED | `MunicipalitySelector.spec.ts` test "updates configStore.selectedMunicipalityId on selection" passes; `selectMunicipality` sets `configStore.selectedMunicipalityId = mun.id` |
| 14 | Clearing input sets `configStore.selectedMunicipalityId` to null | VERIFIED | `MunicipalitySelector.spec.ts` test "clears configStore.selectedMunicipalityId when input cleared" passes; `watch(query)` nulls store when val is empty |
| 15 | MunicipalitySelector is visible in App.vue header next to title | VERIFIED | `App.vue` lines 3 + 12: `MunicipalitySelector` imported and rendered in flex row header |
| 16 | YearGrid enriches days reactively from `useHolidays()` using `configStore.year` | VERIFIED | `YearGrid.vue` lines 10-32: `enrichedMonths` computed merges `holidays.value.get(dateStr)` per day; uses `configStore.year` not hardcoded value |

**Score:** 16/16 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/types/holiday.ts` | Extended Holiday interface with `offset?` and `base?` | VERIFIED | 12 lines; contains `offset?: number` (line 10) and `base?: string` (line 11); existing fields intact |
| `src/composables/useHolidays.ts` | Composable exporting `useHolidays` and `HolidayEntry` | VERIFIED | 124 lines; exports `HolidayEntry` interface (line 7) and `useHolidays` function (line 70); returns `{ holidays, loading, error }` |
| `src/composables/useHolidays.spec.ts` | 5 passing unit tests for API fetch, fallback, municipal resolution | VERIFIED | 91 lines; 5 real tests (no todos); all pass |
| `src/components/MunicipalitySelector.vue` | Combobox component for 308 municipalities | VERIFIED | 63 lines; `<script setup lang="ts">`; filters with 2-char minimum; caps at 10; wired to configStore |
| `src/components/MunicipalitySelector.spec.ts` | 4 passing component tests for filter and store wiring | VERIFIED | 58 lines; 4 real tests; all pass |
| `src/composables/useCalendar.ts` | Day interface extended with holiday optional fields | VERIFIED | `isHoliday?`, `holidayName?`, `holidayType?`, `holidayMunicipalityName?` present at lines 16-19 |
| `src/components/calendar/YearGrid.vue` | enrichedMonths computed using useHolidays + configStore.year | VERIFIED | 44 lines; calls `useHolidays()` (line 10); `enrichedMonths` computed (line 13); passes enriched months to MonthCard |
| `src/components/calendar/DayCell.vue` | Holiday-aware class binding and title attribute | VERIFIED | 29 lines; ternary class chain lines 12-20; `:title` binding lines 21-25 |
| `src/components/calendar/DayCell.spec.ts` | 6 passing DayCell tests covering all holiday styling cases | VERIFIED | 102 lines; 6 tests (5 original + 1 priority override); all pass |
| `src/App.vue` | Header with title and MunicipalitySelector in flex row | VERIFIED | 24 lines; `MunicipalitySelector` imported (line 3) and rendered (line 12) in `sm:flex-row` header |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `useHolidays` | `configStore.year` | `watch(() => configStore.year, ..., { immediate: true })` | WIRED | Line 120 of useHolidays.ts — watch triggers fetchHolidays immediately and on every year change |
| `useHolidays` | `configStore.selectedMunicipalityId` | `computed` reads `configStore.selectedMunicipalityId` | WIRED | Lines 96-110 of useHolidays.ts — `municipalHoliday` computed reads the store ref directly |
| `municipalHoliday` | `municipalities.json` | `municipalitiesData.find(m => m.id === ...)` | WIRED | Line 99 of useHolidays.ts — `.find` on the imported JSON array |
| `YearGrid.vue` | `useHolidays().holidays` | `enrichedMonths` computed merges `holidays.value.get(dateStr)` | WIRED | Lines 13-32 of YearGrid.vue — each day looked up in holidays Map |
| `DayCell.vue` | `day.isHoliday / day.holidayType` | `:class` binding with priority | WIRED | Lines 12-20 of DayCell.vue — ternary evaluates `isHoliday` first, then type |
| `DayCell.vue` | `day.holidayName / day.holidayMunicipalityName` | `:title` attribute | WIRED | Lines 21-25 of DayCell.vue — template literal builds tooltip string |
| `App.vue` header | `MunicipalitySelector` | imported and rendered next to h1 | WIRED | App.vue line 3 (import) and line 12 (render in flex row) |
| `MunicipalitySelector` input | `configStore.selectedMunicipalityId` | `selectMunicipality` sets id; `watch(query)` nulls it | WIRED | MunicipalitySelector.vue lines 19 and 26-28 |

---

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FR2-holiday-integration | 02-01, 02-02, 02-04 | Fetch national holidays from Nager.Date API; mark holidays with distinct color | SATISFIED | `useHolidays` fetches from API with global filter; DayCell applies red/orange; fallback covers offline scenario |
| FR2-municipality-selection | 02-01, 02-02, 02-03, 02-04 | Support user selection of municipality from 308 options to show regional holidays | SATISFIED | `MunicipalitySelector` filters 308 municipalities; selection wires to `configStore.selectedMunicipalityId`; `useHolidays` resolves municipal holiday into Map |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | — |

No TODO/FIXME/placeholder comments found. No stub implementations found. No empty handlers found. The two `return null` occurrences in `useHolidays.ts` are legitimate guard clauses, not stubs.

One design note (not a blocker): `MunicipalitySelector.vue` uses `isOpen` controlled by a watcher, and the dropdown template checks `filtered.length > 0 && isOpen`. In jsdom tests, `isOpen` is not toggled by `setValue` because the watcher fires but `isOpen` is set via the watcher (not directly via v-model). The spec tests work because they check `wrapper.text()` and `findAll('li')` — the `isOpen` path is bypassed by jsdom's lack of focus events. This is a known test/real-browser divergence but does not block the goal: visual filtering in the browser works because the watcher sets `isOpen = val.length >= 2` on every query change.

---

### Human Verification Required

#### 1. National Holiday Red Styling

**Test:** Run `npm run dev`. Open http://localhost:5173. Look at January 1 cell.
**Expected:** Cell background is light red (bg-red-100). Hovering shows native tooltip "Ano Novo · Feriado Nacional".
**Why human:** DayCell class binding and `:title` are unit-tested, but the Nager.Date API fetch must succeed for national holidays to populate the Map and reach the YearGrid enrichment.

#### 2. Municipal Holiday Orange Styling

**Test:** Type "Lis" in the header input and select "Lisboa".
**Expected:** June 13 cell turns orange (bg-orange-100). Tooltip reads "Santo António · Feriado Municipal (Lisboa)".
**Why human:** Requires the reactive chain — configStore write → computed re-evaluation → enrichedMonths recomputation — to work end-to-end in a live Vue runtime.

#### 3. Municipality Selector Dropdown Interaction

**Test:** Type "Lis" in the header combobox. Observe dropdown. Select first result.
**Expected:** Dropdown appears with up to 10 municipalities whose names contain "Lis". Selecting one closes the dropdown and updates the calendar.
**Why human:** The `isOpen` watcher + blur/click 150ms delay interaction requires live DOM timing that jsdom does not fully replicate.

#### 4. Single API Request Verification

**Test:** Open browser DevTools Network tab. Load the page. Count requests to `date.nager.at`.
**Expected:** Exactly one GET request to `https://date.nager.at/api/v3/PublicHolidays/2026/PT` — triggered by the `watch({ immediate: true })` in `useHolidays`, not one per month.
**Why human:** Network request count cannot be verified without a live browser.

---

### Summary

All 16 observable truths that constitute the Phase 2 goal are verified in the actual codebase. All 10 required artifacts exist, are substantive (not stubs), and are wired to each other. The full test suite runs 28/28 passing tests with TypeScript compiling cleanly.

The implementation correctly delivers:
- Nager.Date API integration with `global:true` filtering and local fallback
- Fixed and Easter-based mobile municipal holiday resolution
- Holiday color priority (national red > municipal orange > weekend pink > normal)
- Native title tooltips in correct format
- MunicipalitySelector combobox with 2-char minimum, 10-result cap, store wiring
- Reactive calendar enrichment driven by `configStore.year`
- MunicipalitySelector in the App.vue header

Four human verification items remain for browser-only behaviors (API network confirmation, live tooltip rendering, dropdown timing interaction).

---

_Verified: 2026-03-12T17:06:00Z_
_Verifier: Claude (gsd-verifier)_
