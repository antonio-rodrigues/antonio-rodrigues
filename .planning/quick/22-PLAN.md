# Plan: QT-22 - Fix blank page on GitHub Pages by updating absolute paths in index.html

The user is reporting a blank page on GitHub Pages. The `index.html` contains absolute paths for `/vite.svg` and `/src/main.ts`. While Vite's `base: './'` handles the *output* assets in the `dist/` folder, it doesn't always handle these root-level absolute paths correctly in all deployment environments if not defined as relative.

## Proposed Changes

### Root Configuration
- Update `index.html` to use relative paths for:
  - `<link rel="icon" type="image/svg+xml" href="vite.svg" />` (removed the leading `/`)
  - `<script type="module" src="./src/main.ts"></script>` (added the leading `./`)

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the `dist/index.html` is generated correctly.
- Check the generated `dist/index.html` with `grep` to verify it's using relative paths for assets.

### Manual Verification
- Confirm that the `index.html` file in the root is updated with the relative paths.
