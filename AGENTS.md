# Toolaze 项目协作规则

## 响应与协作

- 始终使用简体中文回复。
- 未经用户明确要求，不主动执行 `git commit`、`git push`、创建分支、合并分支或发布上线操作。
- 修改前先快速理解相关文件和现有实现，避免改动无关区域。
- `toolaze-web-main` 的 main 本地预览端口固定为 `3006`；不得临时改用其他端口，也不得让其他项目目录占用 `3006`。
- 除 `toolaze-web-main` 的 main 分支外，任何 worktree、功能分支、落地页分支、本地预览或临时调试服务都绝对不能占用、推荐或复用 `3006`；必须使用非 `3006` 端口，并在回复中给出实际端口和可打开路径。
- 基础弹窗默认只保留标题、描述和 CTA；不要添加无关标签、解释块、状态徽章或装饰性文案，除非用户明确要求。

## UI 文案与提示规范

- 产品级 UI 文案、提示、弹窗和 CTA 规则以 `docs/UI_STYLE_GUIDE.md` 为准；修改相关组件或文案前先对照该文档。
- 全局顶部提示只使用 `Success`、`Failed`、`Warning` 三种状态；处理中、待确认、退款/返还等场景按 `docs/UI_STYLE_GUIDE.md` 映射，不新增独立状态。
- 所有按钮文字必须在按钮内水平和垂直居中显示，包含 icon、loading 状态或多语言长文案时也要保持视觉居中。
- 生成历史、积分扣除和积分退款记录的用户可见标题默认显示当前功能/工具名（如 `Clothes Changer`），补充信息显示底层模型名（如 `Seedream 5.0 Lite`）；模型页或无功能包装的通用生成器可直接以模型名作为主标题，避免把底层模型名误显示成功能标签。
- 图片生成历史或结果卡片里的 `Edit Image` 操作默认跳转到当前 locale 下的 `/ai-image-to-image-generator`，并通过 pending reprompt 传入输出图作为参考图、选中 `image-to-image` tab；不要跳到 `/ai-image-generator` 或默认文字生图 tab。
- 所有公开落地页、模型页、图片工具页和视频工具页的生成历史默认共用账户级 `/api/history` feed；不要按 `toolSlug`、页面 slug、locale 或模型拆分历史列表。功能名只作为记录标签/metadata，不作为历史读取过滤条件。
- 任何生成历史里的 `Recreate` 按钮必须回到生成该记录的原落地页或工具页，并带回生成时使用的全部参数，包括 prompt、模型/模式、尺寸/分辨率/时长、参考图片、参考音频/视频、native audio 等；不得只回填 prompt，也不得跳到通用页面后丢失原始输入。若历史记录含 `toolSlug` 或 `sourcePath`，优先使用它们定位原页面。

## 执行节奏

- 小型 UI / 文案调整：直接改目标文件，做快速本地预览或源码检查，不默认跑完整 `npm run build`。
- 涉及价格、支付、积分、退款、法律文案、SEO 路由、sitemap、导航入口：需要跑针对性测试，必要时再跑完整 build。
- 只有用户明确说“上线 / 发布 / 过审核前最终检查 / 发 main”时，才执行完整验证链路：测试、build、本地 smoke、sitemap/关键路由检查。
- 上线页面前，页面级图片 / 视频资源必须使用 R2 公网 URL；本地 `/public` 只允许保留 logo、favicon、图标、极小 UI 装饰或开发临时占位。新增落地页、模型页、工具页的 hero、demo、gallery、prompt 示例媒体不得以本地 `/model-assets`、`/images` 等路径作为最终发布资源。
- 工具或模型的入口封面图必须与对应页面的 Demo 图 / Demo 视频保持一致；顶部导航下拉、首页卡片、AI Tools Hub、相关工具推荐等位置不得使用另一套随机封面。更新页面 Demo 媒体时，需要同步检查这些入口图。
- 新增或改写 SEO 落地页的 More Tools / 相关工具卡片时，卡片顶部默认复用被推荐页面的顶部 Demo 图或 Demo 视频；不要使用纯 icon 卡片，除非目标页还没有可用 Demo 媒体且必须临时兜底。
- 不为纯视觉微调启动过重流程；优先快速交付可见结果，再按风险补验证。

## 重复落地页 / 生成组件任务提速

