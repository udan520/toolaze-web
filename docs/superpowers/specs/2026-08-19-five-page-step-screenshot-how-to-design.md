# Five-Page Step Screenshot How To Design

**Date:** 2026-08-19
**Status:** Approved

## Context

The five rewritten landing-page families currently render one section-level workflow screenshot between the How To heading and the numbered steps. That does not match the intended instructional pattern. Each numbered step must have its own screenshot showing the exact Toolaze interface area used in that step.

Affected canonical page families:

- `/age-filter`
- `/photo-restoration`
- `/watermark-remover`
- `/text-to-image-generator`
- `/model/seedream-5-0-pro`

The same structure must work for English and the eight localized routes: `de`, `ja`, `es`, `zh-TW`, `pt`, `fr`, `ko`, and `it`.

## Root Cause

The previous implementation introduced a section-level `screenshot` field and rendered `HowToScreenshot` before `steps.map`. Although `HowToUse` already allowed optional `step.media`, the new assets were not attached to individual steps, and the existing step layout placed the number before any optional media rather than using a screenshot-first card.

## Approved Experience

Each How To section uses a responsive grid of instructional cards. Every card contains, in order:

1. A real Toolaze UI screenshot for that step.
2. The step title.
3. A visible `STEP N` label.
4. The localized explanation.

The section heading remains the first visual information in the block. An optional section description may follow the heading, but no shared workflow screenshot appears above the cards.

### Layout

- Three-step tool pages use three columns on large screens.
- Five-step image/model pages may use five columns on extra-wide screens and wrap at narrower breakpoints.
- Tablet layouts use two or three columns according to available width.
- Mobile layouts stack one card per row.
- Cards use equal visual treatment, screenshot-first hierarchy, light indigo borders, rounded corners, and content-aligned text.
- Screenshot containers use `object-contain`; UI content must never be cropped or stretched by CSS.

## Shared Component Boundary

Introduce one shared step-card renderer used by all five page families. The component accepts normalized steps with:

```ts
type HowToStepCardData = {
  title: string
  description?: string
  media: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}
```

The existing tool-page `HowToUse` component normalizes its `title`/`desc` step shape into the shared renderer. Text-to-image and Seedream normalize their existing `title`/`text` and string step shapes before rendering the same component. This keeps page-specific copy ownership while giving the layout one implementation owner.

The obsolete section-level `HowToScreenshot` rendering and `screenshot` copy fields are removed from the five affected families after all step media is connected.

## Asset Plan

Create 19 screenshots:

- Age Filter: 3
- Photo Restoration: 3
- Watermark Remover: 3
- Text to Image Generator: 5
- Seedream 5.0 Pro: 5

Each screenshot must:

- Show a real Toolaze production or locally built generator UI state.
- Visually correspond to its adjacent step.
- Use a stable R2 URL under `landing-pages/{slug}/how-to/step-{n}.webp`.
- Be WebP with correct `image/webp` metadata.
- Stay below 100 KB when practical without making labels unreadable.
- Use a consistent card-friendly aspect ratio and safe padding.

The same screenshot may be reused across locales because it documents the shared product interface. Alt text remains localized through each locale's step data.

## Data Changes

- Add `media` to every How To step in all nine locale JSON files for Age Filter, Photo Restoration, and Watermark Remover.
- Add localized step media alt text to the text-to-image copy resolver for all nine locales.
- Add localized step media alt text to the Seedream 5.0 Pro copy resolver for all nine locales.
- Keep the existing number and meaning of steps: 3/3/3/5/5.
- Keep current HowTo structured-data step names and descriptions; media is a presentation enhancement and does not create hidden steps.

## Accessibility and SEO

- Every screenshot has meaningful localized alt text describing the visible control or result state.
- Images use explicit width and height, lazy loading, and async decoding.
- Card headings remain semantic `h3` elements below the section `h2`.
- The visible step order and HowTo structured-data order must remain identical.
- Canonical, hreflang, routes, generator requests, credits, history, and sitemap URL membership are unchanged.

## Verification

### Contract tests

- A failing regression test first proves that section-level screenshots still exist and step media is missing.
- Every affected page resolves exactly one R2 screenshot per visible step.
- The shared renderer places media before title, `STEP N`, and description.
- All 19 URLs use the stable R2 step path and return `200 image/webp`.
- Every locale has the same step count and no missing localized alt text.

### Release checks

- Targeted component/content tests pass.
- Generation contract remains unchanged and passes.
- TypeScript and production build pass in an isolated clean candidate.
- All 45 localized routes return 200, `index, follow`, the expected canonical, and the correct count of step screenshots.
- Production smoke repeats the five English content checks and all 45 route status checks after deployment.

## Non-Goals

- No new page, route, navigation item, or sitemap URL.
- No changes to generator inputs, API payloads, credits, history, or Recreate.
- No rewrite of the already approved page copy beyond any small step-label normalization needed by the shared component.
- No generated mock UI or decorative concept imagery.
