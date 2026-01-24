# 内链策略指南

## 核心原则

**不要刻意堆砌内链** - 内链应该自然、相关、有价值，而不是为了SEO而强制添加。

## 内链数量建议

### L2页面（如 `/font-generator`）

**总内链数：3-5个**

**推荐位置：**
1. **Intro板块**：2-3个内链
   - 链接到最相关的3个L3页面（如cursive, fancy, bold）
   - 在介绍工具时自然提及相关风格

2. **FAQ板块**：1-2个内链
   - 在回答问题时自然提及相关工具

3. **Features板块**：**不建议添加内链**
   - Features描述应该简洁，专注于功能本身
   - 避免在功能描述中堆砌链接

### L3页面（如 `/font-generator/cursive`）

**总内链数：2-4个**

**推荐位置：**
1. **Intro板块**：1-2个内链
   - 链接到1-2个最相关的L3页面（如cursive → fancy, calligraphy）
   - 在介绍风格时自然提及相似风格

2. **FAQ板块**：1个内链
   - 在回答最后一个问题时，可以提及相关工具或回到L2

3. **必须包含**：1个回到L2的链接
   - 在intro或FAQ中自然提及"font generator"主页面

4. **Features板块**：**不建议添加内链**
   - Features描述应该简洁，专注于功能本身

## 内链放置规则

### ✅ 应该放置内链的位置

1. **Intro板块的第一段或第二段**
   - 在介绍工具/风格时，自然提及相关工具
   - 例如："If you're looking for more decorative options, try our fancy font generator"

2. **FAQ的最后一个问题**
   - 在回答完问题后，可以自然提及相关工具
   - 例如："For similar styles, check out our gothic font generator"

3. **回到L2的链接**
   - 在intro或FAQ中自然提及主页面
   - 例如："Explore more styles with our font generator collection"

### ❌ 不应该放置内链的位置

1. **Features板块的desc字段**
   - Features应该专注于功能描述，不需要内链

2. **HowToUse板块**
   - 使用说明应该简洁明了，不需要内链

3. **PerformanceMetrics板块**
   - 技术指标不需要内链

4. **Comparison板块**
   - 对比内容不需要内链

5. **Scenarios板块**
   - 使用场景不需要内链

## 内链质量要求

1. **相关性**：只链接到真正相关的页面
   - Cursive → Fancy, Calligraphy（相似风格）
   - Instagram → Discord（相似平台）
   - Tattoo → Gothic, Bold（相似风格）

2. **自然性**：内链应该融入内容，不显突兀
   - ✅ "For similar styles, try our fancy font generator"
   - ❌ "Try our fancy font generator, cursive font generator, bold font generator"

3. **锚文本**：使用自然的关键词作为锚文本
   - ✅ "fancy font generator"
   - ❌ "click here" 或 "this tool"

## 示例

### L2页面示例（font-generator.json）

**Intro板块：**
```json
{
  "text": "A font generator is an online tool... Try our popular <a href=\"/font-generator/cursive\">cursive font generator</a>, <a href=\"/font-generator/fancy\">fancy font generator</a>, or <a href=\"/font-generator/bold\">bold font generator</a> to get started."
}
```

**Features板块：**
```json
{
  "desc": "Generate beautiful text with multiple font styles including cursive, fancy, bold, italic, gothic, tattoo, and more."
}
```
❌ 不要在features的desc中添加内链

**FAQ板块：**
```json
{
  "q": "What font styles are available?",
  "a": "Toolaze supports multiple font styles... For platform-specific fonts, try our <a href=\"/font-generator/instagram\">Instagram font generator</a>."
}
```

### L3页面示例（cursive.json）

**Intro板块：**
```json
{
  "text": "Cursive fonts... If you're looking for more decorative options, try our <a href=\"/font-generator/fancy\">fancy font generator</a> or <a href=\"/font-generator/calligraphy\">calligraphy font generator</a> for additional elegant styles."
}
```

**回到L2的链接：**
```json
{
  "text": "... Explore more font styles with our comprehensive <a href=\"/font-generator\">font generator</a> collection."
}
```

**FAQ板块：**
```json
{
  "q": "How do cursive fonts differ from calligraphy fonts?",
  "a": "... For more decorative options, try our <a href=\"/font-generator/calligraphy\">calligraphy font generator</a> or explore our <a href=\"/font-generator\">font generator</a> collection."
}
```

## 总结

- **L2页面**：3-5个内链（主要在intro和FAQ）
- **L3页面**：2-4个内链（1-2个相关L3 + 1个回到L2 + 1个FAQ）
- **不要**在Features、HowToUse、PerformanceMetrics等板块添加内链
- **确保**内链自然、相关、有价值
