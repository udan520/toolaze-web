# ModelIntroBlock 组件使用指南

## 概述

`ModelIntroBlock` 是用于**模型介绍页**的 SEO 优化内容板块，适用于 Seedance 2.0、Nano Banana Pro 等 AI 模型的产品介绍页面。

## 设计规范

- **设计系统**: Style 1 (Soft Smart Tech)，遵循 `docs/SEO_MASTER_LAYOUT.md`
- **背景交替**: 顶部 `bg-[#F8FAFF]`，底部 `bg-white`，三张卡片采用 `bg-indigo-50` / `bg-purple-50` / `bg-slate-50`（禁止纯白）
- **H1**: `text-[40px]`（40px，符合 SEO 规范）
- **配色**: Blue/Purple 渐变调色板

## 结构

1. **顶部概览区块**
   - H1 主标题
   - 多段描述文字（左）
   - 可选配图（右，大尺寸矩形）

2. **底部功能卡片区块**
   - 三个并列卡片
   - 每卡：标题 + 详细内容
   - 卡片背景：浅靛 / 浅紫 / 浅灰（非白色）

## 数据格式（JSON）

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

## 使用示例

```tsx
import ModelIntroBlock from '@/components/blocks/ModelIntroBlock'

// 从 JSON 数据传入
<ModelIntroBlock
  title={content.modelIntro.title}
  description={content.modelIntro.description}
  image={content.modelIntro.image}
  modelName={content.modelIntro.modelName}
  modelType={content.modelIntro.modelType}
  featureCards={content.modelIntro.featureCards}
/>
```

## 内容要求

- **原创文案**：禁止抄袭参考图或竞品，避免谷歌判定重复内容
- **遵循规格**：严格按 `docs/specs/` 中对应模型的功能规格编写
- **modelType**：视频模型用 `"AI Video Model"`，图片模型用 `"AI Image Model"`

## 何时使用

- 模型介绍页 L2（如 `/seedance-2`、`/model/nano-banana-pro`）
- 模型介绍页 L3（如 `/seedance-2/text-to-video`、`/seedance-2/image-to-video`）
- 需要突出模型核心价值与三大优势的落地页
- 需要配图 + 长文案的 SEO 内容区块

## 与 Intro / Features 的区别

| 组件 | 用途 | 布局 |
|------|------|------|
| Intro | 通用「为什么选择」介绍 | 2 卡片或 1 卡片，居中 |
| Features | 6 项功能点网格 | 2x3 网格 |
| **ModelIntroBlock** | 模型专属介绍 | H1+描述+图 + 3 大功能卡 |

## SEO 关键词布局建议

- **P0 (主关键词)**: 放在 H1 和首段
- **P1 (核心功能词)**: 放在三张卡片标题
- **P2 (长尾关键词)**: 自然分布在描述和卡片内容中
