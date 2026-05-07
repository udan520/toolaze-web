# Model Intro 板块规范

> 适用：AI 模型介绍页（Seedance 2.0、Nano Banana Pro、Watermark Remover 等）
> 设计规范见 `docs/MODEL_INTRO_BLOCK.md`

## 适用页面

- L2：`/model/seedance-2`、`/model/nano-banana-pro`、`/watermark-remover`
- L3：`/model/seedance-2/text-to-video`、`/model/seedance-2/image-to-video` 等

## 位置

- 必须放在 How To Use 下方
- `sectionsOrder`：`["howToUse", "modelIntro", ...]`

## 结构

- **顶部**：H2 标题 + 2-3 段描述（左）+ 右侧配图或模型名占位
- **底部**：三个并列功能卡片，背景色 `bg-indigo-50`、`bg-purple-50`、`bg-slate-50`（禁止纯白）

## 右侧区域：图片 vs 模型名占位（Nano Banana 样式）

- **禁止使用占位图或不存在图片**：若 `image.src` 指向的图片不存在，会导致裂图
- **推荐：模型名占位（Nano Banana 样式）**：不配置 `image`，仅配置 `modelName` 和 `modelType`，右侧显示渐变卡片 + 模型名 + 类型标签
- **仅在有真实图片时使用 image**：如 Seedance 2.0 等有官方产品图时，可配置 `image: { src: "/path/to/existing.jpg", alt: "..." }`
- **Watermark Remover、无产品图的工具**：一律不配置 `image`，使用 `modelName` + `modelType` 占位

## JSON 格式

```json
{
  "modelIntro": {
    "title": "板块主标题",
    "description": ["段落1", "段落2", "段落3"],
    "modelName": "模型名称",
    "modelType": "AI Video Model",
    "image": { "src": "/path.jpg", "alt": "描述" },
    "featureCards": [
      { "title": "卡片1标题", "content": "卡片1内容" },
      { "title": "卡片2标题", "content": "卡片2内容" },
      { "title": "卡片3标题", "content": "卡片3内容" }
    ]
  }
}
```

- `image` 可选，**无真实图片时省略**，使用 modelName 占位

## 内容要求

- 文案必须原创，禁止抄袭参考图或竞品
- 严格遵循 `docs/specs/` 中对应模型的功能规格
- 三张卡片分别突出模型的核心优势（画质/速度、多模态、音视频联合等）