- 继续同一 worktree、同一组件或同一 SEO 落地页链路时，优先沿用已确认上下文，不重复核验 SEO Factory、关键词搜索量、第三方网站、完整 skill 链路或无关历史结论。
- 目标是快速给出可预览结果：先读 2-3 个目标文件，直接做最小 patch，再跑 1-2 个相关测试和页面 200 / HTML 标记 smoke。
- 每次生成、改写或接入落地页后，最终回复必须提供可预览链接；若本地预览服务未启动，需明确给出推荐启动命令、端口和目标路径，不能只汇报文件改动。
- 落地页的 prompt 示例板块默认只保留 4 个示例；除非用户明确要求扩展，不得生成第 5 个或更多 prompt 卡片。
- 浏览器自动化交互只在用户要求视觉/交互确认，或源码与 HTML smoke 不能证明问题时再做；默认不为了单纯给预览链接而启动完整浏览器流程。
- 小型首屏布局、组件接线、文案微调默认不扩展后端 API、导航、sitemap、SEO Factory 记录或完整验证矩阵，除非改动实际触碰这些面。
- 共享生成组件变更若影响真实生成请求、模型选择、上传、积分、历史记录或 API 参数，必须补针对性测试；否则优先用源码契约测试、类型检查和本地页面 smoke。
- 视频模型或工具的生成比例若由上传参考图、参考视频等参考媒体决定，而不是由 provider 支持的固定 `aspect_ratio` / 尺寸参数决定，前端不得展示可点击的 `16:9`、`9:16`、`1:1` 等假比例选项；比例控件默认显示一个已选中的只读项，英文优先命名为 `Match Reference`，中文优先命名为“跟随参考图”，并用辅助文案说明“输出会跟随上传参考媒体的比例，想要 16:9 / 9:16 需先裁剪参考素材”。若要允许用户选择固定比例，必须同时提供真实裁剪框并把裁剪后的参考素材用于生成，同时补 API payload 与 UI 契约测试。
- 新增或修改生成模型时，Vercel 前端模型清单与 Cloudflare 生成后端清单必须通过 `npm run check:generation-contract`。生产发布顺序固定为先发布 Cloudflare Production 契约与生成函数，再发布 Vercel Production；Cloudflare 线上契约版本不一致时，Vercel Production 构建必须失败，不得绕过后继续上线。
- 新增或修改任何生成模型扣点时，定价必须以 **KIE 模型 API 定价** 为准，不使用 Google、Fal、Replicate、官方模型页或其它公开模型成本替代。先核对 KIE 模型页面展示价格，再核对 KIE MCP/模型 registry 中的 credits 价格；两者一致时按 `1 credit = $0.005` 和目标 200% 利润计算 Toolaze 扣点并落地测试。若 KIE 页面价与 KIE MCP/registry 价格不一致，必须先反馈差异、来源和建议扣点，等用户确认后再修改代码。

## SEO 页面与常驻视频资产规则

