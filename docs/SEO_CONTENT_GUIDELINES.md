# SEO 内容编写规范

> **核心原则**：所有 SEO 内容必须严格按照 `FEATURE_SPECIFICATIONS.md` 中的功能介绍进行编写。

## 内容编写原则

### ✅ 必须遵守

1. **全局样式规范**
   - **H2 标题统一规范**：
     - 所有 SEO 板块的 H2 标题必须统一使用 `text-4xl`（36px）
     - Tailwind CSS 类：`text-4xl font-extrabold text-center text-slate-900`
     - 不允许使用响应式字体大小（如 `text-3xl md:text-4xl`），统一为固定 36px
     - 适用板块：Intro、Features、How To Use、Performance Metrics、Comparison、Scenarios、Rating、FAQ 等所有 SEO 板块
     - **目的**：保持视觉一致性和品牌统一性

2. **功能真实性**
   - 只写 `FEATURE_SPECIFICATIONS.md` 中明确支持的功能
   - 不支持的功能绝对不能写（如：不支持 video 就不能写 video 转换）
   - 未使用的技术不能写（如：没有 AI 就不能说 AI 技术）

2. **技术准确性**
   - 只提及实际使用的技术栈
   - 不能夸大技术能力
   - 不能使用未实现的技术术语

3. **内容一致性**
   - 所有页面的功能描述必须一致
   - 不能在不同页面中描述不同的功能支持

4. **Hero 板块规范**
   - Hero 板块**仅保留** `h1` 和 `desc` 两个字段
   - **不显示** `sub` 字段（即使 JSON 中有，也不会在页面上显示）
   - **h1 要求**：
     - 简洁明了，只包含核心工具名称
     - 示例：`"Unlimited HEIC to JPG Converter"`
   - **desc 要求**：
     - 长度适中，不要太长（建议 1-2 句话，约 15-25 个单词）
     - 点名工具的核心优势
     - 格式示例：`"Convert HEIC to JPG online for free. Simply drop your HEIC images below to convert them to JPG in seconds."`
     - 应该包含：工具功能 + 免费 + 简单操作说明
   - **最佳实践**：
     - desc 应该简洁有力，突出核心价值
     - 避免冗长的描述，保持 Hero 区域的简洁性
     - 让用户快速理解工具能做什么

5. **How To Use 板块规范**
   - How To Use 板块用于说明工具的使用步骤
   - **标题格式要求**：
     - **统一格式**：所有页面的 howToUse.title 必须使用 "How to [动作]" 格式
     - **格式示例**：
       - ✅ `"How to Convert HEIC to JPG"`
       - ✅ `"How to Convert PNG to WebP"`
       - ✅ `"How to Compress Images"`
       - ❌ `"Convert 100 HEIC Files in 3 Simple Steps"`（不使用描述性标题）
     - **SEO 优势**：统一使用 "How to" 格式更符合用户搜索习惯
   - **步骤配置**：
     - 每个步骤包含 `title` 和 `desc` 字段
     - 步骤数量：通常 3 个步骤
     - **步骤描述要求**：
       - **简洁原则**：无需大量文字，简单表明步骤即可
       - **字数要求**：每个步骤的 `desc` 建议 10-20 个单词，不超过 30 个单词
       - **内容要求**：直接说明操作动作，避免冗长解释
       - **示例**：
         - ✅ `"Upload your HEIC images or drag and drop them into the converter."`（简洁明了）
         - ✅ `"Select JPG as the output format and click Convert."`（直接说明操作）
         - ❌ `"First, you need to upload your HEIC images. You can do this by clicking the upload button or simply dragging and dropping your files into the designated area. Our converter supports multiple file formats and can process up to 100 images at once..."`（过于冗长）

