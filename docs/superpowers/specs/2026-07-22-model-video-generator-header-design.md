# 模型视频落地页顶部生成器统一设计

## 目标

Seedance 2.0 与 Kling 3.0 模型落地页使用 AI Video Generator 页面相同的顶部生成器结构、交互和样式，同时默认选择当前页面对应的模型。

## 范围

- `/model/seedance-2` 默认选择 `seedance-2`。
- `/model/kling-3` 默认选择 `kling-3`。
- `/ai-video-generator` 继续默认选择 `grok-1-5-video`。
- 三个页面均保留模型选择器，允许切换其他视频模型。
- 保留模型页各自正文、SEO 数据、canonical、结构化数据和路由。

## 实现

在 `ToolL2PageContent` 中建立页面类型到默认视频模型的单一映射，并用同一个 `AiVideoGeneratorTool` 渲染分支承载三个页面。页面仍分别传入自身的标题、描述、面包屑、翻译和可选演示视频。

不复制生成器组件，不修改生成 API、积分、上传、历史记录或模型配置。

## 验证

- 源码契约确认三个页面进入同一共享渲染分支。
- 契约确认三个页面的默认模型映射正确，且 `allowModelSelect` 保留。
- 本地 3006 页面烟测确认 Seedance 2.0 与 Kling 3.0 页面显示对应默认模型。
- 确认页面正文和 SEO 数据文件没有改动。
