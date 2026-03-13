# Quick Task: Add Google AdSense Script

## Objective
Add the Google AdSense script to the `<head>` of `index.html`.

## Proposed Changes
### `index.html`
- Insert the Google AdSense `<script>` tag in the `<head>` section.

## Execution Plan
1. **Step 1: Modify `index.html`**
   - Add the `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0241893451147439" crossorigin="anonymous"></script>` before the closing `</head>` tag.

2. **Step 2: Update STATE.md**
   - Add the new task to the "Quick Tasks Completed" table.

## Verification Strategy
- Verify that the script tag is present in `index.html`.
- Run `npm run build` to ensure no build errors.
