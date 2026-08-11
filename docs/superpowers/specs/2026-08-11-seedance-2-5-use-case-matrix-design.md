# Seedance 2.5 Use Case Matrix Design

## Problem

The current desktop layout keeps the section heading in a sticky left column while four detailed use cases continue down the right column. After the heading ends, the left side becomes a large empty region that weakens the section's visual balance.

## Approved Direction

Use option A: place the eyebrow, heading, and supporting copy across the top of the section, then render the four existing use cases as a two-column task matrix.

## Layout

- Keep the existing section width, background, typography, copy, numbering, and semantic ordered list.
- Use one full-width heading area above the use cases. Keep the body copy within a readable line length.
- Render the four use cases in a two-column grid on desktop and a single column on mobile.
- Organize the matrix with shared one-pixel dividers and generous internal spacing. Do not turn the entries into separate rounded icon cards.
- Keep each use case's number, title, description, `Best for`, and `Direct with` information.
- Remove the sticky positioning and asymmetric sidebar split.

## Responsive Behavior

- Desktop and large tablet: two columns, two rows.
- Mobile: one continuous column with clear separators.
- No horizontal overflow at 390px.

## Scope

Only `Seedance25UseCases` changes. Content JSON, SEO Factory data, other Seedance sections, shared generators, and other model pages remain unchanged.

## Verification

- Add or update a focused source contract that rejects the old sticky split and requires the responsive matrix.
- Run the Seedance page contract and TypeScript check.
- Capture and inspect the section at desktop and mobile widths.
