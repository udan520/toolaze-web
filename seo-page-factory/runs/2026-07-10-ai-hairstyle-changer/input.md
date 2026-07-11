# AI Hairstyle Changer

## 页面需求

- 页面名称：AI Hairstyle Changer
- 目标 URL：`/ai-hairstyle-changer`
- 页面类型：图片场景类 AI Tools 落地页
- 用户要求：按照内置落地页生成 Agent 的完整流程重新生成；若同名页面存在则覆盖。

## 现状

- 仓库中不存在 `/ai-hairstyle-changer` 路由、locale JSON 或历史 run。
- 已存在 `/ai-hair-color-changer`，但搜索意图不同，不能覆盖或合并。
- 当前工作区有大量用户未提交改动，本 run 不回滚、不提交、不推送这些改动。

## 长期要求分类

可复用要求：

- 所有 AI Tools 落地页必须经过 Keyword、Competitor、Capability、Content、Preview、Visual、Localization、Publish、Learning Gate。
- 场景页顶部必须使用真实生成器，不暴露底层模型。
- 发型页默认单图上传、发型 preset 优先、自由 prompt 补充。
- 发布必须在人工批准后进行。

本次 run 特定要求：

- Slug 为 `ai-hairstyle-changer`。
- 页面必须同时覆盖女性和男性常见发型。
- 参考图必须清楚展示脸和头发轮廓。
