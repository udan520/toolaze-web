# Nano Banana 2 功能介绍

> **文件位置**：`docs/specs/nano-banana-2.md`  
> **用途**：Nano Banana 2 工具的功能介绍，作为所有 Nano Banana 2 相关 SEO 内容的基础参考

## 产品概述

Nano Banana 2（Gemini 3.1 Flash Image）是 Google DeepMind 于 2026 年 2 月发布的 AI 图像生成模型，将 Nano Banana Pro 的高级能力与 Gemini Flash 的速度相结合。已在 Google Gemini 应用中上线，作为 Fast、Thinking、Pro 模式的默认图像生成模型。

## 支持的功能

### 支持的输入格式
- **文本 (Text)**：自然语言描述
- **图像 (Image)**：参考图（用于 image-to-image）

### 核心功能
- **Text to Image**：基于文本提示生成图像
- **Image to Image**：基于输入图像生成新图像
- **分辨率**：512px 至 4K 宽屏，多种宽高比
- **主体一致性**：单次工作流中最多保持 5 个角色一致性，最多 14 个物体
- **精准文字渲染**：生成准确、可读的文字（营销 mockup、贺卡等）
- **文字翻译与本地化**：图像内文字翻译和本地化
- **高级世界知识**：基于 Gemini 实时信息和网络搜索，更准确渲染特定主体
- **信息图与数据可视化**：创建信息图、将笔记转为图表、生成数据可视化
- **精准指令跟随**：更好遵循复杂请求，捕捉细节
- **视觉质量**：生动光照、丰富纹理、锐利细节，写实风格

### 技术实现
- Google Nano Banana 2（Gemini 3.1 Flash Image）
- 云端 API 调用（Google AI Studio、Gemini API）
- 需要网络连接

## 不支持的功能

- ❌ 完全本地/离线处理（需要网络连接）
- ❌ 100% 浏览器端处理（需要服务器 API）
- ❌ 视频生成
- ❌ 3D 模型生成

## SEO 内容编写注意事项

1. **只能写支持的功能**：只写上述"支持的功能"列表中明确列出的功能
2. **不能写不支持的功能**：绝对不能提及"不支持的功能"列表中的任何内容
3. **技术描述准确**：Nano Banana 2 是 API 调用工具，**不能**说 "100% private processing" 或 "local processing"
4. **强调优势**：Pro 级质量 + Flash 速度、5 角色/14 物体一致性、精准文字渲染、高级世界知识
5. **与 Nano Banana Pro 区分**：Nano Banana 2 突出速度与 Pro 能力结合；Pro 突出高保真与最大事实准确性

## 更新日志

- 2026-02-15: 初始版本（基于 Google DeepMind 官方发布信息）
