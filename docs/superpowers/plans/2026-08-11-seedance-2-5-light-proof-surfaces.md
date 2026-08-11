# Seedance 2.5 Light Proof Surfaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove component-controlled near-black surfaces from the Seedance 2.5 proof and How To sections while preserving media and structure.

**Architecture:** Keep the existing component props and markup hierarchy. Add a focused source contract, then replace only the dark Tailwind color classes in the two Seedance-specific components.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner through `tsx`, Playwright for visual verification.

---

### Task 1: Lock the light-surface contract

**Files:**
- Modify: `src/components/seedance-2-5-live-page-contract.test.mjs`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Add a failing source contract**

Read both Seedance-specific component sources and assert that component-controlled near-black styling is absent while the approved light surface classes are present:

```js
const proofSource = readFileSync(join(root, 'src/components/blocks/Seedance25Proof.tsx'), 'utf8')
const howToSource = readFileSync(join(root, 'src/components/blocks/Seedance25HowTo.tsx'), 'utf8')

assert.doesNotMatch(`${proofSource}\n${howToSource}`, /bg-slate-950|border-white\/10|text-slate-300/)
assert.match(proofSource, /bg-indigo-50/)
assert.match(proofSource, /bg-white/)
assert.match(howToSource, /bg-indigo-50 object-contain/)
```

- [ ] **Step 2: Run the focused contract and confirm RED**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: FAIL because the current proof, timeline, duration badge, and How To video fallback still contain near-black classes.

### Task 2: Apply the approved light palette

**Files:**
- Modify: `src/components/blocks/Seedance25Proof.tsx`
- Modify: `src/components/blocks/Seedance25HowTo.tsx`
- Test: `src/components/seedance-2-5-live-page-contract.test.mjs`

- [ ] **Step 1: Restyle the result frame and caption**

Use light indigo for the frame, brand indigo for the duration badge, and white/slate for the caption:

```tsx
<div className="... border border-indigo-100 bg-indigo-50 ...">
  <span className="... bg-indigo-600 ... text-white ...">...</span>
  <div className="... border-t border-indigo-100 bg-white text-slate-900 ...">
    <p className="... text-slate-600">...</p>
  </div>
</div>
```

- [ ] **Step 2: Restyle the planning timeline**

Use a light indigo timeline with slate content, pale connectors, and brand-indigo numbered nodes:

```tsx
<div className="... border border-indigo-100 bg-indigo-50/70 text-slate-900 ...">
  <span className="... bg-indigo-200" />
  <div className="... border-indigo-50 bg-indigo-600 text-white">...</div>
  <p className="... text-indigo-600">...</p>
  <p className="... text-slate-600">...</p>
</div>
```

- [ ] **Step 3: Restyle the How To video fallback**

Change only the video fallback class:

```tsx
className="h-full w-full rounded-2xl bg-indigo-50 object-contain"
```

- [ ] **Step 4: Run focused tests and TypeScript**

Run:

```bash
npx --yes tsx --test src/components/seedance-2-5-live-page-contract.test.mjs
npx tsc --noEmit --pretty false
```

Expected: all focused tests pass and TypeScript exits with status 0.

### Task 3: Verify rendered desktop and mobile surfaces

**Files:**
- Verify: `src/components/blocks/Seedance25Proof.tsx`
- Verify: `src/components/blocks/Seedance25HowTo.tsx`

- [ ] **Step 1: Capture proof and How To sections**

Open `http://127.0.0.1:3014/model/seedance-2-5` at 1440px and 390px, scroll each target section into view, and capture the rendered section.

- [ ] **Step 2: Inspect visual and responsive behavior**

Confirm that the caption and timeline use light surfaces, duration remains legible, the video poster is unchanged, and `scrollWidth === clientWidth` at 390px.

- [ ] **Step 3: Run final scoped checks**

Run:

```bash
git diff --check -- src/components/blocks/Seedance25Proof.tsx src/components/blocks/Seedance25HowTo.tsx src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: no whitespace errors. Do not commit, push, merge, or publish without explicit user authorization.
