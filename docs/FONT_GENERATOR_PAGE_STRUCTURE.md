# Font Generator 页面组成结构

## 📄 页面入口

### 文件位置
```
src/app/[locale]/font-generator/page.tsx
```

### 代码结构
```typescript
// 1. 生成静态参数（所有语言版本）
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

// 2. 生成 SEO 元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const content = await getL2SeoContent('font-generator', locale)
  return {
    title: content?.metadata?.title,
    description: content?.metadata?.description,
    // ...
  }
}

// 3. 页面组件
export default async function FontGeneratorPage({ params }: PageProps) {
  return <ToolL2PageContent locale={locale} tool="font-generator" />
}
```

### 数据加载
- **函数**: `getL2SeoContent('font-generator', locale)`
- **文件**: `src/lib/seo-loader.ts:400-410`
- **加载路径**: 
  - 英语: `src/data/en/font-generator.json`
  - 其他语言: `src/data/{locale}/font-generator.json` (如果不存在则回退到英语)

---

## 🏗️ 页面完整结构

### 渲染流程

```
用户访问 /font-generator 或 /{locale}/font-generator
    ↓
FontGeneratorPage (page.tsx)
    ↓
ToolL2PageContent 组件
    ↓
加载数据
    ├── getL2SeoContent('font-generator', locale)
    │   └── 加载 src/data/{locale}/font-generator.json
    └── loadCommonTranslations(locale)
        └── 加载 src/data/{locale}/common.json
    ↓
渲染页面结构
```

---

## 📊 各板块详细引用关系

### 1. JSON-LD Schema (SEO)

**位置**: `<head>` 标签中

**数据来源**:
```typescript
// ToolL2PageContent.tsx:229-231
const howToTitle = content.howToUse?.title || `How to ${...}`
const howToSteps = content.howToUse?.steps || []
const jsonLdSchema = generateHowToSchema(howToTitle, howToSteps)
```

**JSON 字段**:
- `font-generator.json` → `howToUse.title` (第 115 行)
- `font-generator.json` → `howToUse.steps[]` (第 116-129 行)

**代码位置**: `src/components/blocks/ToolL2PageContent.tsx:236-239`

---

### 2. Navigation (导航栏)

**组件**: `@/components/Navigation`
**文件**: `src/components/Navigation.tsx`

**数据来源**:
- `common.json` → `nav.*`
- 硬编码在组件中

**代码位置**: `ToolL2PageContent.tsx:241`

---

### 3. Breadcrumb (面包屑)

**组件**: `@/components/Breadcrumb`
**文件**: `src/components/Breadcrumb.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:188-192
const pageTitle = extractSimpleTitle(content.hero.h1)  // "Font Generator"
const breadcrumbItems = [
  { label: breadcrumbT.home, href: '/' },  // common.json → breadcrumb.home
  { label: pageTitle }  // "Font Generator"
]
```

**JSON 字段**:
- `common.json` → `breadcrumb.home` (第 96 行)
- `font-generator.json` → `hero.h1` (第 18 行) → 提取为 "Font Generator"

**代码位置**: `ToolL2PageContent.tsx:243`

---

### 4. Hero 板块 (固定位置)

**组件**: `FontGeneratorHero`
**文件**: `src/components/blocks/FontGeneratorHero.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:247-251
<FontGeneratorHero 
  h1={content.hero?.h1 || 'Font Generator'}
  desc={content.hero?.desc || '...'}
/>
```

**JSON 字段**:
- `font-generator.json` → `hero.h1` (第 18 行): `"Free <span class=\"text-gradient\">Font Generator</span>"`
- `font-generator.json` → `hero.desc` (第 19 行): `"Generate custom fonts online for free..."`

**组件内部**:
1. **标题渲染**: `FontGeneratorHero.tsx:65-67` - 使用 `renderH1WithGradient()` 处理渐变
2. **描述**: `FontGeneratorHero.tsx:68-70`
3. **工具组件**: `FontGeneratorHero.tsx:72` - `<FontGenerator />`
   - 文件: `src/components/FontGenerator.tsx`
   - 数据加载: `FontGenerator.tsx:74-95` - `loadTranslations(locale)`
   - 数据来源: `common.json` → `common.fontGenerator.*`
     - `common.fontGenerator.selectFontStyle` (第 168 行)
     - `common.fontGenerator.font` / `fonts` (第 169-170 行)
     - `common.fontGenerator.allFonts` (第 171 行)
     - `common.fontGenerator.copy` / `copied` (第 172-173 行)
     - `common.fontGenerator.placeholder` (第 174 行)
     - `common.fontGenerator.defaultText` (第 175 行)
     - `common.fontGenerator.trustBar.*` (第 176-179 行)
     - `common.fontGenerator.fontTerms.*` (第 181-206 行)
     - `common.fontGenerator.categories.*` (第 208-226 行)
   - 使用方式: 客户端组件，通过 `useEffect` 和 `usePathname` 检测语言，动态加载翻译
