# Toolaze UI 样式与提示规范

> 本文档是 Toolaze 产品级 UI 文案、视觉基调、提示反馈、弹窗、CTA、卡片和共享组件的全局规范。修改标题、按钮、账号菜单、消费记录、支付结果、登录状态、生成状态、toast、notice、modal、首页卡片、模型页卡片或落地页通用 UI 时优先遵循本文件。

## 1. 适用范围与来源

- 本文件整合旧 `toolaze-web` 中分散在 `.cursorrules`、`docs/SEO_MASTER_LAYOUT.md`、`docs/PROMPTS_DATA_RULES.md` 和 `_codex/mistakes.md` 的全站 UI 规则。
- `docs/SEO_MASTER_LAYOUT.md` 只保留 SEO 落地页结构、导航、面包屑、Footer 和页面模板细节；产品级 UI 视觉、提示、弹窗、CTA、卡片和组件复用规则以本文件为准。
- SEO、sitemap、canonical、关键词密度、具体 L2/L3 内容结构不写入本文件，继续由 SEO 相关文档维护。

## 2. 设计基调

- Toolaze 默认使用 `Style 1: Soft Smart Tech`：轻量、干净、偏白底，使用蓝紫主题色表达重点。
- 字体优先使用 Poppins / `font-sans`；正文保持易读，不使用过度压缩或负字距。
- 主背景优先使用 `#F8FAFF` 或白色；页面区块可在 `bg-white` 与 `bg-[#F8FAFF]` 之间交替，增强层级。
- 主强调色使用蓝紫渐变：`from-indigo-600 to-purple-600`，需要更丰富时可延展到 `via-violet-600`、`to-fuchsia-600`。
- 标题默认使用 slate 深色，正文使用 slate 中性色；避免大面积纯黑、沉重深色块或破坏现有紫色品牌感的临时风格。
- 容器可使用大圆角，例如 `rounded-[2.5rem]` / `rounded-super`；按钮默认 `rounded-full`；卡片圆角和阴影应轻量、统一。

## 3. 页面说明文字宽度

- 页面 hero、列表页头部、section intro 等左对齐说明文字应尽量使用当前内容容器的可用宽度。桌面端外层为 `max-w-6xl` 或更宽时，说明文字默认不小于 `max-w-5xl`。
- 外层内容容器为 `max-w-5xl` 或更窄时，左对齐说明文字可使用 `max-w-none`，让文案跟随容器宽度自然排布。
- 禁止在右侧仍有明显空白时，用 `max-w-2xl` / `max-w-3xl` 让一句中等长度说明提前换行。
- 居中 hero、长正文、FAQ、CTA、小卡片描述和成组卡片内部文案可以保留较窄行宽，但视觉上不能出现“不必要换行”的空白感。

## 4. 文案大小写

- 英文 UI 标题、按钮、CTA、卡片小标题、账号菜单小标题、消费记录小标题统一使用 Title Case。
- 禁止使用整句全大写文案；明确缩写、品牌名、模型名和技术名除外，例如 `AI`、`UI`、`API`、`CTA`、`GA4`、`GPT Image 2`。
- 不要用 `uppercase` 强制处理普通用户可见文案。平台名、来源名、状态标签、按钮和说明文字应保留自然大小写。
- 非英文文案按对应语言的自然大小写与书写习惯处理，不强行套用英文 Title Case。
- 避免把内部 SEO/研究语言露给用户，例如 `Index Snapshot`、`Best Entry Queries`、`Answer First`、`GEO Summary`、`Prompt Remix System` 等。

## 5. 全局顶部提示状态

全局顶部提示只允许使用三种状态：`Success`、`Failed`、`Warning`。不要新增 `Processing`、`Info`、`Refunded`、`Pending` 等独立状态；这类场景必须映射到三种状态之一，避免全站提示体系发散。

- 位置：页面顶部居中，距离顶部导航栏约 20px；不要放在右上角或右下角。
- 布局：白底、完整细描边、轻阴影、左侧圆形状态 icon、标题和一行必要描述、右侧关闭按钮。
- 尺寸：默认使用当前 `Credit Focus` 风格，宽度约 `max-w-[26rem]`；不要为了短文案随意变成过窄提示。
- 行为：所有顶部提示展示 5 秒；可提供关闭按钮，点击后立即消失。
- 内容：只保留标题和必要描述，不堆叠标签、解释块、状态徽章或无关 SEO 文案。

### Success

用于成功、完成、保存、登录成功、购买成功、积分到账、积分返还等非阻断反馈。

- 样式：绿色语义，左侧绿色小勾 icon。
- 示例：`200 Credits Added`、`Purchase Successful`、`Signed In Successfully`、`Credits Returned`。
- 映射：退款、失败生成后的积分返还、后台补发积分都归入 `Success`，不要新增 `Refunded` 状态。

