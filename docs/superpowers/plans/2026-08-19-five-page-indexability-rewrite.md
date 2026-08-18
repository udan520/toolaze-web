# Five-Page Indexability Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Rewrite five Toolaze page families across nine locales, add real How To screenshots in the approved position, strengthen evidence and intent differentiation, and provide accurate sitemap update signals.

**Architecture:** Keep existing generator implementations and routes. Add one reusable How To screenshot renderer, extend the three existing page render owners, keep public copy in current JSON/TypeScript sources, and mirror final content into traceable SEO Factory records. Store permanent screenshots and new proof media on R2.

**Tech Stack:** Next.js 15, React 19, TypeScript, locale JSON, Node test runner, SEO Factory JSON, Cloudflare R2, local preview on port 3006.

**Release scope:** Do not create a feature branch. After scoped diff review and all required checks pass, commit only approved files from the current local `main`, fetch and verify `origin/main` alignment, push `origin main`, and verify the Vercel production deployment. Do not submit URLs to GSC unless separately requested.

---

## File Map

Shared rendering:

- Create src/components/blocks/HowToScreenshot.tsx.
- Modify src/components/blocks/HowToUse.tsx.
- Modify src/components/blocks/ToolL2PageContent.tsx.
- Modify src/components/AiImageGeneratorPageContent.tsx.
- Modify src/components/Seedream50ProLandingPage.tsx.

Public copy:

- Modify src/data/{locale}/age-filter.json for all nine locales.
- Modify src/data/{locale}/photo-restoration.json for all nine locales.
- Modify src/data/{locale}/watermark-remover.json for all nine locales.
- Modify src/app/text-to-image-generator/copy.ts.
- Modify src/lib/seedream-5-0-pro-landing-copy.ts.

SEO Factory:

- Update _codex/seo-pipeline/tasks/2026-08-14-age-filter and its nine content files.
- Create 2026-08-19 task folders for photo-restoration, watermark-remover, text-to-image-generator, and seedream-5-0-pro.
- Modify _codex/seo-pipeline/queue/ready.json without removing existing tasks.

Research and media:

- Create _codex/seo-pipeline/research/2026-08-19-five-page-indexability-rewrite.json.
- Create _codex/landing-page-assets/five-page-how-to-screenshots.json.
- Use _codex/previews/five-page-indexability only for temporary captures.

SEO signal and tests:

- Modify src/app/sitemap.ts for five meaningful last-modified dates.
- Create src/components/five-page-how-to-screenshot.contract.test.mjs.
- Create src/components/five-page-indexability-content.test.mjs.
- Modify src/components/age-filter-page-contract.test.mjs.

---

### Task 1: Establish research and claim baselines

**Files:**

- Create: _codex/seo-pipeline/research/2026-08-19-five-page-indexability-rewrite.json
- Read: the five English copy sources
- Read: src/lib/ai-image-generator-config.ts
- Read: functions/api/image-to-image.js

- [ ] **Step 1: Create the research record**

Use this exact top-level shape:

~~~json
{
  "checkedAt": "2026-08-19",
  "locales": ["en", "de", "ja", "es", "zh-TW", "pt", "fr", "ko", "it"],
  "pages": {
    "age-filter": {"intentOwner": "/age-filter", "toolFacts": [], "competitorResearch": [], "claimLedger": []},
    "photo-restoration": {"intentOwner": "/photo-restoration", "toolFacts": [], "competitorResearch": [], "claimLedger": []},
    "watermark-remover": {"intentOwner": "/watermark-remover", "toolFacts": [], "competitorResearch": [], "claimLedger": []},
    "text-to-image-generator": {"intentOwner": "/text-to-image-generator", "excludedIntentOwner": "/ai-image-generator", "toolFacts": [], "competitorResearch": [], "claimLedger": []},
    "seedream-5-0-pro": {"intentOwner": "/model/seedream-5-0-pro", "toolFacts": [], "competitorResearch": [], "claimLedger": [], "releaseThesis": {}}
  }
}
~~~

- [ ] **Step 2: Complete the fixed seven-competitor gate for every page**

Inspect the nearest public page from EaseMate AI, Pollo AI, OpenArt, ImagineArt, Topview, Artlist, and Krea. Record competitor, query, URL, page type, relevance, section order, workflow proof, questions answered, content gap, and non-portable claims. Use N/A with a reason when no relevant page exists.

