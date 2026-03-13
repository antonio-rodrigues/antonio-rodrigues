# Quick Task 06: Validated Year Selector next to Title

Add a validated year input next to the main title in `App.vue` with confirmation on change and robust data fetching.

## 1. Research (Completed)
- [x] Identify title location in `App.vue`.
- [x] Check `useConfigStore` for year and holiday data management.
- [x] Identify "Saldo de Férias" input style in `DashboardSidebar.vue`.

## 2. Plan
### 2.1. Store Updates (`src/store/config.ts`)
- [ ] Update `fetchHolidays(targetYear: number)` to return `Promise<boolean>` (true if API succeeded, false otherwise).
- [ ] Modify `fetchHolidays` to NOT apply fallback automatically if the caller wants to handle failures (or just return the success status).
- [ ] Actually, keep the fallback but return `true`/`false` for API success.

### 2.2. Component Updates (`src/App.vue`)
- [ ] Add year input to the right of the `h1` title.
- [ ] Style it to match the "Saldo de Férias" input.
- [ ] Add `handleYearChange` function:
    - [ ] Get new value from input.
    - [ ] Validate: 4 digits, >= 1900.
    - [ ] If invalid, revert input value to current store year.
    - [ ] If valid:
        - [ ] Ask for confirmation: "Todas as seleções actuais serão descartadas. Confirma? (SIM / NÃO)".
        - [ ] If confirmed:
            - [ ] Save current year as backup.
            - [ ] Clear marked days.
            - [ ] Update store year.
            - [ ] Fetch holidays for new year.
            - [ ] If `fetchHolidays` returns `false` (API failure), revert store year and restore marked days (wait, requirement says "mantém os dados anteriores (datas, municipios, etc.)").
            - [ ] Reverting includes year, marked days, and municipality.

### 2.3. Test Updates
- [ ] Add test for `fetchHolidays` return value in `src/store/config.spec.ts`.

## 3. Execution (Iterative)
- [ ] Apply store changes.
- [ ] Apply UI changes in `App.vue`.
- [ ] Verify functionality manually and with tests.
