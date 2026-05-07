# More Tools 板块规范

## 推荐优先级

1. **首选**：推荐已有的、相关联的落地页（同工具下的 L3 子页，或工作流相关工具）
2. **无关联时**：推荐生图页面、生视频页面，或最新上线的模型页面

## 推荐逻辑

### 同工具 L3 子页（优先）

- 有 L3 子页的工具（如 image-compressor、image-converter、font-generator 等）：推荐同工具下 `in_menu: false` 的长尾页面
- 最多 3 个，按相关性排序
- 示例：image-compressor 主页面 → 推荐 jpg-to-20kb、uscis-photo-240kb 等

### 工作流相关工具

- 无 L3 子页或关联场景明确时：推荐用户使用流程中的工具
- 示例：watermark-remover → 推荐 image-compressor、image-converter、how-to-remove-watermark

### 生图 / 生视频 / 模型页（兜底）

- 当无同工具相关落地页时，推荐：
  - **生图**：Nano Banana Pro、Nano Banana 2 等 AI 图像模型
  - **生视频**：Seedance 2.0、Kling 3.0 等 AI 视频模型
  - **最新上线**：优先推荐最新上线的模型页面

## 数量与布局

- 推荐数量：3 个（卡片式）
- 每项：标题、描述、链接
- 标题：使用 `hero.h1` 或 `metadata.title` 提取的纯文本
- 描述：`hero.desc` 或 `metadata.description`，截断至约 100 字

## JSON 字段

- `moreTools`：板块标题，如 `"More Image Compression Tools"`、`"More Image Converter Tools"`
- `moreToolsLinks`（可选）：推荐链接数组，格式 `[{ "slug", "title", "description", "href" }]`。若配置则优先使用；未配置时由代码根据工具类型动态生成

## 禁止

- 不能推荐与当前页面无关的工具
- 不能推荐已下架或不可用的页面
