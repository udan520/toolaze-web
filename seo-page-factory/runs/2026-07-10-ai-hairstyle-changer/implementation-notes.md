# Implementation Notes

Status: implemented_for_local_preview

## Page and Data

- Added `/ai-hairstyle-changer`.
- Added localized routes for de, es, fr, it, ja, ko, pt, and zh-TW.
- Added the new slug to the explicit L2 SEO loader.
- Reused `ToolL2PageContent` and `NanoBananaTool`.

## Functional Tool

- Mode: image-to-image
- Upload limit: one image
- Base-model branding: hidden
- Preset mode: Women / Men / Custom
- Women: eleven visual hairstyle cards
- Men: eleven visual hairstyle cards
- Preset prompt: internal and hidden
- Custom: one localized hairstyle description input
- Optional template reference: `referenceImage`
- Default portrait: `/ai-hairstyle-changer/default-reference.png`
- Local preview canvas: `/ai-hairstyle-changer/hero-before-after.webp`

## Shared Component Change

`PromptPreset` now supports `image`, `group`, and optional `referenceImage`. `NanoBananaTool` supports grouped preset tabs, hides the preset Prompt input outside Custom, and can append a selected template reference image to the generation request. Image presets render as three-column square cards with visible labels and `aria-pressed`. Existing hair-color swatches retain their original four-column color-swatch rendering.

## Template Assets

- Women placeholders: `public/ai-hairstyle-changer/templates/women/*.webp`
- Men placeholders: `public/ai-hairstyle-changer/templates/men/*.webp`
- Total: 22 WebP files
- Final hairstyle template images can replace the current files without changing page data paths.

## Content Synchronization

- `localization/sync-preset-tabs.mjs` synchronizes all nine locale files.
- Removed `promptExamples` from `sectionsOrder`.
- Updated Hero, introduction, how-to, features, testimonials, FAQ, and related-tool copy for the three-Tab workflow.

## Entry Points

- AI Tools Hub first card
- Desktop AI Tools menu first item
- Mobile AI Tools menu first item
- Footer AI Tools list
- Homepage advanced AI grid
- Homepage card image registry
- Nine-language navigation and homepage copy
- Sitemap for all supported locales

## Validation

- Component and landing-page tests: 41/41 pass.
- `npx tsc --noEmit`: pass.
- Browser QA: Women 11, Men 11, Custom one input, preset prompts hidden.
- AI tool entry-point and factory validation are recorded separately.
