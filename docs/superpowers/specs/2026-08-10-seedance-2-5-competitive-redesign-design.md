# Seedance 2.5 Competitive Landing Page Redesign

## Goal

Refactor the English Seedance 2.5 landing page so it competes on visible proof, workflow clarity, and model-selection value instead of generic feature cards.

## References and design thesis

- Borrow Krea's result-first order, real examples, compact technical metrics, and clear prompt-to-output progression.
- Borrow OpenArt's real workflow screenshots and its translation of technical capabilities into complete-scene production decisions.
- Keep Toolaze's working generator as the primary conversion surface.
- Do not copy competitor language or claim Toolaze access to 4K, region editing, 180-second beta generation, near-real-time speed, or a 20% prompt-adherence improvement.

The visual voice is proof-led, cinematic, and precise. The page stays within Toolaze's Soft Smart Tech system but replaces repetitive icon cards with real media, large quantitative facts, visible reference roles, and structured decision content.

## Page order

1. Live Seedance 2.5 generator
2. `seedanceProof`: real result video, four current facts, and a 30-second scene-planning timeline
3. `modelComparison`: verified Seedance 2.0 vs 2.5 decision table
4. `howToUse`: three real Toolaze workflow captures plus the real result video in four steps
5. `scenes`: four numbered workflows that specifically benefit from longer or reference-heavy generation
6. `performanceMetrics`: current Toolaze controls immediately before FAQ
7. `faq`

The old `modelIntro` and generic `features` sections leave the English render order.

## Media plan

- Reuse the existing stable Seedance demo video and WebP poster already served from Toolaze R2. Its known duration remains 5.042 seconds; it must not be labeled as a 30-second result.
- Capture three screenshots from the actual English Toolaze Seedance 2.5 generator at `/model/seedance-2-5`:
  1. mode and model selection;
  2. multimodal uploads and prompt referencing;
  3. output settings and Generate action.
- Capture from a clean signed-out browser without browser chrome, translation UI, account information, or private history.
- Compress each screenshot to WebP under 100 KB, upload to stable Toolaze R2 URLs, and provide descriptive alt text.
- Keep the visible step title and explanation in HTML; screenshots supplement rather than replace crawlable text.

## Component architecture

- Add `Seedance25Proof.tsx` for the real video, metrics, and scene timeline.
- Add `Seedance25HowTo.tsx` for four sequential screenshot/video workflow steps.
- Add `Seedance25UseCases.tsx` for numbered model-specific workflow rows.
- Register new `seedanceProof` renderer and Seedance-specific `howToUse` / `scenes` render paths in `ToolL2PageContent.tsx`.
- Render these only when the English Seedance 2.5 JSON includes the new section data. Other locales keep their current generic sections until localized later.

## Content constraints

- Preserve the approved factual thesis: 4–15 seconds to up to 30 seconds; 9 images + 3 videos + 3 audio clips to as many as 50 inputs; stronger emphasis on reference-led direction.
- Toolaze current controls remain 4–30 seconds, 480p/720p, 30 images, 10 videos, 10 audio clips, separate first/last-frame and multimodal paths, optional native audio, MP4/MOV.
- Exactly four use cases.
- No prompt-example gallery until four matching, verified result videos are available.
- English public JSON and the SEO Factory English artifact must remain equivalent.

## Accessibility and performance

- Semantic headings and ordered step labels.
- Native video controls with `preload="none"` below the fold and a poster.
- Descriptive alt text and explicit image dimensions.
- No autoplay dependency, hover-only meaning, gradient text, or animation required to understand content.
- Respect reduced motion and keep screenshots under 100 KB.
