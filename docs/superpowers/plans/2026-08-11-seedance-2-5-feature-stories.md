# Seedance 2.5 Feature Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the English Seedance 2.5 landing page around four evidence-backed, media-rich Key Feature Stories and establish reusable Toolaze rules for feature depth and heading hierarchy.

**Architecture:** Add one data-driven `ModelFeatureStories` component and a dedicated English `featureStories` content object. Replace the standalone English proof section with this component, keep other sections focused on comparison, operation, use cases, settings, and unanswered FAQ decisions, and preserve the existing generator contract. Update the SEO Factory English mirror and global/skill rules in the same change.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, JSON content, Node test runner, Playwright, Cloudflare R2

---

### Task 1: Lock the content and layout contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Add failing English feature-story assertions**

Require the English content and SEO Factory mirror to be deeply equal and assert:

```js
assert.deepEqual(publicContent.sectionsOrder, [
  'featureStories',
  'modelComparison',
  'howToUse',
  'scenes',
  'performanceMetrics',
  'faq',
])
assert.equal('seedanceProof' in publicContent, false)
assert.equal(publicContent.featureStories.title, 'Key Features of Seedance 2.5')
assert.equal(publicContent.featureStories.items.length, 4)
for (const item of publicContent.featureStories.items) {
  assert.ok(item.title.trim())
  assert.ok(item.paragraphs.length >= 2)
  assert.ok(item.paragraphs.every((paragraph) => paragraph.trim().length >= 80))
  assert.match(item.media.src, /^https:\/\/assets\.toolaze\.com\//)
  assert.ok(item.media.alt.trim())
}
```

Also assert that the visible English content rejects unsupported claims such as `native 4K`, `10-bit`, `180-second`, `region-level editing`, `faster generation`, `20%`, and `better prompt adherence`.

- [ ] **Step 2: Add failing component and rule assertions**

Require:

- `ToolL2PageContent` imports and renders `ModelFeatureStories` for `featureStories`.
- `ModelFeatureStories.tsx` exists, supports image/video media, uses `object-contain`, keeps text before media in DOM order, and uses responsive ordering classes for alternating desktop rows.
- Seedance Proof, How To, and Use Cases do not render eyebrow blocks.
- How To renders H3 before `Step N`.
- The feature-story timeline renders its heading before the time label.
- Use Cases does not render the decorative `01`–`04` sequence before card headings.
- `AGENTS.md` and `docs/UI_STYLE_GUIDE.md` contain the heading rule. Verify the external model-page skill reference separately during final validation so the repository test remains portable.

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: FAIL because `featureStories`, the shared component, the new rules, and the corrected heading order do not exist yet.

### Task 2: Capture and publish the missing real workflow media

**Files:**
- Temporary only: `/tmp/seedance-2-5-reference-video-mention.webp`
- Public output: Cloudflare R2 object under `uploads/seedance-2-5/`

- [ ] **Step 1: Capture the real generator state**

Use the current local English generator at `http://127.0.0.1:3014/model/seedance-2-5`. Upload a real short reference video in the local browser, insert its `@Video 1` mention into the editable prompt, and capture only the relevant generator region. Do not capture browser chrome, account information, credits, or unrelated controls.

- [ ] **Step 2: Compress the screenshot**

Use the bundled Sharp runtime to resize the screenshot to a maximum 1200px edge and encode WebP under 100KB without making the mention text unreadable.

- [ ] **Step 3: Upload to R2**

Use `scripts/r2_upload.py` with the existing environment configuration and a deterministic object name. Do not print credentials. Expected public URL:

```text
https://assets.toolaze.com/uploads/seedance-2-5/reference-video-mention.webp
```

If the configured uploader generates a content-addressed URL, record that returned stable URL instead.

- [ ] **Step 4: Verify the public asset**

Check HTTP 200, `image/webp`, dimensions, and a byte size under 100KB. Visually reopen it and confirm the attached video and prompt mention are readable and belong to the real Toolaze generator.

### Task 3: Build the reusable Feature Stories component

**Files:**
- Create: `src/components/blocks/ModelFeatureStories.tsx`
- Modify: `src/components/blocks/ToolL2PageContent.tsx`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Implement the shared component**

Create typed media, timeline, story, and section interfaces matching the design spec. Render:

```tsx
<section className={`${bgClass} px-6 py-20 md:py-28`}>
  <div className="mx-auto max-w-6xl">
    <header>
      <h2>...</h2>
      <p>...</p>
    </header>
    <div className="mt-16 space-y-20 md:space-y-28">
      {items.map((item, index) => (
        <article className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>...</div>
          <figure className={index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>...</figure>
        </article>
      ))}
    </div>
  </div>
</section>
```

Keep text first in source order. Use `object-contain`, `preload="none"` for feature videos, a truthful caption, and the existing light indigo/white visual language. Do not render eyebrow, icons, badges, dark panels, or generic cards.

- [ ] **Step 2: Move the timeline into the component**

Render the optional timeline after the first story media. Each timeline item renders its H4 before its time helper. Preserve the existing four planning beats and light visual treatment.

- [ ] **Step 3: Wire the section renderer**

Import `ModelFeatureStories` in `ToolL2PageContent.tsx` and add a `featureStories` renderer that passes the data object and alternating background class. Do not modify the live generator, routes, navigation, sitemap, credits, API, or history behavior.

### Task 4: Rewrite the English page and sync SEO Factory