- 一个通用关键词只能有一个主要索引页面；模型页负责“模型名 + 生成器”意图。若历史 URL 与主要页面争抢相同标题、H1 和内容，优先做永久跳转或显著差异化，不保留两个自 canonical 的近重复页面。
- 新增或改写 Toolaze SEO 落地页时，用户可见的提示词示例板块默认只保留 4 个高质量示例；避免为了凑量加入重复场景、弱差异提示词或泛化卡片。
- 新增或改写 Toolaze SEO 落地页时，“Why Toolaze / 为什么选择 Toolaze” 类优势板块默认只保留 3 个核心理由；优先保留差异化能力、用户决策依据和安全/合规边界，避免堆叠重复卖点。
- 新增或改写 Toolaze SEO 落地页时，`performanceMetrics` 属于辅助规格/决策板块，默认放在页面靠后位置，并且紧贴 `faq` 上方；不要把它放在工具区、How To 或 Prompt Examples 之前抢占首屏后的操作理解。
- 新增或改写 Toolaze SEO 落地页时，提示词示例卡片若配图，默认按每个可见提示词生成 9:16 真实结果图；图片内容必须直接对应该提示词，不使用抽象 AI 概念图、UI 截图或无关库存图。
- 衣服更换、发型更换、发色更换、修复、去水印、背景替换等“变换型”工具页的 hero / top demo 图默认使用 before-after 对比图：左侧原图、右侧结果图，整体接近 16:9，左右两半避免拉伸，必要时加简洁 Before / After 标签和细分隔线。
- AI Clothes Changer 的主功能默认分两种：第一种为“两图换装”，用户上传图 1 人物原图，再上传或选择图 2 目标服装参考图，并把两张图一起交给 GPT Image 2，提示词语义为“把图 2 的衣服换到图 1 的人身上”；第二种为 Custom，用户上传一张人物原图并输入服装提示词生成。
- AI Clothes Changer 的内置服装参考图必须是真实可读的全身人像穿着该服装，而不是单独平铺衣服、裁切半身、抽象服装图或 UI 占位。默认内置 4 类：正式 business 西装、奢华礼服、黑色比基尼、另一款彩色/度假风比基尼；泳装示例必须是成人、非露骨、非性化的正常穿着展示。
- 视频、聊天、多模态等非图片工具只有在免费额度、登录要求和限制已经明确时，才可在标题、H1、FAQ 或 CTA 中使用 `Free`。若免费来自注册赠送 credits，可覆盖一次真实生成，就应明确写出注册条件、credits 数量以及适用模型或设置；不得据此延伸成 `Unlimited Free`、`Free Forever`、`No Signup` 或 `No Login`，除非这些承诺也已单独验证。
- 用户可见 SEO 文案不得出现“this page is built”“the page covers”“one model page”“search intent”等编辑、站点架构或 SEO 规划口吻；直接写能力、限制、设置、输出和用户决策依据。
- 新增或改写任何 SEO 落地页后，必须对最终页面 JSON 和渲染 HTML 做一次用户可见文案负面扫描；至少覆盖 `this page`、`the page is designed`、`search intent`、`keyword`、`ranking`、`SEO`、`AI Overview`、`API platform`、`integration`、`provider route`、`Unlimited Free`、`Free Forever`、`No Signup`、`No Login` 等词，并修掉所有命中，除非命中属于开发文档或用户不可见字段。
- 新增或改写带多语言 JSON 的 SEO 落地页时，不能只本地化 metadata、H1、导航或首屏描述；必须递归检查 intro、how-to、tips、prompt 示例标题/说明、对比表、features、FAQ、related tools、schema 可见文本等嵌套字段。除 URL、图片路径、模型名、品牌名、技术规格和刻意给用户复制的 prompt 外，非英文 locale 不得复用英文正文。
- 任何页面标题、H1、meta description、FAQ 或 CTA 使用 `Free` / `免费` / `gratis` / `gratuit` 等免费承诺时，必须在同一页面可见位置说明真实条件：是否需要注册、赠送 credits 数量、可覆盖的模型或设置、以及更高规格或持续使用可能需要更多 credits；并用针对性测试或脚本断言禁止 `Unlimited Free`、`Free Forever`、`No Signup`、`No Login` 等未验证扩展承诺。
- 新增或大改 SEO 页面时，必须补页面级内容契约测试或等价脚本，检查用户可见文案没有内部 SEO/编辑口吻、免费承诺已限定、多语言正文无英文残留，并同步检查 `src/data/{locale}` 与 `_codex/seo-pipeline/tasks/{taskId}/content/{locale}.json` 两份内容；不能只靠人工浏览或单个 locale smoke。
- 模型对比和选择指南优先使用输入类型、参考数量、时长、分辨率、音频支持和 credits 等客观字段。模型下拉中已有的 Quality 评分属于独立产品 UI，除非任务明确要求，不因 SEO 文案清理而修改或删除。
- 常驻提示词视频的可见 prompt、画幅、时长和输入方式必须与实际文件一致；资产清单至少记录稳定 URL、宽高、时长、发布日期、poster 和来源历史，更新任一侧时用测试校验映射。
- 落地页常驻视频默认提供真实视频帧 poster，poster 使用 WebP 且在可行时小于 100KB；列表视频使用 `preload="none"` 并在进入视口后播放，避免首屏同时请求全部视频。
- 有常驻视频示例的 SEO 页面应输出与可见内容一致的 `VideoObject`，至少包含唯一名称、描述、缩略图、发布日期、时长和 `contentUrl`；FAQ 与 HowTo 结构化数据也必须来自当前可见文案，不生成隐藏或虚构内容。
- 修改 SEO URL、canonical、重定向、sitemap 或常驻远程资产时，必须补针对性契约测试，并核对旧 URL 去向、主要页面 canonical、sitemap 收录、poster 文件存在性和远程资源可达性。

## SEO Factory 落地页流程

- 以后生成、改写或接入任何 Toolaze SEO 落地页时，必须先建立 Seo-Factory 运行记录，再写正式页面产物。
- 最小必建记录包括 `_codex/seo-pipeline/queue/ready.json`、`_codex/seo-pipeline/tasks/{taskId}/task.json`、`_codex/seo-pipeline/tasks/{taskId}/content/{locale}.json`。
- 记录必须包含可被 `src/lib/seo-loader.ts` 识别的 `taskId`、`slug`、`pageType`、`status: "ready_for_publish"`，并让 `queue/ready.json` 指向对应 task。
- 正式页面 JSON、路由、sitemap、hub/nav 入口等后续改动必须能追溯到对应 Seo-Factory task/content 记录；不得只写 `src/data` 或页面路由而缺少 Seo-Factory 记录。
- 每个公开 Toolaze 落地页默认必须接入相关桌面菜单、移动菜单、Footer 分组、AI Tools Hub、sitemap 和支持语言的导航数据。只有产品负责人明确要求页面保持隐藏或不公开列出时，才能省略入口。该规则适用于 SEO Factory 的公开页面产物；Factory 仪表盘、提示词、任务备注和管理路由继续保持私有。
