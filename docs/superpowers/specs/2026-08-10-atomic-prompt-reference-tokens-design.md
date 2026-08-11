# Atomic Prompt Reference Tokens Design

## Goal

Treat current prompt reference mentions such as `@Image 1`, `@Video 2`, `@Audio 1`, `@First Frame`, and `@Last Frame` as indivisible editing units inside the existing native textarea.

## Editing Contract

- The native textarea remains the editable, accessible form control.
- A current-resource mention cannot hold a caret inside its text.
- Clicking inside a mention snaps the caret to the nearest token boundary.
- ArrowLeft and ArrowRight cross a mention in one step instead of entering it.
- Backspace immediately after a mention removes the complete mention.
- Delete immediately before a mention removes the complete mention.
- A selection that intersects any part of a current mention expands to include that entire mention.
- Typing, pasting, or cutting over such a selection replaces or removes the complete mention.
- Removing a mention normalizes only redundant horizontal separator whitespace. Line breaks and indentation remain unchanged.
- Text for a resource that is no longer uploaded is ordinary prompt text and does not receive atomic behavior.

## Architecture

Keep token-boundary logic in pure helpers under `src/lib/prompt-reference-mentions.ts`. The helpers derive current mention ranges from the same longest-label scanner used by the visual overlay and return normalized selections or edit results without touching React state.

`AiVideoGeneratorTool` remains responsible for textarea events:

- `onSelect` normalizes a collapsed caret or selection to token boundaries.
- `onKeyDown` handles ArrowLeft, ArrowRight, Backspace, and Delete before the existing mention-picker keyboard flow.
- `onChange` remains the native path for ordinary typing, IME, paste, and undo. Selection normalization prevents partial-token edits from reaching it.
- Focus and caret restoration continue through the existing textarea ref.

No generation payload, resource ordering, upload state, pricing, history, or Recreate contract changes.

## Boundary Decisions

- Boundary choice for a mouse click inside a token uses the closest start/end offset; equal distance resolves to the end.
- A non-collapsed selection expands outward to every current token it intersects, including multiple tokens.
- Backspace/Delete removes the token plus at most one redundant horizontal separator so surrounding words do not gain double spaces.
- Newlines are never collapsed. A token on its own line may leave the empty line intact rather than changing paragraph structure.
- Unknown or stale `@...` text remains editable character by character.

## Testing

Pure helper tests cover:

- caret snapping at the beginning, middle, midpoint, and end of a token;
- ArrowLeft and ArrowRight skipping a token;
- Backspace and Delete removing a complete token;
- partial and multi-token selections expanding to complete ranges;
- typing replacement over an expanded range;
- whitespace normalization without newline or indentation loss;
- stale resource text remaining ordinary editable text;
- longest-label handling for `@Image 10` versus `@Image 1`.

Focused component contracts verify that the textarea routes selection and deletion events through the atomic helpers while preserving the existing picker, overlay, scroll synchronization, and accessibility behavior.

## Out of Scope

- Replacing the textarea with `contenteditable`.
- Rendering separate DOM chips as the editable source of truth.
- Adding drag-and-drop token reordering.
- Changing prompt text sent to the generation API.
