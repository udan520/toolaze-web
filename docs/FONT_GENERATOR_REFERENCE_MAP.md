# Font Generator 页面引用关系图

## 🗺️ 完整引用关系

```
用户访问 /font-generator 或 /{locale}/font-generator
│
├─┐ 入口文件
│ └─ src/app/[locale]/font-generator/page.tsx
│    │
│    ├─ generateMetadata()
│    │  └─ getL2SeoContent('font-generator', locale)
│    │     └─ src/lib/seo-loader.ts:400-410
│    │        └─ import('@/data/{locale}/font-generator.json')
│    │           └─ 返回: content.metadata
│    │
│    └─ FontGeneratorPage()
│       └─ <ToolL2PageContent locale={locale} tool="font-generator" />
│
├─┐ 主组件
│ └─ src/components/blocks/ToolL2PageContent.tsx
│    │
│    ├─ 数据加载 (第 125 行)
│    │  ├─ getL2SeoContent('font-generator', locale)
│    │  │  └─ src/lib/seo-loader.ts:400-410
│    │  │     └─ import('@/data/{locale}/font-generator.json')
│    │  │        └─ 返回: content 对象
│    │  │
│    │  └─ loadCommonTranslations(locale)
│    │     └─ src/lib/seo-loader.ts:120-136
│    │        └─ import('@/data/{locale}/common.json')
│    │           └─ 返回: t 对象
│    │
│    ├─ JSON-LD Schema (第 236-239 行)
│    │  └─ content.howToUse.title + content.howToUse.steps
│    │
│    ├─ Navigation (第 241 行)
│    │  └─ src/components/Navigation.tsx
│    │     └─ common.json → nav.*
│    │
│    ├─ Breadcrumb (第 243 行)
│    │  └─ src/components/Breadcrumb.tsx
│    │     ├─ common.json → breadcrumb.home
│    │     └─ content.hero.h1 → 提取为 "Font Generator"
│    │
│    ├─ Hero 板块 (第 247-251 行) [固定位置]
│    │  └─ FontGeneratorHero
│    │     ├─ content.hero.h1
│    │     ├─ content.hero.desc
│    │     ├─ FontGenerator 组件
│    │     │  └─ common.json → common.fontGenerator.*
│    │     └─ TrustBar 组件
│    │        └─ common.json → common.fontGenerator.trustBar.*
│    │
│    ├─ Dynamic Sections (第 309-406 行)
│    │  └─ 根据 content.sectionsOrder 动态渲染
│    │     │
│    │     ├─ howToUse (第 347-353 行)
│    │     │  └─ src/components/blocks/HowToUse.tsx
│    │     │     ├─ content.howToUse.title
│    │     │     └─ content.howToUse.steps[]
│    │     │
│    │     ├─ features (第 321-330 行)
│    │     │  └─ src/components/blocks/Features.tsx
│    │     │     ├─ content.features.title
│    │     │     └─ content.features.items[]
│    │     │
│    │     ├─ intro (第 313-319 行)
│    │     │  └─ src/components/blocks/Intro.tsx
│    │     │     ├─ content.intro.title
│    │     │     └─ content.intro.content[0].text
│    │     │
│    │     ├─ performanceMetrics (第 332-345 行)
│    │     │  └─ src/components/blocks/PerformanceMetrics.tsx
│    │     │     ├─ content.performanceMetrics.title
│    │     │     ├─ content.performanceMetrics.metrics[]
│    │     │     └─ common.json → common.performanceMetrics.*
│    │     │
│    │     ├─ comparison (第 355-367 行)
│    │     │  └─ src/components/blocks/Comparison.tsx
│    │     │     ├─ content.comparison.title
│    │     │     ├─ content.comparison.toolazeFeatures
│    │     │     ├─ content.comparison.othersFeatures
│    │     │     └─ content.comparison.* (标签)
│    │     │
│    │     ├─ scenes (第 369-375 行)
│    │     │  └─ src/components/blocks/Scenarios.tsx
│    │     │     ├─ content.scenesTitle
│    │     │     └─ content.scenes[]
│    │     │
│    │     ├─ rating (第 377-384 行)
│    │     │  └─ src/components/blocks/Rating.tsx
│    │     │     ├─ content.rating.title
│    │     │     ├─ content.rating.rating
│    │     │     └─ content.rating.text
│    │     │
│    │     └─ faq (第 386-393 行)
│    │        └─ src/components/blocks/FAQ.tsx
│    │           ├─ content.faqTitle
│    │           └─ content.faq[]
│    │
│    ├─ Recommended Tools (第 408-437 行) [固定位置]
│    │  ├─ getAllSlugs('font-generator', locale)
│    │  │  └─ src/lib/seo-loader.ts:509-546
│    │  │     └─ 返回: ['cursive', 'fancy', 'bold', ...]
│    │  ├─ getSeoContent('font-generator', slug, locale)
│    │  │  └─ src/lib/seo-loader.ts:509-516
│    │  │     └─ import('@/data/{locale}/font-generator/{slug}.json')
│    │  ├─ content.moreTools
│    │  ├─ common.json → common.viewAllTools.*
│    │  └─ common.json → common.tryNow
│    │
│    └─ Footer (第 439 行)
│       └─ src/components/Footer.tsx
│          └─ common.json → footer.*
│
└─┐ 数据文件
  │
  ├─ src/data/{locale}/font-generator.json
  │  └─ 主页面 SEO 内容
  │     ├─ metadata.*
  │     ├─ sectionsOrder[]
  │     ├─ hero.*
  │     ├─ intro.*
  │     ├─ features.*
  │     ├─ performanceMetrics.*
  │     ├─ howToUse.*
  │     ├─ comparison.*
  │     ├─ scenesTitle + scenes[]
  │     ├─ rating.*
  │     ├─ faqTitle + faq[]
  │     └─ moreTools
  │
  ├─ src/data/{locale}/common.json
  │  └─ 通用翻译
  │     ├─ nav.* → Navigation
  │     ├─ breadcrumb.* → Breadcrumb
  │     ├─ footer.* → Footer
  │     └─ common.*
  │        ├─ performanceMetrics.* → PerformanceMetrics
  │        ├─ viewAllTools.* → Recommended Tools
  │        ├─ tryNow → Recommended Tools
  │        └─ fontGenerator.* → FontGenerator 组件
  │           ├─ selectFontStyle
  │           ├─ font / fonts
  │           ├─ allFonts
  │           ├─ copy / copied
  │           ├─ placeholder
  │           ├─ defaultText
  │           ├─ trustBar.* → TrustBar
  │           ├─ fontTerms.* → FontGenerator
  │           └─ categories.* → FontGenerator
  │
  └─ src/data/{locale}/font-generator/{slug}.json
     └─ L3 页面数据 (用于 Recommended Tools)
        └─ 例如: cursive.json, fancy.json, bold.json, ...
```

