# Favicon 配置说明

为了让 Google 搜索正确显示网站 logo，需要生成多种格式的 favicon 文件。

## 当前状态

✅ `favicon.svg` - 已存在（矢量图，现代浏览器支持）
⏳ `favicon-16x16.png` - 需要生成
⏳ `favicon-32x32.png` - 需要生成
⏳ `apple-touch-icon.png` - 需要生成

## 快速生成方法

### 方法 1：使用在线工具（推荐，最简单）

1. 访问 **RealFaviconGenerator**: https://realfavicongenerator.net/
2. 上传 `public/favicon.svg` 文件
3. 按照提示配置（保持默认设置即可）
4. 点击 "Generate your Favicons and HTML code"
5. 下载生成的压缩包
6. 解压后，将所有文件复制到 `public/` 目录
7. 替换 `public/favicon.svg`（如果在线工具生成了新版本）

### 方法 2：使用 ImageMagick（本地）

如果已安装 ImageMagick：

```bash
cd /Users/neva/Desktop/toolaze-web
./scripts/generate-favicons.sh
```

如果未安装，先安装：

```bash
brew install imagemagick
```

### 方法 3：使用设计工具手动导出

1. 在 Figma/Sketch/Photoshop 中打开 logo
2. 导出为以下尺寸：
   - `favicon-16x16.png` (16×16 像素)
   - `favicon-32x32.png` (32×32 像素)
   - `apple-touch-icon.png` (180×180 像素，带白色背景)
3. 保存到 `public/` 目录

## 验证配置

生成文件后，检查：

1. 文件是否存在：
   ```bash
   ls -la public/favicon*
   ls -la public/apple-touch-icon.png
   ```

2. 在浏览器中访问：`https://toolaze.com/favicon.svg`
3. 检查 HTML head 中的 favicon 链接（浏览器开发者工具）

## 提交 Google 重新抓取

生成 favicon 文件后：

1. 提交到 Git 并推送到 GitHub
2. 部署到生产环境
3. 在 Google Search Console 中：
   - 访问：https://search.google.com/search-console
   - 选择 `toolaze.com`
   - 使用"URL 检查"工具检查首页
   - 点击"请求编入索引"
   - 等待 Google 重新抓取（通常 1-7 天）

## 注意事项

- PNG 文件应该是透明背景（除了 apple-touch-icon.png 需要白色背景）
- 确保所有文件都小于 100KB
- SVG favicon 已经配置，即使 PNG 未生成也能正常工作，但 PNG 提供更好的兼容性
