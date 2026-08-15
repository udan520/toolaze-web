# Toolaze 项目协作规则

## 响应与协作

- 始终使用简体中文回复。
- 未经用户明确要求，不主动执行 `git commit`、`git push`、创建分支、合并分支或发布上线操作。
- 用户明确说“发布”“上线”或“发 main”时，视为对当次已核对发布范围的提交、推送和生产发布授权，不再重复确认；仅当范围不清或存在未审核文件时才说明风险并请求确认。
- 修改前先快速理解相关文件和现有实现，避免改动无关区域。
- `toolaze-web-main` 的 main 本地预览端口固定为 `3006`；不得临时改用其他端口，也不得让其他项目目录占用 `3006`。
- 除 `toolaze-web-main` 的 main 分支外，任何 worktree、功能分支、落地页分支、本地预览或临时调试服务都绝对不能占用、推荐或复用 `3006`；必须使用非 `3006` 端口，并在回复中给出实际端口和可打开路径。
- 基础弹窗默认只保留标题、描述和 CTA；不要添加无关标签、解释块、状态徽章或装饰性文案，除非用户明确要求。
- 英文默认语言的公开页面 URL 不得包含 `/en` 前缀；英文链接、canonical、hreflang、sitemap、静态参数、预览地址和回复中的可访问链接统一使用无 locale 前缀路径（如 `/history`），其他语言继续使用 `/{locale}/...`。所有公开路由必须保留全局兜底：用户访问 `/en` 或 `/en/...` 时永久重定向到对应无前缀英文路径，并保留 query 参数；新增 `[locale]` 页面必须由全局契约测试证明不会生成可直接渲染的 `/en` 页面。

## UI 文案与提示规范

- 产品级 UI 文案、提示、弹窗和 CTA 规则以 `docs/UI_STYLE_GUIDE.md` 为准；修改相关组件或文案前先对照该文档。
- 页面正文中的 H1、H2、H3 等内容标题必须是所属区块的首个视觉信息；标题上方不得放 eyebrow、kicker、badge、步骤号、分类名或纯装饰标签。Breadcrumb 和全局导航属于页面结构，不受此限制。步骤号、时间、分类等必要辅助信息应放在对应标题之后。
- 全局顶部提示只使用 `Success`、`Failed`、`Warning` 三种状态；处理中、待确认、退款/返还等场景按 `docs/UI_STYLE_GUIDE.md` 映射，不新增独立状态。
- 所有按钮文字必须在按钮内水平和垂直居中显示，包含 icon、loading 状态或多语言长文案时也要保持视觉居中。
- 生成历史、积分扣除和积分退款记录的用户可见标题默认显示当前功能/工具名（如 `Clothes Changer`），补充信息显示底层模型名（如 `Seedream 5.0 Lite`）；模型页或无功能包装的通用生成器可直接以模型名作为主标题，避免把底层模型名误显示成功能标签。
- 图片生成历史或结果卡片里的 `Edit Image` 操作默认跳转到当前 locale 下的 `/ai-image-to-image-generator`，并通过 pending reprompt 传入输出图作为参考图、选中 `image-to-image` tab；不要跳到 `/ai-image-generator` 或默认文字生图 tab。
- 所有公开落地页、模型页、图片工具页和视频工具页的生成历史默认共用账户级 `/api/history` feed；不要按 `toolSlug`、页面 slug、locale 或模型拆分历史列表。功能名只作为记录标签/metadata，不作为历史读取过滤条件。
- 任何生成历史里的 `Recreate` 按钮必须回到生成该记录的原落地页或工具页，并带回生成时使用的全部参数，包括 prompt、模型/模式、尺寸/分辨率/时长、参考图片、参考音频/视频、native audio 等；不得只回填 prompt，也不得跳到通用页面后丢失原始输入。若历史记录含 `toolSlug` 或 `sourcePath`，优先使用它们定位原页面。
- 生成历史 UI 必须显示生成该结果所用的全部参考资源，而不是只显示第一张参考图；图生视频、Motion Control、Talking Avatar 等多资源流程要同时展示参考图片、参考视频和参考音频，并确保 `Recreate` 使用同一批资源回填原页面的对应输入位。若生成请求使用 provider 专用 `uploadRef`，历史记录还必须保存可展示、可回填的公网资源 URL。

## 执行节奏

