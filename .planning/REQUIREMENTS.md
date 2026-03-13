# Requirements: Calendar Webapp

## Functional Requirements
- **FR1: Annual Calendar Visualization**
  - [x] Display all 12 months for a selected year (default: 2026).
  - [x] Desktop: 3x4 or 4x3 grid.
  - [x] Mobile: Single-column scrollable cards.
- **FR2: Holiday Integration**
  - [x] Fetch national holidays for Portugal via Nager.Date API.
  - [x] Support user selection of a municipality from all 308 options (Lisbon, Porto, etc.) to show regional holidays.
  - [x] Mark holidays with a distinct color (e.g., light red/pink).
- **FR3: Interactive Vacation Selection**
  - [x] Click any day to toggle its status as a "Vacation Day" (green).
  - [x] Hover on holidays/vacation days to show relevant tooltips/info.
- **FR4: Real-time Dashboard**
  - [x] **Vacation Balance:** Show initial total (input, default 22), used days, and remaining days.
  - [x] **Total Days Used:** Counts "Work Days" marked as vacation (excludes weekends and holidays).
  - [x] **Consecutive Rest Periods:** Calculate and display the largest block of continuous rest (vacation + weekends + holidays).
- **FR5: Configuration**
  - [x] User can change the year (e.g., 2026, 2027). (Note: Store supports it, YearGrid reactive)
  - [ ] User can change the total allowed vacation days (e.g., 22, 25). (Note: Store supports it, UI input pending in Phase 4)
- **FR6: Data Persistence**
  - [ ] Automatically save all selections (year, municipality, max days, marked dates) to `localStorage`.
  - [ ] Reload state on page refresh.
- **FR7: UI Feedback**
  - [x] Visual alert (red text/border) when used days exceed the maximum balance. (Note: Implemented in DashboardSidebar as red text)

## Non-Functional Requirements
- **NFR1: Performance** - Initial load < 1.5s (excluding API call).
- **NFR2: UI Style** - Clean, modern, similar to Calendarr Portugal.
- **NFR3: Responsiveness** - Fully functional from mobile (375px) to ultra-wide desktop.
- **NFR4: Architecture** - Separation of concerns (logic vs. UI).

## Data Schema (Internal)
- `markedDays`: Map of date strings (e.g., "2026-06-13") to "vacation".
- `holidays`: Map of date strings to holiday names (national or regional).
- `config`: { `year`, `municipality`, `maxDays` }.