4. **信任条**: `FontGeneratorHero.tsx:73` - `<TrustBar />`
   - 文件: `src/components/blocks/TrustBar.tsx`
   - 数据加载: `TrustBar.tsx:14-35` - `loadTrustBarTranslations(locale)`
   - 数据来源: `common.json` → `common.fontGenerator.trustBar.*` (第 176-179 行)
     - `trustBar.private`: `"100% Private"`
     - `trustBar.instantPreview`: `"Instant Preview"`
     - `trustBar.noServerLogs`: `"No Server Logs"`
   - 使用方式: 客户端组件，通过 `usePathname` 检测语言，动态加载翻译

**代码位置**: `ToolL2PageContent.tsx:247-251`

---

### 5. Dynamic Sections (动态板块)

根据 `sectionsOrder` 配置动态渲染，背景色交替。

**数据来源**: `font-generator.json` → `sectionsOrder` (第 7-16 行)
```json
[
  "howToUse",        // 第 1 个板块 (bg-white)
  "features",        // 第 2 个板块 (bg-[#F8FAFF])
  "intro",           // 第 3 个板块 (bg-white)
  "performanceMetrics", // 第 4 个板块 (bg-[#F8FAFF])
  "comparison",      // 第 5 个板块 (bg-white)
  "scenes",          // 第 6 个板块 (bg-[#F8FAFF])
  "rating",          // 第 7 个板块 (bg-white)
  "faq"              // 第 8 个板块 (bg-[#F8FAFF])
]
```

**渲染逻辑**: `ToolL2PageContent.tsx:398-405`

---

#### 5.1 How To Use 板块

**Key**: `howToUse`

**组件**: `@/components/blocks/HowToUse`
**文件**: `src/components/blocks/HowToUse.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:347-353
<HowToUse
  title={content.howToUse?.title}
  steps={howToUseSteps}  // content.howToUse.steps
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `howToUse.title` (第 115 行): `"How to Use Toolaze Font Generator"`
- `font-generator.json` → `howToUse.steps[]` (第 116-129 行):
  - `steps[0].title`: `"Type Your Text"`
  - `steps[0].desc`: `"Enter the text you want to convert..."`
  - `steps[1].title`: `"Choose Font Style"`
  - `steps[1].desc`: `"Select from multiple font styles..."`
  - `steps[2].title`: `"Copy & Paste"`
  - `steps[2].desc`: `"Click the copy button..."`

**代码位置**: `ToolL2PageContent.tsx:347-353`

---

#### 5.2 Features 板块

**Key**: `features`

**组件**: `@/components/blocks/Features`
**文件**: `src/components/blocks/Features.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:321-330
const featuresData = content.features?.items || []
<Features
  title={content.features?.title || 'Key Features'}
  features={featuresData}
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `features.title` (第 35 行): `"Powerful Font Generator Features"`
- `font-generator.json` → `features.items[]` (第 36-73 行):
  - `items[0]`: `{ icon: "🎨", iconType: "quality", title: "Multiple Font Styles", desc: "..." }`
  - `items[1]`: `{ icon: "🔒", iconType: "privacy", title: "Complete Privacy Protection", desc: "..." }`
  - `items[2]`: `{ icon: "⚡", iconType: "speed", title: "Instant Generation", desc: "..." }`
  - `items[3]`: `{ icon: "📋", iconType: "batch", title: "Easy Copy & Paste", desc: "..." }`
  - `items[4]`: `{ icon: "💎", iconType: "free", title: "Zero Cost Forever", desc: "..." }`
  - `items[5]`: `{ icon: "🌐", iconType: "browser", title: "No Installation Needed", desc: "..." }`

**代码位置**: `ToolL2PageContent.tsx:321-330`

---

#### 5.3 Intro 板块

**Key**: `intro`

