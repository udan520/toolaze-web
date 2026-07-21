# AI Video Prompt Template Videos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AI Video Generator history cards 260px and column-aligned, then attach the four newly generated prompt-template videos from R2 to their matching prompt cards.

**Architecture:** Keep the history change local to `AiVideoGeneratorTool`. Extend the shared `PromptExamples` data contract with an optional `video` field so existing image-based pages remain unchanged. Store source provenance in `_codex/ai-video-generator-assets/` and use stable R2 URLs in the English AI Video Generator page data.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Node test runner, Cloudflare R2/S3 API.

---

### Task 1: Lock the History and Prompt Media Contracts

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.layout.test.ts`
- Modify: `src/components/AiVideoGeneratorTool.shared-contract.test.mjs`

- [ ] **Step 1: Write the failing history-height assertion**

Change the expected history media contract from `220px` to `260px`, require the grid row and right detail column to use the same desktop height, and require actions to use `mt-auto`.

```ts
assert.match(source, /lg:h-\[260px\]/)
assert.match(source, /className="h-full max-h-\[260px\] max-w-full object-contain"/)
assert.match(source, /data-video-result-actions className="mt-auto/)
```

- [ ] **Step 2: Write the failing prompt-video assertions**

Require every AI Video Generator prompt example to have an R2-hosted MP4 and require the shared component to render optional videos.

```js
assert.ok(pageData.promptExamples.items.every((item) => /^https:\/\/pub-.*\.r2\.dev\/.+\.mp4$/.test(item.video)))
assert.match(promptExamplesSource, /video\?: string/)
assert.match(promptExamplesSource, /<video/)
```

- [ ] **Step 3: Run the targeted tests and confirm RED**

Run:

```bash
npx tsx --test src/components/AiVideoGeneratorTool.layout.test.ts src/components/AiVideoGeneratorTool.shared-contract.test.mjs
```

Expected: failures for the missing 260px layout, missing `video` data, and missing shared video renderer.

### Task 2: Preserve and Upload the Four Generated Videos

**Files:**
- Create: `_codex/ai-video-generator-assets/prompt-template-videos.source.json`
- Temporary downloads: `/private/tmp/toolaze-ai-video-prompt-templates/*.mp4`

- [ ] **Step 1: Download the exact history outputs**

Download the four URLs returned by `http://localhost:3012/api/history?limit=100` into a temporary directory using stable slugs: `social-short`, `product-ad`, `image-guided-motion`, and `storyboard-scene`.

- [ ] **Step 2: Inspect each video**

Use `ffprobe` to record codec, dimensions, duration, and file size. Reject empty, non-video, or unreadable files.

- [ ] **Step 3: Upload with deterministic R2 object names**

Upload to:

```text
uploads/ai-video-generator/prompt-templates/social-short.mp4
uploads/ai-video-generator/prompt-templates/product-ad.mp4
uploads/ai-video-generator/prompt-templates/image-guided-motion.mp4
uploads/ai-video-generator/prompt-templates/storyboard-scene.mp4
```

Set `Content-Type: video/mp4` and keep credentials only in environment variables.

- [ ] **Step 4: Record source provenance**

Write a JSON manifest containing title, page prompt, history prompt, history item ID, original output URL, R2 object key, public R2 URL, dimensions, duration, and byte size. Do not include credentials.

- [ ] **Step 5: Verify remote media**

Use HTTP requests to confirm all four R2 URLs return success and `video/mp4`.

### Task 3: Implement the Shared Prompt Video Renderer

**Files:**
- Modify: `src/components/blocks/PromptExamples.tsx`
- Modify: `src/components/blocks/ToolL2PageContent.tsx`
- Modify: `src/data/en/ai-video-generator.json`

- [ ] **Step 1: Add the optional video field**

```ts
interface PromptExampleItem {
  title: string
  prompt: string
  image?: string
  video?: string
}
```

Propagate the field through the two page-content item type declarations.

- [ ] **Step 2: Render video before image and placeholder**

```tsx
{item.video ? (
  <div className="flex h-[360px] items-center justify-center bg-slate-100 lg:h-[420px]">
    <video
      src={item.video}
      aria-label={`${item.title} example video`}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="h-full max-w-full object-contain"
    />
  </div>
) : item.image ? (
  // existing image renderer
) : (
  // existing placeholder renderer
)}
```

Keep the four-column grid and existing image/placeholder behavior unchanged.

- [ ] **Step 3: Add the four R2 URLs to page data**

Add each verified public URL to the matching prompt item by title.

- [ ] **Step 4: Run the targeted tests and confirm GREEN**

Run the Task 1 test command and expect all tests to pass.

### Task 4: Implement the 260px History Alignment

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.tsx`

- [ ] **Step 1: Give completed history rows one shared desktop height**

Add `lg:h-[260px]` to completed history items while keeping mobile rows content-driven.

- [ ] **Step 2: Stretch both columns and anchor the actions**

Make the media panel and detail column `h-full`; make the detail column `flex flex-col`; keep metadata and prompt at the top; set actions to `mt-auto`.

- [ ] **Step 3: Increase the media limit without restoring black backing or rounding**

```tsx
<video className="h-full max-h-[260px] max-w-full object-contain" />
```

- [ ] **Step 4: Run the targeted tests and confirm GREEN**

Run the Task 1 test command and expect all tests to pass.

### Task 5: Verify the Complete Change

**Files:**
- Verify only; no new production files.

- [ ] **Step 1: Run TypeScript validation**

```bash
npx tsc --noEmit
```

- [ ] **Step 2: Run relevant component and API tests**

Run the AI video layout/shared-contract tests plus the existing generation-history/API tests touched earlier in this worktree.

- [ ] **Step 3: Check formatting and asset references**

Run `git diff --check`, distinguish known unrelated `Footer.tsx` whitespace from new issues, and verify every new R2 URL is reachable.

- [ ] **Step 4: Inspect the scoped diff**

Confirm no navigation, sitemap, credits, generation request, or unrelated locale behavior changed.

- [ ] **Step 5: Do not commit or deploy**

Per project instructions, leave the verified worktree changes uncommitted until the user explicitly requests a commit, merge, push, or release.