6. **Intro 板块规范**
   - Intro 板块用于详细说明工具的价值和优势
   - **推荐布局**：Picflow 风格混合方案（标题 + 图标行 + 描述段落 + 底部卡片）
     - **标题区域**：居中显示，包含 badge 和 title（H2）
     - **图标行**：标题下方，3-4 个极简线条图标，展示核心功能（Privacy, Speed, Unlimited, Batch）
     - **描述区域**：图标行下方，居中显示，限制最大宽度（max-w-4xl），1-2 段文字（100-150 单词）
     - **底部卡片区域**：三张大卡片（Engine, Limit, Privacy），减少与上方文字的视觉冲突
     - **段落分隔**：使用 `\n\n` 分隔多个段落，提升可读性
     - **配色方案**：保持 AI 蓝紫色科技感风格（indigo-600, purple-600）
   - **图标行配置**（`intro.iconRow`）：
     - **推荐数量**：3-4 个图标
     - **图标类型**：支持 `privacy`、`speed`、`unlimited`、`batch`（极简线条 SVG）
     - **配置格式**：`{ "icon": "privacy", "label": "Privacy" }`
     - **样式**：极简线条图标，圆形边框，indigo 配色
   - **底部卡片配置**（`intro.bottomCards`）：
     - **推荐数量**：3 张卡片（Engine, Limit, Privacy）
     - **配置方式**：在 `intro.bottomCards` 数组中配置，每个卡片包含 `icon`、`title`、`desc`
     - **图标要求**：使用 emoji 格式
     - **描述长度**：每个卡片的 desc 建议 10-20 个单词，简洁有力
   - **描述文字要求**（卡片式设计）：
     - **显示方式**：两段文字自动渲染为两个有设计感的卡片（2列布局）
     - **卡片设计**：
       - 白色背景，圆角卡片（`rounded-2xl`）
       - 每个卡片有对应的图标（第一段：隐私锁图标，第二段：兼容性勾选图标）
       - 渐变背景装饰（第一段：indigo，第二段：purple）
       - 悬停效果（`hover:shadow-md`）
     - **内容要求**：
       - **推荐 2 段**，每段 40-60 单词
       - 使用 `\n\n` 分隔段落
       - 第一段：强调隐私保护核心价值
       - 第二段：说明技术优势或兼容性问题
     - **颜色**：使用 `text-slate-700`，确保 SEO 关键词覆盖
     - **位置**：标题下方，特性卡片网格上方
     - **布局**：响应式 2 列布局（移动端 1 列，桌面端 2 列）
   - **混合方案优势**：
     - **SEO 友好**：描述段落提供丰富的关键词和语义内容（100-150 单词）
     - **视觉清晰**：图标行快速传达核心价值，底部卡片展示技术细节
     - **层次分明**：标题 → 图标行 → 描述 → 卡片，视觉层次清晰
     - **科技感**：极简线条图标 + AI 蓝紫色配色，符合现代设计趋势
   - **content 字段单词数建议**：
     - **推荐范围**：150-250 个单词
     - **最佳长度**：180-220 个单词
     - **最小长度**：不少于 120 个单词
     - **最大长度**：不超过 300 个单词
   - **内容要求**：
     - 深入阐述工具的核心价值和优势
     - 可以包含用户痛点、解决方案、技术优势等
     - **强烈推荐**：将长段落拆分为 2-3 个段落（使用 `\n\n` 分隔）
     - 每个段落建议 60-100 个单词，提升可读性
     - 保持专业性和可读性
   - **最佳实践**：
     - 第一段：强调核心价值或解决的主要问题（60-80 单词）
     - 第二段：详细说明技术优势或使用场景（60-100 单词）
     - 第三段（可选）：补充说明或总结（40-60 单词）
     - 使用段落分隔让内容更易读，避免大段文字造成视觉疲劳
     - 确保内容丰富但不冗长，保持用户阅读兴趣

5. **场景图标规范**
   - Use Cases（Scenarios）板块中的每个场景**必须**配置对应的图标
   - **推荐**：每个场景都应该有 `icon` 字段，且不能为空
   - **自动生成机制**：
     - 如果场景缺少 `icon` 字段，系统会根据场景标题和描述自动生成合适的图标
     - 即使 JSON 中某些场景没有配置 icon，系统也会根据场景内容自动生成合适的图标，确保每个场景都有对应的图标显示
     - 自动生成基于关键词匹配，会分析场景的 `title` 和 `description`/`desc` 字段
   - 图标必须与场景内容相关，不能使用相同的图标
   - 图标使用 emoji 格式，放在 `scenes` 数组的每个对象中的 `icon` 字段
   - 图标不能为空字符串
   - **自动匹配规则**（当缺少 icon 时）：
     - 摄影师/照片相关 → 📸（相机）
     - 社交媒体相关 → 📱（手机）
     - 办公/商务相关 → 💼（公文包）
     - 开发者/网站相关 → 💻（电脑）
     - 电商/购物相关 → 🛒（购物车）
     - 设计师/创意相关 → 🎨（调色板）
     - 内容创作者 → 📝（记事本）
     - 其他 → 💼（默认）
   - **最佳实践**：
     - 虽然系统会自动生成 icon，但建议手动为每个场景配置合适的 icon
     - 手动配置的 icon 优先级高于自动生成的 icon
     - 确保每个场景的 icon 与内容相关且不重复
   - 示例：
     - 摄影师场景 → 📸（相机）
     - 社交媒体场景 → 📱（手机）
     - 办公场景 → 💼（公文包）
     - 开发者场景 → 💻（电脑）
     - 电商场景 → 🛒（购物车）