**组件**: `@/components/blocks/Intro`
**文件**: `src/components/blocks/Intro.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:147-173
const whyToolazeTitle = content.intro?.title || defaultIntro.title
const whyToolazeDesc = content.intro?.content?.[0]?.text || defaultIntro.desc

<Intro
  title={whyToolazeTitle}
  description={whyToolazeDesc}
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `intro.title` (第 22 行): `"Why Use Toolaze Font Generator?"`
- `font-generator.json` → `intro.content[0].title` (第 25 行): `"What is a Font Generator?"`
- `font-generator.json` → `intro.content[0].text` (第 26 行): `"A font generator is an online tool..."`
- `font-generator.json` → `intro.content[1].title` (第 29 行): `"Why Generate Fonts Online?"`
- `font-generator.json` → `intro.content[1].text` (第 30 行): `"Creating styled text manually..."`

**注意**: Intro 组件只显示第一个 content 项的 text，但 JSON 中有两个 content 项。

**代码位置**: `ToolL2PageContent.tsx:313-319`

---

#### 5.4 Performance Metrics 板块

**Key**: `performanceMetrics`

**组件**: `@/components/blocks/PerformanceMetrics`
**文件**: `src/components/blocks/PerformanceMetrics.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:332-345
const performanceMetricsT = t?.common?.performanceMetrics || {}
<PerformanceMetrics
  title={content.performanceMetrics?.title}
  metrics={content.performanceMetrics?.metrics}
  columnHeaders={{
    metric: performanceMetricsT.metricColumn || 'Performance Metric',
    specification: performanceMetricsT.specificationColumn || 'Toolaze Specification'
  }}
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `performanceMetrics.title` (第 82 行): `"Technical Specifications"`
- `font-generator.json` → `performanceMetrics.metrics[]` (第 83-112 行):
  - `metrics[0]`: `{ label: "Font Styles", value: "Cursive, Fancy, Bold..." }`
  - `metrics[1]`: `{ label: "Text Length", value: "Unlimited characters" }`
  - `metrics[2]`: `{ label: "Processing Speed", value: "Instant (Real-time preview)" }`
  - `metrics[3]`: `{ label: "Output Format", value: "Unicode text (Copy & paste ready)" }`
  - `metrics[4]`: `{ label: "Platform Support", value: "Instagram, Facebook..." }`
  - `metrics[5]`: `{ label: "Processing Location", value: "100% Client-Side..." }`
  - `metrics[6]`: `{ label: "Privacy", value: "No server uploads..." }`
- `common.json` → `common.performanceMetrics.metricColumn` (第 159 行): `"Performance Metric"`
- `common.json` → `common.performanceMetrics.specificationColumn` (第 160 行): `"Toolaze Specification"`

**代码位置**: `ToolL2PageContent.tsx:332-345`

---

#### 5.5 Comparison 板块

**Key**: `comparison`

**组件**: `@/components/blocks/Comparison`
**文件**: `src/components/blocks/Comparison.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:182-185, 355-367
const comparisonData = {
  toolaze: content.comparison.toolazeFeatures,
  others: content.comparison.othersFeatures
}

<Comparison
  compare={comparisonData}
  title={content.comparison?.title}
  labels={{
    smartChoice: content.comparison?.smartChoice || 'Smart Choice',
    toolaze: content.comparison?.toolaze || 'Toolaze',
    vs: content.comparison?.vs || 'VS',
    otherTools: content.comparison?.otherTools || 'Other Tools',
  }}
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `comparison.title` (第 132 行): `"Why Choose Toolaze?"`
- `font-generator.json` → `comparison.toolaze` (第 133 行): `"Toolaze 💎"`
- `font-generator.json` → `comparison.others` (第 134 行): `"Other Tools"`
- `font-generator.json` → `comparison.vs` (第 135 行): `"VS"`
- `font-generator.json` → `comparison.smartChoice` (第 136 行): `"Smart Choice"`
- `font-generator.json` → `comparison.otherTools` (第 137 行): `"Other Tools"`
- `font-generator.json` → `comparison.toolazeFeatures` (第 138 行): `"Unlimited text length, Multiple font styles, Instant preview, Real-time generation, 100% local processing, No uploads, Free forever"`
- `font-generator.json` → `comparison.othersFeatures` (第 139 行): `"Character limits, Limited styles, Slow processing, Server uploads required, Cloud queues, Privacy concerns, Paid upgrades"`

**代码位置**: `ToolL2PageContent.tsx:355-367`

---

#### 5.6 Scenarios 板块

**Key**: `scenes`

**组件**: `@/components/blocks/Scenarios`
**文件**: `src/components/blocks/Scenarios.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:369-375
<Scenarios
  title={content.scenesTitle || 'Use Cases'}
  scenarios={scenariosData}  // content.scenes
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `scenesTitle` (第 141 行): `"Use Cases"`
- `font-generator.json` → `scenes[]` (第 142-158 行):
  - `scenes[0]`: `{ title: "For Social Media Users", icon: "📱", desc: "Create eye-catching fonts..." }`
  - `scenes[1]`: `{ title: "For Designers", icon: "🎨", desc: "Generate fonts for design projects..." }`
  - `scenes[2]`: `{ title: "For Content Creators", icon: "💼", desc: "Enhance your content..." }`