### Failed

用于报错、失败、生成失败、支付失败、权限阻断、提交失败等明确失败状态。

- 样式：红色语义，左侧红色感叹号 icon。
- 示例：`Payment Failed`、`Generation Failed`、`Checkout Could Not Be Started`、`Sign-In Failed`。
- 内容：标题说明失败结果，描述说明下一步能做什么；不要把失败提示写成模糊的普通信息。

### Warning

用于重要提醒、待确认、审核中、网络较慢、额度即将不足、支付仍在确认、操作可能有影响等尚未失败的状态。

- 样式：橙色语义，左侧橙色感叹号 icon；不要使用红色错误语义。
- 示例：`Credits Not Added Yet`、`Confirming Payment`、`Review Pending`、`Credits Running Low`。
- 映射：处理中、待确认、审核中都归入 `Warning`，不要新增 `Processing` 或 `Pending` 状态。

## 6. 弹窗与 CTA

- 基础弹窗默认只保留标题、描述和 CTA。
- 不添加无关标签、余额标签、解释卡片或装饰性信息，除非用户明确要求。
- 已有右上角关闭按钮时，不再额外显示 `Close` 文案按钮。
- CTA 文案使用 Title Case，并直接描述动作，例如 `Buy Credits`、`Start Generating`、`Earn Credits`。
- 所有按钮文字必须在按钮内水平和垂直居中显示；按钮包含 icon、loading 状态或多语言长文案时，也要保持文字视觉居中，不得偏上、偏下或贴边。
- 付费、积分、登录、失败提示等关键弹窗应优先服务决策，不要塞入 SEO 文案或多余状态说明。

## 7. 卡片与重复布局

- 重复卡片网格应保持同一行等高，底部按钮/链接通过 `mt-auto` 或等价布局底部对齐。
- 卡片正文最多显示固定行数时，需要保留一致高度，超出使用 line clamp 或等价省略策略。
- 卡片上只展示用户做判断需要的信息；不要用无关标签、解释块、统计块填充视觉空间。
- 首页、AI tools、模型卡片不要用 emoji 或字母占位作为主视觉；优先使用真实 demo、工具样张或模型能力相关缩略图。

## 8. 图片与媒体资产

- 首页高级 AI 工具卡、首页模型卡和模型/工具落地页主视觉应使用与页面 demo 或真实能力匹配的图片。
- 没有明确实体设备场景时，优先使用平面海报、卡片矩阵、流程图、对比板、成品拼贴、信息图式画面，不默认使用电脑屏幕/工作台照片。
- 电商、广告、产品相关图片应像可商用样张：产品广告图、海报图、详情页图、社媒广告图、包装图、教育信息图或 UI 平面稿。
- 页面级图片 / 视频资源上线前必须迁移到 Cloudflare R2，并在页面 JSON / 组件中使用 R2 公网 URL；本地路径只用于开发临时预览，或用于 logo、favicon、图标、极小 UI 装饰等稳定基础资产。
- 新增或改版落地页、模型页、工具页时，hero、demo、gallery、prompt 示例、before/after、视频样例等媒体不得以 `/model-assets`、`/images`、`/uploads` 等本地 public 路径作为最终发布资源；发布检查时需要扫描并迁移这些本地引用。
- 重复视觉资产优先使用 WebP，单张尽量控制在 100KB 左右，长边不超过 800px；大图上线前需要压缩。
- 媒体类型必须准确：静态图不要叠加播放按钮或视频徽标；视频或外部社区卡片必须确保标题、链接和媒体同源。

## 9. 共享组件与翻译

- 按钮、卡片、弹窗、提示、区块、导航、Footer 等重复 UI 优先抽成共享组件，避免每个页面各写一套。
- 需要翻译的共享 UI 文案应进入 `src/data/{locale}/common.json` 或对应页面 JSON；不要只写英文 fallback。
- Client components 如果首屏渲染共享 UI，应优先接收服务端传入的 `initialTranslations`，避免首屏先显示英文再替换。
- 新增全局导航、Footer、toast/status、上传区、工具控件、账号菜单文案时，需要同步多语言结构和相关校验脚本。

## 10. 实现要求

- 全局顶部提示的 `Success`、`Failed`、`Warning` 状态、消失时间、关闭行为、颜色语义应集中维护，不在业务组件里散落硬编码。
- UI 微调优先沿用已有设计系统和用户已经认可的视觉处理；不要无理由把紫色品牌视觉替换为黑色或其他新风格。
- 修改样式后交付预览前，确认本地页面和 CSS 资源可访问；构建后如果样式异常，优先重启本地 dev server 或使用 `npm run dev:clean`。
