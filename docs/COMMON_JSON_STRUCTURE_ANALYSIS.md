# common.json 结构分析报告

## 当前结构问题

### 1. 结构混乱的原因

`common.json` 目前混合了三种不同类型的内容：

#### ❌ 问题 1: 工具特定内容放在 common.json 根级别
- `imageCompressor` - 图片压缩工具的完整 SEO 内容
- `imageConverter` - 图片转换工具的完整 SEO 内容
- 这些应该放在各自的工具 JSON 文件中（如 `image-compression.json`）

#### ❌ 问题 2: 通用 UI 组件翻译放在 common.common 中
- `common.rating` - Rating 组件的通用翻译
- `common.scenarios` - Scenarios 组件的通用翻译
- `common.faq` - FAQ 组件的通用翻译
- `common.comparison` - Comparison 组件的通用翻译
- 这些是正确的，因为它们是跨工具共享的 UI 组件

#### ❌ 问题 3: rating 的双重来源
- 工具特定 JSON（如 `font-generator.json`）中有 `rating.text`
- `common.json` 的 `common.rating` 中有 `title`, `rating`, `description`
- 代码使用：`content.rating?.title || t?.common?.rating?.title`
- 这导致结构不一致

## 当前 common.json 结构

```
common.json
├── nav                    # 导航菜单（通用）
├── home                   # 首页内容（通用）
├── footer                 # 页脚（通用）
├── breadcrumb             # 面包屑（通用）
├── about                  # 关于页面（通用）
├── common                 # 通用 UI 组件翻译
│   ├── rating            # ⚠️ Rating 组件（通用）
│   ├── scenarios         # ✅ Scenarios 组件（通用）
│   ├── faq               # ✅ FAQ 组件（通用）
│   ├── comparison         # ✅ Comparison 组件（通用）
│   ├── fontGenerator     # ✅ FontGenerator 组件（通用）
│   ├── tool              # ✅ 工具 UI 组件（通用）
│   └── ...
├── imageCompressor        # ❌ 工具特定 SEO 内容（应该移除）
│   ├── metadata
│   ├── whyToolaze
│   ├── features
│   ├── howToUse
│   ├── comparison
│   ├── scenarios
│   └── faq
├── imageConverter         # ❌ 工具特定 SEO 内容（应该移除）
│   ├── metadata
│   ├── whyToolaze
│   ├── features
│   ├── howToUse
│   ├── comparison
│   ├── scenarios
│   └── faq
├── privacy                # 隐私政策（通用）
└── terms                  # 服务条款（通用）
```

## 代码使用情况

### Rating 组件的使用方式

```typescript
// src/components/blocks/ToolL2PageContent.tsx:314-321
rating: (bgClass: string) => (
  <Rating
    key="rating"
    title={content.rating?.title || t?.common?.rating?.title}  // 优先使用工具特定的，回退到通用
    rating={t?.common?.rating?.rating}                        // 只从 common 获取
    description={content.rating?.text || t?.common?.rating?.description || ''}  // 优先使用工具特定的
    bgClass={bgClass}
  />
)
```

**问题**：
- `title` 和 `description` 可以从工具特定 JSON 获取，但 `rating` 只能从 common 获取
- 这导致结构不一致

### 工具特定内容的使用

```typescript
// imageCompressor 和 imageConverter 的内容在 common.json 根级别
// 但 font-generator 的内容在独立的 font-generator.json 文件中
// 这导致结构不一致
```

## 建议的理想结构

### 方案 1: 完全分离（推荐）

```
common.json
├── nav                    # 导航菜单
├── home                   # 首页内容
├── footer                 # 页脚
├── breadcrumb             # 面包屑
├── about                  # 关于页面
├── common                 # 通用 UI 组件翻译
│   ├── rating            # Rating 组件（通用标题、评分）
│   ├── scenarios         # Scenarios 组件（通用标题）
│   ├── faq               # FAQ 组件（通用标题）
│   ├── comparison        # Comparison 组件（通用标签）
│   ├── fontGenerator     # FontGenerator 组件
│   ├── tool              # 工具 UI 组件
│   └── ...
├── privacy                # 隐私政策
└── terms                  # 服务条款

工具特定 JSON（如 font-generator.json, image-compression.json）
├── metadata              # SEO 元数据
├── hero                  # Hero 区域
├── intro                 # 介绍部分
├── features              # 功能列表
├── howToUse              # 使用说明
├── performanceMetrics    # 技术规格
├── comparison            # 对比（工具特定的对比内容）
├── scenes                # 使用场景（工具特定的场景）
├── rating                # 评分（工具特定的评分文本）
└── faq                   # 常见问题（工具特定的 FAQ）
```

### 方案 2: 保持现状但明确规则

如果保持当前结构，需要明确规则：

1. **common.json 根级别的工具内容**（imageCompressor, imageConverter）
   - 这些是历史遗留，应该迁移到独立的 JSON 文件
   - 或者保持现状，但所有工具都应该遵循相同模式

2. **common.common 中的通用组件翻译**
   - `rating.title`, `rating.rating` - 通用默认值
   - `scenarios.title` - 通用标题
   - `faq.title` - 通用标题
   - `comparison.*` - 通用标签

3. **工具特定 JSON 中的 SEO 内容**
   - `rating.text` - 工具特定的评分描述
   - `scenes` - 工具特定的使用场景
   - `faq` - 工具特定的常见问题

## 当前实际使用情况

### Rating 组件
- **通用部分**（common.common.rating）：
  - `title`: "Trusted by Thousands of Creators"
  - `rating`: "4.9/5 FROM 10K+ CREATORS"
  - `description`: 通用描述（关于图片压缩）
  
- **工具特定部分**（font-generator.json）：
  - `rating.text`: "The best font generator..."（工具特定的描述）

### 问题
- `rating.description` 在 common 中是通用的（关于图片压缩），但 font-generator 需要不同的描述
- 代码使用 `content.rating?.text || t?.common?.rating?.description`，这意味着如果工具特定 JSON 没有 `rating.text`，会回退到通用的描述（可能不相关）

## 建议的修复方案

### 选项 A: 保持现状，但修复 rating 描述
- 在 `font-generator.json` 中添加 `rating.text`
- 确保所有工具都有工具特定的 `rating.text`
- common.common.rating.description 作为最后的回退

### 选项 B: 重构结构（长期）
- 将 imageCompressor 和 imageConverter 从 common.json 移到独立的 JSON 文件
- 统一所有工具的结构
- 明确区分通用 UI 翻译和工具特定 SEO 内容
