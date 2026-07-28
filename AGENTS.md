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

## 执行节奏

- 小型 UI / 文案调整：直接改目标文件，做快速本地预览或源码检查，不默认跑完整 `npm run build`。
- 涉及价格、支付、积分、退款、法律文案、SEO 路由、sitemap、导航入口：需要跑针对性测试，必要时再跑完整 build。
- 只有用户明确说“上线 / 发布 / 过审核前最终检查 / 发 main”时，才执行完整验证链路：测试、build、本地 smoke、sitemap/关键路由检查。
- 上线页面前，页面级图片 / 视频资源必须使用 R2 公网 URL；本地 `/public` 只允许保留 logo、favicon、图标、极小 UI 装饰或开发临时占位。新增落地页、模型页、工具页的 hero、demo、gallery、prompt 示例媒体不得以本地 `/model-assets`、`/images` 等路径作为最终发布资源。
- 工具或模型的入口封面图必须与对应页面的 Demo 图 / Demo 视频保持一致；顶部导航下拉、首页卡片、AI Tools Hub、相关工具推荐等位置不得使用另一套随机封面。更新页面 Demo 媒体时，需要同步检查这些入口图。
- 不为纯视觉微调启动过重流程；优先快速交付可见结果，再按风险补验证。

## 重复落地页 / 生成组件任务提速

- 继续同一 worktree、同一组件或同一 SEO 落地页链路时，优先沿用已确认上下文，不重复核验 SEO Factory、关键词搜索量、第三方网站、完整 skill 链路或无关历史结论。
- 目标是快速给出可预览结果：先读 2-3 个目标文件，直接做最小 patch，再跑 1-2 个相关测试和页面 200 / HTML 标记 smoke。
- 每次生成、改写或接入落地页后，最终回复必须提供可预览链接；若本地预览服务未启动，需明确给出推荐启动命令、端口和目标路径，不能只汇报文件改动。
- 落地页的 prompt 示例板块默认只保留 4 个示例；除非用户明确要求扩展，不得生成第 5 个或更多 prompt 卡片。
- 浏览器自动化交互只在用户要求视觉/交互确认，或源码与 HTML smoke 不能证明问题时再做；默认不为了单纯给预览链接而启动完整浏览器流程。
- 小型首屏布局、组件接线、文案微调默认不扩展后端 API、导航、sitemap、SEO Factory 记录或完整验证矩阵，除非改动实际触碰这些面。
- 共享生成组件变更若影响真实生成请求、模型选择、上传、积分、历史记录或 API 参数，必须补针对性测试；否则优先用源码契约测试、类型检查和本地页面 smoke。

## SEO 页面与常驻视频资产规则

- 一个通用关键词只能有一个主要索引页面；模型页负责“模型名 + 生成器”意图。若历史 URL 与主要页面争抢相同标题、H1 和内容，优先做永久跳转或显著差异化，不保留两个自 canonical 的近重复页面。
- 视频、聊天、多模态等非图片工具只有在免费额度、登录要求和限制已经明确时，才可在标题、H1、FAQ 或 CTA 中使用 `Free`。若免费来自注册赠送 credits，可覆盖一次真实生成，就应明确写出注册条件、credits 数量以及适用模型或设置；不得据此延伸成 `Unlimited Free`、`Free Forever`、`No Signup` 或 `No Login`，除非这些承诺也已单独验证。
- 用户可见 SEO 文案不得出现“this page is built”“the page covers”“one model page”“search intent”等编辑、站点架构或 SEO 规划口吻；直接写能力、限制、设置、输出和用户决策依据。
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
