# AI Video Generator Localization Design

## Scope

Localize the existing AI Video Generator page from English into German, Japanese, Spanish, Traditional Chinese, Portuguese, French, Korean, and Italian.

## Content contract

- Translate every user-visible string in the page JSON, including metadata, hero copy, model guidance, troubleshooting, how-to steps, prompt-example titles and prompts, video descriptions, use cases, related-tool copy, and FAQ.
- Preserve brand names, model names, numeric specifications, URLs, asset paths, ISO durations, dates, color values, and structural keys.
- Localized prompt cards copy their localized prompt into the generator. The English source prompt remains in the internal asset provenance manifest.
- Keep the verified Free claim qualified in metadata and FAQ: sign-up grants 10 credits and eligible Grok settings can cover at least one generation.

## Routing and SEO

- Add an explicit locale route for `/[locale]/ai-video-generator`.
- English continues to use `/ai-video-generator`; `/en/ai-video-generator` redirects there.
- Each non-English page uses its own canonical URL and complete hreflang alternates.
- Remove `ai-video-generator` from the English-only route list.
- Add all localized URLs to the sitemap.

## Verification

- Every locale JSON must match the English object and array shape.
- Structural and asset fields must remain identical.
- Visible localized fields must not reuse English, except approved brand, model, URL, asset, format, and numeric values.
- Tests must catch partial English residue and cross-language contamination.
- Prompt insertion continues to use each page item's localized `prompt` value.
- Locale routes, canonical/hreflang metadata, sitemap coverage, TypeScript, build, and representative HTTP responses must pass.