5. **Rating 板块规范**
   - **结构要求**：Rating 板块包含 `title`、`rating` 和 `text` 三个字段
   - **title 字段**：
     - 通用标题：`"Trusted by Thousands of Creators"`（用于 L2 页面）
     - 或工具特定标题：`"Trusted for [Tool Name]"`（用于 L3 页面）
   - **rating 字段**：
     - 统一格式：`"4.9/5 FROM 10K+ CREATORS"`（L2 页面）
     - 或：`"4.9/5 FROM 10K+ USERS"`（L3 页面）
   - **text 字段（核心要求）**：
     - **必须根据每个落地页的具体内容编写**，不能使用通用模板
     - **格式要求**：
       - 开头：用户评价引语（可选，用引号包裹）
       - 主体：`"Join thousands of satisfied users who trust Toolaze for [工具核心功能], [核心优势1], and [核心优势2]. [额外说明]."`
     - **内容要求**：
       - 必须提及工具的核心功能（如：image compression, image conversion, font generation, AI image generation）
       - 必须包含 2-3 个核心优势（如：fast, secure, free, private processing, no registration）
       - 必须根据工具的实际特性调整描述：
         - **本地处理工具**（如 image-compressor, image-converter）：强调 "100% private processing"、"local processing"、"no uploads"
         - **API 调用工具**（如 nano-banana-pro）：强调 "no sign up required"、"fast generation"、"free forever"，**不能**说 "100% private processing"
       - 可以添加工具特定的额外说明（如分辨率、格式支持等）
     - **示例（本地处理工具）**：
       - Image Compressor: `"Join thousands of satisfied users who trust Toolaze for fast, secure, and free image compression. No registration required, 100% private processing."`
       - Image Converter: `"Join thousands of satisfied users who trust Toolaze for fast, secure, and free image conversion. No registration required, 100% private processing."`
     - **示例（API 调用工具）**：
       - Nano Banana Pro: `"Join thousands of satisfied users who trust Toolaze for fast, secure, and free AI image generation. No registration required, no sign up needed. Generate high-quality 4K images with Nano Banana Pro."`
     - **示例（L3 页面特定）**：
       - HEIC to JPG: `"\"Finally met the 20KB limit for my government exam registration! No more upload errors.\" - Join thousands of applicants who trust Toolaze for official portal compliance."`
       - Font Generator Cursive: `"\"The best cursive font generator I've found. Instant results and works perfectly on Instagram!\" - Join thousands of users who trust Toolaze for beautiful cursive text generation."`
   - **最佳实践**：
     - L2 页面：使用通用格式，强调工具类别和核心优势
     - L3 页面：可以添加用户评价引语，更具体地描述该页面的特定用途
     - 确保描述与工具的实际处理方式一致（本地处理 vs API 调用）

6. **FAQ 板块规范**
   - **数量要求**：每个三级页面的 FAQ 板块**至少**要有 5 个问题
   - **内容定制**：FAQ 必须根据不同的三级页面来定制，不能使用通用的 FAQ
   - **长尾关键词覆盖**：尽可能覆盖一些长尾关键词，提高 SEO 效果
   - **重复度限制**：每个三级页面的 FAQ 内容重复度不得高于 40%
     - 不同页面的 FAQ 问题应该针对该页面的具体功能和特点
     - 避免在不同页面使用相同或高度相似的问题
   - **问题设计原则**：
     - 问题应该针对该工具的具体功能和使用场景
     - 包含用户可能关心的技术细节、使用限制、隐私安全等问题
     - 使用自然语言，符合用户搜索习惯
     - 答案要准确、详细，基于功能介绍文件
   - **示例**：
     - HEIC to JPG 页面：可以包含关于 HEIC 格式、EXIF 保留、文件大小限制等问题
     - PNG to WebP 页面：可以包含关于 WebP 格式优势、透明度支持、浏览器兼容性等问题
     - 不同页面的 FAQ 应该有不同的侧重点和问题角度

