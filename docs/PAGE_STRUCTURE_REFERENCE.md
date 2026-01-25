# 页面结构参考文档

## 📄 工具 L2 页面完整结构

本文档详细说明工具 L2 页面（如 `/font-generator`, `/image-compressor`, `/image-converter`）的组成结构和每个板块的数据来源。

## 🏗️ 页面整体结构

```
页面 (ToolL2PageContent)
├── JSON-LD Schema (SEO)
├── Navigation (导航栏)
├── Breadcrumb (面包屑)
└── Main Content
    ├── Hero (固定位置，不参与动态顺序)
    ├── Dynamic Sections (根据 sectionsOrder 动态渲染)
    └── Recommended Tools (固定位置)
└── Footer (页脚)
```

## 📊 数据来源

### 主要数据源

1. **工具特定 JSON 文件**
   - `src/data/{locale}/font-generator.json`
   - `src/data/{locale}/image-compressor.json`
   - `src/data/{locale}/image-converter.json`
   - 通过 `getL2SeoContent(tool, locale)` 加载

2. **通用翻译文件**
   - `src/data/{locale}/common.json`
   - 通过 `loadCommonTranslations(locale)` 加载
   - 用于：导航、面包屑、通用 UI 组件翻译

3. **L3 页面数据**
   - 用于推荐工具板块
   - 通过 `getSeoContent(tool, slug, locale)` 加载

## 🔍 各板块详细说明

### 1. JSON-LD Schema (SEO)

**位置**: 页面最顶部（`<head>` 中）

**数据来源**:
- `content.howToUse.title` - HowTo 标题
- `content.howToUse.steps` - HowTo 步骤

**组件**: 内联 `<script>` 标签
**文件**: `src/components/blocks/ToolL2PageContent.tsx:236-239`

---

### 2. Navigation (导航栏)

**位置**: 页面顶部

**数据来源**:
- `common.json` → `nav.*`
- 硬编码在组件中

**组件**: `@/components/Navigation`
**文件**: `src/components/Navigation.tsx`

---

### 3. Breadcrumb (面包屑)

**位置**: Navigation 下方

**数据来源**:
- `common.json` → `breadcrumb.home`
- `content.hero.h1` - 提取页面标题

**组件**: `@/components/Breadcrumb`
**文件**: `src/components/Breadcrumb.tsx`
**代码位置**: `ToolL2PageContent.tsx:243`

---

### 4. Hero 板块 (固定位置)

**位置**: Main Content 最前面，不参与动态顺序

**数据来源**:
- `content.hero.h1` - 主标题
- `content.hero.desc` - 描述

**组件**: 
- `font-generator`: `FontGeneratorHero` + `FontGenerator` + `TrustBar`
- `image-compressor`: 内联 Header + `ImageCompressor` + `TrustBar`
- `image-converter`: 内联 Header + `ImageConverter` + `TrustBar`

**文件**: 
- `src/components/blocks/FontGeneratorHero.tsx`
- `src/components/ImageCompressor.tsx`
- `src/components/ImageConverter.tsx`
- `src/components/blocks/TrustBar.tsx`

**代码位置**: `ToolL2PageContent.tsx:246-307`

---

### 5. Dynamic Sections (动态板块)

**位置**: Hero 板块之后，根据 `sectionsOrder` 配置动态渲染

**数据来源**: `content.sectionsOrder` 或默认顺序

**默认顺序**:
```javascript
[
  'howToUse',
  'features',
  'intro',
  'performanceMetrics',
  'comparison',
  'scenes',
  'rating',
  'faq'
]
```

**背景色交替**: 
- index 0 = `bg-white`
- index 1 = `bg-[#F8FAFF]`
- index 2 = `bg-white`
- ...

**代码位置**: `ToolL2PageContent.tsx:309-406`

#### 5.1 Intro 板块

**Key**: `intro`

**数据来源**:
- `content.intro.title` - 标题
- `content.intro.content[0].text` - 描述文本
- 如果缺失，使用工具特定的默认值

**组件**: `@/components/blocks/Intro`
**文件**: `src/components/blocks/Intro.tsx`
**代码位置**: `ToolL2PageContent.tsx:313-319`

---

#### 5.2 Features 板块

**Key**: `features`

**数据来源**:
- `content.features.title` - 标题
- `content.features.items` - 功能列表数组
  - `items[].icon` - 图标（emoji）
  - `items[].iconType` - 图标类型
  - `items[].title` - 功能标题
  - `items[].desc` - 功能描述

**组件**: `@/components/blocks/Features`
**文件**: `src/components/blocks/Features.tsx`
**代码位置**: `ToolL2PageContent.tsx:321-330`

