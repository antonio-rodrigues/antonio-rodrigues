# Website Design Audit

Date: 2026-04-08  
Scope: UI/UX, visual system, accessibility, interaction design, mobile behavior

## Reviewed Files

- [src/App.vue](src/App.vue)
- [src/style.css](src/style.css)
- [src/components/DashboardSidebar.vue](src/components/DashboardSidebar.vue)
- [src/components/calendar/DayCell.vue](src/components/calendar/DayCell.vue)
- [src/components/MunicipalitySelector.vue](src/components/MunicipalitySelector.vue)
- [src/components/ExportControls.vue](src/components/ExportControls.vue)
- [src/components/calendar/YearGrid.vue](src/components/calendar/YearGrid.vue)
- [index.html](index.html)

## Executive Summary

The application is useful and functionally strong, but it currently has three major design weaknesses:

1. Core interaction accessibility is below expected baseline for a planning tool.
2. Visual language is inconsistent, with competing color and surface systems.
3. The header and control region has high cognitive density, especially on mobile.

The product can be improved significantly with a focused 3-4 week design and implementation pass.

## Top Findings

### 1) Core calendar interaction is not keyboard-accessible (P0)

Evidence:

- [src/components/calendar/DayCell.vue#L86](src/components/calendar/DayCell.vue#L86)
- [src/components/calendar/DayCell.vue#L102](src/components/calendar/DayCell.vue#L102)

Why this is bad:

- The main task flow depends on clickable div elements without native keyboard semantics.
- This blocks robust keyboard and screen-reader usage.

How to solve:

- Replace interactive day wrappers with button elements.
- Add aria-pressed for selected state and descriptive aria-label text.
- Add focus-visible styles with strong contrast on all day states.

### 2) Holiday details are transient and hover-dependent (P0)

Evidence:

- [src/components/calendar/DayCell.vue#L42](src/components/calendar/DayCell.vue#L42)
- [src/components/calendar/DayCell.vue#L59](src/components/calendar/DayCell.vue#L59)
- [src/components/calendar/DayCell.vue#L68](src/components/calendar/DayCell.vue#L68)
- [src/components/DashboardSidebar.vue#L150](src/components/DashboardSidebar.vue#L150)

Why this is bad:

- Mobile interaction relies on a temporary touch timer.
- Important context disappears while the user is planning.

How to solve:

- Add a persistent selected-day details panel.
- Keep hover as optional enhancement, not the only information channel.

### 3) Visual system is inconsistent across app shell and components (P1)

Evidence:

- [src/style.css#L25](src/style.css#L25)
- [src/style.css#L30](src/style.css#L30)
- [src/App.vue#L87](src/App.vue#L87)

Why this is bad:

- Hardcoded page background colors conflict with neutral Tailwind card surfaces.
- Light and dark modes feel unrelated rather than variants of one system.

How to solve:

- Define design tokens for surfaces, text, accents, and semantic states.
- Remove hardcoded global background swaps from app root.

### 4) Dashboard text sizing is too small for sustained use (P1)

Evidence:

- [src/components/DashboardSidebar.vue#L70](src/components/DashboardSidebar.vue#L70)
- [src/components/DashboardSidebar.vue#L150](src/components/DashboardSidebar.vue#L150)

Why this is bad:

- Repeated use of 10px/11px labels hurts readability and scan speed.

How to solve:

- Raise minimum auxiliary text to 12px.
- Reserve 14px for key helper text in high-density panels.

### 5) Sticky header is overloaded with controls and status blocks (P1)

Evidence:

- [src/App.vue#L101](src/App.vue#L101)
- [src/App.vue#L116](src/App.vue#L116)

Why this is bad:

- The planning canvas is visually pushed down.
- First-time users face too many decisions before seeing the calendar.

How to solve:

- Split into two layers:
  - Compact sticky action bar.
  - Optional/collapsible stats region under it.

### 6) Day state mapping relies too much on color only (P1)

Evidence:

- [src/components/calendar/DayCell.vue#L90](src/components/calendar/DayCell.vue#L90)
- [src/components/calendar/DayCell.vue#L92](src/components/calendar/DayCell.vue#L92)
- [src/components/calendar/DayCell.vue#L94](src/components/calendar/DayCell.vue#L94)
- [src/components/calendar/DayCell.vue#L96](src/components/calendar/DayCell.vue#L96)
- [src/components/calendar/DayCell.vue#L98](src/components/calendar/DayCell.vue#L98)

Why this is bad:

- New users need extra effort to decode meaning.
- Color-only encoding weakens accessibility for users with color-vision limitations.

How to solve:

- Add a persistent legend close to the grid.
- Add non-color cues (small icon, pattern, border style, or indicator dot).

### 7) Browser confirm and alert dialogs break product continuity (P2)

Evidence:

- [src/App.vue#L47](src/App.vue#L47)
- [src/App.vue#L71](src/App.vue#L71)
- [src/components/ExportControls.vue#L54](src/components/ExportControls.vue#L54)
- [src/components/ExportControls.vue#L68](src/components/ExportControls.vue#L68)

Why this is bad:

- Native dialogs interrupt design consistency and can feel abrupt.

How to solve:

- Use in-app modal for destructive confirmation.
- Use toast notifications for success and non-blocking errors.

### 8) Duplicate IDs create brittle styling behavior (P2)

Evidence:

- [src/components/DashboardSidebar.vue#L67](src/components/DashboardSidebar.vue#L67)
- [src/components/DashboardSidebar.vue#L132](src/components/DashboardSidebar.vue#L132)
- [src/style.css#L33](src/style.css#L33)

Why this is bad:

- IDs should be unique in a document.
- Reused IDs increase the chance of style and script side effects.

How to solve:

- Replace repeated IDs with class selectors.

### 9) Some controls are not self-explanatory on first use (P2)

Evidence:

- [src/components/MunicipalitySelector.vue#L61](src/components/MunicipalitySelector.vue#L61)
- [src/components/MunicipalitySelector.vue#L63](src/components/MunicipalitySelector.vue#L63)
- [src/components/ExportControls.vue#L95](src/components/ExportControls.vue#L95)

Why this is bad:

- Placeholder-only field labeling and icon-only actions reduce discoverability.

How to solve:

- Add visible municipality label.
- Show export text label on medium and larger screens.

### 10) Metadata and copy are static for locale and year context (P3)

Evidence:

- [index.html#L2](index.html#L2)
- [index.html#L9](index.html#L9)
- [src/App.vue#L177](src/App.vue#L177)

Why this is bad:

- Locale switching does not fully map to document metadata.
- Hardcoded year and footer copy can age quickly.

How to solve:

- Bind html language and dynamic title/description to active locale and year.
- Remove hardcoded year from static footer text.

## Prioritized Roadmap

### Week 1 (critical)

1. Day-cell accessibility and keyboard behavior.
2. Persistent day-details panel.
3. Typography baseline adjustment.

### Week 2 (structure)

1. Header simplification and hierarchy split.
2. Grid legend and state clarity.

### Week 3 (system)

1. Unified color/surface token system.
2. In-app modal/toast replacement for browser dialogs.

### Week 4 (polish)

1. Localization metadata parity.
2. Mobile QA and spacing refinements.

## Success Criteria

1. Core planning flow works with keyboard only.
2. Users can decode all day states quickly with legend support.
3. Mobile planning flow retains context without hover dependency.
4. Light and dark modes feel like one coherent product.

## Appendix: Redesign Direction

### Product Direction

1. Data-first annual planning with low cognitive friction.
2. Calm, trustworthy visual tone.
3. High legibility before visual decoration.

### Initial Token Proposal

1. Surface background: slate-50 and slate-900 family.
2. Card surface: white and slate-800 family.
3. Text system: slate-900 primary, slate-600 secondary.
4. Semantic states: emerald success, amber warning, rose danger.
5. Focus ring: consistent sky-500 ring across controls.

### Suggested IA

1. Sticky top bar: title, year, municipality, primary actions.
2. Secondary stats region: collapsible and compact by default on mobile.
3. Main area: year grid + visible legend + persistent day details.
