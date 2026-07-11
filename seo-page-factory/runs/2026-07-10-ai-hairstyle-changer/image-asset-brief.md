# Image Asset Brief

Status: placeholders_ready_final_generation_required

## 统一要求

- 使用一个虚构成年女性模特生成全部 Women 模板。
- 使用一个虚构成年男性模特生成全部 Men 模板。
- 模特五官端正，正面或近正面，完整头部与发际线清楚可见。
- 使用干净中性背景、自然棚拍光线和固定服装。
- 同一性别模板保持脸、姿势、表情、服装、相机角度、光线和背景一致，只改变发型。
- 无品牌、无水印、无文字。
- 模板使用方形 WebP，目标每张不超过 100KB。
- 顶部 before/after 使用 16:9，同一人物仅改变发型。

## Women 模板

| File | Hairstyle |
|---|---|
| `templates/women/short-bob.webp` | Short Bob |
| `templates/women/a-line-bob.webp` | A-Line Bob |
| `templates/women/long-layers.webp` | Long Layers |
| `templates/women/curtain-bangs.webp` | Curtain Bangs |
| `templates/women/big-waves.webp` | Big Waves |
| `templates/women/pixie-cut.webp` | Pixie Cut |
| `templates/women/wolf-cut.webp` | Wolf Cut |
| `templates/women/top-bun.webp` | Top Bun |
| `templates/women/two-braids.webp` | Two Braids |
| `templates/women/curly-bob.webp` | Curly Bob |
| `templates/women/straight-hair.webp` | Straight Hair |

## Men 模板

| File | Hairstyle |
|---|---|
| `templates/men/buzz-cut.webp` | Buzz Cut |
| `templates/men/crew-cut.webp` | Crew Cut |
| `templates/men/bald.webp` | Bald |
| `templates/men/textured-crop.webp` | Textured Crop |
| `templates/men/taper-fade.webp` | Taper Fade |
| `templates/men/messy-fade.webp` | Messy Fade |
| `templates/men/short-curly.webp` | Short Curly |
| `templates/men/slick-back.webp` | Slick Back |
| `templates/men/soft-bowl.webp` | Soft Bowl |
| `templates/men/textured-flow.webp` | Textured Flow |
| `templates/men/short-box-braids.webp` | Short Box Braids |

## 模板生成策略

- 每个模板保留现有内部英文 Prompt，不向用户展示。
- 第一阶段先用统一模特生成发型模板图。
- 第二阶段可将用户照片作为身份参考、模板图作为发型参考，进行双参考图生成。
- 只有在人物一致性、发型辨识度和背景稳定性通过视觉审核后，才为 preset 配置 `referenceImage`。

## Hero Prompt

Use case: identity-preserve

Asset type: AI Hairstyle Changer top tool demo

Primary request: Create a production-ready 16:9 before-and-after split comparison. Left side shows a clear front-facing adult portrait with the original hairstyle. Right side shows the same person, pose, clothing, lighting, background, camera angle, and facial expression with one clearly different popular hairstyle.

Constraints: Keep identity and every non-hair detail visually consistent. Full hair outline visible. No text, labels, logos, watermark, UI, browser frame, or dramatic crop.

## Visual Gate

- 当前 22 张文件仅为占位图。
- 最终模板必须逐张验证发型差异。
- Hero 必须验证同一人物 before/after。
- 未通过前只允许本地预览，不允许发布。
