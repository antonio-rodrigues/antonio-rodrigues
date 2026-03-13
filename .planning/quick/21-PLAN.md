# Plan: QT-21 - Add GitHub Actions workflow for Vite deployment to GitHub Pages

The user is experiencing a "Multiple artifacts named 'github-pages' were unexpectedly found" error on GitHub Pages. This usually happens when the deployment source is misconfigured or when the default GitHub Actions (like the Jekyll one) clash with custom workflows or settings. Since this is a Vite/Vue project, we will provide a robust deployment workflow specifically for Vite.

## Proposed Changes

### GitHub Actions
- Create `.github/workflows/deploy.yml` with the following steps:
  - Checkout code.
  - Setup Node.js.
  - Install dependencies.
  - Build the project (`npm run build`).
  - Upload the `dist` folder using `actions/upload-pages-artifact`.
  - Deploy to GitHub Pages using `actions/deploy-pages`.
  - Ensure the workflow only runs on the `main` branch.
  - Set permissions for `id-token: write` and `pages: write`.

### Vite Configuration
- Update `vite.config.ts` to set the `base` property to `./` to ensure assets are loaded correctly on GitHub Pages regardless of the subpath.

## Verification Plan

### Automated Tests
- Run `npm run build` locally to ensure the build still works with the new configuration.

### Manual Verification
- Verify the contents of `.github/workflows/deploy.yml`.
- Verify the `base` property in `vite.config.ts`.
