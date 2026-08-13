# AI Clothes Changer 女装奢华预设实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 AI Clothes Changer 女装目录更新为 3 套西装、1 套成人泳装和 4 套高定礼服，并用 KIE GPT Image 2 的全身参考图接入所有 locale。

**Architecture:** 新增一个仅用于生成与暂存预设素材的脚本，复用项目内 KIE job 创建、轮询和下载模式。通过现有 R2 上传凭据将经压缩的 WebP 上传到稳定 URL，再用同一份英文 asset 目录同步替换各 locale 的女装预设数据；契约测试锁定目录构成、资源 URL 和双图换装语义。

**Tech Stack:** Node.js、KIE Jobs API (`gpt-image-2-text-to-image`)、Sharp、Cloudflare R2/S3 兼容 API、Node test runner、JSON 页面数据。

---

### Task 1: 锁定预设目录契约（RED）

**Files:**
- Modify: `src/components/ai-clothes-changer-presets.contract.test.mjs:5-16`

- [ ] **Step 1: 写入新的英文女装期望目录与构成断言**

```js
const expectedWomen = [
  'Black Evening Suit',
  'Caramel Quiet-Luxury Suit',
  'Blush Satin Suit',
  'Classic Black Swim',
  'Emerald Red-Carpet Gown',
  'Burgundy Velvet Mermaid Gown',
  'Ivory Architectural Couture',
  'Midnight Celestial Couture',
]

test('English women catalog keeps the approved luxury wardrobe mix', () => {
  const women = readContent('en').topTool.functionalAcceptance.presets
    .filter((item) => item.group === 'women')
  assert.deepEqual(women.map((item) => item.label), expectedWomen)
  assert.equal(women.filter((item) => /Suit$/.test(item.label)).length, 3)
  assert.equal(women.filter((item) => /Swim$/.test(item.label)).length, 1)
  assert.equal(women.filter((item) => /(Gown|Couture)$/.test(item.label)).length, 4)
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test src/components/ai-clothes-changer-presets.contract.test.mjs`

Expected: FAIL，英文女装目录仍包含旧的日常装标签。

### Task 2: 生成并发布八张服装参考素材

**Files:**
- Create: `scripts/generate-ai-clothes-changer-women-presets.js`
- Create: `tmp/ai-clothes-changer-women-presets/*.webp`（临时文件，不加入版本控制）

- [ ] **Step 1: 定义八个独立的 GPT Image 2 生成 prompt**

每个资产使用 `gpt-image-2-text-to-image`、`aspect_ratio: '9:16'`、`quality: 'basic'`、`output_format: 'png'`，并共享以下硬约束：

```text
Create a photorealistic premium fashion reference image for an AI clothes changer.
Show exactly one adult woman, standing naturally, fully visible from head to toe with shoes or full hem visible.
Use a simple neutral studio backdrop and soft editorial lighting.
The complete outfit must be easy to read: garment layers, silhouette, hem, fabric, shoes, and accessories.
No text, watermark, brand logo, other people, cropped body, isolated garment, sexualized pose, nudity, or transparent clothing.
```

资产 slug 与主要衣装描述固定为：

```js
const assets = [
  ['black-evening-suit', 'tailored black evening tuxedo suit with satin lapels and slim black trousers'],
  ['caramel-quiet-luxury-suit', 'caramel brown quiet-luxury double-breasted suit with silk blouse and matching wide-leg trousers'],
  ['blush-satin-suit', 'blush pink satin power suit with a sculpted blazer, tonal camisole and tailored trousers'],
  ['classic-black-swim', 'tasteful black one-piece adult swimwear with an elegant wrap detail and a lightweight black resort cover-up'],
  ['emerald-red-carpet-gown', 'emerald green satin floor-length red-carpet gown with a draped waist and a refined asymmetric neckline'],
  ['burgundy-velvet-mermaid-gown', 'deep burgundy velvet floor-length mermaid evening gown with elegant long sleeves and a soft train'],
  ['ivory-architectural-couture', 'ivory architectural couture gown with structured pleats, a sculptural cape-like shoulder detail and a full-length skirt'],
  ['midnight-celestial-couture', 'midnight blue celestial couture gown with restrained gold constellation beadwork, layered chiffon and statement sleeves'],
]
```

- [ ] **Step 2: 复用 KIE job 创建、轮询与下载模式实现脚本**

脚本从 `.env.local` 读取 `KIE_AI_API_KEY`，对每个资产创建任务、轮询 `recordInfo` 至成功、下载原图至 `tmp/ai-clothes-changer-women-presets/<slug>.png`。任一任务失败时保留已生成文件并以失败 slug 退出，便于只重跑失败项。

