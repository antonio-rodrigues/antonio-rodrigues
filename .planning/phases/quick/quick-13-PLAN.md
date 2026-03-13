---
phase: quick
plan: 13
type: execute
wave: 1
depends_on: []
files_modified: [src/store/config.ts]
autonomous: true
requirements: [POLISH-01]
must_haves:
  truths:
    - "Unused imports removed from src/store/config.ts"
  artifacts:
    - path: "src/store/config.ts"
      provides: "Pinia store for calendar configuration"
---

<objective>
Fix unused imports in `src/store/config.ts` to resolve TS6133 errors.

Purpose: Clean up codebase and ensure it passes type checking without warnings/errors.
Output: Modified `src/store/config.ts` without unused `computed` and `addDays` imports.
</objective>

<execution_context>
@/Users/arodri06/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/arodri06/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/store/config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove unused imports in config.ts</name>
  <files>src/store/config.ts</files>
  <action>
    - Open `src/store/config.ts`
    - Remove `computed` from the `import { ref, watch, computed } from 'vue'` line.
    - Remove `addDays` from the `import { format, addDays } from 'date-fns'` line.
    - Ensure no other changes are made to the logic or imports.
  </action>
  <verify>
    <automated>! grep -nE "computed|addDays" src/store/config.ts | grep -v "import"</automated>
  </verify>
  <done>Unused imports are removed from `src/store/config.ts`.</done>
</task>

</tasks>

<verification>
Check if `vue-tsc` still passes (if possible) or visually verify the imports.
</verification>

<success_criteria>
`src/store/config.ts` no longer contains unused imports for `computed` and `addDays`.
</success_criteria>

<output>
After completion, create `.planning/phases/quick/quick-13-SUMMARY.md`
</output>