### ❌ 禁止事项

1. **禁止夸大功能**
   - ❌ 不能写不支持的功能
   - ❌ 不能写未实现的技术
   - ❌ 不能写超出实际能力的特性

2. **禁止技术误导**
   - ❌ 没有 AI 就不能说 AI
   - ❌ 不支持 video 就不能写 video
   - ❌ 不是云端处理就不能说云端

3. **禁止内容矛盾**
   - ❌ 不同页面描述不一致
   - ❌ 功能列表与实际不符

4. **禁止 FAQ 内容重复**
   - ❌ 不同三级页面使用相同或高度相似的 FAQ
   - ❌ FAQ 数量少于 5 个
   - ❌ FAQ 内容重复度超过 40%
   - ❌ 使用通用的、不针对具体页面的 FAQ

---

## SEO 内容生成规则

> **核心原则**：作为 SEO 专家，在生成 `toolaze.com` 的内容时，必须严格遵循以下分层内容规则。

### 1. 目录结构定义

- **L2（二级页面）**：分类页面（如 `/image-converter`）。重点聚焦"通用工具集能力"。
- **L3（三级页面）**：具体工具页面（如 `/heic-to-jpg`）。重点聚焦"特定关键词解决方案"。

### 2. 内容差异化逻辑（关键）

对于每个 L3 页面，确保相对于 L2 和其他 L3 页面具有以下唯一性级别：

#### [类别 A：100% 唯一 - 动态生成]

- **Meta Title（钩子公式）**：
  - **公式**：`[Action] [Input] to [Output] [Category] ([Benefit 1], [Benefit 2] & [Benefit 3]) - Toolaze`
  - **示例**：`Convert PNG to WebP Online (Free, Batch & No Ads) - Toolaze`
  - **规则**：
    - Action：动作词（Convert, Transform, Change等）
    - Input：输入格式（PNG, JPG, HEIC等）
    - Output：输出格式（WebP, PNG, JPG等）
    - Category：类别词（Online, Tool, Converter等）
    - Benefits：三个核心优势（Free, Batch, No Ads等），用逗号和&连接
    - 最后必须加上 ` - Toolaze` 品牌标识

- **Meta Description（步骤 + 数据组合）**：
  - **格式要求**：
    - **前100字符**：操作引导（How to + 3个步骤）
    - **后50字符**：技术优势（数据 + 安全/隐私）
  - **示例**：`How to convert PNG to WebP? 1. Upload PNG 2. Auto-convert 3. Download WebP. Shrink file size by 35% with zero quality loss. Secure & Private.`
  - **规则**：
    - 必须以 "How to [动作]?" 开头
    - 步骤格式：`1. [动作1] 2. [动作2] 3. [动作3]`
    - 数据优势：包含具体数字（如 "35%", "100 images"）
    - 结尾强调安全和隐私

- **H1（极简原则）**：
  - **格式**：`[Input] to [Output] Converter`
  - **示例**：`PNG to WebP Converter`
  - **规则**：
    - 只告诉用户他在哪，不添加修饰词
    - 不使用 "Unlimited", "Free", "Online" 等修饰词
    - 保持简洁，核心格式转换信息即可

- **JSON-LD Schema（HowTo类型）**：
  - **要求**：必须在HTML的`<head>`中注入JSON-LD结构化数据
  - **格式**：
    ```json
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert [Input] to [Output]",
      "step": [
        {"@type": "HowToStep", "text": "[步骤1描述]"},
        {"@type": "HowToStep", "text": "[步骤2描述]"},
        {"@type": "HowToStep", "text": "[步骤3描述]"}
      ]
    }
    ```
  - **规则**：
    - name字段：使用 "How to Convert [Input] to [Output]" 格式
    - step数组：基于`howToUse.steps`字段生成，每个步骤对应一个HowToStep
    - **步骤描述要求**：
      - 简洁明了，与页面内容一致
      - 无需大量文字，简单表明步骤即可
      - 每个步骤描述建议 10-20 个单词，不超过 30 个单词
