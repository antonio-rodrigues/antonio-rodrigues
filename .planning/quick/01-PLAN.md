# Quick Task: SEO Optimization for Single Page Application

## Objective
Optimize the application for SEO, focusing on meta tags, structured data, sitemap generation, and semantic HTML for a single-page Vue 3/Vite app.

## Proposed Changes

### 1. Static Optimization of `index.html`
- Update `<html lang="pt-PT">`.
- Add essential meta tags: `<title>`, `<meta name="description">`.
- Add Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`.
- Add Twitter Cards tags.
- Add JSON-LD structured data (Schema.org).

### 2. Vite Configuration for Sitemap
- Install `vite-plugin-sitemap`.
- Update `vite.config.ts` to generate `sitemap.xml`.

### 3. Robots.txt
- Create `public/robots.txt`.

### 4. Semantic HTML in `App.vue`
- Use `<header>`, `<main>`, `<section>`, `<footer>`.

## Execution Plan

1. **Step 1: Install Dependencies**
   - Install `vite-plugin-sitemap`.

2. **Step 2: Update `index.html`**
   - Add all SEO meta tags and JSON-LD.

3. **Step 3: Update `vite.config.ts`**
   - Import and configure the sitemap plugin.

4. **Step 4: Create `public/robots.txt`**
   - Create the directory and the file.

5. **Step 5: Update `App.vue`**
   - Refactor the main structure to use semantic HTML.

6. **Step 6: Verification**
   - Run `npm run build` to verify sitemap generation and build success.

## Verification Strategy
- Manual check of `index.html`.
- Verify `dist/sitemap.xml` existence after build.
- Verify `dist/robots.txt` existence after build.
- Visual check of semantic structure in `App.vue`.
