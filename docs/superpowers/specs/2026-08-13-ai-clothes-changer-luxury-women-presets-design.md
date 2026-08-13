# AI Clothes Changer 女装奢华预设设计

## 目标

将 AI Clothes Changer 的女装内置参考图从以日常服装为主的组合，调整为 3 套西装、1 套成人泳装和 4 套高定礼服。每一项均使用 KIE GPT Image 2 生成的真实全身成人穿搭参考图，供“两图换装”模式作为第二张服装参考图提交。

## 已确认的预设目录

女装总数保持 8 个，不新增分类、模式或交互：

1. Black Evening Suit：黑色修身晚宴西装。
2. Caramel Quiet-Luxury Suit：焦糖棕静奢西装。
3. Blush Satin Suit：樱花粉缎面西装。
4. Classic Black Swim：保留现有成人黑色连体泳装。
5. Emerald Red-Carpet Gown：祖母绿缎面红毯礼服。
6. Burgundy Velvet Mermaid Gown：勃艮第丝绒鱼尾礼服。
7. Ivory Architectural Couture：象牙白建筑感高定礼服。
8. Midnight Celestial Couture：午夜蓝星空刺绣创意礼服。

## 资产与生成约束

- 使用 KIE 的 `gpt-image-2-text-to-image`，9:16 比例，生成 8 张独立服装参考图。
- 每张图是完整可见的成人女性全身时装肖像：头顶到鞋履或裙摆完整入镜，站立姿态清楚，背景中性且不抢主体。
- 不生成单独平铺的服装、半身裁切图、品牌标志、水印、裸露或性化姿态；泳装为正常、非露骨的成人穿着展示。
- 每个 prompt 只描述一个预设，明确材质、色彩、层次、廓形、鞋履与完整全身构图，保证图 2 对换装模型有可读的服装信息。
- 生成完成后进行人工视觉筛选；只保留服装完整、人物为成年人、无明显手脚或衣摆缺陷的结果。
- 最终文件转为适合网页预览的 WebP，上传至 `https://assets.toolaze.com/landing-pages/ai-clothes-changer/presets/women/<slug>.webp`。页面数据只引用该稳定 R2 公网地址。

## 数据与本地化

- 保持每个 locale 的 8 个 women 和 8 个 men 预设结构不变。
- 全部 locale 的女装 `image` 与 `referenceImage` 顺序、URL 和 slug 必须与英文目录一致。
- 各 locale 仅本地化可见 `label` 与提示词中的衣装描述；所有 preset prompt 继续保留既有的 Image 1 / Image 2 语义、人物不变量及无虚构品牌限制。
- 男装目录、Custom 流程、网格布局、上传状态和 API payload 映射不改动。

## 生成契约

| 模式 | 必填输入 | 预设引用资源 | 可生成条件 |
| --- | --- | --- | --- |
| Women / preset | 人物图（Image 1）与选中的预设 | 所选 R2 服装全身图（Image 2） | 人物图和预设均存在 |
| Men / preset | 人物图（Image 1）与选中的预设 | 所选 R2 服装全身图（Image 2） | 人物图和预设均存在 |
| Custom | 人物图与用户上传的服装参考图 | 用户所选图（Image 2） | 两张用户资源均存在 |

## 测试与验收

1. 先更新 `src/components/ai-clothes-changer-presets.contract.test.mjs` 的英文女装标签期望值，再运行该测试，确认因目录仍是旧值而失败。
2. 完成全部 locale 数据更新后重跑测试，确认每个 locale 仍有 8 个女装、8 个男装，且每个预设的 `referenceImage === image`、R2 URL 和 Image 1 / Image 2 prompt 契约成立。
3. 新增/收紧契约：女装刚好包含 3 个 suit、1 个 swim 和 4 个 gown/couture，并断言不再包含旧的日常女装标签与旧资源 slug。
4. 对 8 个 R2 URL 进行 HTTP 可达性检查；确认响应类型是图片，且没有任一 URL 指向本地 `public` 资源。
5. 在非 3006 端口做目标页面本地 smoke，确认女装 tab 显示八个完整 9:16 缩略图，选中其中任意一项后仍以选中图作为第二张参考图进入请求。

## 非目标

- 不更改男装预设、预设数目、模型、定价、用户上传逻辑或页面 SEO 文案。
- 不引入新的女装筛选分类、收藏、排序或后台素材管理功能。
- 不做 git 提交、推送或发布。
