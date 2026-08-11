# Seedance 2.5 Vertical Section Headings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three Seedance 2.5 custom section headers vertically structured and remove artificial desktop heading-width constraints.

**Architecture:** Keep the existing components and content API unchanged. Add one focused source contract for the heading layout, then make class-only and wrapper-only changes in the three custom components so headings use the section container while body copy retains a readable measure.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner, Playwright

---

### Task 1: Add the section-heading layout contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Write the failing source contract**

Add a test that reads `Seedance25Proof.tsx`, `Seedance25HowTo.tsx`, and `Seedance25UseCases.tsx` and asserts:

```js
test('Seedance 2.5 custom section headings use vertical full-width layouts', () => {
  assert.doesNotMatch(proofSource, /lg:grid-cols-\[1fr_1\.1fr\]/)
  assert.doesNotMatch(proofSource, /<h2 className="max-w-3xl/)
  assert.match(proofSource, /<h2[^>]*>[\s\S]*?<\/h2>[\s\S]*?description/)

  assert.match(howToSource, /<div className="mx-auto max-w-6xl text-center">/)
  assert.match(howToSource, /subtitle && <p className="mt-5 mx-auto max-w-5xl/)

  assert.match(useCasesSource, /<div className="max-w-6xl">/)
  assert.match(useCasesSource, /subtitle && <p className="mt-5 max-w-5xl/)
  assert.doesNotMatch(`${proofSource}\n${howToSource}\n${useCasesSource}`, /md:text-5xl/)
})
```

Keep the source reads scoped to these three component files. The exact regular expressions may be adjusted only to match formatting, not to weaken the required layout.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: the new test fails because Proof still uses a desktop grid, How To still uses `max-w-3xl`, and Use Cases still uses `max-w-4xl`.

### Task 2: Implement the vertical heading groups

**Files:**
- Modify: `src/components/blocks/Seedance25Proof.tsx`
- Modify: `src/components/blocks/Seedance25HowTo.tsx`
- Modify: `src/components/blocks/Seedance25UseCases.tsx`

- [ ] **Step 1: Make Proof vertical**

Replace the two-column header with a single vertical wrapper:

```tsx
<div>
  {eyebrow && (...)}
  <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
    {title}
  </h2>
  {description && (
    <p className="mt-5 max-w-5xl text-base leading-7 text-slate-600 md:text-lg">
      {description}
    </p>
  )}
</div>
```

- [ ] **Step 2: Expand How To heading width**

Use the section width for the heading group and retain a narrower centered subtitle:

```tsx
<div className="mx-auto max-w-6xl text-center">
  {eyebrow && (...)}
  <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">{title}</h2>
  {subtitle && (
    <p className="mx-auto mt-5 max-w-5xl text-base leading-7 text-slate-600 md:text-lg">
      {subtitle}
    </p>
  )}
</div>
```

- [ ] **Step 3: Expand Use Cases heading width**

Use the full section width for the header while leaving the subtitle measure unchanged:

```tsx
<div className="max-w-6xl">
  {eyebrow && (...)}
  <h2 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">{title}</h2>
  {subtitle && <p className="mt-5 max-w-5xl ...">{subtitle}</p>}
</div>
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: all tests pass.

### Task 3: Verify rendered behavior

**Files:**
- Verify: `src/components/blocks/Seedance25Proof.tsx`
- Verify: `src/components/blocks/Seedance25HowTo.tsx`
- Verify: `src/components/blocks/Seedance25UseCases.tsx`

- [ ] **Step 1: Run TypeScript checking**

Run:

```bash
npx tsc --noEmit --pretty false
```

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 2: Inspect the English page at desktop width**

Open `http://127.0.0.1:3014/model/seedance-2-5` at 1440px width and verify:

- Proof description is below the heading.
- Proof, How To, and Use Cases headings are not wrapped by artificial narrow containers.
- No section has horizontal overflow.

- [ ] **Step 3: Inspect the English page at mobile width**

Open the same page at 390px width and verify:

- Headings wrap naturally inside the viewport.
- Descriptions remain below headings.
- No horizontal overflow is introduced.

- [ ] **Step 4: Run diff hygiene checks**

Run:

```bash
git diff --check -- \
  src/components/seedance-2-5-live-page-contract.test.mjs \
  src/components/blocks/Seedance25Proof.tsx \
  src/components/blocks/Seedance25HowTo.tsx \
  src/components/blocks/Seedance25UseCases.tsx
```

Expected: no output.

No commit, branch, push, merge, or publish operation is part of this plan.
