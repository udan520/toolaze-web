# common.json 当前结构说明

## 📁 文件位置
- 英文：`src/data/en/common.json`
- 日语：`src/data/ja/common.json`
- 其他语言：`src/data/{locale}/common.json`

## 🏗️ 当前结构

```
common.json
│
├── nav                    # 导航菜单（所有页面共享）
│   ├── quickTools
│   ├── imageCompression
│   ├── imageConverter
│   ├── fontGenerator
│   └── aboutUs
│
├── home                   # 首页内容（仅首页使用）
│   ├── metadata
│   ├── badge
│   ├── title
│   ├── features
│   └── faq
│
├── footer                 # 页脚（所有页面共享）
│   ├── home
│   ├── allTools
│   ├── aboutUs
│   └── ...
│
├── breadcrumb             # 面包屑导航（所有页面共享）
│   ├── home
│   ├── quickTools
│   └── ...
│
├── about                  # 关于页面（仅关于页面使用）
│   ├── metadata
│   ├── title
│   ├── whyToolaze
│   └── features
│
├── common                 # ⭐ 通用 UI 组件翻译（跨工具共享）
│   │
│   ├── rating            # ⚠️ Rating 组件（通用标题和评分）
│   │   ├── title         # "Trusted by Thousands of Creators"
│   │   ├── rating        # "4.9/5 FROM 10K+ CREATORS"
│   │   └── description   # 通用描述（关于图片压缩）
│   │
│   ├── scenarios         # ✅ Scenarios 组件（通用标题）
│   │   └── title         # "Use Cases"
│   │
│   ├── faq               # ✅ FAQ 组件（通用标题）
│   │   └── title         # "Frequently Asked Questions"
│   │
│   ├── comparison        # ✅ Comparison 组件（通用标签）
│   │   ├── smartChoice   # "Smart Choice"
│   │   ├── toolaze       # "Toolaze"
│   │   ├── vs            # "VS"
│   │   └── otherTools    # "Other Tools"
│   │
│   ├── fontGenerator     # ✅ FontGenerator 组件（UI 翻译）
│   │   ├── selectFontStyle
│   │   ├── font/fonts
│   │   ├── allFonts
│   │   ├── copy/copied
│   │   ├── placeholder
│   │   ├── trustBar
│   │   ├── fontTerms
│   │   └── categories
│   │
│   ├── tool              # ✅ 工具 UI 组件（图片处理工具共享）
│   │   ├── dropZone
│   │   ├── controls
│   │   ├── messages
│   │   ├── gallery
│   │   ├── status
│   │   └── trustBar
│   │
│   └── viewAllTools      # ✅ 按钮文本（所有页面共享）
│
├── imageCompressor        # ❌ 工具特定 SEO 内容（历史遗留）
│   │                      # ⚠️ 应该移到独立的 image-compression.json
│   ├── metadata          # SEO 元数据
│   ├── whyToolaze        # 介绍内容
│   ├── features          # 功能列表
│   ├── howToUse          # 使用说明
│   ├── comparison        # 对比内容（工具特定）
│   ├── scenarios         # 使用场景（工具特定）
│   └── faq               # 常见问题（工具特定）
│
├── imageConverter         # ❌ 工具特定 SEO 内容（历史遗留）
│   │                      # ⚠️ 应该移到独立的 image-converter.json
│   └── ...（同上）
│
├── privacy                # 隐私政策（独立页面）
└── terms                  # 服务条款（独立页面）
```

## 🔍 为什么 rating 在 common.json 中？

### 原因分析

1. **Rating 组件的双重来源设计**：
   ```typescript
   // src/components/blocks/ToolL2PageContent.tsx:314-321
   <Rating
     title={content.rating?.title || t?.common?.rating?.title}      // 工具特定 OR 通用
     rating={t?.common?.rating?.rating}                            // 只从 common 获取
     description={content.rating?.text || t?.common?.rating?.description}  // 工具特定 OR 通用
   />
   ```

2. **设计意图**：
   - `common.rating.title` 和 `common.rating.rating` 是**通用默认值**，所有工具共享
   - `common.rating.description` 是**通用回退值**，如果工具特定 JSON 没有提供，使用这个
   - 工具特定 JSON（如 `font-generator.json`）中的 `rating.text` 是**工具特定的描述**

3. **问题**：
   - `common.rating.description` 的内容是关于"图片压缩"的，不适合 font-generator
   - 如果 `font-generator.json` 没有 `rating.text`，会显示不相关的描述

## 🔍 为什么 imageCompressor 在 common.json 中？

### 历史原因

1. **旧的设计**：
   - 最初 image-compressor 的内容直接放在 `common.json` 根级别
   - 使用 `image-compression.json` 文件存储所有 L3 页面（slug 作为 key）