- [ ] **Step 3: 使用 Sharp 将每张图压缩为 WebP 并做基本尺寸检查**

```js
await sharp(sourcePath)
  .resize({ height: 1440, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(webpPath)

const metadata = await sharp(webpPath).metadata()
if (!metadata.width || !metadata.height || metadata.height <= metadata.width) {
  throw new Error(`${slug} must remain portrait after conversion`)
}
```

- [ ] **Step 4: 上传 WebP 到 R2 的稳定目标键**

目标 key 固定为：

```text
landing-pages/ai-clothes-changer/presets/women/<slug>.webp
```

上传后，脚本对每个 `https://assets.toolaze.com/landing-pages/ai-clothes-changer/presets/women/<slug>.webp` 发起 GET 并要求 `2xx` 与 `image/webp` 内容类型。

### Task 3: 更新英文与所有 locale 预设数据（GREEN）

**Files:**
- Modify: `src/data/en/ai-clothes-changer.json:44-108`
- Modify: `src/data/de/ai-clothes-changer.json`
- Modify: `src/data/es/ai-clothes-changer.json`
- Modify: `src/data/fr/ai-clothes-changer.json`
- Modify: `src/data/it/ai-clothes-changer.json`
- Modify: `src/data/ja/ai-clothes-changer.json`
- Modify: `src/data/ko/ai-clothes-changer.json`
- Modify: `src/data/pt/ai-clothes-changer.json`
- Modify: `src/data/zh-TW/ai-clothes-changer.json`

- [ ] **Step 1: 按固定顺序替换每个 locale 的 women preset 数据**

每一项保持以下字段约束：

```json
{
  "label": "<localized label>",
  "group": "women",
  "prompt": "Image 1 is the person photo. Image 2 is the target clothing reference. Put the complete <localized outfit description> from image 2 onto the person in image 1. Preserve the same face, identity, age, skin tone, hair, body shape, body proportions, pose, hands, background, lighting, camera angle, and framing from image 1. Match the garment layers, coverage, fabric, color, fit, footwear, and silhouette from image 2 as closely as possible. Keep the result realistic, tasteful, fully dressed in the target outfit, and free of invented brand logos.",
  "image": "https://assets.toolaze.com/landing-pages/ai-clothes-changer/presets/women/<slug>.webp",
  "referenceImage": "https://assets.toolaze.com/landing-pages/ai-clothes-changer/presets/women/<slug>.webp",
  "swatch": "<matching palette gradient>"
}
```

- [ ] **Step 2: 保持非英文标签为真实本地化字符串**

不复用英文目录原文；每个 locale 的 labels 必须仍是 16 个唯一值。男装八项不得改动。

- [ ] **Step 3: 运行更新后的契约测试确认通过**

Run: `node --test src/components/ai-clothes-changer-presets.contract.test.mjs`

Expected: PASS，所有 locale 的列表结构、R2 资源路径、双图换装 prompt 和本地化标签均满足契约。

### Task 4: 验收资源与页面行为

**Files:**
- Verify: `src/components/AiImageGenerationTool.tsx`
- Verify: `src/components/ai-clothes-changer-presets.contract.test.mjs`

- [ ] **Step 1: 执行远程资产 smoke**

Run: `node scripts/generate-ai-clothes-changer-women-presets.js --verify-only`

Expected: 8 个 R2 URL 皆返回 `2xx` 与 `image/webp`，且每个文件是竖版 WebP。

- [ ] **Step 2: 运行预设路径测试**

Run: `node --test src/components/ai-clothes-changer-presets.contract.test.mjs`

Expected: PASS，测试覆盖 preset 选中后作为 Image 2、请求资源映射与四列 9:16 网格。

- [ ] **Step 3: 在非 3006 端口运行本地页面 smoke**

Run: `npm run dev -- --port 3017`

Open: `http://localhost:3017/ai-clothes-changer`

Expected: Women tab 显示 8 张竖版预设图，选中卡片后可作为服装参考图进入生成准备状态；不启动、占用或推荐 3006 端口。

- [ ] **Step 4: 检查改动边界**

Run: `git diff --check && git diff -- src/data/en/ai-clothes-changer.json src/data/de/ai-clothes-changer.json src/data/es/ai-clothes-changer.json src/data/fr/ai-clothes-changer.json src/data/it/ai-clothes-changer.json src/data/ja/ai-clothes-changer.json src/data/ko/ai-clothes-changer.json src/data/pt/ai-clothes-changer.json src/data/zh-TW/ai-clothes-changer.json src/components/ai-clothes-changer-presets.contract.test.mjs scripts/generate-ai-clothes-changer-women-presets.js`

Expected: 仅包含女装预设、对应测试与一次性可复验资产脚本的相关更改；不提交、不推送、不发布。
