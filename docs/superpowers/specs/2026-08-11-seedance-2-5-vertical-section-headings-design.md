# Seedance 2.5 Vertical Section Headings Design

## Goal

Correct the visual hierarchy of the three Seedance 2.5 custom landing-page sections so desktop headings use the available section width and supporting descriptions sit below—not beside—the heading.

## Scope

This change is limited to:

- `Seedance25Proof`
- `Seedance25HowTo`
- `Seedance25UseCases`

It does not change page copy, media, section order, generator behavior, shared landing-page components, navigation, SEO metadata, or localized content.

## Layout Rules

### Shared heading structure

Each section header uses one vertical content flow:

1. Eyebrow
2. Heading
3. Supporting description or subtitle

The description must never occupy a sibling desktop column beside the heading.

### Heading width

- Desktop headings may use the full width of the section's `max-w-6xl` content container.
- Do not apply `max-w-3xl` or `max-w-4xl` to a heading or to a wrapper that constrains the heading.
- Use the page's established `md:text-4xl` section-heading scale across all three custom sections; do not use `whitespace-nowrap` or fixed widths to force one line.
- Long headings and mobile headings wrap naturally.

### Description width

- Descriptions remain below the heading with `mt-5` spacing.
- Introductory body copy uses `max-w-5xl`, wide enough to avoid artificial two-line wrapping while remaining narrower than the section container.
- Description width must not restrict the heading width.

## Section Decisions

### Proof

- Remove the two-column desktop header grid.
- Keep the header left aligned.
- Let the heading use the full section width.
- Place the description below it with a readable maximum width.

### How To

- Keep the section header centered.
- Expand the heading wrapper from `max-w-3xl` to the full section width.
- Center the subtitle in its own `max-w-5xl` container.

### Use Cases

- Keep the section header left aligned.
- Remove the `max-w-4xl` constraint from the heading wrapper.
- Keep the subtitle below in a `max-w-5xl` container.

## Responsive Behavior

- At desktop width, headings should no longer wrap merely because of artificial wrapper limits.
- At tablet and mobile widths, headings wrap naturally and remain inside the viewport.
- Existing section padding, content order, cards, video, metrics, timeline, and use-case matrix remain unchanged.

## Verification

- Add a focused source contract that rejects the previous side-by-side Proof header and narrow heading wrappers.
- Run the focused Seedance 2.5 page contract test.
- Run TypeScript type checking.
- Inspect the English page at desktop and mobile widths, checking heading line count and horizontal overflow.
