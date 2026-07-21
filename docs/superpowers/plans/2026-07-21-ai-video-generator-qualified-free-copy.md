# AI Video Generator Qualified Free Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore accurate `Free AI Video Generator` search and hero wording while disclosing the 10-credit sign-up condition and eligible Grok scope.

**Architecture:** Keep the change in the existing locale-aware page JSON and its source contract test. Update the project SEO rule so future pages distinguish verified free quotas from unsupported unlimited or no-sign-up claims.

**Tech Stack:** Next.js page data, JSON locale content, Node test runner with `tsx`.

---

### Task 1: Define the qualified-free copy contract

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

- [ ] **Step 1: Replace the old no-Free assertions**

Require `Free` in the metadata title and H1. Require visible copy to include `10 free credits`, sign-up, Grok, and eligible settings. Keep the 160-character metadata description assertion and add negative assertions for `unlimited free` and `no sign-up`.

- [ ] **Step 2: Run the contract test and verify RED**

Run: `npx tsx --test src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

Expected: the qualified-free copy test fails because the current metadata and hero omit `Free` and the sign-up credit explanation.

### Task 2: Implement the qualified Free wording

**Files:**
- Modify: `src/data/en/ai-video-generator.json`

- [ ] **Step 1: Update page copy**

Set the metadata title to `Free AI Video Generator Online | Text & Image to Video`, keep the description at or below 160 characters, set the H1 to `Free AI Video Generator Online`, explain the 10-credit sign-up grant in the hero description, and add a direct FAQ explaining that the grant covers at least one eligible Grok generation while other models or settings may cost more.

- [ ] **Step 2: Run the contract test and verify GREEN**

Run: `npx tsx --test src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

Expected: 9 tests pass.

### Task 3: Preserve the policy as a reusable rule

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Refine the Free-claim rule**

Allow `Free` when a verified grant completes a real generation, but require visible disclosure of sign-up, credit, model, and setting conditions. Continue prohibiting unlimited and no-sign-up claims unless separately verified.

- [ ] **Step 2: Run focused regression and source checks**

Run: `npx tsx --test src/components/AiVideoGeneratorTool.shared-contract.test.mjs src/components/AiVideoGeneratorTool.layout.test.ts src/lib/ai-video-generator-config.test.ts`

Expected: all tests pass and the model-dropdown Quality rating assertions remain green.

Run: `git diff --check`

Expected: no output and exit code 0.