## 📋 数据文件详细映射

### font-generator.json → 页面板块

| JSON 字段路径 | 板块 | 组件 | 代码位置 |
|--------------|------|------|----------|
| `metadata.title` | SEO Title | Metadata | page.tsx:27 |
| `metadata.description` | SEO Description | Metadata | page.tsx:28 |
| `sectionsOrder[]` | 板块顺序 | - | ToolL2PageContent.tsx:226 |
| `hero.h1` | Hero 标题 | FontGeneratorHero | ToolL2PageContent.tsx:249 |
| `hero.desc` | Hero 描述 | FontGeneratorHero | ToolL2PageContent.tsx:250 |
| `intro.title` | Intro 标题 | Intro | ToolL2PageContent.tsx:172 |
| `intro.content[0].text` | Intro 内容 | Intro | ToolL2PageContent.tsx:173 |
| `features.title` | Features 标题 | Features | ToolL2PageContent.tsx:326 |
| `features.items[]` | Features 列表 | Features | ToolL2PageContent.tsx:322 |
| `performanceMetrics.title` | Performance Metrics 标题 | PerformanceMetrics | ToolL2PageContent.tsx:337 |
| `performanceMetrics.metrics[]` | Performance Metrics 列表 | PerformanceMetrics | ToolL2PageContent.tsx:338 |
| `howToUse.title` | How To Use 标题 | HowToUse | ToolL2PageContent.tsx:350 |
| `howToUse.steps[]` | How To Use 步骤 | HowToUse | ToolL2PageContent.tsx:351 |
| `comparison.title` | Comparison 标题 | Comparison | ToolL2PageContent.tsx:359 |
| `comparison.toolazeFeatures` | Toolaze 优势 | Comparison | ToolL2PageContent.tsx:183 |
| `comparison.othersFeatures` | 其他工具劣势 | Comparison | ToolL2PageContent.tsx:184 |
| `comparison.*` | Comparison 标签 | Comparison | ToolL2PageContent.tsx:361-364 |
| `scenesTitle` | Scenarios 标题 | Scenarios | ToolL2PageContent.tsx:372 |
| `scenes[]` | Scenarios 列表 | Scenarios | ToolL2PageContent.tsx:373 |
| `rating.title` | Rating 标题 | Rating | ToolL2PageContent.tsx:380 |
| `rating.rating` | Rating 评分 | Rating | ToolL2PageContent.tsx:381 |
| `rating.text` | Rating 描述 | Rating | ToolL2PageContent.tsx:382 |
| `faqTitle` | FAQ 标题 | FAQ | ToolL2PageContent.tsx:389 |
| `faq[]` | FAQ 列表 | FAQ | ToolL2PageContent.tsx:390 |
| `moreTools` | Recommended Tools 标题 | - | ToolL2PageContent.tsx:414 |

