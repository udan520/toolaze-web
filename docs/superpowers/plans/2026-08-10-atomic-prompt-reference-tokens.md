# Atomic Prompt Reference Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every current `@Image`, `@Video`, `@Audio`, first-frame, and last-frame prompt reference behave as one indivisible editing token in the native textarea.

**Architecture:** Extend the existing pure mention scanner with indexed ranges, selection normalization, navigation, and deletion helpers. Keep the textarea as the source of truth; `AiVideoGeneratorTool` only translates native selection and keyboard events into pure helper calls, while the existing mirror, picker, uploads, and generation payload remain unchanged.

**Tech Stack:** React, TypeScript, native textarea events, Node test runner, tsx.

---

### Task 1: Indexed Mention Ranges and Selection Normalization

**Files:**
- Modify: `src/lib/prompt-reference-mentions.ts`
- Modify: `src/lib/prompt-reference-mentions.test.ts`

- [ ] **Step 1: Add failing range and selection tests**

Add tests that establish indexed ranges and atomic selection boundaries:

```ts
test('snaps a caret inside a current mention to the nearest boundary', () => {
  const references = [{ id: 'image-1', label: '@Image 1' }]

  assert.deepEqual(normalizePromptReferenceMentionSelection({
    value: 'Use @Image 1 now',
    selectionStart: 7,
    selectionEnd: 7,
    references,
  }), { start: 4, end: 4 })

  assert.deepEqual(normalizePromptReferenceMentionSelection({
    value: 'Use @Image 1 now',
    selectionStart: 9,
    selectionEnd: 9,
    references,
  }), { start: 12, end: 12 })
})

test('expands a partial selection across every intersected mention', () => {
  const references = [
    { id: 'image-1', label: '@Image 1' },
    { id: 'video-1', label: '@Video 1' },
  ]

  assert.deepEqual(normalizePromptReferenceMentionSelection({
    value: 'Use @Image 1 then @Video 1 now',
    selectionStart: 8,
    selectionEnd: 22,
    references,
  }), { start: 4, end: 26 })
})

test('does not normalize stale reference text', () => {
  assert.deepEqual(normalizePromptReferenceMentionSelection({
    value: 'Use @Image 1 now',
    selectionStart: 7,
    selectionEnd: 7,
    references: [],
  }), { start: 7, end: 7 })
})
```

- [ ] **Step 2: Run the helper tests and verify RED**

Run:

```bash
npx --yes tsx --test src/lib/prompt-reference-mentions.test.ts
```

Expected: FAIL because `normalizePromptReferenceMentionSelection` and indexed mention ranges do not exist.

- [ ] **Step 3: Implement indexed ranges and normalization**

Add these public contracts:

```ts
export interface PromptReferenceMentionRange<T extends PromptReferenceMention> {
  start: number
  end: number
  reference: T
}

export interface PromptReferenceMentionSelectionInput<T extends PromptReferenceMention> {
  value: string
  selectionStart: number
  selectionEnd: number
  references: readonly T[]
}

export function getPromptReferenceMentionRanges<T extends PromptReferenceMention>(
  value: string,
  references: readonly T[],
): PromptReferenceMentionRange<T>[]

export function normalizePromptReferenceMentionSelection<T extends PromptReferenceMention>(
  input: PromptReferenceMentionSelectionInput<T>,
): { start: number; end: number }
```

Implementation requirements:

- derive offsets from `splitPromptReferenceMentions` so longest-label and end-boundary behavior stays DRY;
- for a collapsed caret strictly inside a token, choose the nearest edge and resolve ties to `end`;
- for a non-collapsed selection, repeatedly expand the start/end until every intersected current token is fully included;
- leave token boundaries and stale text unchanged.

- [ ] **Step 4: Re-run helper tests and verify GREEN**

Run:

```bash
npx --yes tsx --test src/lib/prompt-reference-mentions.test.ts
```

Expected: all mention helper tests pass.

### Task 2: Atomic Navigation and Deletion Helpers

**Files:**
- Modify: `src/lib/prompt-reference-mentions.ts`
- Modify: `src/lib/prompt-reference-mentions.test.ts`

- [ ] **Step 1: Add failing keyboard edit tests**

Add explicit behavior tests:

```ts
test('moves across a current mention in one arrow step', () => {
  const references = [{ id: 'image-1', label: '@Image 1' }]
  const value = 'Use @Image 1 now'

  assert.deepEqual(getAtomicPromptReferenceNavigation({
    value,
    caret: 12,
    direction: 'backward',
    references,
  }), { caret: 4 })

  assert.deepEqual(getAtomicPromptReferenceNavigation({
    value,
    caret: 4,
    direction: 'forward',
    references,
  }), { caret: 12 })
})

test('backspace and delete remove a complete current mention', () => {
  const references = [{ id: 'image-1', label: '@Image 1' }]
  const value = 'Use @Image 1 now'

  assert.deepEqual(deleteAtomicPromptReferenceMention({
    value,
    selectionStart: 12,
    selectionEnd: 12,
    direction: 'backward',
    references,
  }), { value: 'Use now', caret: 4 })

  assert.deepEqual(deleteAtomicPromptReferenceMention({
    value,
    selectionStart: 4,
    selectionEnd: 4,
    direction: 'forward',
    references,
  }), { value: 'Use now', caret: 4 })
})

test('atomic deletion preserves line breaks and indentation', () => {
  const references = [{ id: 'image-1', label: '@Image 1' }]

  assert.deepEqual(deleteAtomicPromptReferenceMention({
    value: 'First\n  @Image 1\n  Next',
    selectionStart: 16,
    selectionEnd: 16,
    direction: 'backward',
    references,
  }), { value: 'First\n  \n  Next', caret: 8 })
})
```

