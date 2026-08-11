# Prompt Reference Mentions Design

## Goal

Let Seedance 2.5 users reference uploaded images, videos, audio, and first/last frames directly from the prompt by typing `@` or clicking an `@` button inside the prompt field.

## Interaction

- Show the mention control only when the active model supports multimodal references or the current image-to-video mode supports first/last frames.
- Typing `@` opens a picker anchored to the prompt field and records that character as the replacement range.
- Clicking the prompt-field `@` button opens the same picker at the textarea's current selection without inserting a character first.
- Selecting an item inserts a plain-text token at the current cursor:
  - `@Image 1`, `@Image 2`
  - `@Video 1`, `@Video 2`
  - `@Audio 1`, `@Audio 2`
  - `@First Frame`, `@Last Frame`
- A keyboard-triggered selection replaces the typed `@`, so the result never contains a doubled `@@` prefix.
- After insertion, focus returns to the textarea and the caret sits immediately after the inserted token.
- Escape and outside pointer presses close the picker. Selecting an item also closes it.
- When no current references exist, the picker remains available and shows `Upload a reference to mention it.`

## Resource Mapping

- Ordinary multimodal mode uses the exact request order already implemented by the generator:
  - remote images, then local images;
  - remote videos, then local videos;
  - remote audio, then local audio.
- First/last-frame mode lists only the currently active frame slots. Hidden ordinary image references are not shown because they are not submitted in that mode.
- Mention tokens are prompt text only. Existing upload arrays, upload order, history data, generation payloads, and backend contracts remain unchanged.

## Architecture

- Add a small pure helper module for insertion/replacement math and caret placement.
- Add a focused `PromptReferenceMentionPicker` presentation component for grouped media items, previews, empty state, accessibility labels, and selection callbacks.
- Keep orchestration in `AiVideoGeneratorTool`: build picker items from current state, detect typed `@`, track the insertion range, restore focus, and manage outside/Escape dismissal.
- Use the repository's existing document-level `mousedown` and `keydown` dismissal pattern; do not add a popover dependency or rich-text editor.

## Accessibility and Layout

- The `@` trigger is a real button with an accessible label.
- Picker items are buttons and expose their full mention label.
- The picker uses a compact responsive width bounded by the prompt container and a scrollable maximum height.
- Images use thumbnails, videos use contained previews, and audio uses an icon plus filename so reference identity remains visible without cropping important content.

## Testing

- Unit-test keyboard replacement, button insertion, selection replacement, spacing, and returned caret position.
- Add source-contract tests proving both triggers, current-mode filtering, stable numbering, focus restoration, empty state, Escape handling, and outside dismissal are wired.
- Run the focused layout contract and a local `3014` page smoke check.

