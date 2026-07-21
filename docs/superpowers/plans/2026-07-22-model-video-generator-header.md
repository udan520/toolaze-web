# Model Video Generator Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the Seedance 2.0, Kling 3.0, and generic AI Video Generator hero tools while preserving page-specific default models and SEO content.

**Architecture:** `ToolL2PageContent` owns a small page-to-model mapping and routes all three page types through one `AiVideoGeneratorTool` render branch. The shared generator remains responsible for interaction, model switching, uploads, history, and generation.

**Tech Stack:** Next.js, React, TypeScript, Node test runner via tsx.

---

### Task 1: Lock the shared rendering contract

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

- [ ] Add assertions for one shared video-page branch, the three page-to-model mappings, and `allowModelSelect`.
- [ ] Run `npx tsx --test src/components/AiVideoGeneratorTool.shared-contract.test.mjs` and confirm the new shared-branch assertion fails before implementation.

### Task 2: Consolidate the landing-page hero branches

**Files:**
- Modify: `src/components/blocks/ToolL2PageContent.tsx`

- [ ] Add a typed mapping from `ai-video-generator`, `seedance-2`, and `kling-3` to their default model IDs.
- [ ] Replace the three duplicate branches with one `AiVideoGeneratorTool` branch using the mapped model ID.
- [ ] Keep `allowModelSelect`, breadcrumbs, localized hero content, translations, and the generic page demo video.
- [ ] Run the focused contract test and confirm it passes.

### Task 3: Verify page behavior and scope

**Files:**
- Test: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`
- Test: `src/lib/ai-video-generator-config.test.ts`

- [ ] Run the focused generator and localization contract tests.
- [ ] Verify `/model/seedance-2` and `/model/kling-3` on port 3006 show the matching default model and retain model switching.
- [ ] Run `git diff --check` and confirm no model-page SEO JSON files changed.

No commit or push is included because the user has not requested Git operations.