- [ ] **Step 3: Verify Seedream 5.0 Pro facts**

Record BytePlus/ByteDance official sources and the current Toolaze implementation. The verified Toolaze baseline is:

~~~json
{
  "modelId": "seedream-5-0-pro",
  "modes": ["text-to-image", "image-to-image"],
  "resolutions": ["1K", "2K"],
  "maxReferenceImages": 10,
  "providerTextRoute": "seedream/5-pro-text-to-image",
  "providerImageRoute": "seedream/5-pro-image-to-image"
}
~~~

Do not publish current UI defaults as official maximum capabilities unless official sources confirm them.

- [ ] **Step 4: Complete Seedream release thesis and feature evidence**

Populate releaseThesis, competitorFeatureExtraction, and officialFeatureEvidence. Every retained feature needs official evidence, a user outcome, matching Pro proof media, and a passing sibling-substitution result.

- [ ] **Step 5: Validate the research gate**

Run:

~~~bash
node -e "const r=require('./_codex/seo-pipeline/research/2026-08-19-five-page-indexability-rewrite.json'); for(const [s,p] of Object.entries(r.pages)){if(p.competitorResearch.length!==7) throw new Error(s); if(!p.claimLedger.length) throw new Error(s)} console.log('research gate passed')"
~~~

Expected: research gate passed.

### Task 2: Write failing screenshot and content contracts

**Files:**

- Create: src/components/five-page-how-to-screenshot.contract.test.mjs
- Create: src/components/five-page-indexability-content.test.mjs
- Modify: src/components/age-filter-page-contract.test.mjs

- [ ] **Step 1: Test renderer position**

Verify HowToScreenshot uses object-contain and appears before step mapping in HowToUse, AiImageGeneratorPageContent, and Seedream50ProLandingPage.

~~~js
assert.match(shared, /object-contain/)
assert.ok(l2.indexOf('<HowToScreenshot') < l2.indexOf('steps.map'))
assert.ok(imagePage.indexOf('<HowToScreenshot') < imagePage.indexOf('copy.howTo.steps.map'))
assert.ok(seedream.indexOf('<HowToScreenshot') < seedream.indexOf('copy.howTo.steps.map'))
~~~

- [ ] **Step 2: Test JSON page content**

For age-filter, photo-restoration, and watermark-remover in every locale:

