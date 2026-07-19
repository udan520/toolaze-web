# Toolaze Analytics Tracking

最后更新：2026-07-20

本文档用于记录 Toolaze 当前使用的 GA4 自定义事件。后续新增、重命名或删除埋点时，需要同步更新这张表，避免事件散落在代码里没人知道。

## Custom Events

| 事件名 | 含义 | 触发时机 | 主要位置 | 后续结果 | 关键参数 | 隐私说明 |
| --- | --- | --- | --- | --- | --- | --- |
| `image_generate_click` | 用户点击生图组件的 `Generate`，代表一次真实生成意图。 | 本地表单校验通过后触发，在登录、点数、提示词审核、生图 API 请求之前。 | `AiImageGenerationTool`，用于 AI Image Generator 和各模型页。 | 后续可能继续生成，也可能打开登录弹窗、展示点数不足弹窗、被审核拦截或 API 失败。 | `source`, `page_path`, `model_id`, `model_name`, `generation_mode`, `resolution`, `aspect_ratio`, `output_format`, `credit_cost`, `has_reference_images`, `reference_image_count`, `preset_mode` | 不包含 prompt 文本、图片 URL、上传文件、用户标识、点数余额或邮箱。 |
| `credit_insufficient_modal_view` | 点数不足弹窗展示。 | `creditExhaustedModalOpen` 变为 true 时触发。 | `AiImageGenerationTool` 内的点数不足弹窗。 | 用户看到购买点数或免费获得积分的选择。 | 生图上下文参数 | 不包含 prompt 文本、图片 URL、用户标识、点数余额或邮箱。 |
| `credit_insufficient_buy_credits_button_click` | 用户点击点数不足弹窗里的 Buy Credits 按钮。 | 点击点数不足弹窗的 Buy Credits 按钮时触发，在弹窗关闭和页面跳转之前。 | `AiImageGenerationTool` 内的点数不足弹窗。 | 用户跳转到 `/pricing`。 | 生图上下文参数，外加 `destination` | 不包含 prompt 文本、图片 URL、用户标识、点数余额、支付信息或邮箱。 |
| `credit_insufficient_earn_free_credits_button_click` | 用户点击点数不足弹窗里的 Earn Free Credits 按钮。 | 点击点数不足弹窗的 Earn Free Credits 按钮时触发，在弹窗关闭和页面跳转之前。 | `AiImageGenerationTool` 内的点数不足弹窗。 | 用户跳转到 `/earn-credits`。 | 生图上下文参数，外加 `destination` | 不包含 prompt 文本、图片 URL、用户标识、点数余额或邮箱。 |
| `login_modal_view` | 登录弹窗展示。 | `authModalOpen` 变为 true 时触发。 | `Navigation` 内的全局登录弹窗。 | 用户看到 Google 登录入口。 | `source`, `page_path` | 不包含用户 id、邮箱、点数余额或登录 token。 |
| `pricing_buy_credits_button_click` | 用户点击 Pricing 页面套餐卡片里的 Buy Credits 按钮。 | 点击可购买套餐的 Buy Credits 按钮时触发，在 checkout API 请求之前。 | `PricingCheckoutButton`。 | 页面继续请求 checkout，后续可能跳转支付、打开嵌入式 checkout 或展示登录/失败提示。 | `page_path`, `plan_id`, `plan_credits`, `plan_price` | 不包含用户 id、邮箱、点数余额、支付信息或 checkout URL。 |
| `generation_history_recreate_button_click` | 用户点击历史生成记录里的 Recreate / Create Similar 按钮。 | 点击全局 History 页面或 inline generator history 的复用按钮时触发。 | `HistoryPageClient`, `AiImageGenerationTool`。 | 用户回到对应生成器并复用历史参数。 | `surface`, `page_path`, `media_type`, `model_id`, `tool_slug`, `tool_label`, `source_path` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `generation_history_download_button_click` | 用户点击历史生成记录里的 Download 按钮。 | 点击全局 History 页面或 AI Image inline history 的下载按钮时触发。 | `HistoryPageClient`, `AiImageGenerationTool`。 | 页面尝试下载对应历史产物。 | `surface`, `page_path`, `media_type`, `model_id`, `tool_slug`, `tool_label`, `source_path` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `generation_history_delete_button_click` | 用户点击历史生成记录里的 Delete 按钮，并通过确认后继续删除。 | 删除确认通过后触发。 | `HistoryPageClient`, `AiImageGenerationTool`。 | 页面请求删除对应历史记录，并刷新本地列表。 | `surface`, `page_path`, `media_type`, `model_id`, `tool_slug`, `tool_label`, `source_path` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
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
| `destination` | string | CTA 点击后的目标路径。 |
| `plan_id` | string | Pricing 套餐 id，例如 `starter` 或 `creator`。 |
| `plan_credits` | number | Pricing 套餐包含的 credits 数量。 |
| `plan_price` | string | Pricing 套餐展示价格，例如 `$8.99`。 |
| `surface` | string | 历史记录操作所在入口，例如 `history_page` 或 `inline_generator_history`。 |
| `media_type` | string | 历史记录产物类型，当前为 `image` 或 `video`。 |
| `tool_slug` | string | 生成该历史记录的工具 slug。 |
| `tool_label` | string | 生成该历史记录的工具展示名。 |
| `source_path` | string | 生成该历史记录时的页面路径。 |
| `model` | string | 营销页或 waitlist 场景下的模型 slug。 |
| `page_type` | string | waitlist 事件使用的页面类型。 |
| `signup_location` | string | waitlist 表单所在的页面位置。 |

## Implementation Rules

- 新增事件优先使用 `src/lib/analytics.ts` 中的 `trackToolazeEvent()`。
- 只有旧代码尚未迁移时，才保留直接调用 `window.gtag('event', ...)`。
- 埋点中不要发送 prompt 文本、图片 URL、上传文件名、用户 id、邮箱、IP、点数余额或支付信息。
- 每个自定义事件上线前都必须补到 Custom Events 表里。
