# Watermark Remover 功能介绍

> **文件位置**：`docs/specs/watermark-remover.md`  
> **用途**：Watermark Remover 工具的功能介绍，作为所有 Watermark Remover 相关 SEO 内容的基础参考

## 支持的功能

### 支持的格式
- JPG/JPEG
- PNG
- WebP
- 其他常见图片格式（最大 30MB）

### 核心功能
- 图片去水印（AI 图生图）
- 单张图片处理
- 长按对比原图与结果
- 一键下载

### 技术实现
- qwen-image-edit API（ai.t8star.cn /v1/images/edits，nano-banana 模型，multipart 直接发送图片，同步返回）
- AI 图像编辑
- 同步处理（上传 → 创建任务 → 轮询 → 返回）

## 不支持的功能

- ❌ 批量处理
- ❌ 视频去水印
- ❌ 本地/客户端处理（需上传至 API）
- ❌ 自定义提示词（内置固定提示词）

## SEO 内容编写注意事项

1. **只能写支持的功能**：只写上述"支持的功能"列表中明确列出的功能
2. **不能写不支持的功能**：绝对不能提及"不支持的功能"列表中的任何内容
3. **技术描述准确**：使用 AI 图像编辑，不夸大（不写具体 API 名）
4. **格式限制**：只写支持的格式
5. **处理方式**：图片需上传至服务器处理，**不能**写 "local processing"、"100% private processing"、"processing on your device"。应写 "no sign-up required"、"images not stored permanently"、"secure processing"。