2. **新的设计**：
   - font-generator 使用独立文件：`font-generator.json`（L2）+ `font-generator/{slug}.json`（L3）
   - image-converter 也使用独立文件：`image-converter/{slug}.json`（L3）

3. **不一致性**：
   - image-compressor 的 L2 内容在 `common.json` 中
   - image-compressor 的 L3 内容在 `image-compression.json` 中
   - font-generator 的 L2 内容在 `font-generator.json` 中
   - font-generator 的 L3 内容在 `font-generator/{slug}.json` 中

## 📊 数据加载流程

### L2 页面（工具主页面）

```typescript
// font-generator L2 页面
getL2SeoContent('font-generator', locale)
  → 加载 src/data/{locale}/font-generator.json
  → 返回完整的 SEO 内容（metadata, hero, intro, features, etc.）

// image-compressor L2 页面
// ⚠️ 目前没有独立的 L2 JSON，可能使用 common.json 中的 imageCompressor
```

### L3 页面（工具子页面）

```typescript
// font-generator L3 页面
getSeoContent('font-generator', 'cursive', locale)
  → 加载 src/data/{locale}/font-generator/cursive.json
  → 返回完整的 SEO 内容

// image-compressor L3 页面
getSeoContent('image-compressor', 'jpg-to-20kb', locale)
  → 加载 src/data/{locale}/image-compression.json
  → 返回 data['jpg-to-20kb'] 对象
```

### 通用 UI 组件翻译

```typescript
// 所有页面
loadCommonTranslations(locale)
  → 加载 src/data/{locale}/common.json
  → 返回整个 common.json 对象
  → 组件通过 t?.common?.rating, t?.common?.faq 等访问
```

## ⚠️ 当前结构的问题

### 问题 1: 结构不一致
- ✅ font-generator: 独立 JSON 文件
- ❌ image-compressor: 内容在 common.json 中
- ❌ image-converter: 只有 L3 页面，没有 L2 页面 JSON

### 问题 2: rating 描述不匹配
- `common.rating.description` 是关于图片压缩的
- font-generator 需要不同的描述
- 如果工具特定 JSON 没有 `rating.text`，会显示错误的描述

### 问题 3: 工具特定内容混在 common.json 中
- `imageCompressor` 和 `imageConverter` 应该有自己的 JSON 文件
- 这些内容不是"通用"的，不应该在 common.json 中

## ✅ 建议的理想结构

### 方案：统一所有工具的结构

```
src/data/{locale}/
├── common.json              # 只包含真正的通用内容
│   ├── nav
│   ├── footer
│   ├── breadcrumb
│   ├── common               # 通用 UI 组件翻译
│   │   ├── rating          # 通用默认值（可被工具特定覆盖）
│   │   ├── scenarios       # 通用标题
│   │   ├── faq             # 通用标题
│   │   ├── comparison      # 通用标签
│   │   └── ...
│   ├── home
│   ├── about
│   ├── privacy
│   └── terms
│
├── image-compression.json   # image-compressor L3 页面（保持现状）
│   └── {slug}: {...}
│
├── image-compressor.json    # ⭐ 新增：image-compressor L2 页面
│   ├── metadata
│   ├── hero
│   ├── intro
│   ├── features
│   └── ...
│
├── image-converter.json     # ⭐ 新增：image-converter L2 页面（如果需要）
│
├── font-generator.json      # ✅ font-generator L2 页面（已有）
│
└── {tool}/
    └── {slug}.json          # L3 页面（如 font-generator/cursive.json）
```

## 📝 当前实际使用情况总结

| 内容类型 | 位置 | 用途 | 问题 |
|---------|------|------|------|
| **通用 UI 翻译** | `common.common.*` | 跨工具共享的 UI 组件文本 | ✅ 正确 |
| **工具特定 SEO** | `common.imageCompressor` | image-compressor 的 SEO 内容 | ❌ 应该在独立文件 |
| **工具特定 SEO** | `common.imageConverter` | image-converter 的 SEO 内容 | ❌ 应该在独立文件 |
| **工具特定 SEO** | `font-generator.json` | font-generator 的 SEO 内容 | ✅ 正确 |
| **通用页面** | `common.home`, `common.about` | 首页和关于页面 | ✅ 正确 |

## 🎯 结论

**为什么 rating 在 common.json 中？**
- 因为它是**通用 UI 组件**的翻译，所有工具共享相同的标题和评分格式
- 但描述应该是工具特定的，所以工具特定 JSON 中的 `rating.text` 会覆盖 `common.rating.description`

**为什么 imageCompressor 在 common.json 中？**
- 这是**历史遗留**，应该重构到独立的 JSON 文件
- 目前保持现状是为了向后兼容，但结构确实混乱

**建议**：
- 短期：保持现状，但确保所有工具特定 JSON 都有 `rating.text`
- 长期：重构，将 imageCompressor 和 imageConverter 移到独立文件