- **Intro（介绍）**：
  - 分析 [输入格式] 的特定痛点（兼容性/文件大小）与 [输出格式] 的优势
  - **必须** 200+ 单词
- **Scenes（使用场景）**：
  - 基于该工具创建 3 个特定用户画像
  - 示例（HEIC 转换工具）：iPhone 摄影师、打印服务、Windows 用户

#### [类别 B：50%-80% 唯一 - 混合生成]

- **FAQ（常见问题）**：
  - 5+ 个问题
  - **前 3 个问题必须**针对 [输入格式/输出格式] 特定问题（如："我的 EXIF 数据会保留吗？"）
  - 最后 2 个可以是通用的安全/隐私 FAQ
- **Comparison（对比）**：
  - 必须从源文档中提取技术规格（质量、压缩、支持）
  - 以叙述或列表格式进行比较
- **HowToUse（使用说明）**：
  - **简洁原则**：无需大量文字，简单表明步骤即可
  - **字数要求**：每个步骤描述建议 10-20 个单词，不超过 30 个单词
  - **内容要求**：
    - 基础逻辑共享，但所有动词和名词必须具体化
    - 直接说明操作动作，避免冗长解释
    - 示例：使用 "Upload your HEIC" 而不是 "Upload file"
    - 示例：使用 "Select JPG format and click Convert" 而不是长篇大论

#### [类别 C：10%-30% 唯一 - 核心品牌]

- **Features & Performance（功能与性能）**：
  - 保留核心卖点（速度、隐私、批量处理）
  - 但必须改变措辞、句子结构和 H3 标题，避免"重复内容"惩罚

### 3. 参考源

- **优先使用**：始终优先使用上下文中提供的"功能介绍页面"
- **禁止虚构**：**不要**虚构功能或文件限制
- **缺失数据**：如果缺少特定数据，使用占位符如 `[Insert Limit Here]` 或询问

### 4. 输出格式

- 当被要求生成 SEO 内容时，以指定的 JSON 或 Markdown 格式输出
- 确保所有变量（如 `{{source_format}}` 和 `{{target_format}}`）都被正确替换

---

## 内容编写流程

### 1. 查看功能介绍
在编写任何 SEO 内容前，必须先查看 `docs/FEATURE_SPECIFICATIONS.md`

### 2. 确认功能支持
确认要写的功能是否在支持列表中

### 3. 编写 SEO 内容
基于功能介绍进行 SEO 扩写，但必须：
- 保持功能描述准确
- 不添加不支持的功能
- 不提及未使用的技术

### 4. 检查清单
- [ ] 所有功能都在支持列表中
- [ ] 没有提及不支持的功能
- [ ] 技术描述准确
- [ ] 内容与其他页面一致
- [ ] Use Cases 板块的每个场景都配置了对应的图标（`icon` 字段，且不为空）
- [ ] 场景图标不重复，且与场景内容相关
- [ ] 如果场景缺少 icon，系统会自动根据场景内容生成合适的图标
- [ ] FAQ 板块至少有 5 个问题
- [ ] FAQ 内容针对该三级页面定制，不是通用内容
- [ ] FAQ 覆盖了长尾关键词
- [ ] FAQ 内容与其他三级页面的重复度低于 40%

---

## 示例

### ✅ 正确示例

**功能介绍文件说**：支持 JPG、PNG、WebP、HEIC 格式转换

**SEO 内容可以写**：
- "Convert between JPG, PNG, WebP, and HEIC formats"
- "Support multiple image formats including HEIC"
- "Transform HEIC photos to JPG format"

**Use Cases 场景配置正确示例**：
```json
"scenes": [
  {
    "title": "iPhone Photographers",
    "icon": "📸",
    "desc": "Quickly backup your entire HEIC library..."
  },
  {
    "title": "Social Media Managers",
    "icon": "📱",
    "desc": "Transform HEIC assets into optimized JPG..."
  },
  {
    "title": "Office Productivity",
    "icon": "💼",
    "desc": "Share large 50MB+ high-fidelity renders..."
  }
]
```

### ❌ 错误示例

**功能介绍文件说**：不支持 video 格式

**SEO 内容不能写**：
- ❌ "Convert video to images"（不支持 video）
- ❌ "AI-powered conversion"（没有 AI）
- ❌ "Cloud processing"（不是云端处理）

