# Prompt Index Pruning Design

## Goal

Reduce low-value Prompt URLs submitted for indexing while preserving the Prompt library for users and historical Seedance 2.0 redirects.

## Indexing boundary

- Keep the English Prompt hub and seven English model/category landing pages indexable and listed in the sitemap.
- Mark Prompt detail pages and all non-English Prompt hub/model/category pages `noindex, follow`.
- Remove those noindex URLs from the sitemap.

## Seedance boundary

- Keep `/model/seedance-2` as the only Seedance 2.0 model page.
- Delete the obsolete `ai-video-generator`, `text-to-video`, and `image-to-video` locale content files.
- Preserve static 308 coverage for all three historical L3 slugs without loading their old page content.

## Verification

- Add source-level regression tests for sitemap inclusion/exclusion, noindex metadata, and the retained Seedance redirect slugs.
- Run the focused tests and inspect the changed-file diff.
