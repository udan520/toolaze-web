# Seedance 2.5 Feature Stories Design

## Goal

Replace the thin Seedance 2.5 feature-card treatment and separate proof introduction with one editorial Key Features section that explains verified capabilities in depth, connects each capability to a real workflow decision, and pairs the copy with real Toolaze media.

The first implementation is English only. Other locale content remains unchanged until it is intentionally localized.

## Evidence Boundary

Competitor pages are structure references, not capability sources. Imagine.art demonstrates that a feature section can explain a creator problem and workflow outcome before summarizing capabilities, while the existing Toolaze GPT Image 2 page demonstrates the preferred alternating text/media layout.

Seedance 2.5 visible claims remain limited to the current verified source set:

- A 4–30 second Toolaze generation range.
- 480p or 720p output in the current Toolaze generator.
- Up to 30 image, 10 video, and 10 audio reference files in the Toolaze multimodal request.
- Up to 50 combined multimodal references in the documented Seedance 2.5 brief.
- Multimodal reference mode and First/Last Frames are separate, mutually exclusive control paths.
- Optional native audio, reference audio, MP4/MOV output, and the currently exposed aspect-ratio controls.
- The verified Seedance 2.0 baseline: 4–15 seconds with up to 9 images, 3 videos, and 3 audio clips.

Do not import competitor claims about native 4K, 10-bit color, 180-second beta generation, local region editing, multilingual lip sync, faster generation, better text rendering, stronger consistency, or prompt-adherence percentages unless a qualifying source is added and the current Toolaze product boundary is also stated.

## Page Architecture

The English section order becomes:

1. Hero + live generator
2. Key Features of Seedance 2.5
3. Seedance 2.5 vs Seedance 2.0
4. How to Use Seedance 2.5 in Toolaze
5. Where Seedance 2.5 earns the extra scene length
6. Toolaze Seedance 2.5 Generation Settings
7. FAQ

The existing standalone `seedanceProof` section is removed from the English `sectionsOrder`. Its useful media and 30-second planning timeline move into the first feature story so the page does not repeat the same 30-second and 50-reference claims in two consecutive sections.

## Shared Component

Create a reusable `ModelFeatureStories` component based on the existing GPT Image 2 alternating layout.

### Section header

- H2 first: `Key Features of {Model}`.
- Supporting description directly below the H2.
- No eyebrow, kicker, badge, category label, or decorative text above the H2.
- Left/right story rows begin after the section introduction.

### Story row

Each row contains:

- One H3.
- Two or more concise paragraphs with distinct responsibilities.
- One real media object: image or video.
- Optional factual caption when the media needs a scope clarification.
- Optional supporting content, such as the existing 30-second timeline, only when it directly helps use the feature.

At desktop widths, rows use two equal columns and alternate text/media position by item index. At mobile widths, every row uses the same reading order: H3 and copy first, media second. Media uses `object-contain`; user-inspection screenshots and videos are never cropped.

The shared component must not render feature icons, decorative badges, eyebrow labels, or generic card shells.

### Data contract

```ts
type ModelFeatureStoryMedia = {
  type: 'image' | 'video'
  src: string
  alt: string
  poster?: string
  caption?: string
}

type ModelFeatureStory = {
  title: string
  paragraphs: string[]
  media: ModelFeatureStoryMedia
  timelineTitle?: string
  timeline?: Array<{
    time: string
    title: string
    description: string
  }>
}
```

The section data contains `title`, `description`, and `items`. The component renders nothing when the section or item list is missing.

## Seedance 2.5 Feature Stories

### 1. A 30-Second Window for a Complete Scene

Paragraph one explains the verified change from a 15-second Seedance 2.0 ceiling to 30 seconds in Seedance 2.5 and translates it into setup, development, payoff, and resolution inside one generation.

Paragraph two gives practical direction: plan the clip as timed beats, reserve time for transitions, and do not confuse the maximum duration with the current demo length.

Media uses the current real Toolaze Seedance 2.5 demo video and its poster. The caption explicitly states that the visible demo is 5.042 seconds; it demonstrates a real Toolaze result, not a 30-second output. The existing four-beat planning timeline moves below this story.

### 2. Build One Brief from Images, Video, and Audio

Paragraph one explains the 50-input combined reference brief and the current Toolaze split of up to 30 images, 10 videos, and 10 audio files.

Paragraph two explains role assignment: images for identity, products, locations, or art direction; video for movement and camera behavior; audio for pacing, dialogue tone, ambience, or cues. It should advise users to give each reference a specific job instead of uploading unrelated material.

Media uses the existing real Toolaze uploader screenshot showing image, reference-video, reference-audio, and prompt controls.

### 3. Use Reference Video to Direct Motion, Space, and Camera Behavior

Paragraph one explains why reference video can communicate paths, timing, framing changes, subject interaction, and camera movement that are difficult to specify with text alone.

