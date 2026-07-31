# H5 Generation History and Model Consistency Design

## Goal

Fix the reported mobile generation, history, navigation, clipboard, and credit activity issues while making image model selection, provider routing, credit charging, history metadata, and account-menu labels consistent.

## Model Consistency

- Keep one explicit public model ID for every selectable image model.
- Map each public model ID to the correct KIE provider model for text-to-image and image-to-image.
- Use `grok-imagine/text-to-image` and `grok-imagine/image-to-image` for Grok image generation.
- Preserve the official GPT Image 1.5 aspect ratios: `1:1`, `2:3`, and `3:2`.
- Reject unknown model IDs with a clear `400` response. Never silently route an unknown model to Nano Banana Pro.
- Persist the selected public model ID and label in credit metadata and generation history.
- Add contract tests covering every selectable model across frontend configuration, backend acceptance, provider routing, credit pricing, and display labels.

## Deployment Boundary

The Vercel frontend currently proxies production generation requests to the Cloudflare backend. A frontend release that introduces model IDs must be paired with the matching Cloudflare generation-function release. Verification must confirm both deployments understand the same model set before generation is considered ready.

## Mobile Navigation

- Use the dynamic viewport height for the mobile menu.
- Keep the menu body internally scrollable with enough bottom safe-area padding so every language remains reachable on mobile browsers with dynamic toolbars.

## History Page

- Route Recreate for image records to the localized generic image generator with the model passed as state/query data instead of assuming `/model/{modelId}` exists.
- Keep video records routed to the video generator.
- Rename `Create Similar` to `Recreate` in all supported locales.
- On H5, place Recreate, Download, and Delete in one row. Recreate keeps text; Download and Delete use icons with accessible labels and tooltips.
- Limit the visible prompt area to four lines of height and allow internal vertical scrolling for longer prompts.
- Copy Prompt shows the shared global Success notice after a successful copy and a Failed notice when copying fails.

## Inline Image Generator

- Recreate availability depends on the selected history item, not unrelated current form state.
- Recreate remains available while another task is generating and restores the record's model, mode, prompt, aspect ratio, quality/resolution, output format, and original references.
- After starting a generation on H5, switch to History and scroll the newly created pending record into view after it renders.

## Account Credit Activity

- Preserve `type` and `reason` from `/api/credits` in the navigation account-menu transaction type.
- Show the same localized status badge used by the Credits page before each recent activity title: Used, Refund, Bonus, Purchase, or Adjustment.
- Keep model and tool labels sourced from transaction metadata, so Flux, GPT Image 1.5, Grok, and other models display the model actually charged.

## Verification

- Unit/contract tests must fail first for unknown-model fallback, Grok provider routing, Recreate routing, mobile action layout, clipboard feedback, menu viewport scrolling, and account-menu badges.
- Run the focused image API, model configuration, credit label, History, Navigation, and mobile generation tests.
- Run TypeScript checking.
- Verify `/ai-image-generator` and `/history` at an H5 viewport on local main port `3006`, including generation-start scrolling and the last language option.
- Do not publish until explicitly requested.
