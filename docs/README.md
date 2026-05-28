# Toolaze 文档索引

> 本文档为所有 SEO、规格、关键词文档的总索引，便于快速定位与避免重复查阅。

---

## 一、文档结构总览

```
docs/
├── README.md                    # 本文件：文档总索引
├── FEATURE_SPECIFICATIONS.md    # 功能规格索引（指向 specs/）
│
├── SEO 核心规范（必读）
│   ├── LANDING_PAGE_SEO_PIPELINE.md # 新落地页接入 SEO 后台流程（与 data/en JSON）
│   ├── SEO_CONTENT_GUIDELINES.md    # 内容编写规范（索引，指向 sections/ 与 keywords/）
│   ├── SEO_MASTER_LAYOUT.md         # 布局与设计系统（导航、Footer、样式）
│   ├── TRANSLATION_STRUCTURE_GUIDE.md  # JSON 结构与翻译规范
│   └── sections/                   # 各板块细致规范（按需查阅）
│       ├── README.md               # 板块规范索引
│       ├── 00_global.md            # 全局样式、禁止事项
│       ├── metadata.md             # Title、Description、H1
│       ├── hero.md, how-to-use.md, features.md, intro.md
│       ├── model-intro.md, scenarios.md, rating.md, faq.md
│       ├── comparison.md, internal-links.md, navigation.md
│
├── specs/                       # 工具功能规格（按工具分文件）
│   ├── common.md               # 通用特性
│   ├── image-compressor.md
│   ├── image-converter.md
│   ├── font-generator.md
│   ├── watermark-remover.md
│   └── ...
│
├── keywords/                    # 关键词数据与策略
│   ├── README.md               # 关键词使用说明
│   ├── KEYWORD_DENSITY_GUIDELINES.md  # 密度与 Rating 规范
│   ├── *-keywords.json         # 各工具关键词配置
│   └── *.csv                   # 原始关键词数据
│
├── 工具专项策略（可选，新建工具时参考）
│   ├── watermark-remover/      # Watermark Remover 策略
│   └── keywords/emoji-copy-and-paste-seo-layout.md
│
└── 其他
    ├── ADMIN_SEO.md            # 管理后台使用说明
    ├── LANGUAGE_SWITCH_AND_REDIRECT.md  # 导航/页脚语言入口与缺语种→英语重定向
    ├── MODEL_INTRO_BLOCK.md    # Model Intro 板块规范
    ├── PROMPTS_DATA_RULES.md   # Prompts 模板库数据与标题规则
    └── SITEMAP_UPDATE_GUIDE.md # Sitemap 更新指南
```

---

## 二、按场景快速查找

### 编写 SEO 内容时

| 步骤 | 查阅文档 |
|------|----------|
| 1. 确定功能范围 | `FEATURE_SPECIFICATIONS.md` → `specs/{tool}.md` |
| 2. 内容规范 | `SEO_CONTENT_GUIDELINES.md`（索引）→ `sections/` 板块文档 |
| 3. 布局与样式 | `SEO_MASTER_LAYOUT.md` |
| 4. JSON 结构 | `TRANSLATION_STRUCTURE_GUIDE.md` |
| 5. 关键词布局 | `keywords/KEYWORD_STRATEGY.md` + `keywords/{tool}-keywords.json` |
| 6. 密度与 Rating | `keywords/KEYWORD_DENSITY_GUIDELINES.md` |

### 使用管理后台 AI 生成时

- **参考规则**：SEO 内容规范、SEO 布局规范、结构规范、工具规格
- **关键词**：`keywords/` 下 JSON 或 CSV
- **详细说明**：`ADMIN_SEO.md`

### 新建工具时

1. `specs/` 下新建 `{tool}.md` 功能规格
2. 更新 `FEATURE_SPECIFICATIONS.md` 索引
3. `keywords/` 下新建 `{tool}-keywords.json`
4. 参考 `watermark-remover/` 或 `emoji-copy-and-paste-seo-layout.md` 做策略规划

---

## 三、文档职责与避免重复

| 文档 | 职责 | 不重复内容 |
|------|------|------------|
| **SEO_CONTENT_GUIDELINES** | 内容编写索引、L2/L3 差异化、流程 | 详细规范见 sections/、keywords/ |
| **SEO_MASTER_LAYOUT** | 设计系统、导航、面包屑、Footer、HTML 模板 | 不写内容编写规则（见 SEO_CONTENT_GUIDELINES） |
| **TRANSLATION_STRUCTURE_GUIDE** | JSON 字段、sectionsOrder、必填项 | 不写板块内容规范（见 SEO_CONTENT_GUIDELINES） |
| **KEYWORD_DENSITY_GUIDELINES** | 密度标准、Rating 板块格式 | 被 SEO_CONTENT_GUIDELINES 引用，避免两处维护 |
| **specs/*.md** | 工具功能列表、技术栈 | 不写 SEO 策略 |

---

## 四、工具专项策略文档

部分工具有独立的策略文档，用于 L2/L3 规划与关键词覆盖：

| 工具 | 文档位置 | 说明 |
|------|----------|------|
| Watermark Remover | `watermark-remover/` | STRATEGY、L2-L3-LAYOUT |
| Emoji Copy & Paste | `keywords/emoji-copy-and-paste-seo-layout.md` | L2 关键词布局 |
| Font Generator | `keywords/font-generator-url-structure.md` | URL 结构 |

新建工具时，可参考上述结构创建 `{tool}/` 或 `keywords/{tool}-seo-layout.md`。

---

## 五、相关文档

- **.cursorrules**：项目级规则，引用上述文档路径
- **ADMIN_SEO.md**：管理后台启动、AI 生成配置
- **SITEMAP_UPDATE_GUIDE.md**：部署前 Sitemap 检查
- **MODEL_INTRO_BLOCK.md**：AI 模型页 Model Intro 板块
- **PROMPTS_DATA_RULES.md**：Prompts 模板库标题、prompt 原文、X source、指标与媒体规则