- [ ] **Step 2: Run helper tests and verify RED**

Run:

```bash
npx --yes tsx --test src/lib/prompt-reference-mentions.test.ts
```

Expected: FAIL because the navigation and deletion helpers are missing.

- [ ] **Step 3: Implement atomic keyboard helpers**

Add these pure functions:

```ts
export function getAtomicPromptReferenceNavigation<T extends PromptReferenceMention>(input: {
  value: string
  caret: number
  direction: 'backward' | 'forward'
  references: readonly T[]
}): { caret: number } | null

export function deleteAtomicPromptReferenceMention<T extends PromptReferenceMention>(input: {
  value: string
  selectionStart: number
  selectionEnd: number
  direction: 'backward' | 'forward'
  references: readonly T[]
}): { value: string; caret: number } | null
```

Implementation requirements:

- ArrowLeft at a token end returns its start; ArrowRight at a token start returns its end;
- Backspace at a token end and Delete at a token start remove the complete token;
- a non-collapsed deletion first uses `normalizePromptReferenceMentionSelection`, then removes the normalized range;
- remove at most one redundant adjacent horizontal separator and never collapse `\n`, `\r`, or indentation;
- return `null` when native textarea behavior should continue.

- [ ] **Step 4: Re-run helper tests and verify GREEN**

Run:

```bash
npx --yes tsx --test src/lib/prompt-reference-mentions.test.ts
```

Expected: all helper tests pass, including longest-label and stale-resource cases.

### Task 3: Native Textarea Integration

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.tsx`
- Modify: `src/components/AiVideoGeneratorTool.layout.test.ts`

- [ ] **Step 1: Add failing component contracts**

Add source contracts proving the textarea uses the atomic helpers without replacing the native control:

```ts
test('prompt reference mentions behave as atomic textarea tokens', () => {
  assert.match(source, /normalizePromptReferenceMentionSelection/)
  assert.match(source, /deleteAtomicPromptReferenceMention/)
  assert.match(source, /getAtomicPromptReferenceNavigation/)
  assert.match(source, /event\.currentTarget\.setSelectionRange/)
  assert.match(source, /event\.preventDefault\(\)[\s\S]*setPrompt\(atomicDeletion\.value\)/)
  assert.match(source, /event\.key === 'Backspace'/)
  assert.match(source, /event\.key === 'Delete'/)
  assert.match(source, /event\.key === 'ArrowLeft'/)
  assert.match(source, /event\.key === 'ArrowRight'/)
  assert.doesNotMatch(source, /contentEditable/)
})
```

- [ ] **Step 2: Run the focused layout test and verify RED**

Run:

```bash
npx --yes tsx --test src/components/AiVideoGeneratorTool.layout.test.ts
```

Expected: FAIL because the atomic helpers are not wired into textarea selection and keyboard events.

- [ ] **Step 3: Wire selection normalization**

Replace the inline `onSelect` body with a named handler that:

```ts
const normalized = normalizePromptReferenceMentionSelection({
  value: event.currentTarget.value,
  selectionStart: event.currentTarget.selectionStart,
  selectionEnd: event.currentTarget.selectionEnd,
  references: promptReferenceMentionItems,
})
```

If the range changes, schedule `setSelectionRange(normalized.start, normalized.end)` on the same textarea. After normalization, update `promptMentionSelection` when the picker is open.

- [ ] **Step 4: Wire navigation and deletion before ordinary mention typing**

In `handlePromptKeyDown`:

- preserve existing open-picker handling for Escape, ArrowUp, ArrowDown, and Enter;
- when the picker did not consume the event, call `getAtomicPromptReferenceNavigation` for ArrowLeft/ArrowRight;
- call `deleteAtomicPromptReferenceMention` for Backspace/Delete;
- on an atomic result, call `event.preventDefault()`, update `prompt`, close any stale picker state, and restore the returned caret;
- otherwise continue to `handlePromptMentionKeyDown(event)` so typing `@` still opens the picker.

- [ ] **Step 5: Run focused helper and layout tests**

Run:

```bash
npx --yes tsx --test \
  src/lib/prompt-reference-mentions.test.ts \
  src/components/AiVideoGeneratorTool.layout.test.ts
```

Expected: all tests pass.

### Task 4: Verification

**Files:**
- Verify only.

- [ ] **Step 1: Run the full focused Seedance regression set**

```bash
npx --yes tsx --test \
  src/lib/prompt-reference-mentions.test.ts \
  src/lib/motion-video-state.test.ts \
  src/components/AiVideoGeneratorTool.layout.test.ts \
  src/components/blocks/ToolL2PageContent.breadcrumb-ownership.test.mjs \
  src/lib/ai-video-generator-config.test.ts \
  functions/api/ai-video-generator.test.ts \
  src/lib/history-reprompt.test.ts \
  src/components/seedance-2-5-live-page-contract.test.mjs
```

Expected: zero failures.

- [ ] **Step 2: Run type and contract checks**

```bash
npx tsc --noEmit --pretty false
npm run check:generation-contract
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 3: Verify on the existing worktree preview**

Open `http://localhost:3014/model/seedance-2-5` and confirm:

- clicking within a purple current-resource token snaps before or after it;
- ArrowLeft/ArrowRight skip the whole token;
- Backspace/Delete remove the whole token;
- dragging across part of a token selects the entire token;
- stale `@...` text remains editable character by character;
- picker, purple hover preview, scroll isolation, and single breadcrumb still work.

No commit, push, branch, merge, or release operation is included because the user did not request repository integration.