- 小型 UI / 文案调整：直接改目标文件，做快速本地预览或源码检查，不默认跑完整 `npm run build`。
- 涉及价格、支付、积分、退款、法律文案、SEO 路由、sitemap、导航入口：需要跑针对性测试，必要时再跑完整 build。
- 只有用户明确说“上线 / 发布 / 过审核前最终检查 / 发 main”时，才执行完整验证链路：测试、build、本地 smoke、sitemap/关键路由检查。
- 上线页面前，页面级图片 / 视频资源必须使用 R2 公网 URL；本地 `/public` 只允许保留 logo、favicon、图标、极小 UI 装饰或开发临时占位。新增落地页、模型页、工具页的 hero、demo、gallery、prompt 示例媒体不得以本地 `/model-assets`、`/images` 等路径作为最终发布资源。
- 工具或模型的入口封面图必须与对应页面的 Demo 图 / Demo 视频保持一致；顶部导航下拉、首页卡片、AI Tools Hub、相关工具推荐等位置不得使用另一套随机封面。更新页面 Demo 媒体时，需要同步检查这些入口图。
- 视频模型落地页默认应该加入 AI Video 下拉菜单的模型分组，以及 Model Hub、Footer 模型分组和 sitemap；ASMR、Kissing、Dance 等功能型视频工具页应留在 AI Video/AI Tools 对应入口。除非用户明确要求，或已有真实 `/prompts/models/...` / `/prompts/categories/...` 提示词库页面，否则不得把模型页或生成器落地页加入 Prompts 下拉菜单。
- 新增或改写 SEO 落地页的 More Tools / 相关工具卡片时，卡片顶部默认复用被推荐页面的顶部 Demo 图或 Demo 视频；不要使用纯 icon 卡片，除非目标页还没有可用 Demo 媒体且必须临时兜底。
- 不为纯视觉微调启动过重流程；优先快速交付可见结果，再按风险补验证。

## 重复落地页 / 生成组件任务提速

- 继续同一 worktree、同一组件或同一 SEO 落地页链路时，优先沿用已确认上下文，不重复核验 SEO Factory、关键词搜索量、第三方网站、完整 skill 链路或无关历史结论。
- 目标是快速给出可预览结果：先读 2-3 个目标文件，直接做最小 patch，再跑 1-2 个相关测试和页面 200 / HTML 标记 smoke。
- 每次生成、改写或接入落地页后，最终回复必须提供可预览链接；若本地预览服务未启动，需明确给出推荐启动命令、端口和目标路径，不能只汇报文件改动。
- 落地页的 prompt 示例板块默认只保留 4 个示例；除非用户明确要求扩展，不得生成第 5 个或更多 prompt 卡片。
- 公开落地页、模型页和工具页的 FAQ 最多保留 6 条；每条必须解决剩余的高意图疑问，不得重复 Hero、Key Features、How To、Comparison 或 Use Cases 已完整回答的内容。
- 浏览器自动化交互只在用户要求视觉/交互确认，或源码与 HTML smoke 不能证明问题时再做；默认不为了单纯给预览链接而启动完整浏览器流程。
- 小型首屏布局、组件接线、文案微调默认不扩展后端 API、导航、sitemap、SEO Factory 记录或完整验证矩阵，除非改动实际触碰这些面。
- 共享生成组件变更若影响真实生成请求、模型选择、上传、积分、历史记录或 API 参数，必须补针对性测试；否则优先用源码契约测试、类型检查和本地页面 smoke。
- 共享 Hero 中的 breadcrumb、H1、Demo 等结构必须只有一个单一 owner；外层页面和共享生成组件不得重复渲染同一结构，ownership 必须由结构能力或配置解析，不得依赖页面 slug 手工名单。
- 每个缺陷修复前必须先分类为 isolated 或 reusable；可复用模式必须同时补充项目规则和契约测试，禁止只修单个页面或单个调用点后结束。
- 共享视频生成器分支负责渲染 hero breadcrumb，外层页面不得重复渲染；新增视频模型必须依靠生成器配置解析 ownership，不得加入 breadcrumb ownership 手工名单。
- 视频上传组件、Motion Control 参考视频、历史记录参考视频和其它需要用户检查视频内容的预览，默认必须完整展示原始画面：使用 `object-contain` / 居中显示，不裁剪、不拉伸；9:16、1:1、16:9 等比例都应放在容器中间并保留必要背景留白。只有明确作为装饰性封面、入口海报或无需检查主体细节的卡片，才可以使用裁剪式 `object-cover`，且需要有对应源码契约测试防止误用。
- 图片或视频模型/工具的生成比例若由上传参考图、参考视频等参考媒体决定，而不是由 provider 对当前生成模式实际支持的固定 `aspect_ratio` / 尺寸参数决定，前端不得展示可点击的 `16:9`、`9:16`、`1:1` 等假比例选项；比例控件默认显示一个已选中的只读项，英文优先命名为 `Match Reference`，中文优先命名为“跟随参考图”，并用辅助文案说明“输出会跟随上传参考媒体的比例，想要 16:9 / 9:16 需先裁剪参考素材”。该控件宽度必须按内容自适应，不得默认占满整行。每次接入新生成模型时，必须按 text-to-image / image-to-image / text-to-video / image-to-video 等实际模式显式声明比例行为，并补 UI 与 API payload 契约测试；provider 未声明或不支持比例字段时，前端使用 `Match Reference`，后端不得继续发送或记录虚假的自定义比例。若要允许用户选择固定比例，必须同时提供真实裁剪框并把裁剪后的参考素材用于生成。
- 新增或修改生成模型时，Vercel 前端模型清单与 Cloudflare 生成后端清单必须通过 `npm run check:generation-contract`。生产发布顺序固定为先发布 Cloudflare Production 契约与生成函数，再发布 Vercel Production；Cloudflare 线上契约版本不一致时，Vercel Production 构建必须失败，不得绕过后继续上线。
- 新增或修改任何生成模型扣点时，定价必须以 **KIE 模型 API 定价** 为准，不使用 Google、Fal、Replicate、官方模型页或其它公开模型成本替代。先核对 KIE 模型页面展示价格，再核对 KIE MCP/模型 registry 中的 credits 价格；两者一致时按 `1 credit = $0.005` 和目标 200% 利润计算 Toolaze 扣点并落地测试。若 KIE 页面价与 KIE MCP/registry 价格不一致，必须先反馈差异、来源和建议扣点，等用户确认后再修改代码。
- 原声开关仅在开启与关闭原声会改变当前生成扣点时展示；两种状态扣点相同的模型必须隐藏该选项，并默认以开启原声提交。前端可见状态、请求参数、历史记录与 Recreate 必须使用同一个有效原声值，不得出现 UI 隐藏但实际按关闭原声生成的情况。

