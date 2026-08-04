# Toolaze Analytics Tracking

最后更新：2026-08-03

本文档用于记录 Toolaze 当前使用的 GA4 自定义事件。后续新增、重命名或删除埋点时，需要同步更新这张表，避免事件散落在代码里没人知道。

## Custom Events

| 事件名 | 含义 | 触发时机 | 主要位置 | 后续结果 | 关键参数 | 隐私说明 |
| --- | --- | --- | --- | --- | --- | --- |
| `generate_click` | 用户点击图片或视频生成组件的 Generate，代表一次真实生成意图。 | 本地表单校验通过后触发，在登录、点数、提示词审核、上传和生成 API 请求之前。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 后续可能继续生成，也可能打开登录弹窗、展示点数不足弹窗、被审核拦截、上传失败或 API 失败。 | `source`, `page_path`, `media_type`, `model_id`, `model_name`, `generation_mode`, `resolution`, `aspect_ratio`, `output_format`, `duration_seconds`, `native_audio`, `credit_cost`, `has_reference_images`, `reference_image_count`, `preset_mode` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `generate_start` | 图片或视频生成开始请求后端。 | 登录和点数检查通过、必要参考图上传完成后，在调用生成后端接口之前触发。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 后端开始创建图片或视频生成任务；后续可能成功、轮询或失败。 | 生成上下文参数，含 `media_type` | 不包含 prompt 文本、图片/视频 URL、上传文件、任务 id、用户标识、点数余额或邮箱。 |
| `generate_success` | 图片或视频生成成功。 | 图片或视频 URL 直接返回或轮询成功后、历史记录保存尝试后触发。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 用户在 History 面板看到生成结果。 | 生成上下文参数，外加 `result_delivery`, `task_provider`, `history_persisted` | 不包含 prompt 文本、图片/视频 URL、上传文件、任务 id、用户标识、点数余额或邮箱。 |
| `generate_fail` | 图片或视频生成失败。 | 上传、创建任务、状态轮询或结果解析失败后触发；未登录和点数不足分支不计为生成失败。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 用户看到失败提示，并在 History 面板看到失败状态。 | 生成上下文参数，外加 `failure_stage` | 不包含 prompt 文本、错误详情、图片/视频 URL、上传文件、任务 id、用户标识、点数余额或邮箱。 |
| `credit_low_view` | 点数不足弹窗展示。 | 图片或视频生成流程的 `creditExhaustedModalOpen` 变为 true 时触发。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 用户看到购买点数或免费获得积分的选择。 | 生成上下文参数，含 `media_type` | 不包含 prompt 文本、图片/视频 URL、上传文件、任务 id、用户标识、点数余额或邮箱。 |
| `credit_low_buy_click` | 用户点击点数不足弹窗里的 Buy Credits 按钮。 | 点击点数不足弹窗的 Buy Credits 按钮时触发，在弹窗关闭和页面跳转之前。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 用户跳转到 `/pricing`。 | 生成上下文参数，外加 `destination` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额、支付信息或邮箱。 |
| `credit_low_earn_click` | 用户点击点数不足弹窗里的 Earn Free Credits 按钮。 | 点击点数不足弹窗的 Earn Free Credits 按钮时触发，在弹窗关闭和页面跳转之前。 | `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 用户跳转到 `/earn-credits`。 | 生成上下文参数，外加 `destination` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `login_modal_view` | 登录弹窗展示。 | `authModalOpen` 变为 true 时触发。 | `Navigation` 内的全局登录弹窗。 | 用户看到 Google 登录入口。 | `source`, `page_path` | 不包含用户 id、邮箱、点数余额或登录 token。 |
| `login_google_click` | 用户点击登录弹窗里的 Continue with Google。 | 点击 Google 登录按钮时触发，在打开 OAuth popup 之前。 | `Navigation` 内的全局登录弹窗。 | 页面继续打开 Google OAuth popup，后续可能登录成功、失败或被浏览器拦截。 | `source`, `page_path`, `auth_provider` | 不包含用户 id、邮箱、点数余额、登录 token、credential 或 OAuth URL。 |
| `pricing_buy_click` | 用户点击 Pricing 页面套餐卡片里的 Buy Credits 按钮。 | 点击可购买套餐的 Buy Credits 按钮时触发，在 checkout API 请求之前。 | `PricingCheckoutButton`。 | 页面继续请求 checkout，后续可能跳转支付、打开嵌入式 checkout 或展示登录/失败提示。 | `page_path`, `plan_id`, `plan_credits`, `plan_price` | 不包含用户 id、邮箱、点数余额、支付信息或 checkout URL。 |
| `history_recreate_click` | 用户点击历史生成记录里的 Recreate / Create Similar 按钮。 | 点击全局 History 页面或 inline generator history 的复用按钮时触发。 | `HistoryPageClient`, `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 用户回到对应生成器并复用历史参数。 | `surface`, `page_path`, `media_type`, `model_id`, `tool_slug`, `tool_label`, `source_path` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `history_download_click` | 用户点击历史生成记录里的 Download 按钮。 | 点击全局 History 页面或 inline generator history 的下载按钮时触发。 | `HistoryPageClient`, `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 页面尝试下载对应历史产物。 | `surface`, `page_path`, `media_type`, `model_id`, `tool_slug`, `tool_label`, `source_path` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `history_delete_click` | 用户点击历史生成记录里的 Delete 按钮，并通过确认后继续删除。 | 删除确认通过后触发。 | `HistoryPageClient`, `AiImageGenerationTool`, `AiVideoGeneratorTool`。 | 页面请求删除对应历史记录，并刷新本地列表。 | `surface`, `page_path`, `media_type`, `model_id`, `tool_slug`, `tool_label`, `source_path` | 不包含 prompt 文本、图片/视频 URL、上传文件、用户标识、点数余额或邮箱。 |
| `waitlist_signup` | 用户在 Seedance 2.5 上线提醒表单中提交了有效邮箱。 | 邮箱格式校验通过，并写入本地 waitlist storage 后触发。 | `Seedance25LaunchUpdates`。 | 页面展示本地成功状态。 | `model`, `page_type`, `signup_location` | 邮箱只保存在用户本地 storage，不会作为 GA4 事件参数发送。 |

## Parameter Dictionary

| 参数 | 类型 | 说明 | GA4 注册类型 | GA4 状态 | GA4 备注 |
| --- | --- | --- | --- | --- | --- |
| `source` | string | 发出事件的组件或流程，例如 `nano_banana_tool`。当前值先保持兼容，后续可单独改成更通用的 `ai_image_generation_tool`。 | 暂缓 | 暂缓 | 容易和 GA4 流量来源 `source` 混淆，先只保留在事件 payload 里排查。 |
| `page_path` | string | 当前页面路径，包含多语言前缀。 | 暂缓 | 暂缓 | GA4 已有页面路径相关维度；暂不占用自定义维度名额。 |
| `model_id` | string | 内部 AI 生图模型 id。 | 自定义维度 | 已添加 | 用户已在 GA4 后台添加。 |
| `model_name` | string | UI 中展示的模型名称。 | 暂缓 | 暂缓 | 展示名可能调整，报表主维度优先用稳定的 `model_id`。 |
| `generation_mode` | string | 生图模式，当前为 `text-to-image` 或 `image-to-image`。 | 自定义维度 | 已添加 | 用户已在 GA4 后台添加；如后台说明里有 `ext-to-image` 拼写，建议改为 `text-to-image`。 |
| `resolution` | string | 用户选择的输出分辨率。 | 自定义维度 | 待添加 | 图片生成核心拆分维度。 |
| `aspect_ratio` | string | 用户选择的输出比例。 | 自定义维度 | 待添加 | 图片生成核心拆分维度。 |
| `output_format` | string | 模型支持输出格式时，记录用户选择的格式。 | 自定义维度 | 待添加 | 图片生成核心拆分维度。 |
| `duration_seconds` | number | 视频生成时用户选择的时长，单位为秒。 | 自定义指标 | 待添加 | 视频生成时长统计，适合做平均值和分布分析。 |
| `native_audio` | boolean | 视频生成是否启用 Native Audio。 | 自定义维度 | 待添加 | 视频生成能力开关拆分维度。 |
| `credit_cost` | number | 当前生图配置需要消耗的 credits。 | 自定义指标 | 已添加 | 用户已加到 GA4 自定义指标。 |
| `has_reference_images` | boolean | 用户是否选择了本地或远程参考图。 | 自定义维度 | 待添加 | 区分文生图、图生图和多参考图链路。 |
| `reference_image_count` | number | 本地参考图和远程参考图的总数量。 | 自定义指标 | 待添加 | 参考图数量统计，适合做平均值和分布分析。 |
| `preset_mode` | string | 工具预设模式，例如 `default` 或 `ai-couple-photo-maker`。 | 自定义维度 | 待添加 | 工具预设和通用生成器拆分维度。 |
| `destination` | string | CTA 点击后的目标路径。 | 暂缓 | 暂缓 | CTA 去向可先通过事件名和页面路径判断；需要做路径级漏斗时再注册。 |
| `plan_id` | string | Pricing 套餐 id，例如 `starter` 或 `creator`。 | 自定义维度 | 已添加 | 用户已在 GA4 后台添加。 |
| `plan_credits` | number | Pricing 套餐包含的 credits 数量。 | 自定义维度 | 已添加 | 用户已按自定义维度添加；如后续要做数值聚合，建议新增独立指标参数，避免同名重复。 |
| `plan_price` | string | Pricing 套餐展示价格，例如 `$8.99`。 | 自定义维度 | 已添加 | 用户已按自定义维度添加；金额统计建议后续新增 `plan_price_usd` 指标参数。 |
| `surface` | string | 历史记录操作所在入口，例如 `history_page` 或 `inline_generator_history`。 | 自定义维度 | 待添加 | 历史记录页面和生成器内联历史的核心拆分维度。 |
| `media_type` | string | 生成或历史记录产物类型，当前为 `image` 或 `video`。 | 自定义维度 | 已添加 | 用户已在 GA4 后台添加。 |
| `tool_slug` | string | 生成该历史记录的工具 slug。 | 自定义维度 | 已添加 | 用户已在 GA4 后台添加。 |
| `tool_label` | string | 生成该历史记录的工具展示名。 | 暂缓 | 暂缓 | 展示名可能调整，报表主维度优先用稳定的 `tool_slug`。 |
| `source_path` | string | 生成该历史记录时的页面路径。 | 暂缓 | 暂缓 | 路径类字段基数较高，先用 GA4 内置页面路径维度观察。 |
| `result_delivery` | string | 图片或视频结果返回方式，当前为 `direct` 或 `polling`。 | 自定义维度 | 待添加 | 成功链路核心拆分维度。 |
| `task_provider` | string | 视频任务供应商标识，不包含任务 id。 | 自定义维度 | 待添加 | 视频生成供应商排查和质量对比维度。 |
| `history_persisted` | boolean | 成功结果是否保存到账户级 History。 | 自定义维度 | 待添加 | 判断生成成功后是否写入历史记录。 |
| `failure_stage` | string | 生成失败所在阶段，当前使用粗粒度值，避免发送错误详情。 | 自定义维度 | 已添加 | 用户已在 GA4 后台添加。 |
| `auth_provider` | string | 登录按钮使用的授权供应商，当前为 `google`。 | 自定义维度 | 待添加 | 登录弹窗点击的核心拆分维度。 |
| `model` | string | 营销页或 waitlist 场景下的模型 slug。 | 暂缓 | 暂缓 | 仅用于 waitlist 场景，低频参数先不占用自定义维度名额。 |
| `page_type` | string | waitlist 事件使用的页面类型。 | 暂缓 | 暂缓 | 仅用于 waitlist 场景，低频参数先不占用自定义维度名额。 |
| `signup_location` | string | waitlist 表单所在的页面位置。 | 暂缓 | 暂缓 | 仅用于 waitlist 场景，低频参数先不占用自定义维度名额。 |

## Implementation Rules

- 新增事件优先使用 `src/lib/analytics.ts` 中的 `trackToolazeEvent()`。
- 事件名必须使用简单易懂的英文小写 snake_case，且不得超过 40 个字符；优先用短词表达动作，例如 `credit_low_buy_click`。
- 只有旧代码尚未迁移时，才保留直接调用 `window.gtag('event', ...)`。
- 埋点中不要发送 prompt 文本、图片 URL、上传文件名、用户 id、邮箱、IP、点数余额或支付信息。
- 每个自定义事件上线前都必须补到 Custom Events 表里。
