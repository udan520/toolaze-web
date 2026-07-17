# 落地页接入 SEO 后台（必读）

后续**新增或改版落地页**时，须接入 **SEO 管理后台**（`npm run admin:seo`），以便用 `src/data/en/*.json` 维护文案与板块顺序，避免内容写死在 TSX 里。

## 标准流程（英文单路由 `/your-tool-slug` 示例）

1. **数据文件**  
   - 新增 `src/data/en/<tool-id>.json`，结构遵循 `docs/TRANSLATION_STRUCTURE_GUIDE.md`，并与功能规格 `docs/specs/` 一致。  
   - 至少包含：`metadata`、`hero`、`sectionsOrder`、`howToUse`、`features`、`intro`（按需）、`comparison`（按需）、`scenes`/`scenesTitle`、`rating`、`faq`/`faqTitle`。  
   - 交互型顶部组件用 **`topComponent`** 字段标识（与 `ToolL2PageContent` 里分支名一致）。

2. **加载逻辑**  
   - 在 `src/lib/seo-loader.ts` 的 **`getL2SeoContent`** 中，为 `<tool-id>` 增加 `import('@/data/en/<tool-id>.json')`（含 fallback 分支）。

3. **页面组件**  
   - `src/app/<tool-id>/page.tsx` 仅保留：`generateMetadata()`（从 `getL2SeoContent` 读 title/description/canonical）+ `export default` 渲染 `<ToolL2PageContent locale="en" tool="<tool-id>" />`。  
   - 参考：`src/app/photo-restoration/page.tsx`、`src/app/ai-couple-photo-maker/page.tsx`。

4. **顶部交互区**  
   - 若落地页含定制工具 UI（如 `AiImageGenerationTool`、`PhotoRestoration`），在 **`ToolL2PageContent.tsx`** 中按 **`topComponent === '<identifier>'`** 增加分支，并传入所需 props（勿在 JSON 里写 React 代码）。

5. **面包屑**  
   - 同一文件中 **`breadcrumbItems`**：对单语 AI 工具页一般为 `Home → AI Tools → 页面名`（见 `photo-restoration`、`ai-couple-photo-maker`）。

6. **SEO 后台列表**  
   - 将 `<tool-id>` 加入 `scripts/admin-seo-server.js` 的 **`TOOL_DISPLAY_ORDER`**（可选，仅影响后台排序）。

7. **Sitemap**  
   - 若为仅英文静态路径，在 `src/app/sitemap.ts` 的「单语言功能页面」中追加 URL（若尚未存在）。

8. **上架控制**  
   - 使用 JSON 内 **`metadata.published`**（默认上架）；下架时设为 `false`。

## 不要再做的事

- 在 `page.tsx` 里长篇硬编码 Intro/FAQ/Features（除非该页明确不参与 SEO 管线）。  
- 忘记 **`canonical`**（可在 JSON `metadata` 与 `generateMetadata` 中保持一致）。

## 相关文件速查

| 用途 | 文件 |
|------|------|
| L2 页面壳 + 板块顺序 | `src/components/blocks/ToolL2PageContent.tsx` |
| 读取 L2 JSON | `src/lib/seo-loader.ts` → `getL2SeoContent` |
| 英文数据目录 | `src/data/en/` |
| 本地 SEO 后台 | `npm run admin:seo` → http://localhost:3007 |
