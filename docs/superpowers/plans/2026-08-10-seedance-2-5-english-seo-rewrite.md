# Seedance 2.5 English SEO Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the English Seedance 2.5 model landing page around verified 2.0-to-2.5 deltas and current Toolaze controls.

**Architecture:** Keep the existing renderer and live generator untouched. Change only the English public content, its matching SEO Factory artifact, and the focused content contract; preserve all other locales and infrastructure.

**Tech Stack:** JSON content, Node.js test runner, TypeScript/Next.js content loader.

---

### Task 1: Lock the English content contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] Add a test requiring the shorter section order, the 15-to-30-second and 15-to-50-reference deltas, exactly four use cases, Toolaze 480p/720p boundaries, and English Factory parity.
- [ ] Add negative assertions against claiming that 2.5 introduced multimodal input or native audio.
- [ ] Run `npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs` and confirm the new test fails against the old copy.

### Task 2: Rewrite and synchronize the English content

**Files:**
- Modify: `src/data/en/seedance-2-5.json`
- Modify: `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json`

- [ ] Replace the repetitive English outline with `modelIntro`, `features`, `modelComparison`, `howToUse`, `scenes`, `performanceMetrics`, and `faq`.
- [ ] Write the hero, feature, comparison, workflow, use-case, settings, and FAQ copy using only the approved evidence boundary.
- [ ] Keep the two JSON artifacts equivalent and leave all non-English JSON unchanged.
- [ ] Run the focused test and confirm it passes.

### Task 3: Verify the final page content

**Files:**
- Verify: `src/data/en/seedance-2-5.json`
- Verify: `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json`

- [ ] Parse both JSON files with `jq empty`.
- [ ] Scan user-visible English content for internal SEO/editorial wording and unqualified free claims.
- [ ] Run `npx tsc --noEmit --pretty false`.
- [ ] Run `git diff --check`.
- [ ] Review the final diff for English-only scope and report a preview URL without committing or publishing.
