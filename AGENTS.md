# Toolaze 项目协作规则

## 响应与协作

- 始终使用简体中文回复。
- 未经用户明确要求，不主动执行 `git commit`、`git push`、创建分支、合并分支或发布上线操作。
- 修改前先快速理解相关文件和现有实现，避免改动无关区域。
- `toolaze-web-main` 的 main 本地预览端口固定为 `3006`；不得临时改用其他端口，也不得让其他项目目录占用 `3006`。
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
- 不为纯视觉微调启动过重流程；优先快速交付可见结果，再按风险补验证。

## SEO Factory 落地页流程

- 以后生成、改写或接入任何 Toolaze SEO 落地页时，必须先建立 Seo-Factory 运行记录，再写正式页面产物。
- 最小必建记录包括 `_codex/seo-pipeline/queue/ready.json`、`_codex/seo-pipeline/tasks/{taskId}/task.json`、`_codex/seo-pipeline/tasks/{taskId}/content/{locale}.json`。
- 记录必须包含可被 `src/lib/seo-loader.ts` 识别的 `taskId`、`slug`、`pageType`、`status: "ready_for_publish"`，并让 `queue/ready.json` 指向对应 task。
- 正式页面 JSON、路由、sitemap、hub/nav 入口等后续改动必须能追溯到对应 Seo-Factory task/content 记录；不得只写 `src/data` 或页面路由而缺少 Seo-Factory 记录。
