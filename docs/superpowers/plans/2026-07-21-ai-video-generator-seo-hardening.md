# AI Video Generator SEO Hardening Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with test-first changes. Do not commit, push, or deploy unless the user explicitly requests it.

**Goal:** Make the generic AI Video Generator page more trustworthy, distinct, useful, and video-search friendly while preserving the model dropdown Quality stars.

**Architecture:** Keep page-owned visible copy and video metadata in the English SEO JSON. Extend the shared L2 renderer with reusable schema helpers and intersection-based prompt-video playback. Consolidate the overlapping Seedance slug with a permanent redirect and encode the resulting standards in project rules.

**Tech Stack:** Next.js App Router, React, TypeScript, JSON locale data, Node test runner, JSON-LD, ffmpeg poster extraction.

---

### Task 1: Add failing SEO content and route contracts

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`
- Modify: `src/app/model/seedance-2/all-tools/page.tsx`
- Modify: `src/app/model/seedance-2/[slug]/page.tsx`

- [ ] Add assertions that the generic page has no absolute free claim, no internal editorial phrases, direct credit/audio answers, a troubleshooting section, and video metadata.
- [ ] Add assertions that the Product Ad prompt matches its 5-second 9:16 asset.
- [ ] Add assertions that the Seedance generic slug permanently redirects and is excluded from the all-tools list.
- [ ] Run the focused tests and confirm they fail for the missing behavior.

### Task 2: Rewrite and consolidate page-owned content

**Files:**
- Modify: `src/data/en/ai-video-generator.json`
- Modify: `_codex/ai-video-generator-assets/prompt-template-videos.source.json`

- [ ] Remove duplicated visible sections and unsupported comparison/rating data.
- [ ] Rewrite metadata, H1, model summary, model guide, settings, FAQ, and prompt copy using direct objective wording.
- [ ] Add per-video description, duration, upload date, and poster fields.
- [ ] Run the content contract and confirm it passes.

### Task 3: Consolidate the competing Seedance URL

**Files:**
- Modify: `src/app/model/seedance-2/[slug]/page.tsx`
- Modify: `src/app/model/seedance-2/all-tools/page.tsx`
- Test: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

- [ ] Return noindex/canonical metadata for the legacy slug.
- [ ] Call `permanentRedirect('/model/seedance-2')` for the legacy slug.
- [ ] Filter the legacy slug from the Seedance all-tools grid.
- [ ] Run the route contract and confirm it passes.

### Task 4: Add poster assets and deferred playback

**Files:**
- Create: `public/videos/ai-video-generator/prompt-templates/*.webp`
- Modify: `src/components/blocks/PromptExamples.tsx`
- Test: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

- [ ] Extract one representative frame from each permanent R2-backed source video and encode it as WebP.
- [ ] Add `poster` support to prompt-example items.
- [ ] Add a small reusable video element that observes its card, loads with `preload="none"`, and plays only while visible.
- [ ] Run the focused contract and TypeScript check.

### Task 5: Add reusable video and FAQ schema

**Files:**
- Modify: `src/components/blocks/ToolL2PageContent.tsx`
- Test: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

- [ ] Replace the single HowTo object with an `@graph` schema builder.
- [ ] Add `FAQPage` entries from visible FAQ content.
- [ ] Add one `VideoObject` for every permanent prompt video with actual poster, duration, upload date, description, and content URL.
- [ ] Run the focused contract and confirm it passes.

### Task 6: Capture reusable project rules

**Files:**
- Modify: `AGENTS.md`

- [ ] Add a concise `SEO 页面与常驻视频资产规则` section covering URL ownership, claim safety, objective comparisons, media consistency, video loading, schema, and targeted verification.
- [ ] Preserve the explicit exception that existing model-selector Quality ratings should only change when a task requests it.

### Task 7: Verify the complete scope

**Files:**
- Verify only

- [ ] Run the focused AI video generator tests.
- [ ] Run route/sitemap tests affected by SEO URL handling.
- [ ] Run `npx tsc --noEmit`.
- [ ] Verify all local poster paths exist and all remote video URLs respond.
- [ ] Run `git diff --check` and distinguish pre-existing whitespace findings from new issues.
- [ ] Review the diff against every design requirement and report exact evidence without committing or publishing.
