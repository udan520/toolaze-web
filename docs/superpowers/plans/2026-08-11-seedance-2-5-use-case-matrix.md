# Seedance 2.5 Use Case Matrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the empty sticky-sidebar use-case layout with the approved full-width heading and responsive two-column task matrix.

**Architecture:** Keep the existing `Seedance25UseCases` component interface and JSON unchanged. Protect the layout with a focused source contract, then change only the component's internal Tailwind structure.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner through `tsx`, Playwright for visual verification.

---

### Task 1: Lock the approved layout contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Write the failing source contract**

Read `src/components/blocks/Seedance25UseCases.tsx` and assert that the component uses a responsive two-column ordered-list matrix and does not retain the sticky asymmetric split:

```js
const useCasesSource = readFileSync(
  join(root, 'src/components/blocks/Seedance25UseCases.tsx'),
  'utf8',
)

assert.match(useCasesSource, /<ol className="[^"]*grid[^"]*sm:grid-cols-2/)
assert.doesNotMatch(useCasesSource, /lg:sticky|lg:grid-cols-\[0\.82fr_1\.18fr\]/)
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: the new layout test fails because the old component still contains `lg:sticky` and the asymmetric `0.82fr / 1.18fr` split.

### Task 2: Implement the full-width task matrix

**Files:**
- Modify: `src/components/blocks/Seedance25UseCases.tsx`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Replace the sidebar split with a top heading block**

Keep the existing eyebrow, H2, and subtitle but remove the outer asymmetric grid and sticky positioning:

```tsx
<div className="max-w-4xl">
  {eyebrow && <p className="...">{eyebrow}</p>}
  <h2 className="...">{title}</h2>
  {subtitle && <p className="...">{subtitle}</p>}
</div>
```

- [ ] **Step 2: Render the four items as a responsive matrix**

Use shared one-pixel dividers rather than four independent rounded cards:

```tsx
<ol className="mt-14 grid border-l border-t border-indigo-100 sm:grid-cols-2">
  {items.map((item, index) => (
    <li className="border-b border-r border-indigo-100 p-7 md:p-9" key={item.title}>
      {/* Keep number, title, description, Best for, and Direct with. */}
    </li>
  ))}
</ol>
```

- [ ] **Step 3: Run focused tests and TypeScript**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
npx tsc --noEmit --pretty false
```

Expected: all focused tests pass and TypeScript exits with status 0.

### Task 3: Verify the rendered page

**Files:**
- Verify: `src/components/blocks/Seedance25UseCases.tsx`

- [ ] **Step 1: Capture the use-case section at desktop and mobile widths**

Open `http://127.0.0.1:3014/model/seedance-2-5` with Playwright at 1440px and 390px, scroll the use-case heading into view, and capture its ancestor section.

- [ ] **Step 2: Inspect layout and overflow**

Confirm:

- desktop shows two columns and two rows;
- the title occupies the full section width above the matrix;
- mobile shows one continuous column;
- `document.documentElement.scrollWidth === document.documentElement.clientWidth` at 390px.

- [ ] **Step 3: Run final scoped checks**

Run:

```bash
git diff --check -- src/components/blocks/Seedance25UseCases.tsx src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: no whitespace errors. Do not commit, push, or publish without explicit user authorization.
