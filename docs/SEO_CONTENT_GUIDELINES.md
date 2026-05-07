# SEO 内容编写规范

> **核心原则**：所有 SEO 内容必须严格按照 `FEATURE_SPECIFICATIONS.md` 中的功能介绍进行编写。
>
> **文档关系**：布局与设计系统见 `SEO_MASTER_LAYOUT.md`；JSON 结构见 `TRANSLATION_STRUCTURE_GUIDE.md`；关键词密度与 Rating 格式见 `keywords/KEYWORD_DENSITY_GUIDELINES.md`；各板块细致规范见 `sections/` 目录。总索引见 `docs/README.md`。

---

## 一、规范索引（按需查阅）

| 类别 | 文档 | 说明 |
|------|------|------|
| **全局** | [sections/00_global.md](sections/00_global.md) | H2 样式、JSON 标题禁止 CSS、禁止事项、功能真实性 |
| **Metadata** | [sections/metadata.md](sections/metadata.md) | Title、Description、H1 公式 |
| **板块** | [sections/README.md](sections/README.md) | Hero、How To Use、Features、Intro、Model Intro、Scenarios、Rating、FAQ、Comparison |
| **内链** | [sections/internal-links.md](sections/internal-links.md) | 密度、FAQ 限制 |
| **导航** | [sections/navigation.md](sections/navigation.md) | in_menu、L2 索引 |
| **关键词** | [keywords/KEYWORD_STRATEGY.md](keywords/KEYWORD_STRATEGY.md) | P0-P4 布局、修饰词、长尾分类 |
| **密度** | [keywords/KEYWORD_DENSITY_GUIDELINES.md](keywords/KEYWORD_DENSITY_GUIDELINES.md) | 密度标准、Rating 格式 |

---

## 二、内容编写流程

1. **查看功能介绍**：在编写任何 SEO 内容前，必须先查看 `docs/FEATURE_SPECIFICATIONS.md`
2. **确认功能支持**：确认要写的功能是否在支持列表中
3. **编写 SEO 内容**：基于功能介绍进行 SEO 扩写，必须保持功能描述准确、不添加不支持的功能、不提及未使用的技术
4. **检查清单**：见 [sections/00_global.md](sections/00_global.md) 及 [keywords/KEYWORD_STRATEGY.md](keywords/KEYWORD_STRATEGY.md)

---

## 三、SEO 内容生成规则（L2/L3 差异化）

### 目录结构

- **L2（二级页面）**：分类页面（如 `/image-converter`）。重点聚焦「通用工具集能力」。
- **L3（三级页面）**：具体工具页面（如 `/heic-to-jpg`）。重点聚焦「特定关键词解决方案」。

### 差异化逻辑

| 类别 | 唯一性 | 内容 |
|------|--------|------|
| **A：100% 唯一** | 动态生成 | Meta Title、Meta Description、H1、JSON-LD、Intro（200+ 词）、Scenes（3 个） |
| **B：50%-80% 唯一** | 混合生成 | FAQ（5+）、Comparison、HowToUse |
| **C：10%-30% 唯一** | 核心品牌 | Features、Performance（改变措辞与 H3） |

### 参考源与输出

- **优先使用**：始终优先使用上下文中提供的「功能介绍页面」
- **禁止虚构**：不要虚构功能或文件限制
- **缺失数据**：使用占位符如 `[Insert Limit Here]` 或询问
- **输出格式**：以指定的 JSON 或 Markdown 格式输出，确保变量正确替换

### 核心关键词优先级（AI 生成时必遵）

> **CRITICAL**：在后台新建 SEO 页面时，若用户填写了「核心关键词」，该词为**主关键词**，优先级高于关键词文件。

| 来源 | 角色 | 说明 |
|------|------|------|
| **用户指定核心关键词** | 主关键词（P0） | 必须用于 metadata.title、metadata.description、hero.h1、hero.desc，并贯穿全文 |
| **关键词文件**（`keywords/*.json`） | 补充参考 | 用于策划整页 SEO 布局、长尾词分布、内部链接等，不覆盖用户指定的主词 |

- 用户填写了核心关键词时：以该词为主，关键词文件中的 primaryKeywords 仅作补充
- 用户未填写时：按关键词文件中的 primaryKeywords 作为主词

---

## 四、示例

### ✅ 正确示例

**功能介绍说**：支持 JPG、PNG、WebP、HEIC 格式转换

**SEO 可写**：
- "Convert between JPG, PNG, WebP, and HEIC formats"
- "Support multiple image formats including HEIC"
- "Transform HEIC photos to JPG format"

### ❌ 错误示例

**功能介绍说**：不支持 video 格式

**SEO 不能写**：
- ❌ "Convert video to images"（不支持 video）
- ❌ "AI-powered conversion"（没有 AI）
- ❌ "Cloud processing"（不是云端处理）

---

## 五、文件位置

- **功能介绍**：`docs/FEATURE_SPECIFICATIONS.md`
- **SEO 规范**：`docs/SEO_CONTENT_GUIDELINES.md`（本文件）
- **板块细致规范**：`docs/sections/`
- **页面布局**：`docs/SEO_MASTER_LAYOUT.md`
- **关键词密度**：`docs/keywords/KEYWORD_DENSITY_GUIDELINES.md`
- **关键词策略**：`docs/keywords/KEYWORD_STRATEGY.md`
