# Project: Calendar Webapp - Portugal Holiday Planner

## Overview
A Vue.js-based web application for planning vacation days in Portugal. It features an annual calendar view (2026 as the primary target) with national and regional (municipal) holiday support. Users can interactively mark vacation days and see real-time summaries of used vs. available days, including "smart" calculations for consecutive rest periods.

## Goals
- **UX Excellence:** A visually appealing, responsive calendar mimicking [Calendarr Portugal](https://www.calendarr.com/portugal/calendario-2026).
- **Automation:** Real-time calculation of used vacation days (excluding weekends and holidays).
- **Customization:** Support for all 308 Portuguese municipalities' holidays.
- **Persistence:** Local-first approach with `localStorage`.

## Tech Stack
- **Framework:** Vue 3 (Composition API)
- **Styling:** Tailwind CSS (Mobile-first grid)
- **API:** Nager.Date (National Holidays)
- **Icons:** Lucide-vue-next
- **Build Tool:** Vite

## Key Concepts
- **National Holiday:** Mandatory days off across the whole country.
- **Municipal Holiday:** One day off per municipality (optional/facultative but widely observed).
- **Consecutive Rest Days:** A "bridge" (ponte) calculation where a block of vacation days + weekends + holidays are combined into a single period of rest.
- **Vacation Balance:** Initial input (e.g., 22 days) minus "Used Work Days".
