# Portugal Holiday & Vacation Planner

An interactive vacation planning web application focused on the Portuguese context (national and regional holidays). Manage your vacation days against a responsive 2026 calendar view.

## Features
- **Portuguese Holiday Integration:** Automatic marking of all 13 national holidays (fixed and mobile) and 308 municipal holidays.
- **Vacation Balance:** Interactive selection of vacation days with real-time balance tracking (22 days standard).
- **Smart Stats:** Automatic calculation of the longest consecutive rest period (including holidays and weekends).
- **Budget Alerts:** Visual warning when the 22-day vacation budget is exceeded.
- **Export Options:**
  - **iCalendar (.ics):** Sync your vacations with Google Calendar, Outlook, or Apple Calendar.
  - **Visual Export (PNG):** Save the 12-month grid as an image for sharing or printing.
  - **JSON Backup:** Export/Import your data to move between devices or browsers.
- **Persistence:** All selections (municipality and marked days) are saved to `localStorage`.
- **Responsive UI:** Modern, mobile-first design with smooth transitions and hover effects.

## Tech Stack
- **Frontend:** [Vue 3](https://vuejs.org/) (Composition API)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Testing:** [Vitest](https://vitest.dev/)

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Project Structure
- `src/store/config.ts`: Pinia store for vacation and municipality settings with localStorage persistence.
- `src/composables/useHolidays.ts`: Logic for national (Nager.Date API) and municipal holiday calculations.
- `src/composables/useVacationStats.ts`: Core logic for calculating balances and rest periods.
- `src/components/calendar/`: Reusable annual grid components.