**Use Cases 场景配置错误示例**：
```json
"scenes": [
  {
    "title": "iPhone Photographers",
    "desc": "..."  // ❌ 缺少 icon 字段
  },
  {
    "title": "Social Media Managers",
    "icon": "💻",  // ❌ 图标与内容不匹配（应该用 📱）
    "desc": "..."
  },
  {
    "title": "Office Productivity",
    "icon": "💻",  // ❌ 图标重复（与上面相同）
    "desc": "..."
  }
]
```

**FAQ 配置正确示例**（HEIC to JPG 页面）：
```json
"faq": [
  {
    "q": "Will I lose my photo's GPS and time information?",
    "a": "No. Toolaze preserves all EXIF metadata, ensuring your JPG exports keep the original shooting date, camera settings, and location tags."
  },
  {
    "q": "Can I really convert a 200MB HEIC file?",
    "a": "Yes. Unlike competitors who have strict bandwidth limits, Toolaze has no file size restrictions. If your computer has the RAM to open it, Toolaze can convert it."
  },
  {
    "q": "Why does Toolaze emphasize \"Local Processing\"?",
    "a": "Speed and security. By processing data on your device, we skip the slow \"Upload\" and \"Download\" phases. It's the fastest and most secure way to handle image data."
  },
  {
    "q": "Does Toolaze support batch converting multiple HEIC files?",
    "a": "Yes. You can convert up to 100 HEIC images in a single batch, making it perfect for photographers who need to process entire photo libraries."
  },
  {
    "q": "What makes HEIC to JPG conversion different from other formats?",
    "a": "HEIC uses advanced HEVC encoding, which requires specialized decoding. Toolaze uses WebAssembly-powered HEVC decoder to handle Apple's proprietary format locally in your browser."
  }
]
```

**FAQ 配置错误示例**：
```json
"faq": [
  {
    "q": "How do I convert images?",  // ❌ 问题太通用，不是针对 HEIC to JPG
    "a": "..."
  }
]
// ❌ 只有 3 个问题，少于要求的 5 个
```

**FAQ 重复度检查**：
- ✅ 正确：HEIC to JPG 页面的 FAQ 关注 HEIC 格式、EXIF 保留、文件大小等
- ✅ 正确：PNG to WebP 页面的 FAQ 关注 WebP 优势、透明度、浏览器兼容性等
- ❌ 错误：两个页面的 FAQ 有超过 40% 的问题相同或高度相似

---

## 关键词密度和布局规范

### 主关键词密度要求
- **推荐密度**：1-2%
- **最低要求**：0.5%
- **最高限制**：3%（避免关键词堆砌）

### 关键词分布优先级
1. **Title**（最重要）：主关键词 + 品牌名
2. **H1**（最重要）：主关键词（精确匹配或变体）
3. **Meta Description**（重要）：主关键词 + 1-2 个长尾关键词
4. **前 100 字**（重要）：主关键词出现 1-2 次
5. **内容段落**：自然嵌入相关关键词
6. **FAQ**：长尾关键词自然嵌入

### Rating 板块关键词要求
- **必须根据每个落地页的具体内容编写**，不能使用通用模板
- **格式**：`"Join thousands of satisfied users who trust Toolaze for [工具核心功能], [核心优势1], and [核心优势2]. [额外说明]."`
- **必须包含**：工具的核心功能关键词 + 2-3 个核心优势关键词
- **根据工具特性调整**：
  - **本地处理工具**：强调 "100% private processing"、"local processing"
  - **API 调用工具**：强调 "no sign up required"、"fast generation"，**不能**说 "100% private processing"

详细规范见：`docs/keywords/KEYWORD_DENSITY_GUIDELINES.md`

## 文件位置

- **功能介绍**：`docs/FEATURE_SPECIFICATIONS.md`
- **SEO 规范**：`docs/SEO_CONTENT_GUIDELINES.md`（本文件）
- **页面布局**：`docs/SEO_MASTER_LAYOUT.md`
- **关键词密度指南**：`docs/keywords/KEYWORD_DENSITY_GUIDELINES.md`

---

---

## 菜单与路由分发逻辑 (Navigation Logic)

### 核心原则

所有三级页面（L3）必须明确标记是否显示在主导航菜单中，以保持菜单简洁并优化用户体验。

### 分类标准

#### 1. Primary Tool (核心功能) - `in_menu: true`

**定义**：基础格式处理工具，提供通用的、广泛适用的功能。

