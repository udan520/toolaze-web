# Google 搜索结果 Logo 配置指南

## 当前配置状态

✅ **已完成的配置**:

1. **Organization Schema (JSON-LD)**
   - 位置: `src/app/layout.tsx` 和 `src/app/page.tsx`
   - Logo URL: `https://toolaze.com/web-app-manifest-512x512.png`
   - 符合 Google 要求（至少 112x112px，正方形）

2. **Favicon 配置**
   - 位置: `src/app/layout.tsx`
   - 包含多种尺寸: 16x16, 32x32, SVG, Apple Touch Icon
   - 路径: `/favicon.svg`, `/favicon-32x32.png`, `/favicon-16x16.png`

3. **Open Graph 图片**
   - 位置: `src/app/layout.tsx` 和 `src/app/[locale]/page.tsx`
   - 图片: `https://toolaze.com/web-app-manifest-512x512.png`
   - 尺寸: 512x512px

4. **Twitter Card 图片**
   - 位置: `src/app/layout.tsx` 和 `src/app/[locale]/page.tsx`
   - 图片: `https://toolaze.com/web-app-manifest-512x512.png`

## Logo 文件要求

根据 Google 的要求，logo 必须满足：

- ✅ **最小尺寸**: 至少 112x112 像素（当前使用 512x512px，符合要求）
- ✅ **格式**: PNG 或 SVG（当前使用 PNG）
- ✅ **形状**: 正方形（512x512px 是正方形）
- ✅ **可访问性**: 必须可通过 URL 直接访问（`https://toolaze.com/web-app-manifest-512x512.png`）

## 当前 Logo 文件

- **主 Logo**: `public/web-app-manifest-512x512.png` (512x512px)
- **备用 Logo**: `public/web-app-manifest-192x192.png` (192x192px)
- **Favicon**: `public/favicon.svg`, `public/favicon-32x32.png`, `public/favicon-16x16.png`

## 如何让 Google 显示 Logo

### 1. 验证 Logo 可访问性

访问以下 URL 确认 logo 可以正常加载：
- https://toolaze.com/web-app-manifest-512x512.png
- https://toolaze.com/favicon.svg
- https://toolaze.com/favicon-32x32.png

### 2. 在 Google Search Console 中验证

1. 登录 [Google Search Console](https://search.google.com/search-console)
2. 选择你的网站属性
3. 使用 "URL 检查" 工具检查首页
4. 查看 "结构化数据" 部分，确认 Organization Schema 被正确识别
5. 如果发现问题，点击 "请求编入索引" 重新抓取

### 3. 使用 Rich Results Test 验证

访问 [Google Rich Results Test](https://search.google.com/test/rich-results)
- 输入: `https://toolaze.com`
- 检查 Organization Schema 是否正确
- 确认 logo URL 可访问

### 4. 等待 Google 重新抓取

- Google 可能需要几天到几周时间才能显示新的 logo
- 可以在 Search Console 中请求重新抓取首页
- 确保 robots.txt 没有阻止 Googlebot 访问 logo 文件

## 检查清单

- [x] Organization Schema 已添加到所有页面
- [x] Logo URL 使用绝对路径（https://toolaze.com/...）
- [x] Logo 图片尺寸符合要求（至少 112x112px）
- [x] Logo 图片是正方形
- [x] Logo 图片可通过 URL 直接访问
- [x] Favicon 已正确配置
- [x] Open Graph 图片已添加
- [x] Twitter Card 图片已添加
- [ ] 在 Google Search Console 中验证
- [ ] 使用 Rich Results Test 测试
- [ ] 请求 Google 重新抓取

## 常见问题

### Q: Logo 还是不显示怎么办？

A: 
1. 确认 logo 文件可以通过浏览器直接访问
2. 检查 robots.txt 是否阻止了 logo 文件
3. 在 Search Console 中请求重新抓取
4. 等待几天让 Google 更新（可能需要 1-2 周）

### Q: 需要多长时间才能显示？

A: Google 通常需要几天到几周时间才能更新搜索结果中的 logo。如果配置正确，通常 1-2 周内会显示。

### Q: 可以使用 SVG 格式的 logo 吗？

A: Organization Schema 中的 logo 建议使用 PNG 格式。Favicon 可以使用 SVG，但 Google 搜索结果中的 logo 最好使用 PNG。

## 相关文件

- `src/app/layout.tsx` - 根布局，包含 Organization Schema
- `src/app/page.tsx` - 首页，包含 Organization Schema
- `src/app/[locale]/page.tsx` - 多语言首页，包含 Open Graph
- `public/web-app-manifest-512x512.png` - 主 Logo 文件
- `public/site.webmanifest` - Web App Manifest

## 更新记录

- 2024-12-19: 更新 Organization Schema 使用 512x512px logo
- 2024-12-19: 添加 Open Graph 和 Twitter Card 图片
- 2024-12-19: 确保所有页面都包含正确的 logo 配置
