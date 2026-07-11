# Mistakes

## 1. Oversized first component patch

The first implementation attempt combined component types, rendering, routes, and page data. It failed because the component context had changed.

Correction: split the work into focused patches and verify exact local code before editing.

## 2. Inline expression did not match the test contract

The first image-preset implementation computed the image-preset state directly inside JSX, while the test required a named `hasImagePromptPresets` variable.

Correction: extracted the variable and reused it in the grid class.

## 3. Localization API attempt stalled

A public translation endpoint did not return promptly.

Correction: terminated the request and created an auditable local localization generator with reviewed language copy.

## 4. Multi-file common.json patch used inconsistent footer anchors

The first combined common translation patch failed because localized footer field names and ordering differ.

Correction: separated the shared navigation and homepage changes from the locale-specific footer insertion.

## 5. Competitor evidence was not carried into functional acceptance

The competitor analysis recorded VisualGPT's Female / Male / Custom workflow, but the first Toolaze implementation collapsed the result into eleven mixed presets with an editable Prompt.

Correction: rebuilt the top experience as Women / Men / Custom, added eleven presets per gender, hid preset prompts, and added browser acceptance tests for all three states.

## 6. Content tests did not block exposed internal prompts

The initial tests verified that each preset contained a prompt but did not verify that Prompt Examples and editable-prompt language were absent from the rendered page.

Correction: added regression assertions for `gender-tab-preset-first-with-custom`, removed `promptExamples` from section order, and rejected editable-Prompt language in Hero and metadata.

## 7. Validation scripts conflicted with approved project rules

The forbidden-claims script still rejected `no watermark` and `no sign up`, although both are approved reusable selling points. The localization residue script also scanned hidden model prompts and treated `uploaded portrait` as visible English residue.

Correction: aligned the forbidden-claims list with the approved project rules and excluded `prompt` and `defaultPrompt` fields from visible localization residue scans.
