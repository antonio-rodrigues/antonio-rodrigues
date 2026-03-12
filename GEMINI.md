# Calendar Webapp - Portugal Holiday Planner

## Project Overview
An interactive vacation planning web application focused on the Portuguese context (national and regional holidays). It allows users to manage their vacation days against an annual calendar view.

## Core Features
- **Annual Calendar View:** 12-month grid (Desktop) or scrollable cards (Mobile).
- **Holiday Integration:** Automatic marking of Portuguese national holidays (and optional municipal holidays).
- **Vacation Management:** Interactive selection of vacation days with real-time balance calculation.
- **Smart Logic:** Automatic calculation of consecutive rest days (bridges/long weekends).
- **Data Persistence:** State saved locally via `localStorage`.

## Tech Stack (Planned)
- **Frontend:** React.js (TypeScript) or Vanilla JavaScript.
- **Styling:** Tailwind CSS (for responsive layout).
- **Storage:** Browser `localStorage`.
- **Data:** Nager.Date API or static holiday data.

## Building and Running
- **Install dependencies:** `npm install` (once initialized)
- **Run development server:** `npm run dev`
- **Build for production:** `npm run build`

## Development Conventions
- **Modular Logic:** Separate data logic (holiday calculations) from UI components and styles.
- **Responsive First:** Mobile-friendly card layouts transforming to desktop grids.
- **Type Safety:** Preferred use of TypeScript for state and holiday logic.
