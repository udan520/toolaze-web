# Learnings

## Functional UX

Image-based hairstyle presets are materially clearer than color swatches or a prompt-only wrapper. A shared preset type can support both experiences without creating a separate generator component.

For hairstyle tools, gender-separated preset tabs are not a cosmetic filter. They reduce scan time, make popular cuts easier to find, and match the functional intent captured by ranking competitors. Custom input should remain a separate path instead of exposing every preset's internal prompt.

## Component Design

The `PromptPreset` contract can support `image`, `group`, and optional `referenceImage` without creating a page-specific generator. This preserves existing color swatches, enables Women / Men filtering, and leaves a clean path for two-reference generation when final template images are ready.

## Visual Trust

A visually attractive side-by-side image is not enough for a transformation tool. If identity continuity cannot be verified, the asset must remain local-preview-only and publishing must stay blocked.

## Localization

Run-specific localization generators are useful when they preserve exact prompts, URLs, brand names, and data structure while translating visible copy.

Localization residue checks must distinguish visible copy from intentionally hidden model instructions. Scanning hidden prompts creates false failures and can encourage translating prompts that should remain exact.

## Process

Small patches and immediate tests are more reliable in a heavily modified repository than broad multi-file implementation patches.

Competitor research is incomplete until its functional findings are carried into `functional-acceptance.md`, `tool-requirements.json`, browser checks, and regression tests. A correct research document does not compensate for a mismatched implementation.
