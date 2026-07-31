# Mobile Generation History and Model Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix H5 generation/history/navigation issues and guarantee that the selected image model, KIE provider model, charged credits, history model, and credit activity label remain consistent.

**Architecture:** Keep the existing public model IDs, but make backend model parsing strict and provider routing explicit. Reuse shared history reprompt and credit badge helpers so the full History page, inline generator, Credits page, and account menu follow the same rules without duplicating business logic.

**Tech Stack:** Next.js 15, React, TypeScript, Cloudflare Pages Functions, Node test runner with `tsx --test`, Tailwind CSS.

---

### Task 1: Strict Image Model and Provider Routing

**Files:**
- Modify: `functions/api/image-to-image.js`
- Modify: `functions/api/image-to-image.test.mjs`
- Modify: `src/lib/ai-image-generator-config.test.ts`

- [ ] **Step 1: Write failing backend tests**

Add cases asserting that `grok-1-5-image` sends `grok-imagine/text-to-image` or `grok-imagine/image-to-image`, all selectable image model IDs are accepted, and an unknown model returns `400` before credit consumption or KIE submission.

- [ ] **Step 2: Run the tests and confirm RED**

Run: `npx --yes tsx --test functions/api/image-to-image.test.mjs src/lib/ai-image-generator-config.test.ts`

Expected: Grok provider and unknown-model assertions fail against the current fallback behavior.

- [ ] **Step 3: Implement strict model parsing**

Change `resolveModel()` to return an accepted model ID or an empty result. In `onRequest`, return:

```js
return jsonResponse({ error: 'Unsupported image model.' }, 400)
```

before moderation, credit consumption, or provider submission when parsing fails. Route Grok with:

```js
return isImageToImage
  ? env.KIE_GROK_1_5_IMAGE_TO_IMAGE_MODEL || 'grok-imagine/image-to-image'
  : env.KIE_GROK_1_5_TEXT_TO_IMAGE_MODEL || 'grok-imagine/text-to-image'
```

- [ ] **Step 4: Run the focused model/API tests and confirm GREEN**

Run: `npx --yes tsx --test functions/api/image-to-image.test.mjs src/lib/ai-image-generator-config.test.ts functions/_shared/generation-credits.test.mjs src/lib/generation-credits.test.ts`

Expected: all selected model, provider, and pricing cases pass.

### Task 2: Shared History Recreate Destination

**Files:**
- Modify: `src/lib/history-reprompt.ts`
- Modify: `src/lib/history-reprompt.test.ts`
- Modify: `src/components/HistoryPageClient.tsx`
- Modify: `src/components/HistoryPageClient.media-tabs.test.mjs`

- [ ] **Step 1: Write failing destination tests**

Add tests for a helper that maps image records to the locale-aware `/ai-image-generator?model=<id>` destination and video records to `/ai-video-generator`, including `zh-TW` paths. Assert no record navigates to a missing `/model/{id}` route.

- [ ] **Step 2: Run and confirm RED**

Run: `npx --yes tsx --test src/lib/history-reprompt.test.ts src/components/HistoryPageClient.media-tabs.test.mjs`

Expected: destination helper and H5 action layout assertions fail.

- [ ] **Step 3: Implement the destination and H5 modal layout**

Use the shared locale parser to build the Recreate destination. In `HistoryPageClient`, replace `Create Similar` with localized `Recreate`, make the mobile action container a three-column grid, keep Recreate text, and render Download/Delete as icon-only buttons with `aria-label` and `title`.

Set the prompt container to four visible lines with internal scrolling:

```tsx
className="max-h-24 overflow-y-auto overscroll-contain whitespace-pre-wrap"
```

- [ ] **Step 4: Add clipboard feedback**

Replace the silent clipboard call with an async handler that dispatches the shared top notice:

```ts
dispatchToolazeTopNotice({ type: 'success', title: copy.promptCopied, message: '' })
```

and emits `Failed` copy on rejection. Add `promptCopied` and `promptCopyFailed` to every locale's `historyPage` copy.

- [ ] **Step 5: Run History and locale tests and confirm GREEN**

Run: `npx --yes tsx --test src/lib/history-reprompt.test.ts src/components/HistoryPageClient.media-tabs.test.mjs src/lib/localization-coverage.test.ts`

Expected: all Recreate, layout, clipboard, and locale coverage tests pass.

### Task 3: Inline Recreate and Mobile Generation Scroll

**Files:**
- Modify: `src/components/AiImageGenerationTool.tsx`
- Modify: `src/components/AiImageGenerationTool.result-layout.test.mjs`
- Modify: `src/lib/mobile-generator-source-contract.test.ts`

- [ ] **Step 1: Write failing source/behavior contracts**

