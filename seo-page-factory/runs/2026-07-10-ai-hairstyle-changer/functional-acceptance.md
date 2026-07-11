# Functional Acceptance

Status: passed_for_local_preview

## 页面

- Slug: `ai-hairstyle-changer`
- Page type: AI Tools 图片场景页
- Primary keyword: `ai hairstyle changer`

## 竞品功能承接结论

| Competitor | Upload count | UX pattern | What to learn | What to avoid |
|---|---:|---|---|---|
| VisualGPT | 单次 1，界面总上限未验证 | Female / Male / Custom + 18 张图片卡 | 图片卡片和默认选择 | 含义不清的 0/4、无 before/after |
| Imagine.Art | 1 | Prompt-first + before/after | 默认 prompt、清晰对比 | 没有 preset |
| AI Ease | 1 | Default 80+ + Custom | 双模式、男女长尾 | 模型暴露、脸型和发际线声明 |

## Toolaze 功能方案

- Mode: `image-to-image`
- Max upload images: `1`
- Accepted input: 单人、正面或近正面、脸和头发轮廓完整可见
- Default reference: 清晰正面中性肖像
- Preset strategy: `Women / Men / Custom`
- Women: 11 个图片模板，使用统一女性模特占位图
- Men: 11 个图片模板，使用统一男性模特占位图
- Preset prompt: 内置在每个模板数据中，不向用户显示
- Custom: 不显示模板卡片，仅显示自然语言发型描述输入框
- Template reference: 支持可选 `referenceImage`，真实模板图完成后可作为第二张隐藏参考图
- Result preview: 16:9 before/after
- Model selector: hidden

## Women 预设

- Short Bob
- A-Line Bob
- Long Layers
- Curtain Bangs
- Big Waves
- Pixie Cut
- Wolf Cut
- Top Bun
- Two Braids
- Curly Bob
- Straight Hair

## Men 预设

- Buzz Cut
- Crew Cut
- Bald
- Textured Crop
- Taper Fade
- Messy Fade
- Short Curly
- Slick Back
- Soft Bowl
- Textured Flow
- Short Box Braids

## 本地浏览器验收

- Women：11 个模板，提示词输入框数量为 0。
- Men：11 个模板，包含 Buzz Cut、Crew Cut、Bald，提示词输入框数量为 0。
- Custom：模板卡片数量为 0，显示 1 个本地化描述输入框。
- 页面正文不再渲染 Prompt Examples。

## 不可暗示能力

- 精确剪发模拟
- 自动脸型、肤色、发际线或发质分析
- 保证脸、服装和背景完全不变
- 真实理发结果完全一致
- 无限使用或绝对隐私

## Handoff

- To SEO Content: 写成视觉预览，加入结果差异和照片质量说明。
- To Local Preview: 验证单图 Replace、键盘可访问、Tab 切换、模板选择与 Custom 输入。
- To Design: 最终模板必须使用统一男女模特生成真实发型差异，并覆盖当前同名占位图。
- To PM: 阻止公开模板 Prompt、模型品牌、脸型分析、过强准确性或多图误导。
- To Visual Gate: 最终模板图与顶部 before/after 必须通过同人物一致性检查。
