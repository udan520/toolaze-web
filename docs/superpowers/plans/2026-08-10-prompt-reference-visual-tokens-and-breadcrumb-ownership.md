# Prompt Reference Visual Tokens and Breadcrumb Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship single breadcrumb ownership, isolated picker scrolling, and purple hover-preview prompt references.

**Architecture:** Keep the native textarea and add a synchronized token mirror rather than replacing input semantics. Derive breadcrumb ownership from the shared video-generator branch, and enforce both recurring patterns through project rules and focused contracts.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner, tsx.

---

### Task 1: Structural Breadcrumb Ownership

**Files:**
- Modify: `src/components/blocks/ToolL2PageContent.tsx`
- Modify: `src/components/blocks/ToolL2PageContent.breadcrumb-ownership.test.mjs`
- Modify: `AGENTS.md`

- [ ] Add failing assertions that a resolved `videoGeneratorDefaultModel` suppresses the outer breadcrumb and Seedance 2.5 needs no manual ownership entry.
- [ ] Run the breadcrumb ownership test and verify failure.
- [ ] Replace the video-page allowlist dependency with structural ownership and add the recurring-error rules to `AGENTS.md`.
- [ ] Re-run the breadcrumb ownership test and verify success.

### Task 2: Mention Token Segmentation

**Files:**
- Modify: `src/lib/prompt-reference-mentions.ts`
- Modify: `src/lib/prompt-reference-mentions.test.ts`

- [ ] Add failing tests for ordinary text, current-resource tokens, repeated tokens, and longest-label matching such as `@Image 10` before `@Image 1`.
- [ ] Run the helper test and verify failure.
- [ ] Implement `splitPromptReferenceMentions` as a pure scanner.
- [ ] Re-run the helper test and verify success.

### Task 3: Purple Tokens, Hover Preview, and Scroll Isolation

**Files:**
- Create: `src/components/PromptReferenceMentionOverlay.tsx`
- Modify: `src/components/PromptReferenceMentionPicker.tsx`
- Modify: `src/components/AiVideoGeneratorTool.tsx`
- Modify: `src/components/AiVideoGeneratorTool.layout.test.ts`

- [ ] Add failing source contracts for purple current-resource tokens, portal hover previews, textarea/mirror scroll synchronization, and wheel/touch propagation isolation.
- [ ] Run the focused layout test and verify failure.
- [ ] Implement the overlay, preview portal, synchronized scroll, and picker overscroll containment.
- [ ] Re-run focused tests and verify success.

### Task 4: Verification

**Files:**
- Verify only.

- [ ] Run focused breadcrumb, mention, layout, model, and API tests.
- [ ] Run `npx tsc --noEmit --pretty false`, `npm run check:generation-contract`, and `git diff --check`.
- [ ] Verify on port 3014 that one breadcrumb renders, picker scrolling does not move the page, tokens are purple, and hover shows the referenced resource.

No commit, push, branch, or release operation is included.
