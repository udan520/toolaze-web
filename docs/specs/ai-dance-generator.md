# AI Dance Generator 功能介绍

> **文件位置**：`docs/specs/ai-dance-generator.md`
> **用途**：AI Dance Generator 落地页的 Seo-Factory 功能规格输入。

## 产品概述

AI Dance Generator 是 Toolaze 的 AI 舞蹈视频场景页，用于上传一张图片并通过提示词转换为短舞蹈视频，包括舞蹈 promo、短视频片段、编舞 mood board、舞台概念和社交媒体创意。

## 支持的功能

- 上传一张图片后生成舞蹈主题短视频。
- 顶部功能区不提供 style / preset 选择。
- 支持用户在 prompt 中描述舞蹈方向、动作、服装、舞台灯光、背景、镜头和用途。
- 顶部功能只能上传一张图片，`maxUploadImages` 必须为 `1`。
- 顶部功能默认模式必须为 `image-to-image`，用于单图输入的视频生成链路。
- 顶部功能使用共享 Toolaze generation workflow。
- 页面公开文案不得露出底层生成模型名称；内部模型配置仍由 `topTool.modelId` 控制。

## 不支持的功能

- 不生成音乐、音频、动作捕捉数据或 3D 骨骼动画。
- 不提供 style / preset 选择器；动作和场景方向全部通过 prompt 描述。
- 不保证真实人物身份复刻；用户不应请求未经授权的真人模仿。

## SEO 内容注意事项

1. 可以写 AI dance video、dance clip、dance promo、choreography concept、short-form social clip。
2. 必须说明当前页面上传一张图片并生成短舞蹈视频。
3. 不要在公开页面文案中说明或询问当前页面使用的底层视频生成模型。
4. 避免声称 no signup，除非后续访问策略明确确认。