~~~js
assert.match(page.howToUse.screenshot.src, /^https:\/\/assets\.toolaze\.com\//)
assert.ok(page.howToUse.screenshot.alt.trim())
assert.equal(page.howToUse.steps.length, 3)
assert.ok(page.faq.length <= 6)
assert.doesNotMatch(JSON.stringify(page), /4\.9\/5|10K\+|Trusted by Thousands|Unlimited Free|Free Forever|No Login/i)
~~~

Require non-English screenshot alt text to differ from English.

- [ ] **Step 3: Test TypeScript copy sources**

Assert text-to-image and Seedream Pro define localized howTo.screenshot data, use R2 URLs, expose three steps, and remove Coming Soon, upcoming, Model preview, Preview workflow, and the Lite substitute from Pro visible copy.

- [ ] **Step 4: Prove the tests fail first**

Run:

~~~bash
node --test src/components/five-page-how-to-screenshot.contract.test.mjs src/components/five-page-indexability-content.test.mjs src/components/age-filter-page-contract.test.mjs
~~~

Expected: FAIL because the screenshot contract does not exist.

### Task 3: Implement shared screenshot rendering

**Files:**

- Create: src/components/blocks/HowToScreenshot.tsx
- Modify: src/components/blocks/HowToUse.tsx
- Modify: src/components/blocks/ToolL2PageContent.tsx
- Modify: src/components/AiImageGeneratorPageContent.tsx
- Modify: src/components/Seedream50ProLandingPage.tsx

- [ ] **Step 1: Create the reusable interface**

~~~tsx
export type HowToScreenshotData = {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}
~~~

Render one figure with an image using aspect-video, object-contain, lazy loading, default 1600×900 dimensions, and an optional localized figcaption.

- [ ] **Step 2: Extend HowToUse**

Add optional subtitle and screenshot props. Render H2, subtitle, screenshot, then the numbered grid. Preserve existing behavior when the fields are absent.

- [ ] **Step 3: Pass data through ToolL2PageContent**

Pass content.howToUse.subtitle and content.howToUse.screenshot. Do not add slug-specific ownership lists.

- [ ] **Step 4: Extend the two specialist pages**

Add the same screenshot type to text-to-image and Seedream Pro copy types. Render it immediately after the current section heading and before step mapping.

- [ ] **Step 5: Verify**

Run:

~~~bash
node --test src/components/five-page-how-to-screenshot.contract.test.mjs
~~~

Expected: PASS.

### Task 4: Capture and upload five real screenshots

**Files:**

- Create: _codex/landing-page-assets/five-page-how-to-screenshots.json
- Temporary: _codex/previews/five-page-indexability/*.png and *.webp

- [ ] **Step 1: Start the main preview**

Run npm run dev and use http://localhost:3006.

- [ ] **Step 2: Capture the generator area**

Capture one 1600×900 workflow image from each English page. Show the page-specific input or preset and Generate action. Exclude browser chrome, account data, history, credit balances, and unrelated navigation. Do not bake localized text annotations into the screenshot.

- [ ] **Step 3: Convert to WebP**

Keep visible UI text legible and target less than 102400 bytes. Record any justified exception in the manifest.

- [ ] **Step 4: Upload to stable R2 keys**

~~~bash
./scripts/quick-upload.sh "_codex/previews/five-page-indexability/age-filter-how-to.webp" "landing-pages/age-filter/how-to/workflow.webp"
./scripts/quick-upload.sh "_codex/previews/five-page-indexability/photo-restoration-how-to.webp" "landing-pages/photo-restoration/how-to/workflow.webp"
./scripts/quick-upload.sh "_codex/previews/five-page-indexability/watermark-remover-how-to.webp" "landing-pages/watermark-remover/how-to/workflow.webp"
./scripts/quick-upload.sh "_codex/previews/five-page-indexability/text-to-image-generator-how-to.webp" "landing-pages/text-to-image-generator/how-to/workflow.webp"
./scripts/quick-upload.sh "_codex/previews/five-page-indexability/seedream-5-0-pro-how-to.webp" "landing-pages/seedream-5-0-pro/how-to/workflow.webp"
~~~

- [ ] **Step 5: Record and verify URLs**

Manifest fields: slug, localSource, r2Url, width, height, bytes, capturedAt, sourcePath. Require HTTP 200 from every R2 URL.

### Task 5: Create SEO Factory records before public copy

**Files:**

- Modify: _codex/seo-pipeline/queue/ready.json
- Update: existing Age Filter task and content files
- Create: four new task folders and 36 locale content files

- [ ] **Step 1: Create loader-compatible task records**

Use pageType l2 for photo restoration, watermark remover, and text-to-image. Use pageType model for Seedream Pro. Every task uses status ready_for_publish and all nine locales.

- [ ] **Step 2: Merge queue entries**

Preserve every existing queue task. Reject duplicate task IDs and duplicate new slug entries.

- [ ] **Step 3: Create all 45 traceability records**

Each locale record includes taskId, slug, pageType, status, locale, sourceData, competitorResearchRef, claimLedgerRef, and mediaManifestRef.

- [ ] **Step 4: Validate**

Run a Node check requiring five tasks, 45 locale records, ready_for_publish status, and ready-queue references.

### Task 6: Rewrite Age Filter in nine locales

**Files:**

- Modify: src/data/{locale}/age-filter.json
- Modify: existing Age Filter Factory content files
- Modify: src/components/age-filter-page-contract.test.mjs

- [ ] **Step 1: Rewrite English around independent answers**

Keep the five real presets. Cover suitable portrait inputs, Preset versus Custom, whole-portrait age consistency, identity/background variation, common failures, creative-use limits, and download workflow. Keep four proof examples, three evidence-backed features, three steps, and no more than six FAQ entries.

- [ ] **Step 2: Add the screenshot**

Use https://assets.toolaze.com/landing-pages/age-filter/how-to/workflow.webp with localized alt and caption.

- [ ] **Step 3: Localize eight non-English versions**

Preserve prompt and safety semantics. Localize all visible nested fields without English body fallback.

- [ ] **Step 4: Sync Factory content and test**

~~~bash
node --test src/components/age-filter-page-contract.test.mjs src/components/five-page-indexability-content.test.mjs
~~~

Expected: PASS for Age Filter.

### Task 7: Rewrite Photo Restoration in nine locales

**Files:**

- Modify: src/data/{locale}/photo-restoration.json
- Modify: Photo Restoration Factory content files

- [ ] **Step 1: Remove weak claims**

Delete the rating section, 4.9/5 FROM 10K+ CREATORS, generic secure-processing promises, and duplicated Generate steps.

- [ ] **Step 2: Rewrite the page**

Cover scratch/dust cleanup, fading/contrast, fixed colorization behavior, suitable scan quality, details that cannot be reliably reconstructed, faces/textures that may need another pass, single-image limits, supported inputs, and when a manual editor is preferable. Put performance metrics immediately above FAQ.

- [ ] **Step 3: Add screenshot and three steps**

Use the stable R2 workflow screenshot. Steps: upload, generate/inspect, download.

- [ ] **Step 4: Localize and synchronize Factory content**

Recursively localize all nested fields.

- [ ] **Step 5: Test**

~~~bash
node --test src/components/five-page-indexability-content.test.mjs
npx tsx --test src/app/legal-copy.test.ts
~~~

Expected: PASS.

### Task 8: Rewrite Watermark Remover in nine locales

**Files:**

- Modify: src/data/{locale}/watermark-remover.json
- Modify: Watermark Remover Factory content files

- [ ] **Step 1: Remove unverifiable claims**

Delete No Account, No Limit, Trusted by Thousands, 4.9/5 FROM 10K+ CREATORS, unsupported storage promises, and absolute success claims. Keep lawful-use guidance.

- [ ] **Step 2: Rewrite around proof and failure modes**

Cover corner overlays, repeated translucent overlays, text/date overlays, inpainting, uniform versus detailed backgrounds, faces/fine textures, supported inputs, compare/download workflow, and when to use an editor or licensed source replacement.

- [ ] **Step 3: Add screenshot and three steps**

Place the R2 screenshot after H2/subtitle and before numeric steps.

- [ ] **Step 4: Localize, sync, and test**

~~~bash
node --test src/components/five-page-indexability-content.test.mjs
npx tsx --test src/app/legal-copy.test.ts
~~~

Expected: PASS.

### Task 9: Rewrite Text to Image Generator in nine locales

**Files:**

- Modify: src/app/text-to-image-generator/copy.ts
- Modify: Text to Image Factory content files

- [ ] **Step 1: Lock the intent boundary**

Keep /ai-image-generator broad. Make this page own text-only ideation, prompt anatomy, exposed output settings, diagnosis, readable text requests, composition control, and the switch to image-to-image when preservation matters.

- [ ] **Step 2: Rewrite without word-count padding**

Keep four distinct outputs and four usable prompts. Remove repeated advice across What Is, Features, Tips, and FAQ. Keep no more than six FAQ entries.

- [ ] **Step 3: Add screenshot and three steps**

Steps: write a testable prompt, choose supported settings, generate/review/refine.

- [ ] **Step 4: Fully localize all copy objects**

Do not inherit English visible body fields through base merging. English is allowed only for copyable prompts and model/brand names.

- [ ] **Step 5: Sync and test**

~~~bash
node --test src/components/five-page-indexability-content.test.mjs
npx tsx --test src/lib/localization-coverage.test.ts
~~~

Expected: PASS.

### Task 10: Rewrite Seedream 5.0 Pro in nine locales

**Files:**

- Modify: src/lib/seedream-5-0-pro-landing-copy.ts
- Modify: src/components/Seedream50ProLandingPage.tsx
- Modify: Seedream Pro Factory content files

- [ ] **Step 1: Remove obsolete preview positioning**

Remove Coming Soon, upcoming, Model preview, Preview workflow, and Lite substitute references. Hero and schema describe the live modelId seedream-5-0-pro workflow.

- [ ] **Step 2: Rewrite from verified evidence**

Use official model evidence and current Toolaze behavior. Key Features pass official-evidence and sibling-substitution gates. Comparisons use objective, supported fields without invented maxima.

- [ ] **Step 3: Use real Pro proof on R2**

Any retained core proof must be a real Pro result. Lite results and decorative local files cannot support Pro claims.

- [ ] **Step 4: Add screenshot and three steps**

Steps: choose text/reference input, choose supported settings, generate/review Pro output. Synchronize HowTo schema.

- [ ] **Step 5: Fully localize and synchronize Factory content**

Preserve the release thesis and model-specific differentiators.

- [ ] **Step 6: Test**

~~~bash
npx tsx --test src/lib/special-model-og-metadata.unit.test.ts src/lib/localization-coverage.test.ts
node --test src/components/five-page-indexability-content.test.mjs
npm run check:generation-contract
~~~

Expected: PASS.

### Task 11: Apply humanizer and similarity gates

**Files:**

- Modify: final public and Factory content as required by the gate

- [ ] **Step 1: Review section information gain**

Every section owns one decision question. Remove claims repeated in FAQ, How To, Use Cases, and secondary cards.

- [ ] **Step 2: Run the negative-language scan**

Scan public and Factory content for internal SEO/editorial language, unsupported Free/Unlimited/login/privacy/speed claims, fake ratings, Coming Soon, and upcoming. Fix user-visible hits.

- [ ] **Step 3: Run same-site similarity checks**

Compare text-to-image versus AI Image Generator; Seedream Pro versus Lite and 4.5; Photo Restoration versus Watermark Remover; Age Filter versus AI Baby Generator. Record whole-page and heading/FAQ similarity in research JSON.

- [ ] **Step 4: Run visible-copy guardrails**

~~~bash
npm run check:visible-copy
~~~

Expected: PASS.

### Task 12: Update accurate sitemap dates and smoke routes

**Files:**

- Modify: src/app/sitemap.ts
- Test: existing sitemap contract tests discovered with rg

- [ ] **Step 1: Add five meaningful dates**

~~~ts
'/age-filter': '2026-08-19',
'/photo-restoration': '2026-08-19',
'/watermark-remover': '2026-08-19',
'/text-to-image-generator': '2026-08-19',
'/model/seedream-5-0-pro': '2026-08-19',
~~~

Do not change unrelated dates or the global fallback.

- [ ] **Step 2: Verify sitemap output**

All 45 canonical/localized URLs remain present, English has no /en prefix, and last modified is 2026-08-19.

- [ ] **Step 3: Smoke all 45 routes on port 3006**

Require HTTP 200, one H1, self-canonical, correct hreflang, indexable robots, three How To steps, and the screenshot in the approved DOM position.

- [ ] **Step 4: Inspect representative layouts**

Inspect all five English pages plus German, Japanese, and French at desktop and mobile widths. Confirm screenshot legibility, no crop/stretch, correct heading order, and no untranslated blocks.

### Task 13: Final verification, production release, and handoff

**Files:**

- Review only the approved scoped diff

- [ ] **Step 1: Run fresh targeted verification**

~~~bash
node --test src/components/five-page-how-to-screenshot.contract.test.mjs src/components/five-page-indexability-content.test.mjs src/components/age-filter-page-contract.test.mjs
npx tsx --test src/app/legal-copy.test.ts src/lib/special-model-og-metadata.unit.test.ts src/lib/localization-coverage.test.ts
npm run check:visible-copy
npm run check:generation-contract
~~~

Expected: all exit 0.

- [ ] **Step 2: Run build because shared TypeScript rendering changed**

~~~bash
npm run build
~~~

Expected: exit 0. If an unrelated existing check blocks it, report the exact failure and do not claim a clean build.

- [ ] **Step 3: Recheck R2 assets**

Require HTTP 200 and image/webp for every new screenshot and proof URL.

- [ ] **Step 4: Preserve unrelated dirty work and create the scoped release commit**

Do not stage, delete, reformat, or modify unrelated files. Stage only the approved five-page public content, shared screenshot renderer, tests, sitemap dates, SEO Factory records, research record, design/plan, and media manifest. Review `git diff --cached --name-only` before committing.

- [ ] **Step 5: Verify main alignment and publish**

Run `git fetch origin main && git status -sb`. Proceed only when local `main` is aligned with or linearly ahead of `origin/main`; stop on behind or diverged history. Push with `git push origin main`, then verify the resulting Vercel production deployment and the five production URLs.

- [ ] **Step 6: Hand off previews and production evidence**

~~~text
http://localhost:3006/age-filter
http://localhost:3006/photo-restoration
http://localhost:3006/watermark-remover
http://localhost:3006/text-to-image-generator
http://localhost:3006/model/seedream-5-0-pro
~~~

Report the release commit, push result, Vercel production status, five production smoke results, test evidence, R2 status, remaining blockers, and that no GSC submission occurred.
