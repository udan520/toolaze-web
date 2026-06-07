# Prompts 数据规则

本文档记录 `/prompts` 模板库的数据准入与维护规则。新增、修复、批量导入模板前必须先阅读本规则，并在导入后运行标题审计脚本。

## 标题规则

- 标题必须根据真实 prompt 内容提炼，不能直接截取 prompt 开头。
- 标题应概括模板核心视觉或用途，优先使用“主体 + 场景/风格 + 动作/用途”的结构。
- 标题长度建议约 5 个英文单词，通常 3-6 个词，最多 7 个词。
- 标题使用 Title Case：英文标题中每个主要单词首字母大写。
- 不要使用整句式标题，例如 `Create A...`、`Generate An...`、`Use The Uploaded...`。
- 不要使用字段名式标题，例如 `Prompt`、`Subject`、`Description`、`Type`、`Version`、`Parameters`、`Image Generation Prompt`。
- 不要保留来源噪声，例如 `I Used`、`Use This`、`Copy-Paste`、`Bookmark`、`Scene 1`、时间码、JSON 字段名、社媒引导语。
- 不要使用全大写单词，除非是明确缩写或产品名，例如 `AI`、`UI`、`GPT`、`X`、`3D`、`4K`、`ASMR`、`FPV`、`POV`。
- 标题要具体，不要写成泛泛的 `Prompt Technique`、`Transform Prompt Framework`、`Image Using On...`。
- 好标题示例：`Sunny Rooftop Bikini Selfie`、`Clumsy Scribble Redraw Meme`、`Japanese GRWM Vlog`、`Lotus Smartwatch Commercial`。

## Prompt 原文规则

- Prompt 必须来自 X 原帖正文或评论，不能根据图片、视频或主题自行编造。
- 如果 X 正文和评论中都没有看到 prompt，删除该模板，不要补假 prompt。
- Prompt 必须保持 X 原文语种，不要翻译成中文、英文或其他语言。
- 从长帖提取 prompt 时，只保留真正可复用的 prompt 内容，去掉作者闲聊、引导关注、工具广告、线程目录和无关教程。
- 如果正文与评论都包含 prompt，优先保留作者明确标注为 `Prompt`、`Video Prompt`、`Image Prompt` 的版本。

## Source 与指标规则

- Source 必须是 `https://x.com/.../status/...` 源链接；不是 X 源链接的模板不展示或不收录。
- X 指标不得伪造。官方数据为 `0` 时显示 `0`，未知或无法取得时显示 `-`。
- 指标标签必须固定显示 `Likes`、`Views`、`Reposts`、`Bookmarks`，不能因为某个模型数据缺失而减少标签。
- 去重以 `tweetId` 和 `sourceUrl` 为准；同一个 X 状态不能重复出现在列表中。

## 分类规则

- 分类必须根据已验证 prompt 的核心用途判断，不能只根据模型名、作者、热度或抓取批次判断。
- 优先根据提炼后的标题判断分类；标题不足以判断时，再读取 prompt 原文确认。
- 只有高置信度时才放入具体分类；不确定时使用 `General`，不要硬塞进相似 tag。
- `Workflow & Utility` 用于 prompt 框架、教程、模型对比、生成流程、React/component、工具链、benchmark、导入方法等，不属于具体视觉内容的模板。
- `Advertising` 只用于商品广告、品牌海报、商业摄影、包装、营销物料、产品图，不要把普通电影镜头或人物写真放入广告。
- `Fashion & Beauty` 用于美妆、穿搭、自拍、人像写真、变装、GRWM、时尚大片、模特图。
- `Character & Portrait` 用于身份保留、头像、角色肖像、面部/人物参考；如果是角色资料卡、三视图、设定表，归入 `Infographic & Education`。
- `Game & Action` 用于战斗、追逐、枪战、爆炸、竞速、灾难、怪物攻击、动作场面。
- `Film & Trailer` 用于电影镜头、分镜、纪录片、广播/直播镜头、MV、短片、镜头序列；如果核心是动作冲突，优先 `Game & Action`。
- `Fantasy & Anime` 用于动漫、漫画、奇幻、科幻、赛博朋克、神兽、妖怪、仙侠、魔法、非现实生物或世界观。
- `Art & Illustration` 用于绘画风格、插画、水彩、蜡笔、像素、剪纸、纸雕、拼贴、艺术风格转换。
- `Infographic & Education` 用于信息图、知识图谱、图鉴、资料卡、设定表、教材、菜谱页、关系图、讲解图。
- `Social Media & Meme` 用于梗图、搞笑段子、脱口秀、小品、反转爽剧、以社媒传播为核心的 comedy/viral 内容。
- `Culture & History` 用于历史人物、朝代、书法、传统节日、国潮、文博、明确传统文化主题。
- `Lifestyle & Vlog` 用于日常、旅行、居家、餐厅、咖啡馆、健身、情侣、生活方式、UGC/vlog 语境。

