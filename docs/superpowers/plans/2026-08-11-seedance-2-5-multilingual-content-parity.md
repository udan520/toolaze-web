# Seedance 2.5 Multilingual Content Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the non-essential 30-second planning timeline and ship complete native-language parity for all supported Seedance 2.5 locales.

**Architecture:** Keep the English JSON as the canonical schema, localize the complete object for eight non-English locales, and mirror every public content file into its SEO Factory counterpart. A single focused contract test enforces structure, locale completeness, FAQ limits, forbidden wording, and public/Factory equality.

**Tech Stack:** JSON content, Node.js test runner, TypeScript/TSX contract tests, Next.js localized routes.

---

### Task 1: Define the multilingual content contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] Replace the old positive timeline assertion with a negative assertion for `timelineTitle` and `timeline` across every locale.
- [ ] Assert each locale has the English `sectionsOrder`, four feature stories, four How To steps, and exactly three additive FAQ entries covering audio, 4K export, and local region editing.
- [ ] Assert each public locale object deeply equals its SEO Factory counterpart.
- [ ] Assert non-English locales do not reuse the finalized English section titles or full English Hero description.
- [ ] Run `npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs` and confirm RED because the old localized files lack `featureStories` and English still contains the timeline.

### Task 2: Remove the redundant English timeline

**Files:**
- Modify: `src/data/en/seedance-2-5.json`
- Modify: `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json`

- [ ] Remove only `timelineTitle` and `timeline` from the first feature story.
- [ ] Keep the feature title, two explanatory paragraphs, proof video, duration, and alt text unchanged.
- [ ] Confirm the first story flows directly into the second story.

### Task 3: Localize the finalized page into all supported locales

**Files:**
- Modify: `src/data/{de,es,fr,it,ja,ko,pt,zh-TW}/seedance-2-5.json`
- Modify: `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/{de,es,fr,it,ja,ko,pt,zh-TW}.json`

- [ ] Translate metadata, model intro, Hero, four feature stories, comparison, four How To steps, performance settings, and FAQ from the finalized English fact boundary.
- [ ] Preserve model names, media URLs, technical formats, numeric specifications, `topTool` configuration, and section order.
- [ ] Keep `Demo`, `History`, and `Recreate` only where they identify the real UI workflow.
- [ ] Copy each finalized public locale JSON to the matching Factory content object through an explicit patch so the pairs remain deeply equal.

### Task 4: Run the final copy and implementation gates

**Files:**
- Verify all files from Tasks 1–3.

- [ ] Run the focused contract test and confirm GREEN.
- [ ] Run `npx tsc --noEmit --pretty false`.
- [ ] Parse all 18 JSON files and verify public/Factory deep equality.
- [ ] Scan visible copy for internal SEO/editorial terms, unverified free claims, old timeline fields, and substantial English fallback in non-English locales.
- [ ] Run targeted `git diff --check`.
- [ ] Smoke the English and representative localized routes on port 3014 and confirm the timeline is absent and localized Key Features render.

No commit, push, deployment, or indexing submission is part of this plan.
