# Seedance 2.5 Competitive Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the English Seedance 2.5 generic landing-page sections with proof-led, media-backed sections inspired by Krea and OpenArt while preserving Toolaze's real generator contract.

**Architecture:** Add three page-specific presentation components and register them through the existing dynamic section renderer. Keep all claims and media in the English JSON/SEO Factory artifacts; other locales continue using their existing section order and shared blocks.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, JSON content, Playwright screenshot capture, Sharp WebP compression, Cloudflare R2 media.

---

### Task 1: Lock the redesign contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] Require the English section order `seedanceProof`, `modelComparison`, `howToUse`, `scenes`, `performanceMetrics`, `faq`.
- [ ] Require four proof metrics with values `30s`, `50`, `4`, and `2` and a real R2 video with its honest duration.
- [ ] Require four How To steps, three R2 WebP screenshots, one R2-backed video result, and exactly four use cases.
- [ ] Require the page renderer to import and route the three Seedance-specific components.
- [ ] Run the focused test and confirm RED because the new sections and components are absent.

### Task 2: Capture and publish real Toolaze workflow media

**Files:**
- Create temporarily under `/tmp`: three English generator captures
- Modify content references only after R2 upload succeeds

- [ ] Capture the current English generator with a clean headless browser at 1440 px desktop width.
- [ ] Crop mode/model, references/prompt, and settings/generate regions.
- [ ] Encode each crop as WebP below 100 KB and visually inspect all three.
- [ ] Upload the screenshots through the configured Toolaze R2 upload route and verify HTTP 200, `image/webp`, and byte size.

### Task 3: Build the proof-led components

**Files:**
- Create: `src/components/blocks/Seedance25Proof.tsx`
- Create: `src/components/blocks/Seedance25HowTo.tsx`
- Create: `src/components/blocks/Seedance25UseCases.tsx`
- Modify: `src/components/blocks/ToolL2PageContent.tsx`

- [ ] Implement the real-video proof section with a four-value metric rail and 30-second scene-planning timeline.
- [ ] Implement four sequential How To steps with three real screenshots, one real result video, and crawlable HTML descriptions.
- [ ] Implement four numbered use-case rows without repeated icon cards.
- [ ] Add the new section renderer and Seedance-specific branches without changing other page behavior.
- [ ] Run the focused test and TypeScript until GREEN.

### Task 4: Rewrite and synchronize the English page structure

**Files:**
- Modify: `src/data/en/seedance-2-5.json`
- Modify: `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json`

- [ ] Replace `modelIntro` and generic `features` in the English render order with `seedanceProof`.
- [ ] Add the proof media, metrics, timeline, How To media, and numbered use-case data.
- [ ] Keep the comparison, Toolaze settings, and FAQ fact boundaries intact.
- [ ] Keep both English JSON artifacts equivalent.
- [ ] Run the focused contract and visible-copy negative scan.

### Task 5: Visual and technical verification

**Files:**
- Verify all files from Tasks 1–4.

- [ ] Run the focused Seedance page contract and relevant shared layout contracts.
- [ ] Run `npx tsc --noEmit --pretty false` and `git diff --check` for the touched files.
- [ ] Confirm all new R2 assets load with the expected MIME type and size.
- [ ] Smoke `/model/seedance-2-5` on port 3014 and confirm the new headings appear in rendered HTML.
- [ ] Capture desktop and mobile page screenshots, inspect them, and fix any hierarchy, overflow, media crop, or accessibility problem.
- [ ] Report the existing non-3006 preview URL without committing, pushing, or publishing.
