# First/Last Frame Image State Preservation

## Goal

When a user switches the First/Last Frames toggle, preserve the images already uploaded in each toggle state.

## Confirmed Behavior

- Enabling First/Last Frames hides ordinary multimodal reference images without clearing them or revoking their local preview URLs.
- Disabling First/Last Frames restores the ordinary reference images exactly as they were.
- First-frame and last-frame images remain in their existing dedicated state when the toggle is disabled and reappear when it is enabled again.
- Reference videos and reference audio continue to be cleared when First/Last Frames is enabled.
- A generation request submits only the image collection for the active toggle state. Hidden images are not included in the payload.

## Implementation

Keep the existing independent state collections:

- `imageFiles` and `remoteImageUrls` for ordinary reference images.
- `firstLastFrameImages` for first-frame and last-frame images.

Update `handleFirstLastFrameToggle` so enabling the toggle no longer revokes or resets ordinary reference images. Preserve the existing video and audio cleanup in that handler. No new cache state or component abstraction is required.

## Verification

Add a focused regression contract test before changing production code. The test must prove that `handleFirstLastFrameToggle`:

- does not revoke ordinary reference-image previews;
- does not reset `imageFilesRef`, `imageFiles`, or `remoteImageUrls`;
- still clears reference video and audio state when First/Last Frames is enabled.

Run the targeted generator layout test and the directly related generator contract tests. Perform a local page smoke check on `/model/seedance-2-5` using port `3014`.

## Scope

This change does not alter upload validation, generation payload fields, history, Recreate, credits, API routes, navigation, SEO content, or release configuration.
