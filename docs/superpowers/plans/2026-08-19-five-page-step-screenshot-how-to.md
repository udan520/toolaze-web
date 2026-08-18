# Five-Page Step Screenshot How To Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five pages' section-level How To screenshot with 19 real, screenshot-first instructional cards, preserve all nine locales, and publish the verified result to Toolaze production.

**Architecture:** Add one `HowToStepCards` presentation component that owns the responsive card layout. Each page family keeps its existing copy source and normalizes its step data into the shared component; every visible step owns exactly one localized media record pointing to a stable R2 WebP asset.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, Node test runner, Toolaze R2 upload script, Vercel production.

---

## File Map

**Create**

- `src/components/blocks/HowToStepCards.tsx` — shared screenshot-first step card renderer.
- `docs/superpowers/specs/2026-08-19-five-page-step-screenshot-how-to-design.md` — approved design record (already committed).
- `docs/superpowers/plans/2026-08-19-five-page-step-screenshot-how-to.md` — this implementation plan.
- `outputs/five-page-how-to-steps/{slug}-step-{n}.webp` — temporary local capture outputs; never commit.

**Modify**

- `src/components/five-page-how-to-screenshot.contract.test.mjs` — replace the obsolete section-level assertions with per-step media assertions.
- `src/components/blocks/HowToUse.tsx` — normalize tool-page steps and delegate layout to `HowToStepCards`.
- `src/components/blocks/ToolL2PageContent.tsx` — remove the obsolete section-level screenshot prop.
- `src/components/AiImageGeneratorPageContent.tsx` — normalize text-to-image steps into shared cards.
- `src/components/Seedream50ProLandingPage.tsx` — normalize Seedream steps into shared cards.
- `src/app/ai-image-generator/copy.ts` — replace the How To section screenshot type with per-step media support.
- `src/app/text-to-image-generator/copy.ts` — attach five step assets and localized alt text.
- `src/lib/seedream-5-0-pro-landing-copy.ts` — give five Seedream steps localized titles, text, and media.
- `src/data/{locale}/{age-filter,photo-restoration,watermark-remover}.json` — remove `howToUse.screenshot` and add `media` to every step for all nine locales.
- `_codex/landing-page-assets/five-page-how-to-screenshots.json` — replace five workflow entries with 19 step entries and their dimensions/bytes/status.
- `_codex/seo-pipeline/tasks/2026-08-14-age-filter/task.json` and four 2026-08-19 rewrite task records — reference the corrected media manifest state.

**Delete after all imports are removed**

- `src/components/blocks/HowToScreenshot.tsx` — obsolete section-level screenshot renderer.

## Task 1: Write the Regression Contract First

**Files:**

- Modify: `src/components/five-page-how-to-screenshot.contract.test.mjs`
- Test: `src/components/five-page-how-to-screenshot.contract.test.mjs`

- [ ] **Step 1: Replace section-level assertions with screenshot-first card assertions**

Use source-contract checks that require the shared component and reject the old renderer:

```js
test('shared How To cards render one screenshot before each step title', () => {
  const source = read('src/components/blocks/HowToStepCards.tsx')
  assert.match(source, /steps\.map/)
  assert.ok(source.indexOf('<img') < source.indexOf('<h3'))
  assert.ok(source.indexOf('<h3') < source.indexOf('stepLabel'))
})

test('five page renderers no longer use one section-level screenshot', () => {
  const sources = [
    read('src/components/blocks/HowToUse.tsx'),
    read('src/components/AiImageGeneratorPageContent.tsx'),
    read('src/components/Seedream50ProLandingPage.tsx'),
  ].join('\n')
  assert.doesNotMatch(sources, /HowToScreenshot/)
  assert.match(sources, /HowToStepCards/)
})
```

Add data checks for exact counts `3 + 3 + 3 + 5 + 5 = 19`, stable `/how-to/step-{n}.webp` URLs, localized non-empty alt text, and the absence of `howToUse.screenshot` in the 27 JSON pages.

- [ ] **Step 2: Run the test and confirm the intended RED state**

Run:

