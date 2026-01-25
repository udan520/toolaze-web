# Sitemap 更新指南

## 重要提醒

**每次发布新页面到 Git 后，必须确保 sitemap 已自动包含这些页面！**

## 当前 Sitemap 自动生成机制

sitemap 通过 `src/app/sitemap.ts` 自动生成，它会：

1. **自动包含所有工具页面**：通过 `getAllTools(locale)` 函数获取所有工具和 slug
2. **支持多语言**：自动为所有支持的语言生成 URL
3. **特殊处理 font-generator**：只包含 en 和 de 两种语言

## 如何确保新页面被包含

### 1. 检查 `getAllTools` 函数

确保 `src/lib/seo-loader.ts` 中的 `getAllTools` 函数包含了你的新工具：

```typescript
export async function getAllTools(locale: string = 'en'): Promise<Array<{ tool: string; slug: string }>> {
  // ... 现有工具 ...
  
  // 如果添加了新工具，确保在这里添加
  if (tool === 'your-new-tool') {
    const slugs = await getAllSlugs('your-new-tool', locale)
    for (const slug of slugs) {
      tools.push({ tool: 'your-new-tool', slug })
    }
  }
}
```

### 2. 检查 `TOOL_PAGES` 数组

确保 `src/app/sitemap.ts` 中的 `TOOL_PAGES` 包含了新工具的 L2 页面：

```typescript
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator', 'your-new-tool']
```

### 3. 验证 Sitemap

发布后，访问以下 URL 验证：

- 生产环境：`https://toolaze.com/sitemap.xml`
- 本地开发：`http://localhost:3006/sitemap.xml`

检查是否包含：
- ✅ 所有新页面的 URL
- ✅ 所有语言版本的 URL（如果支持多语言）
- ✅ 正确的 lastModified 日期

## 最近更新的页面（需要确认在 sitemap 中）

### 2025-01-25 更新

- ✅ **字体生成器德语页面**：
  - L2: `/de/font-generator`
  - L3: `/de/font-generator/{slug}` (16 个分类)
    - cursive, fancy, bold, tattoo, cool, instagram, italic, gothic
    - calligraphy, discord, old-english, 3d, minecraft, disney, bubble, star-wars

这些页面已通过 `getAllTools` 函数自动包含在 sitemap 中。

## 发布前检查清单

- [ ] 新页面已添加到 `getAllSlugs` 函数
- [ ] 新工具已添加到 `getAllTools` 函数
- [ ] L2 页面已添加到 `TOOL_PAGES` 数组（如果适用）
- [ ] **运行 `npm run verify-sitemap` 验证 sitemap 完整性** ⚠️ **重要！**
- [ ] 运行 `npm run build` 检查构建是否成功
- [ ] 检查生成的 sitemap.xml 是否包含新页面
- [ ] 提交到 Git 并推送到远程仓库

## 快速验证命令

```bash
# 验证 sitemap 是否包含所有页面
npm run verify-sitemap

# 检查 404 错误
npm run check-404
```

## 自动化建议

考虑在 CI/CD 流程中添加 sitemap 验证步骤，确保每次部署后自动检查 sitemap 的完整性。