## SEO 页面与常驻视频资产规则

- 所有公开落地页、模型页和工具页的首要内容目标，是尽快获得目标关键词及高相关长尾词的 Google 自然搜索排名。选题、标题、H1、首屏描述、板块顺序、正文深度、示例、对比和 FAQ 必须优先服务目标搜索意图：直接说明模型或工具的核心能力、差异化特点、适用场景、输入输出、使用方法和用户决策依据。不得用编辑说明、研究过程、站点规划、内部实现、发布流程或对用户决策无帮助的免责声明占用首屏和核心正文；必要的限制、条件与事实边界应简洁放在最相关的位置，不得反复稀释主题。竞品页面用于识别排名内容结构、用户关注点和表达方式，最终内容仍需保持 Toolaze 自有结构、低重复度与可验证的产品边界。
- 所有模型页必须提供有价值、有深度、能帮助用户做选择的内容，禁止只泛泛罗列文生图、文生视频、图生视频、参考图等基础能力。尤其是最新一代模型页，必须先建立清晰的版本价值主张：具体说明它相对上一代在输出分辨率、时长、参考数量、主体与角色一致性、多镜头叙事、运镜控制、运动与物理真实性、提示词遵循、原生音频、生成速度、稳定性和成本等维度提升了什么，这些提升分别解决了什么实际创作问题；同时与当前市场第一梯队同类模型做客观比较，明确目标模型在哪些任务上更有优势、哪些场景应优先选择它、哪些场景应选择其它模型。比较不得停留在“质量更高”“效果更好”等空泛结论，必须使用具体规格、工作方式、示例任务、限制和选择依据，并把技术差异转化为广告制作、角色短片、产品展示、电影预演、社交内容等用户可理解的产出价值。
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
- 证据核验语言只留在内部研究与验收记录，不得直接写进公开落地页。完成事实核验后应直接陈述用户可理解的产品事实与创作结果，避免 `documented`、`verified`、`visible limits`、`current generator`、`decision point`、`planning burden`、`actual controls`、`not a guarantee` 等研究报告、审计或实现口吻；必要限制用一句自然产品文案放在对应设置或 FAQ，不得让免责声明主导正文。
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
