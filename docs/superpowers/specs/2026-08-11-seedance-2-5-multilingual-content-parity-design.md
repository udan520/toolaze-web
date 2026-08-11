# Seedance 2.5 Multilingual Content Parity Design

## Goal

Remove the editorial 30-second planning timeline from the first Key Feature and bring every supported Seedance 2.5 locale to full content parity with the finalized English model page.

## Scope

- Keep English as the structural source of truth.
- Remove `timelineTitle` and `timeline` from the first English feature story.
- Localize the complete visible page into `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt`, and `zh-TW`.
- Cover metadata, model intro, Hero, Key Features, Seedance 2.5 versus 2.0 comparison, How To, performance settings, and FAQ.
- Preserve model names, verified numeric specifications, URLs, media paths, technical formats, and intentionally copyable prompt syntax.
- Keep the existing section order, four Key Features, four How To steps, and exactly three additive FAQ entries covering audio, 4K export, and local region editing.
- Keep every `src/data/{locale}/seedance-2-5.json` file identical to its corresponding SEO Factory content file.

## Content Architecture

The Key Features section remains a four-story editorial sequence:

1. Complete 30-second scenes.
2. Up to 50 multimodal references.
3. Motion, space, and interaction direction.
4. First and last frame control.

The first story retains its two explanatory paragraphs and real proof media, then proceeds directly to the second story. The removed timeline is not moved elsewhere because it is an editorial planning template, repeats the 30-second claim, and is not a distinct model capability.

## Localization Rules

- Translate for native landing-page fluency rather than literal sentence alignment.
- Preserve the English release thesis and the same user-decision boundaries in every locale.
- Do not expose SEO, research, implementation, provider-route, or editorial planning language.
- Keep product UI labels such as `Demo`, `History`, and `Recreate` only where they refer to the actual English interface; explain the surrounding action in the target language.
- Keep all claims within the verified English fact boundary; localization must not introduce stronger promises.

## Data Flow

For each locale, the public JSON and SEO Factory JSON contain the same finalized object. The existing page renderer continues reading the same schema, so no shared component or route change is required.

## Verification

Add or extend a focused page contract test that fails before implementation and verifies:

- No locale contains `timelineTitle` or a feature-story `timeline`.
- Every locale has the same required section structure and item counts as English.
- FAQ contains exactly the three additive audio, 4K export, and local region editing questions.
- Public and SEO Factory copies are deeply equal for every locale.
- Non-English locales do not retain the finalized English headings or full English body sentences.
- Locale metadata and visible copy still identify Seedance 2.5 consistently.

Then run the focused contract test, TypeScript checking, JSON parsing, negative wording scan, and targeted diff checking. Use the existing non-3006 preview at `http://localhost:3014/model/seedance-2-5` and localized routes for smoke verification.

## Non-Goals

- No generator behavior, model settings, pricing, navigation, sitemap, route, media, or shared-component changes.
- No new sections or additional FAQ entries.
- No Git commit, push, merge, deployment, or indexing request.