```bash
node --test src/components/five-page-how-to-screenshot.contract.test.mjs
```

Expected: FAIL because `HowToStepCards.tsx` does not exist and current pages still import `HowToScreenshot`.

- [ ] **Step 3: Commit the failing contract with the plan**

```bash
git add docs/superpowers/plans/2026-08-19-five-page-step-screenshot-how-to.md \
  src/components/five-page-how-to-screenshot.contract.test.mjs
git commit -m "test: require per-step how-to screenshots"
```

## Task 2: Add the Shared Screenshot-First Card Renderer

**Files:**

- Create: `src/components/blocks/HowToStepCards.tsx`
- Modify: `src/components/blocks/HowToUse.tsx`
- Modify: `src/components/blocks/ToolL2PageContent.tsx`
- Delete: `src/components/blocks/HowToScreenshot.tsx`
- Test: `src/components/five-page-how-to-screenshot.contract.test.mjs`

- [ ] **Step 1: Implement the normalized shared type and renderer**

Create:

```tsx
export type HowToStepCardData = {
  title: string
  description?: string
  media: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export default function HowToStepCards({
  steps,
  stepLabel = 'Step',
}: {
  steps: HowToStepCardData[]
  stepLabel?: string
}) {
  const columns = steps.length >= 5
    ? 'xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2'
    : 'lg:grid-cols-3 md:grid-cols-2'

  return (
    <div className={`grid grid-cols-1 gap-6 ${columns}`}>
      {steps.map((step, index) => (
        <article key={`${step.title}-${index}`} className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white">
          <div className="border-b border-indigo-100 bg-indigo-50 p-3">
            <img
              src={step.media.src}
              alt={step.media.alt}
              width={step.media.width || 1200}
              height={step.media.height || 750}
              className="aspect-[8/5] w-full rounded-[1.25rem] bg-white object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-7 text-left">
            <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              {stepLabel} {index + 1}
            </p>
            {step.description && <p className="mt-5 leading-7 text-slate-600">{step.description}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Make `HowToUse` normalize `title`/`desc`/`media` and delegate**

Remove the `screenshot` prop and the number-circle layout. Keep the section `h2` first, then render:

```tsx
<HowToStepCards
  steps={steps.filter((step): step is Step => typeof step === 'object' && Boolean(step.media)).map((step) => ({
    title: step.title,
    description: step.desc,
    media: step.media!,
  }))}