Paragraph two explains when this is useful: product demonstrations, choreography, action blocking, and camera-led social adaptations. It must not promise perfect copying, stronger consistency, or unverified motion-quality improvements.

Media must be a real Toolaze screenshot showing a reference video attached to the Seedance 2.5 generator and its mention token in the editable prompt. Capture a new screenshot from the live local generator if the current asset set does not show this state. Upload the final screenshot to R2 before wiring it into public content.

### 4. Choose the Control Path Before You Prompt

Paragraph one explains the two mutually exclusive paths: a multimodal brief for open-ended direction, or First/Last Frames when the opening and closing compositions must be fixed.

Paragraph two gives a selection rule and limitation: choose one control path before composing the prompt, because the current Toolaze request does not combine First/Last Frames with the multimodal reference set.

Media uses a real Toolaze screenshot of the Seedance 2.5 model selector and First/Last Frames control. The existing R2 screenshot may be reused if it remains visually accurate.

## GPT Image 2 Reuse Boundary

The new component extracts the proven alternating story-row pattern rather than importing or coupling to `GptImage2LandingPage`.

Do not migrate GPT Image 2 in this task. Its feature media currently depends on page-specific slot resolution and existing local assets, so migrating it would add unrelated data and visual-regression risk. Seedance is the first consumer of the reusable component; GPT Image 2 can migrate in a separate mechanical refactor after the shared contract is stable. The user-visible GPT Image 2 page remains unchanged.

## Key Features Skill Standard

Update `toolaze-model-seo-page/references/model-page-sections.md` so future model-page Key Features follow these rules:

- Treat each retained feature as a compact decision article, not a one-line card.
- Each feature must cover four elements: verified capability, practical outcome, usage or selection guidance, and any limitation needed to prevent overclaiming.
- Use two or more concise paragraphs when the feature requires different answers; do not pad to a fixed word count.
- Prefer a real-output, reference-to-result, real workflow, or real product screenshot beside each feature. Media must prove the adjacent claim.
- Use an alternating editorial text/media layout when feature items contain substantial copy and media. Reserve card grids for secondary summaries, not the primary model-page Key Features module.
- Do not create abstract AI art, stock-like decoration, mock controls, or competitor-derived assets as proof.
- Omit a feature when reliable evidence or honest supporting media is unavailable.
- Do not duplicate the complete claim in What Changed, Comparison, Proof, Use Cases, and FAQ; assign one primary owner and short-reference it elsewhere.

## Global Heading Rule

Add the following project-level UI rule to `AGENTS.md` and `docs/UI_STYLE_GUIDE.md`:

> On public landing pages, H1, H2, H3, and other content headings must be the first visual information in their content group. Do not place eyebrow text, kickers, badges, step labels, category labels, or decorative short phrases above a heading. Breadcrumbs and global navigation are navigation structures and are excluded from this rule.

Apply the rule to all Seedance custom content groups in this redesign:

- Remove section eyebrow rendering from Proof, How To, and Use Cases. English eyebrow fields may be removed once no renderer consumes them.
- In How To cards, render the H3 before the `Step N` helper or remove the helper; do not place `Step N` above the H3.
- In the migrated timeline, render each beat heading before its time label.
- Remove or reposition use-case sequence numbers so they do not appear above a card H3 at any breakpoint.

These component-level heading changes affect every locale that uses the shared Seedance components, while the substantial Key Features copy rewrite remains English only.

## Content And Factory Sync

Update both:

- `src/data/en/seedance-2-5.json`
- `_codex/seo-pipeline/tasks/2026-08-10-seedance-2-5-live-generator/content/en.json`

The two files must remain deeply equal. Other locales are not rewritten in this phase.

## Verification

- TDD contract: English content contains exactly four feature stories; every story has at least two non-empty paragraphs and real media.
- TDD contract: English `sectionsOrder` starts with the new Key Features section and no longer includes `seedanceProof`.
- TDD contract: public English content and SEO Factory English content are deeply equal.
- TDD contract: component alternates desktop row positions while preserving text-first mobile DOM order.
- TDD contract: component has no eyebrow/kicker/badge rendering and uses `object-contain` for inspectable media.
- TDD contract: Seedance How To, timeline, and use-case cards do not render helper labels or sequence markers above their content headings.
- TDD contract: the skill reference and both project UI rules contain the new heading and Key Features depth requirements.
- Run the Seedance page contract test and TypeScript checking.
- Run the user-visible copy negative scan required by the project SEO rules.
- Verify all final Seedance feature media use stable R2 URLs, load successfully, and accurately match the adjacent copy.
- Inspect the English page at 1440px and 390px for alternating layout, text hierarchy, media fit, and horizontal overflow.
- Confirm the live preview returns HTTP 200 at `/model/seedance-2-5` on the worktree preview port.

No commit, push, merge, branch creation, deployment, indexing submission, or production release is included.
