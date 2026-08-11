# Prompt Reference Visual Tokens and Breadcrumb Ownership Design

## Goal

Prevent duplicate breadcrumbs on shared video-generator pages, keep reference-picker scrolling inside the picker, and render inserted prompt references as purple hoverable tokens with media previews.

## Breadcrumb Ownership

- `AiVideoGeneratorTool` remains the single breadcrumb owner whenever `ToolL2PageContent` resolves a `videoGeneratorDefaultModel`.
- The outer page breadcrumb is suppressed from that structural signal instead of requiring every video model slug in a manual allowlist.
- A contract test covers Seedance 2.5 and the generic shared-video-generator condition.

## Prompt Reference Tokens

- Preserve the native textarea as the editable and accessible control.
- Add a synchronized visual mirror over the textarea. Ordinary text uses the current text color; references matching current uploaded resources use purple text.
- The textarea keeps its native value, selection, keyboard behavior, IME behavior, and form semantics; its glyph color becomes transparent while the caret remains visible.
- Hovering a purple reference renders a portal preview near the token: image thumbnail, contained video preview, or compact audio identity card.
- Removed resources stop matching and their old prompt text returns to ordinary text styling.
- Mirror scroll position follows textarea scroll position.

## Picker Scrolling

- The picker uses `overscroll-contain` and stops wheel/touch propagation.
- Scrolling within the picker never scrolls the generator panel or document, including at the picker boundaries.

## Recurrence Prevention

- Add a project rule requiring single ownership for breadcrumb, H1, Demo, and other shared-Hero structures.
- Every defect must be classified as isolated or reusable. Reusable failure patterns require a project rule plus a contract test, not only a page-specific patch.

## Verification

- Pure tests for mention segmentation and longest-label matching.
- Source contracts for purple tokens, hover previews, scroll isolation, and structural breadcrumb ownership.
- TypeScript check and browser verification on port 3014.

