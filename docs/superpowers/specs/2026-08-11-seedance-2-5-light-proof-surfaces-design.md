# Seedance 2.5 Light Proof Surfaces Design

## Problem

The Seedance 2.5 proof section uses near-black containers for the result video caption and the 30-second planning timeline. The How To result video also uses a near-black fallback surface. These blocks conflict with the page's white, soft-indigo Toolaze visual system.

## Approved Direction

Use option A: replace component-controlled near-black surfaces with light indigo and white surfaces while preserving the current layout, content, media, controls, and information hierarchy.

## Color Treatment

- Result video frame: light indigo background with the existing indigo border and shadow.
- Result caption: white background, slate heading, slate supporting text, and a light indigo top divider.
- Duration badge: solid brand indigo with white text; no black or near-black transparency.
- Timeline: light indigo surface with slate text, indigo time labels, pale indigo connectors, and white-ringed brand-indigo numbered nodes.
- How To result video fallback: light indigo rather than near-black.

## Boundaries

- Do not change the video file, poster, native browser video controls, section layout, content JSON, or shared components.
- Dark pixels that belong to the video itself or its browser-native controls are outside component-controlled page styling.
- Only `Seedance25Proof.tsx` and `Seedance25HowTo.tsx` production styles change.

## Verification

- Add a focused source contract rejecting `bg-slate-950`, dark translucent duration backgrounds, white-only caption text, and white-on-dark timeline styling in the two Seedance components.
- Run the Seedance page contract and TypeScript check.
- Capture the proof, timeline, and How To result card at desktop and mobile widths.
- Confirm there is no horizontal overflow at 390px and no component-controlled near-black surface remains.