**代码位置**: `ToolL2PageContent.tsx:369-375`

---

#### 5.7 Rating 板块

**Key**: `rating`

**组件**: `@/components/blocks/Rating`
**文件**: `src/components/blocks/Rating.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:377-384
<Rating
  title={content.rating?.title || 'Trusted by Thousands of Creators'}
  rating={content.rating?.rating || '4.9/5 FROM 10K+ CREATORS'}
  description={content.rating?.text || ''}
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `rating.title` (第 160 行): `"Trusted by Thousands of Creators"`
- `font-generator.json` → `rating.rating` (第 161 行): `"4.9/5 FROM 10K+ CREATORS"`
- `font-generator.json` → `rating.text` (第 162 行): `"The best font generator I've found..."`

**代码位置**: `ToolL2PageContent.tsx:377-384`

---

#### 5.8 FAQ 板块

**Key**: `faq`

**组件**: `@/components/blocks/FAQ`
**文件**: `src/components/blocks/FAQ.tsx`

**数据来源**:
```typescript
// ToolL2PageContent.tsx:386-393
<FAQ
  title={content.faqTitle || 'Frequently Asked Questions'}
  items={content.faq}
  bgClass={bgClass}
/>
```

**JSON 字段**:
- `font-generator.json` → `faqTitle` (第 164 行): `"Frequently Asked Questions"`
- `font-generator.json` → `faq[]` (第 165-190 行):
  - `faq[0]`: `{ q: "What font styles are available?", a: "Toolaze supports multiple..." }`
  - `faq[1]`: `{ q: "Is this font generator really free?", a: "Yes! Toolaze is 100% free..." }`
  - `faq[2]`: `{ q: "Can I use these fonts on social media?", a: "Yes, you can copy and paste..." }`
  - `faq[3]`: `{ q: "Are my texts uploaded to a server?", a: "No! All font generation..." }`
  - `faq[4]`: `{ q: "Can I download font files?", a: "Toolaze generates styled text..." }`
  - `faq[5]`: `{ q: "Is there a character limit?", a: "No, there are no character limits..." }`

**代码位置**: `ToolL2PageContent.tsx:386-393`

---

### 6. Recommended Tools 板块 (固定位置)

**位置**: Dynamic Sections 之后

**数据来源**:
```typescript
// ToolL2PageContent.tsx:194-213, 408-437
const allSlugs = await getAllSlugs('font-generator', locale)  // 获取所有 L3 页面 slug
const recommendedTools = await Promise.all(
  allSlugs.slice(0, 3).map(async (s) => {
    const toolData = await getSeoContent('font-generator', s, locale)
    return {
      slug: s,
      title: toolData?.hero?.h1 ? extractSimpleTitle(toolData.hero.h1) : s,
      description: toolData?.hero?.desc || toolData?.metadata?.description || '',
      href: getToolHref('font-generator', s),
    }
  })
)
```

**数据加载**:
- `getAllSlugs('font-generator', locale)` → 返回所有 L3 页面 slug 列表
  - 文件: `src/lib/seo-loader.ts:509-546`
  - 返回: `['cursive', 'fancy', 'bold', 'tattoo', ...]`
- `getSeoContent('font-generator', slug, locale)` → 加载每个 L3 页面的数据
  - 文件: `src/lib/seo-loader.ts:509-516`
  - 路径: `src/data/{locale}/font-generator/{slug}.json`
  - 例如: `src/data/en/font-generator/cursive.json`

**JSON 字段**:
- `font-generator.json` → `moreTools` (未在 JSON 中，使用默认值)
- `common.json` → `common.viewAllTools.all` (第 230 行): `"View All Tools"`
- `common.json` → `common.tryNow` (第 142 行): `"Try Now →"`

**组件**:
- `ToolCard` - 显示推荐工具卡片
- `ViewAllToolsButton` - "View All Tools" 按钮

**文件**:
- `src/components/ToolCard.tsx`
- `src/components/ViewAllToolsButton.tsx`

**代码位置**: `ToolL2PageContent.tsx:408-437`

---

### 7. Footer (页脚)

**组件**: `@/components/Footer`
**文件**: `src/components/Footer.tsx`

**数据来源**:
- `common.json` → `footer.*`

**代码位置**: `ToolL2PageContent.tsx:439`

---

## 📁 文件引用关系图

```
font-generator 页面
│
├── 入口文件
│   └── src/app/[locale]/font-generator/page.tsx
│       ├── 导入: ToolL2PageContent
│       └── 调用: getL2SeoContent('font-generator', locale)
│
├── 主组件
│   └── src/components/blocks/ToolL2PageContent.tsx
│       ├── 导入: FontGeneratorHero, Intro, Features, ...
│       └── 数据: content (来自 font-generator.json)
│
├── 数据文件
│   ├── src/data/{locale}/font-generator.json (主数据)
│   └── src/data/{locale}/common.json (通用翻译)
│
├── Hero 板块组件
│   ├── src/components/blocks/FontGeneratorHero.tsx
│   │   ├── 导入: FontGenerator
│   │   └── 导入: TrustBar
│   ├── src/components/FontGenerator.tsx
│   │   └── 数据: common.json → common.fontGenerator.*
│   └── src/components/blocks/TrustBar.tsx
│       └── 数据: common.json → common.fontGenerator.trustBar.*
│
├── 动态板块组件
│   ├── src/components/blocks/Intro.tsx
│   ├── src/components/blocks/Features.tsx
│   ├── src/components/blocks/PerformanceMetrics.tsx
│   ├── src/components/blocks/HowToUse.tsx
│   ├── src/components/blocks/Comparison.tsx
│   ├── src/components/blocks/Scenarios.tsx
│   ├── src/components/blocks/Rating.tsx
│   └── src/components/blocks/FAQ.tsx
│
├── 推荐工具组件
│   ├── src/components/ToolCard.tsx
│   └── src/components/ViewAllToolsButton.tsx
│
├── 通用组件
│   ├── src/components/Navigation.tsx
│   ├── src/components/Breadcrumb.tsx
│   └── src/components/Footer.tsx
│
└── 数据加载器
    └── src/lib/seo-loader.ts
        ├── getL2SeoContent() - 加载 font-generator.json
        ├── loadCommonTranslations() - 加载 common.json
        └── getAllSlugs() - 获取所有 L3 页面 slug
