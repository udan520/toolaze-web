# Prompt Index Pruning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop submitting low-value Prompt URLs for indexing while retaining the English Prompt entry pages and Seedance 2.0 redirect coverage.

**Architecture:** Sitemap generation becomes the single allowlist for indexable Prompt pages. Prompt route metadata applies `noindex, follow` to detail and non-English collection surfaces. Seedance L3 redirect routes use a fixed legacy-slug list and no longer depend on deleted locale JSON files.

**Tech Stack:** Next.js App Router, TypeScript, Node test runner.

---

### Task 1: Lock down Prompt sitemap inclusion

**Files:**
- Modify: `src/app/sitemap.ts`
- Test: `src/lib/localized-route-fallbacks.test.ts`

- [ ] Add failing assertions that the sitemap contains `/prompts` and English Prompt model/category pages but excludes `/prompts/{tweetId}` and all localized Prompt URLs.
- [ ] Run `node --test src/lib/localized-route-fallbacks.test.ts` and confirm the assertions fail against the current sitemap.
- [ ] Remove detail and localized Prompt sitemap entries, retaining only the eight English allowlisted Prompt pages.
- [ ] Re-run the test and confirm it passes.

### Task 2: Mark non-indexable Prompt routes

**Files:**
- Modify: `src/app/prompts/[id]/page.tsx`
- Modify: `src/app/[locale]/prompts/page.tsx`
- Modify: `src/app/[locale]/prompts/models/[model]/page.tsx`
- Modify: `src/app/[locale]/prompts/categories/[category]/page.tsx`
- Test: new focused source-contract test under `src/app/prompts/`

- [ ] Write a failing source-contract test requiring `robots: { index: false, follow: true }` on Prompt details and localized Prompt collection routes.
- [ ] Run the new test and confirm it fails because the metadata is currently indexable.
- [ ] Add the minimal robots metadata to those routes without altering their user-visible content or canonical paths.
- [ ] Re-run the test and confirm it passes.

### Task 3: Remove obsolete Seedance L3 content safely

**Files:**
- Delete: `src/data/{en,de,ja,es,zh-TW,pt,fr,ko,it}/seedance-2/{ai-video-generator,text-to-video,image-to-video}.json`
- Modify: `src/lib/seo-loader.ts`
- Modify: `src/app/seedance-2/[slug]/page.tsx`
- Modify: `src/app/model/seedance-2/[slug]/page.tsx`
- Modify: `src/app/[locale]/model/seedance-2/[slug]/page.tsx`
- Test: new focused Seedance redirect source-contract test

- [ ] Write a failing test requiring the three legacy L3 slugs to remain statically declared while their JSON files and SEO loader registration are absent.
- [ ] Run the test and confirm it fails against the current loader/data layout.
- [ ] Replace content-derived static parameters with the fixed legacy slug list, remove obsolete Seedance loader registration, and delete the 27 locale JSON files.
- [ ] Re-run the test and confirm it passes.

### Task 4: Verify the public-index contract

**Files:**
- Verify changed files only.

- [ ] Run all focused Node tests from Tasks 1–3.
- [ ] Check `git diff --check` and `git diff --name-only` to confirm the edit scope contains only Prompt indexing and Seedance L3 cleanup files plus their tests/docs.
