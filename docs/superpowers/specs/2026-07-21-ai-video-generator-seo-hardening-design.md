# AI Video Generator SEO Hardening Design

## Goal

Improve the `/ai-video-generator` page by removing duplicated or internal-sounding copy, making access and model specifications objective, aligning prompt examples with their actual videos, consolidating the competing Seedance URL, and making permanent video examples easier for search engines and browsers to process.

The model-selector Quality stars remain unchanged by explicit user request.

## Page ownership and URL strategy

- `/ai-video-generator` owns the generic `AI video generator` search intent.
- `/model/seedance-2` owns the Seedance 2.0 model intent.
- `/model/seedance-2/ai-video-generator` permanently redirects to `/model/seedance-2` and is excluded from the Seedance all-tools index.
- The generic page keeps its self-referencing canonical and sitemap entry.

## Content structure

The visible page order becomes:

1. Functional generator and concise H1/description
2. Three-step usage guide
3. Prompt templates with real video outputs
4. Short product definition and capability summary
5. Objective per-model settings and credit estimates
6. Model selection guide using measurable labels
7. Troubleshooting guidance
8. Use cases
9. Direct, factual FAQ
10. Related video workflows

The separate generic `features` and `intro` sections are removed from the visible order because they repeat text/image input, model selection, and settings already explained elsewhere. The unsupported generic comparison and hidden rating content are removed from page-owned data.

## Claim policy

- Remove absolute `Free` wording from metadata, H1, and section titles until a stable free-access policy is explicitly defined.
- State credit requirements as estimates shown by the generator, using the same model settings already present in the product configuration.
- Replace subjective model-guide labels such as `Highest control` with measurable capability labels.
- Keep the model selector's existing Quality stars unchanged.
- FAQ answers must answer the question directly. Unknown watermark, retention, refund, or account-policy claims are omitted instead of guessed.

## Prompt video consistency

- The Product Ad prompt is rewritten as a 5-second vertical 9:16 prompt because its permanent output is 496x864 and 5.042 seconds.
- Each permanent prompt video receives a stable poster extracted from the actual video, not an AI-generated substitute.
- Each video item carries a unique description, duration, upload date, poster URL, and content URL for structured data.

## Video loading and structured data

- Prompt videos use `preload="none"` and a poster.
- Playback starts only when a card enters the viewport and pauses when it leaves.
- Autoplay remains muted and inline after intersection so the current visual behavior is retained without requesting every video immediately.
- The page emits a JSON-LD graph containing the existing `HowTo`, `FAQPage`, and one `VideoObject` per permanent prompt video.
- Video structured data uses actual content URL, poster URL, publication date, duration, title, and description.

## Reusable rules

Add project rules covering:

- one generic keyword owner versus model-specific page ownership;
- permanent redirect or significant differentiation for overlapping indexed pages;
- no absolute free/no-signup claims without a confirmed policy;
- prompt, duration, aspect ratio, poster, and video metadata consistency;
- objective model comparisons and explicit preservation of internally approved rating systems;
- poster, deferred playback, and `VideoObject` requirements for permanent landing-page videos;
- targeted tests for SEO route, copy, media, and schema changes.

## Verification

- Contract tests must fail before implementation and pass afterward.
- Verify the duplicate route returns a permanent redirect in source/build behavior.
- Verify all poster files exist and every R2 video URL remains present.
- Run the focused AI video tests and TypeScript checking.
- Run sitemap and route-related tests touched by the redirect.
- Do not commit, push, or deploy.