**Files:**
- Modify: `src/data/en/seedance-2-5.json`
- Modify: `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Replace the Proof and thin feature data**

Remove `seedanceProof` and the old one-sentence `features` card object. Add `featureStories` with exactly four items:

1. `A 30-Second Window for a Complete Scene`
2. `Build One Brief from Images, Video, and Audio`
3. `Use Reference Video to Direct Motion, Space, and Camera Behavior`
4. `Choose the Control Path Before You Prompt`

Each item contains at least two distinct paragraphs following the approved evidence boundary and the real media mapping from the design spec. The first item owns the 30-second planning timeline.

- [ ] **Step 2: Reassign the remaining section responsibilities**

Rewrite the English sections so they do not duplicate the complete Key Features claims:

- Comparison keeps verified Seedance 2.5 vs 2.0 numeric and workflow choices.
- How To stays action-oriented and matches the current generator controls.
- Use Cases explain four different production tasks, inputs, and outputs.
- Settings list only current Toolaze controls and limitations.
- FAQ answers remaining access, limits, resolution, audio, control-path, and prompting questions directly.

Do not change the generator payload, pricing, route, navigation, sitemap, or non-English copy.

- [ ] **Step 3: Update the English section order**

Set:

```json
[
  "featureStories",
  "modelComparison",
  "howToUse",
  "scenes",
  "performanceMetrics",
  "faq"
]
```

- [ ] **Step 4: Sync the SEO Factory mirror**

Copy the final English public JSON structure into the existing SEO Factory English content file and verify deep equality. Do not create a second task or modify unrelated Factory dashboard/admin files.

### Task 5: Enforce the heading hierarchy and reusable content rules

**Files:**
- Modify: `src/components/blocks/Seedance25Proof.tsx`
- Modify: `src/components/blocks/Seedance25HowTo.tsx`
- Modify: `src/components/blocks/Seedance25UseCases.tsx`
- Modify: `AGENTS.md`
- Modify: `docs/UI_STYLE_GUIDE.md`
- Modify: `/Users/neva/.codex/skills/toolaze-model-seo-page/references/model-page-sections.md`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Remove labels above Seedance headings**

Remove eyebrow rendering and unused eyebrow props from the three Seedance custom components. In How To, render H3 before the step helper. In Use Cases, remove the leading decorative sequence number so the H3 is the first card information at every breakpoint.

- [ ] **Step 2: Add the project heading rule**

Add the approved rule to both `AGENTS.md` and `docs/UI_STYLE_GUIDE.md`: content headings are the first visual information in their group; eyebrow, kicker, badge, step, category, and decorative labels do not appear above them; breadcrumbs and global navigation are excluded.

- [ ] **Step 3: Expand the model-page Key Features skill reference**

Update the `Key Features` section so each feature story covers verified capability, practical outcome, usage/selection guidance, and necessary limits. Require real adjacent proof media and prefer alternating editorial rows for substantial primary features; reserve grids for secondary summaries. Retain the existing 3–5 evidence-based item guidance and anti-duplication rules.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: all focused tests pass.

### Task 6: Validate SEO, media, responsive layout, and type safety

**Files:**
- Verify all files modified above
- Read for final acceptance: `/Users/neva/.codex/skills/toolaze-model-seo-page/references/model-page-verification.md`

- [ ] **Step 1: Run TypeScript and diff checks**

Run:

```bash
npx tsc --noEmit --pretty false
git diff --check -- \
  src/components/blocks/ModelFeatureStories.tsx \
  src/components/blocks/ToolL2PageContent.tsx \
  src/components/blocks/Seedance25Proof.tsx \
  src/components/blocks/Seedance25HowTo.tsx \
  src/components/blocks/Seedance25UseCases.tsx \
  src/components/seedance-2-5-live-page-contract.test.mjs \
  src/data/en/seedance-2-5.json \
  _codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json \
  AGENTS.md docs/UI_STYLE_GUIDE.md
```

Expected: both commands exit 0.

- [ ] **Step 2: Run the visible-copy negative scan**

Scan the final English JSON and rendered English HTML for the project forbidden editorial/SEO language and unsupported promises, including `this page`, `search intent`, `keyword`, `ranking`, `SEO`, `AI Overview`, `API platform`, `provider route`, `Unlimited Free`, `Free Forever`, `No Signup`, `No Login`, and the unsupported Seedance claims listed in Task 1.

- [ ] **Step 3: Verify public media**

For each feature-story image/video/poster, check HTTP status, MIME type, and size. Confirm screenshots are WebP under 100KB, the video remains under 5MB, and every URL uses `https://assets.toolaze.com/`.

- [ ] **Step 4: Run same-site similarity checks**

Compare the English Seedance 2.5 visible text with the English Seedance 2.0 page at whole-page, headings, release-thesis, comparison, and FAQ surfaces using the repository's existing script if available; otherwise use the documented token 3-gram Jaccard method. Record excluded shared navigation/generator boilerplate and explain the remaining information gain.

- [ ] **Step 5: Inspect desktop and mobile rendering**

At 1440px and 390px verify:

- H2 and H3 headings have no labels above them.
- Feature stories alternate text/media on desktop.
- Mobile DOM and visual order is always text then media.
- Screenshots and video use contain-fit without crop.
- No dark surfaces or horizontal overflow appear.
- The page returns HTTP 200 at `http://127.0.0.1:3014/model/seedance-2-5`.

- [ ] **Step 6: Run final model-page verification**

Read and execute `model-page-verification.md`, then report the evidence boundary, information gain, media provenance, remaining unknowns, and excluded release operations.

No commit, branch, push, merge, deployment, GSC submission, or production publication is part of this plan.