---

#### 5.3 Performance Metrics 板块

**Key**: `performanceMetrics`

**数据来源**:
- `content.performanceMetrics.title` - 标题
- `content.performanceMetrics.metrics` - 指标数组
  - `metrics[].label` - 指标标签
  - `metrics[].value` - 指标值
- `common.json` → `common.performanceMetrics.*` - 列标题翻译

**组件**: `@/components/blocks/PerformanceMetrics`
**文件**: `src/components/blocks/PerformanceMetrics.tsx`
**代码位置**: `ToolL2PageContent.tsx:332-345`

---

#### 5.4 How To Use 板块

**Key**: `howToUse`

**数据来源**:
- `content.howToUse.title` - 标题
- `content.howToUse.steps` - 步骤数组
  - `steps[].title` - 步骤标题
  - `steps[].desc` - 步骤描述

**组件**: `@/components/blocks/HowToUse`
**文件**: `src/components/blocks/HowToUse.tsx`
**代码位置**: `ToolL2PageContent.tsx:347-353`

---

#### 5.5 Comparison 板块

**Key**: `comparison`

**数据来源**:
- `content.comparison.title` - 标题
- `content.comparison.toolazeFeatures` - Toolaze 优势（字符串，逗号分隔）
- `content.comparison.othersFeatures` - 其他工具劣势（字符串，逗号分隔）
- `content.comparison.smartChoice` - "Smart Choice" 标签
- `content.comparison.toolaze` - "Toolaze 💎" 标签
- `content.comparison.vs` - "VS" 标签
- `content.comparison.otherTools` - "Other Tools" 标签

**组件**: `@/components/blocks/Comparison`
**文件**: `src/components/blocks/Comparison.tsx`
**代码位置**: `ToolL2PageContent.tsx:355-366`

**注意**: Comparison 组件会智能分割多种语言的分隔符（`, `, `、`, 中文标点等）

---

#### 5.6 Scenarios 板块

**Key**: `scenes`

**数据来源**:
- `content.scenesTitle` - 标题（默认 "Use Cases"）
- `content.scenes` - 场景数组
  - `scenes[].title` - 场景标题
  - `scenes[].icon` - 图标（emoji）
  - `scenes[].desc` - 场景描述

**组件**: `@/components/blocks/Scenarios`
**文件**: `src/components/blocks/Scenarios.tsx`
**代码位置**: `ToolL2PageContent.tsx:368-374`

---

#### 5.7 Rating 板块

**Key**: `rating`

**数据来源**:
- `content.rating.title` - 标题（默认 "Trusted by Thousands of Creators"）
- `content.rating.rating` - 评分文本（默认 "4.9/5 FROM 10K+ CREATORS"）
- `content.rating.text` - 工具特定的评分描述

**组件**: `@/components/blocks/Rating`
**文件**: `src/components/blocks/Rating.tsx`
**代码位置**: `ToolL2PageContent.tsx:376-383`

---

#### 5.8 FAQ 板块

**Key**: `faq`

**数据来源**:
- `content.faqTitle` - 标题（默认 "Frequently Asked Questions"）
- `content.faq` - FAQ 数组
  - `faq[].q` - 问题（可能包含 HTML 链接）
  - `faq[].a` - 答案（可能包含 HTML 链接）

**组件**: `@/components/blocks/FAQ`
**文件**: `src/components/blocks/FAQ.tsx`
**代码位置**: `ToolL2PageContent.tsx:385-392`

---

### 6. Recommended Tools 板块 (固定位置)

**位置**: Dynamic Sections 之后

**数据来源**:
- `getAllSlugs(tool, locale)` - 获取所有 L3 页面 slug
- `getSeoContent(tool, slug, locale)` - 加载前 3 个 L3 页面数据
- `content.moreTools` - "More Tools" 标题
- `common.json` → `common.viewAllTools.*` - 按钮文本
- `common.json` → `common.tryNow` - "Try Now" 文本

**组件**: 
- `ToolCard` - 工具卡片
- `ViewAllToolsButton` - "View All Tools" 按钮

**文件**: 
- `src/components/ToolCard.tsx`
- `src/components/ViewAllToolsButton.tsx`

**代码位置**: `ToolL2PageContent.tsx:408-437`

---

### 7. Footer (页脚)

**位置**: 页面底部

**数据来源**:
- `common.json` → `footer.*`

**组件**: `@/components/Footer`
**文件**: `src/components/Footer.tsx`
**代码位置**: `ToolL2PageContent.tsx:439`

---

