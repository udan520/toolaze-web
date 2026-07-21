# AI Video Entry and Upload Design

## Scope

- Enlarge the single-reference upload tile used by Grok 1.5 Video from the current 160px cap to a 240px cap while keeping the existing square tile and upload behavior.
- Add a localized `Create Video` workspace-sidebar item immediately after `Edit Image`, linking to the localized AI Video Generator route.
- Replace the homepage hero's secondary AI Image-to-Image CTA with a localized `AI Video Generator` CTA linking to `/ai-video-generator`.
- Make the generic AI Video Generator page select `grok-1-5-video` by default. Seedance and Kling model pages keep their model-specific defaults.

## Implementation Boundaries

- Reuse the existing sidebar, homepage CTA, and video generator components.
- Add only the translation keys required for the new visible labels across all supported locales.
- Do not change API requests, credit logic, generation history, navigation menus outside the workspace sidebar, sitemap behavior, or model-page defaults.
- Keep the existing untracked AI Dance assets and `tmp/` directory untouched.

## Verification

- Add source-contract tests for sidebar order, localized labels, homepage CTA href/copy, Grok upload sizing, and generic-page default model.
- Run the focused navigation, localization, homepage, and AI video generator tests.
- Verify `/`, `/ai-video-generator`, and one localized page locally on port 3006, including CSS loading and active sidebar state.
