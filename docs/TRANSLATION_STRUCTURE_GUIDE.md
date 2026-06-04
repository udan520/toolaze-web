# 翻译结构指南

> **文档关系**：内容与板块规范见 `SEO_CONTENT_GUIDELINES.md`；布局与设计见 `SEO_MASTER_LAYOUT.md`。总索引见 `docs/README.md`。

## 📋 工具 JSON 文件标准结构

所有工具的 L2 页面 JSON 文件必须遵循以下标准结构：

```json
{
  "in_menu": true,
  "metadata": {
    "title": "...",
    "description": "..."
  },
  "sectionsOrder": [
    "howToUse",
    "features",
    "intro",
    "performanceMetrics",  // 可选
    "comparison",
    "scenes",
    "rating",
    "faq"
  ],
  "hero": {
    "h1": "...",
    "desc": "..."
  },
  "intro": {
    "title": "...",
    "content": [
      {
        "title": "...",
        "text": "..."
      }
    ]
  },
  "features": {
    "title": "...",
    "items": [
      {
        "icon": "...",
        "iconType": "...",
        "title": "...",
        "desc": "..."
      }
    ]
  },
  "specs": {  // 可选
    "engine": "...",
    "limit": "...",
    "logic": "...",
    "privacy": "..."
  },
  "performanceMetrics": {  // 可选
    "title": "...",
    "metrics": [
      {
        "label": "...",
        "value": "..."
      }
    ]
  },
  "howToUse": {
    "title": "...",
    "steps": [
      {
        "title": "...",
        "desc": "..."
      }
    ]
  },
  "comparison": {
    "title": "...",
    "toolaze": "Toolaze 💎",
    "others": "Other Tools",
    "vs": "VS",
    "smartChoice": "Smart Choice",
    "otherTools": "Other Tools",
    "toolazeFeatures": "...",  // 工具特定的优势列表（逗号分隔）
    "othersFeatures": "..."    // 其他工具的劣势列表（逗号分隔）
  },
  "scenesTitle": "Use Cases",
  "scenes": [
    {
      "title": "...",
      "icon": "...",
      "desc": "..."
    }
  ],
  "rating": {
    "title": "Trusted by Thousands of Creators",
    "rating": "4.9/5 FROM 10K+ CREATORS",
    "text": "..."  // 工具特定的评分描述
  },
  "faqTitle": "Frequently Asked Questions",
  "faq": [
    {
      "q": "...",
      "a": "..."
    }
  ],
  "moreTools": "More [Tool Name] Tools"
}
```

## ⚠️ 重要注意事项

### 1. 必须字段（所有工具都需要）
- `in_menu`
- `metadata.title` 和 `metadata.description`
- `sectionsOrder`
- `hero.h1` 和 `hero.desc`
- `intro.title` 和 `intro.content[0].title` 和 `intro.content[0].text`
- `features.title` 和 `features.items[0].icon`, `features.items[0].iconType`, `features.items[0].title`, `features.items[0].desc`
- `howToUse.title` 和 `howToUse.steps[0].title` 和 `howToUse.steps[0].desc`
- `comparison.title`, `comparison.toolaze`, `comparison.others`, `comparison.vs`, `comparison.smartChoice`, `comparison.otherTools`, `comparison.toolazeFeatures`, `comparison.othersFeatures`
- `scenesTitle`
- `scenes[0].title`, `scenes[0].icon`, `scenes[0].desc`
- `rating.title`, `rating.rating`, `rating.text`
- `faqTitle`
- `faq[0].q` 和 `faq[0].a`
- `moreTools`

### 2. 可选字段
- `specs` - 仅当工具有技术规格时
- `performanceMetrics` - 仅当工具有性能指标时

### 3. 结构一致性
- **所有工具必须使用相同的字段名称**
- **comparison 结构必须统一**：使用 `toolazeFeatures` 和 `othersFeatures`（字符串，逗号分隔），而不是 `features` 对象
- **数组结构必须一致**：`features.items`, `howToUse.steps`, `scenes`, `faq` 等数组的第一项作为模板

## 🔍 翻译检查流程

