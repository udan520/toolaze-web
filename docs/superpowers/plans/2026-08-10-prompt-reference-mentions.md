# Prompt Reference Mentions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cursor-aware `@` reference mentions for currently uploaded Seedance 2.5 media without changing generation payloads.

**Architecture:** A pure helper owns text replacement and caret math, a focused picker owns the resource menu UI, and `AiVideoGeneratorTool` owns current-mode resource mapping and textarea orchestration. Existing upload arrays remain the source of truth so displayed numbering matches request order.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner, tsx.

---

### Task 1: Cursor-aware mention insertion

**Files:**
- Create: `src/lib/prompt-reference-mentions.ts`
- Create: `src/lib/prompt-reference-mentions.test.ts`

- [ ] Write tests for replacing a typed trigger, inserting from the button at a collapsed caret, replacing a selected range, adding readable spacing, and returning the caret after the token.
- [ ] Run `npx --yes tsx --test src/lib/prompt-reference-mentions.test.ts` and verify it fails because the helper does not exist.
- [ ] Implement a minimal `insertPromptReferenceMention` pure function returning `{ value, caret }`.
- [ ] Re-run the focused helper tests and verify they pass.

### Task 2: Reference picker presentation

**Files:**
- Create: `src/components/PromptReferenceMentionPicker.tsx`
- Modify: `src/components/AiVideoGeneratorTool.layout.test.ts`

- [ ] Add failing source-contract assertions for a reusable picker, grouped media labels, empty state, accessible item buttons, image/video previews, and audio fallback visuals.
- [ ] Run `npx --yes tsx --test src/components/AiVideoGeneratorTool.layout.test.ts` and verify the new assertions fail for the missing picker.
- [ ] Implement the minimal picker with compact responsive layout and `onSelect` callbacks.
- [ ] Re-run the layout contract and verify the picker assertions pass.

### Task 3: Prompt field orchestration

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.tsx`
- Modify: `src/components/AiVideoGeneratorTool.layout.test.ts`

- [ ] Add failing source-contract assertions for keyboard `@` detection, the inline trigger button, exact remote/local numbering order, first/last-frame filtering, caret restoration, Escape dismissal, and outside dismissal.
- [ ] Run the focused layout contract and verify the new assertions fail for the missing orchestration.
- [ ] Add textarea/picker refs and state, derive active mention items, wire `onChange`, trigger-button behavior, selection insertion, focus restoration, and dismissal effects.
- [ ] Re-run helper and layout tests and verify they pass.

### Task 4: Focused verification

**Files:**
- Verify only; no production files expected.

- [ ] Run `npx --yes tsx --test src/lib/prompt-reference-mentions.test.ts src/components/AiVideoGeneratorTool.layout.test.ts`.
- [ ] Run a TypeScript check scoped through the existing project command if available; otherwise rely on the focused tsx compilation plus page smoke.
- [ ] Verify `http://localhost:3014/model/seedance-2-5` returns HTTP 200.
- [ ] Review the final diff and confirm no generation API, upload order, history contract, or unrelated dirty-worktree changes were altered.

No git commit, push, branch, or release step is included because the user did not request repository integration.