**特征**：
- 工具名称简洁明确（如：Compress JPG, PNG to JPG, JPG Compressor）
- 功能通用，适用于大多数用户场景
- 不包含特定场景或平台限制

**示例**：
- ✅ `compress-jpg` - JPG Compressor
- ✅ `compress-png` - PNG Compressor
- ✅ `compress-webp` - WebP Compressor
- ✅ `compress-image` - Image Compressor
- ✅ `batch-compress` - Batch Image Compressor
- ✅ `jpg-to-png` - JPG to PNG Converter
- ✅ `png-to-jpg` - PNG to JPG Converter
- ✅ `webp-to-jpg` - WebP to JPG Converter

**菜单显示**：✅ 显示在主导航栏的三级菜单中

#### 2. Long-tail Landing Page (长尾页面) - `in_menu: false`

**定义**：针对特定场景、平台或需求的专用工具页面。

**特征**：
- 工具名称包含特定场景关键词（如：USCIS Photo, Discord Emoji, YouTube Thumbnail）
- 针对特定平台或用途（如：Amazon Product, Etsy Listing, eBay Picture）
- 包含特定大小限制（如：20KB, 100KB, 240KB, 2MB）

**示例**：
- ❌ `jpg-to-20kb` - Compress JPG to 20KB
- ❌ `png-to-100kb` - PNG to 100KB Compression
- ❌ `uscis-photo-240kb` - USCIS Photo 240KB Tool
- ❌ `discord-emoji-256kb` - Discord Emoji & Sticker Sizer
- ❌ `youtube-thumbnail-2mb` - YouTube Thumbnail Fixer (Under 2MB)
- ❌ `amazon-product-10mb` - Amazon Product Image Optimizer
- ❌ `etsy-listing-1mb` - Etsy Listing Photo Tool
- ❌ `ebay-picture-fast` - eBay Fast-Load Optimizer

**菜单显示**：❌ 不显示在主导航栏中

### 实现要求

#### 1. JSON 数据结构

每个三级页面的 JSON 文件必须在根级别添加 `in_menu` 字段：

```json
{
  "in_menu": true,  // 或 false
  "metadata": {
    "title": "...",
    "description": "..."
  },
  "hero": {
    "h1": "...",
    "desc": "..."
  },
  // ... 其他字段
}
```

#### 2. Navigation 组件逻辑

Navigation 组件必须根据 `in_menu` 字段过滤菜单项：

```typescript
// 只显示 in_menu: true 的工具
const menuItems = allItems.filter(item => item.in_menu !== false)
```

**默认行为**：
- 如果 `in_menu` 字段不存在，默认值为 `true`（向后兼容）
- 只有明确设置为 `false` 的页面才会被排除

#### 3. L2 页面索引要求

所有 `in_menu: false` 的页面必须自动汇总到其所属二级目录（L2）的 "More Tools" 或 "Related Tools" 列表区域。

**实现位置**：
- `/image-compressor` 页面：显示所有 `in_menu: false` 的压缩工具
- `/image-converter` 页面：显示所有 `in_menu: false` 的转换工具

**显示要求**：
- 必须显示在页面底部或专门的工具列表区域
- 使用卡片式布局，每个工具显示标题、简短描述和链接
- 标题使用工具的 `hero.h1` 字段
- 描述使用 `hero.desc` 或 `metadata.description` 的前100字符
- 链接指向对应的三级页面

**严禁事项**：
- ❌ 不能将 `in_menu: false` 的工具显示在顶部主导航栏
- ❌ 不能在主导航栏堆砌过多工具
- ❌ 不能忽略 `in_menu` 字段的设置

### 更新清单

当创建或更新三级页面时：

- [ ] 确定页面类型（Primary Tool 或 Long-tail Landing Page）
- [ ] 在 JSON 根级别添加 `in_menu` 字段（true 或 false）
- [ ] 如果是 `in_menu: false`，确保在对应的 L2 页面有索引链接
- [ ] 验证 Navigation 组件正确过滤菜单项
- [ ] 验证 L2 页面正确显示所有工具

---

## 更新说明

当功能介绍更新时：
1. 更新 `FEATURE_SPECIFICATIONS.md`
2. 检查所有现有 SEO 内容是否符合新规范
3. 更新不符合规范的 SEO 内容
4. 检查所有页面的 `in_menu` 字段设置是否正确