## 📋 JSON 文件结构映射

### 工具特定 JSON 文件结构

```json
{
  "in_menu": true,
  "metadata": {
    "title": "...",           // → SEO title
    "description": "..."      // → SEO description
  },
  "sectionsOrder": [...],     // → 控制板块顺序
  "hero": {
    "h1": "...",              // → Hero 标题
    "desc": "..."             // → Hero 描述
  },
  "intro": {
    "title": "...",           // → Intro 标题
    "content": [{
      "title": "...",
      "text": "..."           // → Intro 描述
    }]
  },
  "features": {
    "title": "...",           // → Features 标题
    "items": [...]            // → Features 列表
  },
  "performanceMetrics": {
    "title": "...",           // → Performance Metrics 标题
    "metrics": [...]          // → Performance Metrics 列表
  },
  "howToUse": {
    "title": "...",           // → How To Use 标题
    "steps": [...]            // → How To Use 步骤
  },
  "comparison": {
    "title": "...",           // → Comparison 标题
    "toolazeFeatures": "...", // → Toolaze 优势
    "othersFeatures": "...",  // → 其他工具劣势
    "smartChoice": "...",     // → 标签文本
    "toolaze": "...",         // → 标签文本
    "vs": "...",              // → 标签文本
    "otherTools": "..."       // → 标签文本
  },
  "scenesTitle": "...",      // → Scenarios 标题
  "scenes": [...],            // → Scenarios 列表
  "rating": {
    "title": "...",           // → Rating 标题
    "rating": "...",          // → 评分文本
    "text": "..."             // → Rating 描述
  },
  "faqTitle": "...",         // → FAQ 标题
  "faq": [...],              // → FAQ 列表
  "moreTools": "..."         // → Recommended Tools 标题
}
```

### Common.json 使用部分

```json
{
  "nav": {...},              // → Navigation
  "breadcrumb": {...},       // → Breadcrumb
  "footer": {...},           // → Footer
  "common": {
    "performanceMetrics": {  // → Performance Metrics 列标题
      "metricColumn": "...",
      "specificationColumn": "..."
    },
    "viewAllTools": {        // → Recommended Tools 按钮
      "related": "...",
      "all": "..."
    },
    "tryNow": "..."          // → "Try Now" 按钮文本
  }
}
```

## 🔄 数据流图

```
用户访问页面
    ↓
ToolL2PageContent 组件
    ↓
getL2SeoContent(tool, locale)
    ↓
加载工具特定 JSON 文件
    ├── font-generator.json
    ├── image-compressor.json
    └── image-converter.json
    ↓
loadCommonTranslations(locale)
    ↓
加载 common.json
    ↓
根据 sectionsOrder 渲染板块
    ├── intro → content.intro
    ├── features → content.features
    ├── performanceMetrics → content.performanceMetrics
    ├── howToUse → content.howToUse
    ├── comparison → content.comparison
    ├── scenes → content.scenes
    ├── rating → content.rating
    └── faq → content.faq
    ↓
渲染固定板块
    ├── Hero (固定位置)
    └── Recommended Tools (固定位置)
```

## 📝 修改指南

### 添加新板块

1. **在 JSON 文件中添加数据**
   ```json
   {
     "newSection": {
       "title": "...",
       "content": "..."
     }
   }
   ```

2. **在 ToolL2PageContent.tsx 中添加渲染器**
   ```typescript
   const sectionRenderers = {
     // ... 现有板块
     newSection: (bgClass: string) => (
       <NewSection
         key="newSection"
         title={content.newSection?.title}
         content={content.newSection?.content}
         bgClass={bgClass}
       />
     )
   }
   ```

3. **在 sectionsOrder 中添加**
   ```json
   {
     "sectionsOrder": [
       "...",
       "newSection",
       "..."
     ]
   }
   ```

### 修改板块顺序

直接修改 JSON 文件中的 `sectionsOrder` 数组：

```json
{
  "sectionsOrder": [
    "howToUse",      // 第一个
    "features",      // 第二个
    "intro",         // 第三个
    // ...
  ]
}
```

### 修改板块内容

直接编辑对应的 JSON 文件字段即可，无需修改代码。

## 🔗 相关文件

- **主组件**: `src/components/blocks/ToolL2PageContent.tsx`
- **页面文件**: 
  - `src/app/[locale]/font-generator/page.tsx`
  - `src/app/[locale]/image-compressor/page.tsx`
  - `src/app/[locale]/image-converter/page.tsx`
- **数据加载**: `src/lib/seo-loader.ts`
- **板块组件**: `src/components/blocks/*.tsx`
