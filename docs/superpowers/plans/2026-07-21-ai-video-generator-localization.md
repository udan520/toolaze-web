# AI Video Generator Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish complete, indexable AI Video Generator pages in every currently supported Toolaze locale.

**Architecture:** Mirror the approved English JSON into eight locale files while translating every visible string, including copied prompts. Add one explicit locale page following existing L2 patterns, then update English-only fallback and sitemap behavior. Protect the result with recursive shape, residue, route, and asset tests.

**Tech Stack:** Next.js App Router, locale JSON data, Node test runner with `tsx`, Toolaze SEO loader and hreflang helpers.

---

### Task 1: Record the localization run and define failing contracts

**Files:**
- Create: `_codex/seo-pipeline/queue/ready.json`
- Create: `_codex/seo-pipeline/tasks/2026-07-21-ai-video-generator-localization/task.json`
- Create: `_codex/seo-pipeline/tasks/2026-07-21-ai-video-generator-localization/content/{locale}.json`
- Modify: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`
- Modify: `src/lib/localized-route-fallbacks.test.ts`

- [ ] Create loader-compatible SEO run records for the L2 localization and all nine locale outputs.
- [ ] Add tests requiring eight locale JSON files, recursive shape parity, localized prompts, preserved assets, and no unapproved English fallback.
- [ ] Add tests requiring an explicit locale page, localized sitemap URLs, and removal from English-only fallback.
- [ ] Run the focused tests and confirm they fail because locale files and route wiring do not exist yet.

### Task 2: Translate all page-owned content

**Files:**
- Create: `src/data/de/ai-video-generator.json`
- Create: `src/data/ja/ai-video-generator.json`
- Create: `src/data/es/ai-video-generator.json`
- Create: `src/data/zh-TW/ai-video-generator.json`
- Create: `src/data/pt/ai-video-generator.json`
- Create: `src/data/fr/ai-video-generator.json`
- Create: `src/data/ko/ai-video-generator.json`
- Create: `src/data/it/ai-video-generator.json`

- [ ] Translate metadata, hero, explanatory sections, prompt cards, video descriptions, use cases, related tools, and FAQ into each locale.
- [ ] Preserve model names, specifications, URLs, asset paths, ISO durations, dates, colors, and object structure.
- [ ] Run JSON parsing, recursive shape, locale residue, and prompt-localization tests until green.

### Task 3: Publish localized routes and SEO discovery

**Files:**
- Create: `src/app/[locale]/ai-video-generator/page.tsx`
- Modify: `src/lib/localized-route-fallbacks.ts`
- Modify: `src/app/sitemap.ts`

- [ ] Add the explicit localized L2 route with English redirect, locale file guard, canonical, and hreflang metadata.
- [ ] Remove `ai-video-generator` from `ENGLISH_ONLY_ROOT_ROUTES`.
- [ ] Add English and eight non-English AI Video Generator URLs to the sitemap with localized priorities.
- [ ] Run route and sitemap tests until green.

### Task 4: Verify the complete localization surface

**Files:**
- Test: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`
- Test: `src/lib/localized-route-fallbacks.test.ts`
- Test: `src/lib/localization-coverage.test.ts`

- [ ] Run focused localization, page contract, route fallback, and layout tests.
- [ ] Run `npx tsc --noEmit` and `git diff --check`.
- [ ] Run the production build.
- [ ] Start the candidate on a non-3006 port and verify representative locale pages return 200 with localized title, prompt text, FAQ, canonical, hreflang, and structured data.
