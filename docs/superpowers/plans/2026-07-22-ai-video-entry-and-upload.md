# AI Video Entry and Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge Grok's single-reference upload tile, expose AI Video Generator in the workspace sidebar and homepage hero, and make Grok 1.5 Video the generic page default.

**Architecture:** Keep the existing shared components and add narrow source-contract coverage before implementation. Sidebar and homepage labels remain locale-aware; model-specific pages keep their existing defaults.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Node test runner with `tsx`.

---

### Task 1: Add failing release-contract coverage

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`
- Modify: `src/lib/localization-coverage.test.ts`

- [ ] Add assertions that the generic AI video page passes `modelId="grok-1-5-video"`, while Seedance and Kling branches keep their model-specific IDs.
- [ ] Add assertions that the single-image upload grid uses `w-full max-w-[240px]` instead of `max-w-40`.
- [ ] Add assertions that `GlobalWorkspaceShell.tsx` declares `createVideo`, places it after `editImage`, links to `/ai-video-generator`, and localizes it for all supported locales.
- [ ] Add assertions that the homepage secondary CTA links to `/ai-video-generator` and reads from `home.ctaVideo`.
- [ ] Run `npx tsx --test src/components/AiVideoGeneratorTool.shared-contract.test.mjs src/lib/localization-coverage.test.ts` and confirm the new assertions fail for the missing behavior.

### Task 2: Implement the minimal UI and locale changes

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.tsx`
- Modify: `src/components/blocks/ToolL2PageContent.tsx`
- Modify: `src/components/GlobalWorkspaceShell.tsx`
- Modify: `src/components/home/HomePageMain.tsx`
- Modify: `src/data/{en,de,ja,es,zh-TW,pt,fr,ko,it}/common.json`

- [ ] Change the single-image video upload grid to `grid-cols-1 w-full max-w-[240px]` while leaving the multi-image `grid-cols-3` branch unchanged.
- [ ] Change only the generic `topComp === 'ai-video-generator'` branch to `modelId="grok-1-5-video"`.
- [ ] Add the `video` icon type, `createVideo` label key, locale translations, and `{ labelKey: 'createVideo', href: '/ai-video-generator', icon: 'video' }` directly after `editImage`.
- [ ] Change the homepage secondary CTA href to `/ai-video-generator` and label to `home?.ctaVideo ?? 'AI Video Generator'`.
- [ ] Add `home.ctaVideo` to all nine common locale files using natural localized labels; keep `ctaImageEdit` intact for backward compatibility.
- [ ] Re-run the focused tests and confirm they pass.

### Task 3: Verify the visible release surface

**Files:**
- Test only; no additional production files expected.

- [ ] Run the AI video, homepage, workspace navigation, and localization contract tests.
- [ ] Run `git diff --check` and inspect the scoped diff; confirm untracked AI Dance assets and `tmp/` remain untouched.
- [ ] Restart the fixed-port `3006` dev server only if the current process serves stale CSS.
- [ ] Browser-smoke `/`, `/ai-video-generator`, and `/de/ai-video-generator`; verify 1290+ CSS rules, the homepage CTA destination, sidebar order/active state, Grok default selection, and the 240px upload tile.

No commit, push, or production deployment is included unless explicitly requested.