```

## 🔗 数据流详细说明

### 1. 页面加载流程

```
用户访问 /font-generator
    ↓
FontGeneratorPage (page.tsx:37-40)
    ↓
调用 ToolL2PageContent({ locale, tool: "font-generator" })
    ↓
ToolL2PageContent.tsx:125
    ├── getL2SeoContent('font-generator', locale)
    │   └── seo-loader.ts:400-410
    │       └── import('@/data/{locale}/font-generator.json')
    │           └── 返回 content 对象
    │
    └── loadCommonTranslations(locale)
        └── seo-loader.ts:120-136
            └── import('@/data/{locale}/common.json')
                └── 返回 t 对象
    ↓
根据 content.sectionsOrder 渲染板块
```

### 2. 各板块数据映射

| 板块 | JSON 路径 | 组件 | 代码行 |
|------|-----------|------|--------|
| Hero | `content.hero.*` | FontGeneratorHero | 247-251 |
| How To Use | `content.howToUse.*` | HowToUse | 347-353 |
| Features | `content.features.*` | Features | 321-330 |
| Intro | `content.intro.*` | Intro | 313-319 |
| Performance Metrics | `content.performanceMetrics.*`<br>`common.performanceMetrics.*` | PerformanceMetrics | 332-345 |
| Comparison | `content.comparison.*` | Comparison | 355-367 |
| Scenarios | `content.scenesTitle`<br>`content.scenes[]` | Scenarios | 369-375 |
| Rating | `content.rating.*` | Rating | 377-384 |
| FAQ | `content.faqTitle`<br>`content.faq[]` | FAQ | 386-393 |
| Recommended Tools | `getAllSlugs()`<br>`getSeoContent()`<br>`content.moreTools` | ToolCard | 408-437 |

## 📝 修改指南

### 修改页面内容

直接编辑 `src/data/{locale}/font-generator.json` 文件，修改对应字段即可。

### 修改板块顺序

编辑 `font-generator.json` 的 `sectionsOrder` 字段：
```json
{
  "sectionsOrder": [
    "howToUse",      // 调整顺序即可
    "features",
    // ...
  ]
}
```

### 添加新板块

1. 在 `font-generator.json` 中添加数据
2. 在 `ToolL2PageContent.tsx` 的 `sectionRenderers` 中添加渲染器
3. 在 `sectionsOrder` 中添加板块 key

## 🔍 快速查找

- **页面入口**: `src/app/[locale]/font-generator/page.tsx`
- **主组件**: `src/components/blocks/ToolL2PageContent.tsx`
- **数据文件**: `src/data/{locale}/font-generator.json`
- **数据加载**: `src/lib/seo-loader.ts:400-410`
