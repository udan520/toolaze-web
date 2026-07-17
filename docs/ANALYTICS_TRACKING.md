# Toolaze Analytics Tracking

最后更新：2026-07-17

本文档用于记录 Toolaze 当前使用的 GA4 自定义事件。后续新增、重命名或删除埋点时，需要同步更新这张表，避免事件散落在代码里没人知道。

## Custom Events

| 事件名 | 含义 | 触发时机 | 主要位置 | 后续结果 | 关键参数 | 隐私说明 |
| --- | --- | --- | --- | --- | --- | --- |
| `image_generate_click` | 用户点击生图组件的 `Generate`，代表一次真实生成意图。 | 本地表单校验通过后触发，在登录、点数、提示词审核、生图 API 请求之前。 | `AiImageGenerationTool`，用于 AI Image Generator 和各模型页。 | 后续可能继续生成，也可能打开登录弹窗、展示点数不足弹窗、被审核拦截或 API 失败。 | `source`, `page_path`, `model_id`, `model_name`, `generation_mode`, `resolution`, `aspect_ratio`, `output_format`, `credit_cost`, `has_reference_images`, `reference_image_count`, `preset_mode` | 不包含 prompt 文本、图片 URL、上传文件、用户标识、点数余额或邮箱。 |
| `credit_paywall_view` | 点数不足付费弹窗展示。 | `creditExhaustedModalOpen` 变为 true 时触发。 | `AiImageGenerationTool` 内的点数不足弹窗。 | 用户看到购买点数或赚取免费点数的选择。 | 生图上下文参数，外加 `paywall_type` | 不包含 prompt 文本、图片 URL、用户标识、点数余额或邮箱。 |
| `credit_paywall_cta_click` | 用户点击点数不足弹窗里的 CTA。 | 付费弹窗 CTA 点击时触发，在弹窗关闭和页面跳转之前。 | `AiImageGenerationTool` 内的点数不足弹窗。 | 用户跳转到 `/pricing` 或 `/earn-credits`。 | 生图上下文参数，外加 `paywall_type`, `cta`, `destination` | 不包含 prompt 文本、图片 URL、用户标识、点数余额或邮箱。 |
| `waitlist_signup` | 用户在 Seedance 2.5 上线提醒表单中提交了有效邮箱。 | 邮箱格式校验通过，并写入本地 waitlist storage 后触发。 | `Seedance25LaunchUpdates`。 | 页面展示本地成功状态。 | `model`, `page_type`, `signup_location` | 邮箱只保存在用户本地 storage，不会作为 GA4 事件参数发送。 |

## Parameter Dictionary

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `source` | string | 发出事件的组件或流程，例如 `nano_banana_tool`。当前值先保持兼容，后续可单独改成更通用的 `ai_image_generation_tool`。 |
| `page_path` | string | 当前页面路径，包含多语言前缀。 |
| `model_id` | string | 内部 AI 生图模型 id。 |
| `model_name` | string | UI 中展示的模型名称。 |
| `generation_mode` | string | 生图模式，当前为 `text-to-image` 或 `image-to-image`。 |
| `resolution` | string | 用户选择的输出分辨率。 |
| `aspect_ratio` | string | 用户选择的输出比例。 |
| `output_format` | string | 模型支持输出格式时，记录用户选择的格式。 |
| `credit_cost` | number | 当前生图配置需要消耗的 credits。 |
| `has_reference_images` | boolean | 用户是否选择了本地或远程参考图。 |
| `reference_image_count` | number | 本地参考图和远程参考图的总数量。 |
| `preset_mode` | string | 工具预设模式，例如 `default` 或 `ai-couple-photo-maker`。 |
| `paywall_type` | string | 付费墙出现原因，当前为 `credit_exhausted`。 |
| `cta` | string | 付费墙按钮 id，当前为 `buy_credits` 或 `earn_free_credits`。 |
| `destination` | string | CTA 点击后的目标路径。 |
| `model` | string | 营销页或 waitlist 场景下的模型 slug。 |
| `page_type` | string | waitlist 事件使用的页面类型。 |
| `signup_location` | string | waitlist 表单所在的页面位置。 |

## Implementation Rules

- 新增事件优先使用 `src/lib/analytics.ts` 中的 `trackToolazeEvent()`。
- 只有旧代码尚未迁移时，才保留直接调用 `window.gtag('event', ...)`。
- 埋点中不要发送 prompt 文本、图片 URL、上传文件名、用户 id、邮箱、IP、点数余额或支付信息。
- 每个自定义事件上线前都必须补到 Custom Events 表里。
