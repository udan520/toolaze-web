# Five-Page Indexability Rewrite Design

## Objective

Rewrite five high-value Toolaze page families to improve their usefulness, differentiation, crawl clarity, and probability of being selected for indexing. The work must not promise indexing, manipulate word count for its own sake, or expose internal SEO language in public copy.

The selected page families are:

1. `/age-filter`
2. `/photo-restoration`
3. `/watermark-remover`
4. `/text-to-image-generator`
5. `/model/seedream-5-0-pro`

Each page family covers all supported locales: `en`, `de`, `ja`, `es`, `zh-TW`, `pt`, `fr`, `ko`, and `it`.

## Success Criteria

- Each page has a distinct primary search intent and does not compete unnecessarily with a broader Toolaze page.
- The visible page answers the high-intent questions found across the mandatory competitor set: EaseMate AI, Pollo AI, OpenArt, ImagineArt, Topview, Artlist, and Krea.
- Claims are limited to verified Toolaze behavior, verified model facts, and visible proof media.
- Each How To section places one real interface screenshot between the section heading and the numbered steps.
- Each screenshot reflects the current page workflow and remains readable on desktop and mobile.
- All nine locales contain fully localized visible copy, excluding brand names, model names, technical formats, URLs, and intentionally copyable prompts.
- FAQ contains no more than six non-duplicative questions per page.
- Prompt examples contain no more than four examples per applicable page.
- Final public media uses stable R2 URLs; page-owned media is not published from local `public/` paths.
- Metadata, visible schema, headings, media, generator behavior, and page copy agree.
- Current canonical, hreflang, sitemap, route, and generator behavior remain unchanged unless a verified defect requires a narrowly scoped correction.

## Page Intent Boundaries

### Age Filter

Primary intent: transform a clear portrait into a creative younger or older appearance.

The page must explain age presets, suitable inputs, identity preservation expectations, creative-use limits, common failures, and how lighting, face visibility, hair, and pose affect results. It must not present the output as medical analysis, real age estimation, or a prediction of future appearance.

### Photo Restoration

Primary intent: repair visibly damaged or degraded personal photos.

The page must distinguish restoration, colorization, enhancement, and unsupported reconstruction claims. It must show which defects can improve, which missing details cannot be recovered reliably, how scan quality affects output, and when a dedicated editor is preferable.

### Watermark Remover

Primary intent: remove an authorized visible overlay from a still image.

The page must prove several watermark patterns with real before-and-after results, explain inpainting limitations, preserve lawful-use guidance, and remove or substantiate unverified ratings, user counts, unlimited-use, storage, speed, and privacy claims.

### Text to Image Generator

Primary intent: create a new image from text when no reference image is required.

`/ai-image-generator` remains the broad generator owner. `/text-to-image-generator` owns text-only prompting, prompt structure, model/output choices exposed by Toolaze, failure diagnosis, and the decision to switch to image-to-image when preservation matters.

### Seedream 5.0 Pro

Primary intent: understand and use Seedream 5.0 Pro on Toolaze, if the model is genuinely supported.

The page must not say `Coming Soon`, describe the model as upcoming, or route a Pro promise into Seedream 5.0 Lite. Before rewriting, implementation must verify whether Toolaze actually supports Pro:

- If supported, connect the copy and proof to the real Pro workflow without changing generator behavior outside the existing supported contract.
- If unsupported, do not present the page as a usable Pro generator. The implementation must stop and report the product decision required before exposing the page as an indexable generator surface.

All model capability claims require official evidence and a matching Toolaze proof surface.

## Competitor Research Design

Before drafting each page, inspect the closest relevant public page from each mandatory competitor. Record for every competitor:

- Checked date, query, URL, page type, and relevance.
- Hero promise and access conditions.
- Section order and content breadth.
- Workflow proof and screenshot treatment.
- Examples, use cases, limitations, comparison fields, and FAQ topics.
- Specific high-intent questions the Toolaze page currently misses.
- Claims that cannot be transferred to Toolaze.

Competitor pages are discovery and benchmarking inputs only. They cannot establish Toolaze capabilities, limits, price, privacy, free access, quality, speed, copyright, or model specifications.

For Seedream 5.0 Pro, additionally build the required release thesis, competitor feature extraction, and official feature evidence records before writing Key Features.

## Shared Page Architecture

The pages use a common decision sequence without forcing identical sections or copy:

1. Hero with a concrete task and output.
2. Real generator.
3. Definition or model-specific positioning.
4. Evidence-backed Key Features.
5. Real results, before-and-after proof, or model-specific proof.
6. How To heading.
7. One real workflow screenshot.
8. Three numbered steps.
9. Input guidance and failure recovery.
10. Use cases, selection guidance, or comparison when it adds a new answer.
11. Up to four examples when the page has a real prompt field or supported example workflow.
12. Up to six remaining high-intent FAQ entries.
13. Related Tools or Related Models.