/>
```

Because the affected tool pages all use object steps, no string fallback is needed for this release path. Preserve a text-only fallback for unrelated callers if `media` is absent.

- [ ] **Step 3: Remove the `screenshot` prop from `ToolL2PageContent` and delete the obsolete component**

Remove:

```tsx
screenshot={content.howToUse?.screenshot}
```

Delete `src/components/blocks/HowToScreenshot.tsx` only after `rg -n "HowToScreenshot" src` returns no production imports.

- [ ] **Step 4: Run the component contract**

```bash
node --test src/components/five-page-how-to-screenshot.contract.test.mjs
```

Expected: the structural tests pass; asset-count tests may remain RED until Tasks 3–5.

## Task 3: Capture, Crop, Compress, and Upload 19 Real UI Screenshots

**Files:**

- Create temporarily: `outputs/five-page-how-to-steps/*.png`
- Create temporarily: `outputs/five-page-how-to-steps/*.webp`
- Modify: `_codex/landing-page-assets/five-page-how-to-screenshots.json`

- [ ] **Step 1: Capture real Toolaze UI states**

Use the in-app browser against the local release candidate or production UI. Capture these states without spending generation credits:

- Age Filter: upload panel; life-stage presets; preview/result panel.
- Photo Restoration: upload panel; Generate control and built-in workflow; result/download panel.
- Watermark Remover: upload panel; Generate control; before/after or result/download panel.
- Text to Image: prompt field; result review area; revised prompt/settings; variation/history area; image-reference workflow.
- Seedream 5.0 Pro: model/mode selector; prompt field; aspect ratio/resolution; reference/requirements area; result/history area.

Use existing account history for result panels when available. Do not trigger a paid generation solely to create documentation screenshots.

- [ ] **Step 2: Normalize every crop to a card-friendly frame**

Use `sips` to resize source crops to a maximum width of 1200, then encode WebP with the existing image dependency or `cwebp`:

```bash
cwebp -quiet -q 78 -resize 1200 0 \
  outputs/five-page-how-to-steps/age-filter-step-1.png \
  -o outputs/five-page-how-to-steps/age-filter-step-1.webp
```

Repeat for every `{slug}-step-{n}` file. Confirm each asset is readable and under 100 KB with:

```bash
find outputs/five-page-how-to-steps -name '*.webp' -size +100k -print
```

Expected: no output.

- [ ] **Step 3: Upload exact stable R2 keys with correct metadata**

For every asset, call the provided uploader with:

```python
upload_and_get_url(
    local_path,
    f"landing-pages/{slug}/how-to/step-{index}.webp",
    content_type="image/webp",
)
```

The five key prefixes are `age-filter`, `photo-restoration`, `watermark-remover`, `text-to-image-generator`, and `seedream-5-0-pro`.

- [ ] **Step 4: Verify all 19 public assets**

For each URL, require:

```text
HTTP 200
Content-Type: image/webp
Non-zero size under 100 KB
```

Open representative assets with `view_image` to confirm the UI is legible, centered, and corresponds to the adjacent step.

- [ ] **Step 5: Replace the media manifest entries**

Write 19 entries to `_codex/landing-page-assets/five-page-how-to-screenshots.json`, including slug, step, local source, stable R2 URL, bytes, width, height, and `uploaded-and-verified` status. Remove the obsolete five `workflow.webp` manifest entries.

## Task 4: Add Per-Step Media to the Three JSON Tool Pages

**Files:**

- Modify: `src/data/{en,de,ja,es,zh-TW,pt,fr,ko,it}/age-filter.json`
- Modify: `src/data/{en,de,ja,es,zh-TW,pt,fr,ko,it}/photo-restoration.json`
- Modify: `src/data/{en,de,ja,es,zh-TW,pt,fr,ko,it}/watermark-remover.json`
- Test: `src/components/five-page-how-to-screenshot.contract.test.mjs`

- [ ] **Step 1: Remove the shared `howToUse.screenshot` object from all 27 files**

Do not change the section title or existing step copy.

- [ ] **Step 2: Add one localized media object to each step**

English example:

```json
{
  "title": "Upload a clear portrait",
  "desc": "Choose one well-lit, front-facing portrait...",
  "media": {
    "src": "https://assets.toolaze.com/landing-pages/age-filter/how-to/step-1.webp",
    "alt": "Toolaze Age Filter upload panel for adding a clear portrait",
    "width": 1200,
    "height": 750
  }
}
```

Translate only `alt`; URL and dimensions remain identical across locales.

- [ ] **Step 3: Run JSON and contract validation**

```bash
node --test \
  src/components/age-filter-page-contract.test.mjs \
  src/components/five-page-how-to-screenshot.contract.test.mjs \
  src/components/five-page-indexability-content.test.mjs
```

Expected: all JSON page checks pass; text-to-image/Seedream asset checks may remain RED until Task 5.

## Task 5: Normalize Text-to-Image and Seedream Steps

**Files:**

- Modify: `src/app/ai-image-generator/copy.ts`
- Modify: `src/app/text-to-image-generator/copy.ts`
- Modify: `src/components/AiImageGeneratorPageContent.tsx`
- Modify: `src/lib/seedream-5-0-pro-landing-copy.ts`
- Modify: `src/components/Seedream50ProLandingPage.tsx`
- Test: `src/components/five-page-how-to-screenshot.contract.test.mjs`

- [ ] **Step 1: Add step media to the text-to-image copy type**

Change each How To step to:

```ts
{
  title: string
  text: string
  media: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}
```

Remove the section-level `screenshot` type and data.

- [ ] **Step 2: Add five localized media alts to every text-to-image locale**

Map stable assets `step-1.webp` through `step-5.webp` in the same order as the visible steps. Preserve all existing localized titles and text.

- [ ] **Step 3: Render text-to-image through the shared component**

Replace both duplicate How To card renderers in `AiImageGeneratorPageContent.tsx` with:

```tsx
<HowToStepCards
  stepLabel={copy.howTo.stepLabel}
  steps={copy.howTo.steps.map((step) => ({
    title: step.title,
    description: step.text,
    media: step.media,
  }))}
/>
```

- [ ] **Step 4: Convert Seedream strings into five localized step objects**

Use the exact shape:

```ts
{
  title: string
  text: string
  media: {
    src: string
    alt: string
    width: 1200
    height: 750
  }
}
```

English titles are:

1. `Open Seedream 5.0 Pro`
2. `Write for the final image`
3. `Set format and resolution`
4. `Add concrete visual constraints`
5. `Generate, review, and refine`

Provide equivalent localized titles and alts for the other eight locales.

- [ ] **Step 5: Update Seedream schema and renderer**

Schema uses `step.text`; the visible section normalizes `title`, `text`, and `media` into `HowToStepCards`.

- [ ] **Step 6: Run the full five-page contract**

```bash
node --test \
  src/components/age-filter-page-contract.test.mjs \
  src/components/five-page-how-to-screenshot.contract.test.mjs \
  src/components/five-page-indexability-content.test.mjs
```

Expected: all tests pass with 19 unique step assets and no section-level screenshot references.

- [ ] **Step 7: Commit the implementation and media records**

Stage only the shared components, five-page copy/data files, focused tests, asset manifest, and SEO Factory task record adjustments. Do not stage `AGENTS.md`, `outputs/`, media-library work, or unrelated untracked files.

```bash
git commit -m "fix(seo): show a screenshot for every how-to step"
```

## Task 6: Isolated Release Verification

**Files:**

- Verify the exact staged/committed release candidate only.

- [ ] **Step 1: Run focused tests and model contract**

```bash
node --test \
  src/components/age-filter-page-contract.test.mjs \
  src/components/five-page-how-to-screenshot.contract.test.mjs \
  src/components/five-page-indexability-content.test.mjs
npm run check:generation-contract
```

- [ ] **Step 2: Run clean TypeScript and production build**

Use an isolated clean candidate matching the exact intended commit so unrelated user-owned untracked files cannot affect results:

```bash
npx tsc --noEmit
npm run build
```

- [ ] **Step 3: Start the isolated candidate on a non-3006 port**

Use port `3091` if free; otherwise select another non-3006 port. Never use `3006` outside the main workspace.

- [ ] **Step 4: Smoke all 45 routes**

For all five page paths across `en`, `de`, `ja`, `es`, `zh-TW`, `pt`, `fr`, `ko`, and `it`, require:

- HTTP 200.
- Expected canonical.
- `<meta name="robots" content="index, follow">`.
- Exactly 3/3/3/5/5 step image URLs.
- No obsolete `/how-to/workflow.webp` in visible HTML.

- [ ] **Step 5: Confirm sitemap membership is unchanged**

Require all 45 URLs to remain present in `/sitemap.xml`; do not create or remove sitemap entries.

## Task 7: Publish Main and Verify Production

**Files:**

- Release local `main` commit only; do not include unrelated working-tree state.

- [ ] **Step 1: Verify release alignment**

```bash
git fetch origin main
git rev-list --left-right --count origin/main...HEAD
git status -sb
```

Expected: local `main` is aligned with or linearly ahead of `origin/main`, never behind or diverged.

- [ ] **Step 2: Push local main**

```bash
git push origin main
```

This triggers the Vercel production deployment for `toolaze.com`.

- [ ] **Step 3: Verify production content**

After deployment, require the five English pages to contain all 19 stable step asset URLs collectively, and run HTTP status checks for all 45 localized routes.

- [ ] **Step 4: Verify production sitemap and assets**

Confirm all 45 sitemap URLs remain present and each of the 19 R2 images returns `200 image/webp`.

- [ ] **Step 5: Report exclusions**

State that unrelated local `AGENTS.md`, admin media-library files, previews, outputs, and other user-owned changes were preserved and excluded from the release.