Assert that Recreate is not disabled because another task is generating, checks the selected result's own prompt and references, and the new pending item is assigned a ref used by a mobile `scrollIntoView` effect.

- [ ] **Step 2: Run and confirm RED**

Run: `npx --yes tsx --test src/components/AiImageGenerationTool.result-layout.test.mjs src/lib/mobile-generator-source-contract.test.ts`

Expected: current disable expression and missing pending-item scroll target fail.

- [ ] **Step 3: Implement record-based Recreate**

Derive availability only from `currentResult.prompt`; let `applyHistoryItemToForm()` restore the record while concurrent tasks continue. Do not use current left-form `activeTab` or `imageFiles` to disable the action.

- [ ] **Step 4: Implement H5 pending-record focus**

Attach the pending item ID to its mobile card/ref. After adding a pending item and switching `rightMode` to `history`, wait for React render and call:

```ts
node.scrollIntoView({ behavior: 'smooth', block: 'start' })
```

only below the `md` breakpoint.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `npx --yes tsx --test src/components/AiImageGenerationTool.result-layout.test.mjs src/lib/mobile-generator-source-contract.test.ts`

Expected: all inline History, Recreate, and H5 scroll contracts pass.

### Task 4: Mobile Navigation Language Reachability

**Files:**
- Modify: `src/components/Navigation.tsx`
- Create: `src/components/Navigation.mobile-contract.test.mjs`

- [ ] **Step 1: Write a failing mobile menu contract**

Assert the menu uses `100dvh`, internal scrolling, overscroll containment, and safe-area bottom padding.

- [ ] **Step 2: Run and confirm RED**

Run: `npx --yes tsx --test src/components/Navigation.mobile-contract.test.mjs`

Expected: the `100dvh` and safe-area assertions fail.

- [ ] **Step 3: Implement viewport-safe scrolling**

Use `max-h-[calc(100dvh-70px)]`, keep `overflow-y-auto overscroll-contain`, and add bottom padding using `env(safe-area-inset-bottom)` so the final language remains scrollable above browser chrome.

- [ ] **Step 4: Run and confirm GREEN**

Run: `npx --yes tsx --test src/components/Navigation.mobile-contract.test.mjs`

Expected: mobile menu contract passes.

### Task 5: Shared Credit Activity Type Badges

**Files:**
- Create: `src/lib/credit-transaction-badge.ts`
- Create: `src/lib/credit-transaction-badge.test.ts`
- Modify: `src/components/CreditsPageClient.tsx`
- Modify: `src/components/Navigation.tsx`
- Create: `src/components/navigation-credit-menu.test.mjs`

- [ ] **Step 1: Write failing badge classification tests**

Cover `use`, `refund`, `grant`, `bonus`, `purchase`, and `adjustment`, including their existing green, orange, indigo, and slate classes.

- [ ] **Step 2: Run and confirm RED**

Run: `npx --yes tsx --test src/lib/credit-transaction-badge.test.ts src/components/navigation-credit-menu.test.mjs`

Expected: shared badge helper and account-menu badge assertions fail.

- [ ] **Step 3: Extract and reuse badge rules**

Move type-label normalization and class selection from `CreditsPageClient` into the shared helper. Extend the account-menu `CreditTransaction` type with `type` and `reason`, then render the badge before the function/title while preserving the model supplement.

- [ ] **Step 4: Run and confirm GREEN**

Run: `npx --yes tsx --test src/lib/credit-transaction-badge.test.ts src/components/navigation-credit-menu.test.mjs src/lib/credit-transaction-description.test.ts`

Expected: Credits page and account menu use identical badge semantics.

### Task 6: Integrated Verification and Local H5 Preview

**Files:**
- Verify only

- [ ] **Step 1: Run all touched tests**

Run the combined focused suite from Tasks 1-5. Expected: zero failures.

- [ ] **Step 2: Run TypeScript and diff checks**

Run: `npx tsc --noEmit --pretty false`

Run: `git diff --check`

Expected: both commands exit `0`.

- [ ] **Step 3: Start local main on the reserved port**

Run: `npm run dev`

Expected: Next.js serves `http://localhost:3006` and no other worktree owns port `3006`.

- [ ] **Step 4: Verify H5 behavior**

At a mobile viewport, verify `/ai-image-generator` and `/history`: the last language is reachable, History actions share one row, prompt scrolls after four lines, copy shows Success, Recreate restores settings without 404, and generation scrolls to the pending record.

- [ ] **Step 5: Report deployment dependency**

Do not publish automatically. Report that a later production release must include both GitHub/Vercel frontend changes and the matching Cloudflare production generation function because Vercel proxies `/api/image-to-image` to Cloudflare.