### common.json → 页面板块

| JSON 字段路径 | 板块 | 组件 | 代码位置 |
|--------------|------|------|----------|
| `nav.*` | Navigation | Navigation | ToolL2PageContent.tsx:241 |
| `breadcrumb.home` | Breadcrumb | Breadcrumb | ToolL2PageContent.tsx:190 |
| `footer.*` | Footer | Footer | ToolL2PageContent.tsx:439 |
| `common.performanceMetrics.*` | Performance Metrics 列标题 | PerformanceMetrics | ToolL2PageContent.tsx:339-342 |
| `common.viewAllTools.all` | Recommended Tools 按钮 | ViewAllToolsButton | ToolL2PageContent.tsx:374 |
| `common.tryNow` | Recommended Tools 按钮 | ToolCard | ToolL2PageContent.tsx:435 |
| `common.fontGenerator.*` | FontGenerator 组件 UI | FontGenerator | FontGenerator.tsx:82-88 |
| `common.fontGenerator.trustBar.*` | TrustBar 组件 | TrustBar | TrustBar.tsx:22-28 |

## 🔄 数据加载流程

### 服务端数据加载 (ToolL2PageContent)

```typescript
// 1. 加载工具特定数据
const content = await getL2SeoContent('font-generator', locale)
// → src/lib/seo-loader.ts:400-410
// → import('@/data/{locale}/font-generator.json')

// 2. 加载通用翻译
const t = await loadCommonTranslations(locale)
// → src/lib/seo-loader.ts:120-136
// → import('@/data/{locale}/common.json')

// 3. 加载推荐工具数据
const allSlugs = await getAllSlugs('font-generator', locale)
// → src/lib/seo-loader.ts:509-546
// → 返回: ['cursive', 'fancy', 'bold', ...]

const recommendedTools = await Promise.all(
  allSlugs.slice(0, 3).map(async (s) => {
    const toolData = await getSeoContent('font-generator', s, locale)
    // → src/lib/seo-loader.ts:509-516
    // → import('@/data/{locale}/font-generator/{slug}.json')
  })
)
```

### 客户端数据加载 (FontGenerator & TrustBar)

```typescript
// FontGenerator.tsx:74-95
async function loadTranslations(locale: string) {
  const data = await import(`@/data/${locale}/common.json`)
  return data.default?.common?.fontGenerator || defaultTranslations
}

// TrustBar.tsx:14-35
async function loadTrustBarTranslations(locale: string) {
  const data = await import(`@/data/${locale}/common.json`)
  return data.default?.common?.fontGenerator?.trustBar || defaultTrustBar
}
```

## 📂 文件位置速查

### 页面文件
- **入口**: `src/app/[locale]/font-generator/page.tsx`
- **主组件**: `src/components/blocks/ToolL2PageContent.tsx`

### 数据文件
- **主数据**: `src/data/{locale}/font-generator.json`
- **通用翻译**: `src/data/{locale}/common.json`
- **L3 页面**: `src/data/{locale}/font-generator/{slug}.json`

### 组件文件
- **Hero**: `src/components/blocks/FontGeneratorHero.tsx`
- **工具**: `src/components/FontGenerator.tsx`
- **信任条**: `src/components/blocks/TrustBar.tsx`
- **板块组件**: `src/components/blocks/*.tsx`
- **通用组件**: `src/components/Navigation.tsx`, `Breadcrumb.tsx`, `Footer.tsx`

### 工具文件
- **数据加载**: `src/lib/seo-loader.ts`
- **链接本地化**: `src/lib/localize-links.ts`