Sections are retained only when they answer a distinct user decision. The implementation must not add repetitive capability summaries, generic testimonials, fake ratings, or standalone specifications that duplicate Key Features.

## How To Screenshot Design

Each page receives one real screenshot of its current generator workflow. The screenshot sits after the How To heading and introductory sentence, and before step 1.

Required composition:

- Show the relevant input area, page-specific mode or preset when applicable, and the Generate action.
- Avoid browser chrome, personal account data, history records, credit balances, or unrelated navigation.
- Use a consistent wide composition that remains understandable when scaled on mobile.
- Use an annotated composite only when one raw screenshot cannot show the necessary workflow state; annotations must be minimal and localized text must not be baked into the image.
- Alt text and surrounding captions are localized in page data.
- Screenshot files are compressed below 100 KB where legibility permits, uploaded to R2, and referenced through stable public URLs.

The screenshot must not replace numbered instructions. It visually grounds the same three-step workflow described below it.

## Page-Specific Proof Media

- Age Filter: before-and-after age transformations using adult subjects, with identity and framing preserved.
- Photo Restoration: before-and-after examples for scratches/fading, low contrast, and optional colorization where supported.
- Watermark Remover: before-and-after examples for a corner overlay, repeated translucent overlay, and date or text overlay. Only authorized synthetic examples may be used.
- Text to Image Generator: varied final outputs tied to visible prompt examples; no reference-image workflow in the primary proof.
- Seedream 5.0 Pro: actual Pro outputs tied to verified model-specific capabilities. Lite results cannot be presented as Pro proof.

All new permanent media must be uploaded to R2 and mapped to its adjacent claim. Existing local page-owned media may be retained only as temporary processing input and must not remain the final published reference.

## Localization Design

English copy is the semantic source, but every locale receives a natural localized version rather than a literal field-by-field translation. Each locale must preserve:

- The same factual claims and access conditions.
- The same section purpose and information coverage.
- Locale-aware internal links without an `/en` prefix for English.
- Localized screenshot alt text, captions, headings, steps, FAQ, metadata, and visible schema source copy.
- Intentional English only for model and brand names, technical formats, URLs, and copyable prompts.

Automated scans must detect accidental English residue in non-English visible fields and internal SEO or editorial wording across both `src/data` or copy modules and SEO Factory content.

## SEO Factory Records

After research and draft validation, create one traceable SEO Factory task per page family before syncing any official page content. Each task must include:

- `taskId`, `slug`, page type, locale coverage, and `status: ready_for_publish` at the point it becomes the source for official page content.
- Competitor research and intent boundaries.
- Source and claim records.
- Final content for all nine locales.
- Media requirements and final R2 mappings.

The ready queue must point to the corresponding tasks without overwriting unrelated user work.

## Technical Scope

Allowed implementation scope:

- Existing page copy modules and locale JSON.
- Existing section rendering needed to insert the How To screenshot in the approved position.
- Focused reusable screenshot support when the same content contract applies to several selected pages.
- SEO Factory task and content records.
- Page-specific content and media contract tests.

Excluded unless a verified blocker is found and reported:

- Generator API behavior, provider routing, credits, auth, history, or Recreate.
- Global navigation redesign.
- New routes or URL changes.
- Production deployment, GSC submission, git commit, or push.

## Verification Design

For every selected page and locale:

- Confirm HTTP/rendering locally at the required main preview port `3006`.
- Confirm one H1, valid heading order, self-canonical, expected hreflang, indexable robots, and sitemap presence.
- Confirm the How To screenshot is between the heading/intro and numbered steps in rendered HTML.
- Confirm the screenshot URL is reachable, is an R2 URL, and its compressed asset meets the intended size threshold.
- Confirm three numbered steps and localized alt text.
- Scan visible copy for internal SEO/editorial phrases and unsupported free, unlimited, login, speed, privacy, rating, and user-count claims.
- Confirm FAQ count is at most six and examples count is at most four.
- Confirm metadata and visible schema match rendered content.
- Confirm non-English locales do not reuse English visible body copy outside the whitelist.
- Run same-site similarity checks against the nearest Toolaze intent owner and sibling pages.
- Run targeted page/content tests and a local route smoke. A full build is reserved for final release review or when shared type/rendering changes make it necessary.

## Delivery And Release

The implementation handoff must include:

- The five completed page families across nine locales.
- Stable R2 screenshot and proof-media URLs.
- Competitor and official-evidence summaries.
- SEO Factory records.
- Targeted verification output and any unresolved product blockers.
- Local preview URLs on `http://localhost:3006`.

After all content, media, sitemap, route, localization, and build checks pass, commit only the approved files from the current local `main`, confirm local `main` is aligned with or linearly ahead of `origin/main`, push `origin main`, and verify the Vercel production deployment on `https://toolaze.com`. GSC indexing submission remains outside this scope unless requested separately.
