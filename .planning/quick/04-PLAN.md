---
phase: quick
plan: 04
type: execute
wave: 1
depends_on: []
files_modified: ["src/App.vue"]
autonomous: true
requirements: ["QT-11"]
must_haves:
  truths:
    - "Clicking 'Limpar tudo' triggers a confirmation dialog"
    - "Clicking OK in the dialog clears all marked days"
    - "Clicking Cancel in the dialog does nothing"
  artifacts:
    - path: "src/App.vue"
      provides: "Confirmation logic for clearing days"
  key_links:
    - from: "src/App.vue"
      to: "store.clearMarkedDays"
      via: "confirmClear function"
---

<objective>
Add a confirmation dialog to the 'Limpar tudo' button to prevent accidental clearing of all vacation data.

Purpose: Prevent accidental loss of selected vacation days.
Output: User is prompted before data is cleared.
</objective>

<execution_context>
@/Users/arodri06/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@src/App.vue
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add confirmation logic to 'Limpar tudo' button</name>
  <files>src/App.vue</files>
  <action>
    - Define a `confirmClear` function in `<script setup>` in `src/App.vue` that uses `window.confirm('Confirma?')` to ask the user for confirmation.
    - Update the `@click` event handler for the 'Limpar tudo' button in the `<template>` to call `confirmClear()` instead of `store.clearMarkedDays()`.
    - If the user clicks OK, call `store.clearMarkedDays()`.
    - If the user clicks Cancel, the operation should be cancelled (nothing happens).
  </action>
  <verify>
    - Clicking the 'Limpar tudo' button should trigger a native browser confirmation dialog with 'Confirma?'.
    - If 'OK' is clicked, verify that `store.clearMarkedDays()` is executed and days are cleared.
    - If 'Cancel' is clicked, verify that no changes occur and days remain marked.
  </verify>
  <done>
    The 'Limpar tudo' button has a functional confirmation dialog as requested.
  </done>
</task>

</tasks>

<success_criteria>
- Confirmation dialog "Confirma?" is displayed on button click.
- "OK" action successfully clears all marked vacation days.
- "Cancel" action prevents data clearing.
</success_criteria>

<output>
After completion, create `.planning/phases/quick/quick-04-SUMMARY.md`
</output>
