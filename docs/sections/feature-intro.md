# Feature Intro 板块规范

> 适用：围绕**核心关键词**介绍工具相关功能的 SEO 板块
> 设计规范参考 `docs/MODEL_INTRO_BLOCK.md`，布局与 Model Intro 一致

## 适用页面

- **L2**：无 model intro 的工具主页面（如 `/image-converter`、`/image-compressor`）
- **L3**：需强调核心关键词相关功能的子页面（如 `/nano-banana-pro/image-to-image`、`/image-converter/heic-to-jpg`）
- **与 Model Intro 二选一**：有 AI 模型介绍需求用 `modelIntro`，侧重核心关键词功能介绍用 `featureIntro`

## 位置

- 必须放在 How To Use 下方
- `sectionsOrder`：`["howToUse", "featureIntro", ...]` 或 `["howToUse", "modelIntro", ...]`（二者择一）

## 结构（与 Model Intro 一致）

- **顶部**：H2 标题 + 2-3 段描述（左）+ 右侧核心关键词占位或留空
- **底部**：三个并列功能卡片，背景色 `bg-indigo-50`、`bg-purple-50`、`bg-slate-50`（禁止纯白）

## 右侧区域：核心关键词占位

- **推荐**：配置 `coreKeyword`，右侧显示渐变卡片 + 核心关键词 + 类型标签（如 "Primary Keyword"）
- **可选**：不配置 `coreKeyword` 时，右侧留空，仅展示左侧标题与描述
- **禁止**：使用占位图或不存在图片

## JSON 格式

```json
{
  "featureIntro": {
    "title": "板块主标题（含核心关键词）",
    "description": ["段落1", "段落2", "段落3"],
    "coreKeyword": "核心关键词",
    "keywordType": "Primary Keyword",
    "featureCards": [
      { "title": "功能1标题", "content": "功能1内容" },
      { "title": "功能2标题", "content": "功能2内容" },
      { "title": "功能3标题", "content": "功能3内容" }
    ]
  }
}
```

- `coreKeyword` 可选，无时右侧不显示
- `keywordType` 可选，默认 "Primary Keyword"

## 内容要求

### 1. 核心关键词导向

- **title**：必须自然包含核心关键词（P0），可搭配修饰词（Free、Online）
- **description**：2-3 段，围绕核心关键词展开，说明该功能能解决什么问题、适用场景
- **featureCards**：每张卡片对应**一个与核心关键词直接相关的功能**，不是泛泛而谈

### 2. 三张卡片规则

| 卡片 | 定位 | 示例（image to image ai） |
|------|------|---------------------------|
| 卡片 1 | 核心能力 | 如：Image-to-Image 转换、输入输出格式 |
| 卡片 2 | 使用体验 | 如：免费、无需注册、批量处理 |
| 卡片 3 | 技术/质量 | 如：画质、速度、隐私安全 |

- 每卡 **title**：简洁功能点，含相关关键词
- 每卡 **content**：1-2 句展开，不重复 title，仅写工具规格支持的功能

### 3. 功能真实性

- 严格遵循 `docs/specs/` 中对应工具的功能规格
- 禁止虚构功能、未支持格式、未使用的技术
- 与 Features 板块互补：Feature Intro 侧重「核心关键词相关」的 3 大功能；Features 为 6 项完整功能列表

### 4. 文案原创

- 禁止抄袭竞品或参考图
- 每页内容需针对该 L2/L3 定制，避免与同工具其他页面高度重复

## 与 Model Intro / Intro / Features 的区别

| 板块 | 用途 | 布局 |
|------|------|------|
| **Model Intro** | 模型/产品介绍（Seedance、Nano Banana） | H2+描述+模型名占位 + 3 模型优势卡 |
| **Feature Intro** | 核心关键词相关功能介绍 | H2+描述+核心词占位 + 3 功能卡 |
| Intro | 通用「为什么选择」介绍 | 2 卡片或 1 卡片，居中 |
| Features | 6 项功能点网格 | 2x3 网格 |

## SEO 关键词布局建议

- **P0（主关键词）**：放在 title 和首段
- **P1（核心功能词）**：放在三张卡片标题
- **P2（长尾关键词）**：自然分布在 description 和卡片 content 中

## 检查清单（编写后）

- [ ] title 含核心关键词
- [ ] 三张卡片均与核心关键词相关
- [ ] 所有功能在 `specs/` 支持列表中
- [ ] 未提及不支持的功能或技术