### 1. 翻译前
```bash
# 检查英文文件结构
node scripts/check-translation-keys.js src/data/en/[tool-name].json
```

### 2. 翻译后
```bash
# 检查翻译文件是否与英文结构一致
node scripts/check-translation-keys.js src/data/[locale]/[tool-name].json
```

### 3. 批量检查所有工具
```bash
# 运行批量检查脚本（需要创建）
node scripts/check-all-tool-translations.js [locale]
```

## 🌐 共享 UI 翻译位置（必须覆盖）

以下内容属于全站共享 UI，不允许只在组件里写英文 fallback。新增或修改时必须同步 9 个 locale 的 `src/data/{locale}/common.json`：

- `nav`：顶部菜单、一级/二级/三级菜单标题、菜单兜底标题，例如 `nav.emojiMenu`
- `breadcrumb`：面包屑所有固定节点，如 Home、AI Tools、Model、工具名
- `footer`：底部菜单、语言入口、版权和 no-tools 文案
- `common.tool`：图片上传/拖拽框、压缩/转换工具按钮、状态、toast、trust bar
- `common.watermarkRemoverTool`、`common.photoRestorationTool`、`common.nanoBananaTool`：各生图/修图组件首屏上传区域、按钮、错误和结果文案
- `common.fontGenerator`：字体生成器输入框、分类、copy 状态和 trust bar
- `common.emojiPicker`：emoji 分类、Copied 状态和分类标题
- `common.modelPlaceholders`、`common.specs`：模型占位卡和规格表

### 首屏 SSR 翻译规则

- 任何会出现在首屏 HTML 的 client component，都必须支持从 server page 传入 `initialTranslations`。
- L2/L3 page 必须把当前 locale 的 `common.json` 结果传给 `Navigation`、`Footer`、上传组件、emoji/font/model placeholder 等首屏组件。
- 不要依赖 client mount 后再加载翻译来修正首屏英文；这会影响用户体验和 SEO。
- 顶部菜单的三级菜单也必须翻译。若某个三级菜单有 runtime fallback（例如 emoji L3），fallback 标题必须从 `common.json` 的多语言 key 读取，不允许只写英文 fallback。
- 顶部菜单新增任何入口（例如 Prompts / Prompt Library）时，必须同步新增 `nav.{key}` 到 9 个 `src/data/{locale}/common.json`，并把该 key 加入 `scripts/check-menu-translations.js`；不能只在 `Navigation.tsx` 的默认英文对象里新增。
- 全站任何用户可见的共享 UI 文案都必须进入 `common.json` 或对应页面 JSON。只有品牌名、模型名、文件格式、Schema 固定枚举、内部 section key（如 `sectionsOrder`）允许保持英文。
- 如果 `src/data/{locale}/...` 已存在对应 L3 JSON，本地化 URL 必须渲染该 locale 内容，不允许静默回退英文内容；只有该 locale 文件不存在时才可重定向或回退英文 canonical。
- 验证时必须抽查构建后的非英文 HTML，确认关键英文 fallback 没有出现在首屏。

## 📝 翻译最佳实践

1. **保持结构一致**：翻译文件必须与英文文件的结构完全一致
2. **不要遗漏字段**：即使内容相似，也要翻译所有字段
3. **保持数组结构**：确保数组中的每个对象都有相同的字段
4. **检查特殊字符**：确保 HTML 标签、链接等正确保留
5. **验证 JSON 格式**：翻译后验证 JSON 文件格式正确

## 🚨 常见错误

1. ❌ **遗漏可选字段**：即使字段是可选的，如果英文版本有，翻译版本也应该有
2. ❌ **结构不一致**：使用不同的字段名称或嵌套结构
3. ❌ **数组结构不匹配**：数组中的对象缺少字段
4. ❌ **HTML 标签错误**：翻译时破坏了 HTML 标签结构

## ✅ 验证清单

翻译完成后，请确认：
- [ ] 所有必须字段都已翻译
- [ ] 结构与英文版本完全一致
- [ ] 数组中的对象结构一致
- [ ] HTML 标签和链接正确保留
- [ ] JSON 格式正确（无语法错误）
- [ ] 运行了 `check-translation-keys.js` 且无错误
