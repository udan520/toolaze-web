# Proposed Rule Updates

Status: awaiting_human_confirmation

## Proposal 1

When a scene page uses image-based presets, the shared prompt preset contract may include an optional local `image` field. The UI should render image presets as labeled square cards and preserve color-swatch behavior for existing tools.

## Proposal 2

Transformation pages must distinguish between:

- identity-preserving before/after evidence
- separate reference or inspiration images

Separate people may be used for local layout review only and must block the final Visual Gate.

## Proposal 3

For new AI Tools pages, the entry-point validation should require:

- AI Tools Hub card
- desktop navigation item
- mobile navigation item
- footer link
- homepage grid id
- homepage image registry
- localized common labels
- sitemap entries

No global rule is changed automatically by this proposal.

## Proposal 4

For hairstyle changer scene pages, when competitor evidence supports separate gender collections:

- use Women / Men / Custom as separate functional paths
- require at least ten auditable presets per gender
- keep preset generation prompts internal
- use Custom for free-form hairstyle descriptions
- allow an optional hidden template reference image after final visual assets are approved

This proposal remains scoped to hairstyle-changing workflows and requires human confirmation before promotion into a shared skill or validation script.

## Proposal 5

Localization residue validators should skip fields that are explicitly model instructions, such as `prompt` and `defaultPrompt`, while continuing to scan labels, placeholders, titles, descriptions, FAQ, alt text, navigation, and schema-visible copy.

The script was corrected in this run because the existing behavior conflicted with the approved localization rule that exact hidden prompts may remain in English.
