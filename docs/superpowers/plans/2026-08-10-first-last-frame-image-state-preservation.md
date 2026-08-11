# First/Last Frame Image State Preservation Implementation Plan

> **For agentic workers:** Execute inline in the current session. Do not create a branch or commit unless the user explicitly requests it.

**Goal:** Preserve ordinary reference images when users switch First/Last Frames on and off, while retaining the existing video and audio cleanup.

**Architecture:** Keep the existing independent ordinary-image and first/last-frame state collections. Change only the toggle handler so it no longer destroys ordinary image state; the existing `isUsingFirstLastFrame` branches continue to control visible inputs and request payload selection.

**Tech Stack:** React 19, TypeScript, Next.js 15, Node test runner through `tsx`.

---

### Task 1: Add the regression contract

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.layout.test.ts`
- Test: `src/components/AiVideoGeneratorTool.layout.test.ts`

- [ ] **Step 1: Write the failing test**

Add this focused test beside the existing First/Last Frames layout contract:

```ts
test('AI video generator preserves ordinary reference images when first/last-frame mode toggles', () => {
  const toggleHandler = extractConstFunctionSource('handleFirstLastFrameToggle')

  assert.doesNotMatch(toggleHandler, /imageFilesRef\.current\.forEach/, 'the toggle must not revoke ordinary local image previews')
  assert.doesNotMatch(toggleHandler, /imageFilesRef\.current = \[\]/, 'the toggle must not reset the ordinary local image ref')
  assert.doesNotMatch(toggleHandler, /setImageFiles\(\[\]\)/, 'the toggle must preserve ordinary local images')
  assert.doesNotMatch(toggleHandler, /setRemoteImageUrls\(\[\]\)/, 'the toggle must preserve ordinary remote images')
  assert.match(toggleHandler, /motionVideoFilesRef\.current\.forEach/, 'the toggle should keep clearing incompatible reference videos')
  assert.match(toggleHandler, /audioFilesRef\.current\.forEach/, 'the toggle should keep clearing incompatible reference audio')
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npx tsx --test src/components/AiVideoGeneratorTool.layout.test.ts
```

Expected: the new test fails because `handleFirstLastFrameToggle` currently revokes and resets ordinary reference images.

### Task 2: Preserve ordinary image state

**Files:**
- Modify: `src/components/AiVideoGeneratorTool.tsx`
- Test: `src/components/AiVideoGeneratorTool.layout.test.ts`

- [ ] **Step 1: Apply the minimal implementation**

Remove only these ordinary-image cleanup statements from `handleFirstLastFrameToggle`:

```ts
imageFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
imageFilesRef.current = []
setImageFiles([])
setRemoteImageUrls([])
```

Keep the existing reference video and audio cleanup unchanged.

- [ ] **Step 2: Run the targeted test and verify GREEN**

Run:

```bash
npx tsx --test src/components/AiVideoGeneratorTool.layout.test.ts
```

Expected: all tests pass.

- [ ] **Step 3: Run the directly related generator contract**

Run:

```bash
node --test src/components/AiVideoGeneratorTool.shared-contract.test.mjs
```

Expected: all tests pass.

- [ ] **Step 4: Verify the local page**

Run:

```bash
curl --max-time 20 -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3014/model/seedance-2-5
```

Expected: `200`.