## 媒体规则

- 列表和详情页不能渲染空字符串媒体地址；无媒体时显示 prompt-only 占位。
- 如果 X 帖同时有原图和效果图，详情页必须展示原图与效果图对比，不能只取原图。
- 媒体判断要结合帖子顺序、上下文说明和最终效果图语义，不要只拿第一张图片。

## UI 文案规则

- 全局不要使用每个字母全大写的展示文案。
- 页面标题和按钮文案使用首字母大写风格，避免 AI 味过重的泛化词。
- 详情页已有 `Related Templates` 标题时，不要再给卡片额外加 `Related` 标签。
- 所有 prompts 相关页面不要在 H1/H2 等标题上方添加 `Answer First`、`Prompt Remix System`、`GEO Summary`、模型名胶囊等解释型小标签；如果需要表达结构，用自然标题和正文承担，避免暴露 SEO/GEO 写作痕迹。
- Prompts 落地页首屏不要放 `Index Snapshot` 这类仪表盘统计卡；真实数量、点赞、浏览等指标可以出现在模板列表或上下文正文里，但不要作为首屏装饰板块抢占用户价值表达。
- Prompts 页面文案要像真实创作者写给真实用户的说明，优先使用具体场景、取舍和操作建议；避免堆砌 `unlock`、`ultimate`、`seamless`、`game-changing` 等泛化营销词，也不要写成明显的 AI 总结腔。
- Prompts 页面 H2 标题在桌面端尽量单行显示：标题容器默认使用页面内容区全宽，正文可单独限宽；必要时把桌面标题字号控制在约 `34px`，但移动端不要为了单行牺牲可读性。
- 只有 `How to`、安装步骤、发布流程这类存在真实先后顺序的内容才使用 `01/02/03` 等编号；分类、收录标准、组成部分、注意事项不要为了设计感强行编号，可用标签、表格、清单或分组布局表达。

## SEO 页面规则

- `/prompts` 是总入口，主攻 `AI image prompt templates`、`AI video prompt templates` 和模型集合词。
- `/prompts` 必须服务端传入模板数据，保证模板卡片链接和核心内容出现在静态 HTML 中，不要只依赖客户端 fetch。
- 模型和分类只作为页面内筛选 tab，不创建 `/prompts/models/[model]` 或 `/prompts/categories/[category]` SEO 落地页，也不要加入 sitemap。
- 详情页标题格式优先使用 `{Title} Prompt for {Model} | Toolaze`。
- 所有 prompts 页面必须设置 canonical，并加入 sitemap。
- 主页面使用 `ItemList` JSON-LD，详情页使用 `CreativeWork` 和 `BreadcrumbList` JSON-LD。
- SEO 文案必须突出真实差异点：X source-backed、可复制 prompt、模型、用例、真实媒体预览和 performance metrics。
- 不要为了 SEO 新增未验证的 prompt、模型、指标或来源；数据真实性优先于关键词覆盖。

## 协作与专业判断规则

- 不要一味认同用户方案；遇到 SEO、数据真实性、架构复杂度、发布风险、性能或长期维护风险时，必须主动提出不同观点。
- 质疑时必须给出事实依据、潜在后果和更稳妥的替代方案，不能只说“不建议”。
- 如果用户方案可行但有隐藏成本，要先明确 trade-off，再执行。
- 如果用户方案会伤害 SEO、数据可信度或线上稳定性，即使用户已经倾向确认，也要先暂停并说明风险。
- 最终仍以用户确认后的决策为准，但专业判断不能省略。
- 每次明确任务完成后，用系统提示音提醒用户；只在最终完成时提示，不在中间步骤频繁提示。

## 导入后检查

导入或批量修复后运行：

```bash
npm run audit:prompt-titles
```

如果脚本输出标题候选，需要逐条检查并修复，不能把字段名、prompt 截断句或来源噪声留到线上。
