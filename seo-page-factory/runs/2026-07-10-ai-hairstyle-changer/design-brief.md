# Design Brief

Status: approved_for_placeholder_preview

## Design Read

现有 Toolaze AI Tools 场景页，面向希望在剪发前快速比较视觉方向的普通用户。保留当前品牌、导航、工具布局和浅色主题，重点提升发型选择的可视性。

## Dials

- DESIGN_VARIANCE: 5
- MOTION_INTENSITY: 3
- VISUAL_DENSITY: 5

## 工具区

- 左侧：单图上传、Women / Men / Custom 三个 Tab、输出设置和 Generate。
- Women：11 张图片模板，统一使用同一女性模特占位图。
- Men：11 张图片模板，统一使用同一男性模特占位图。
- Women 和 Men：模板 Prompt 内置，不显示给用户。
- Custom：不显示模板卡，只显示一个本地化自然语言描述输入框。
- 右侧：16:9 before/after 示例。
- 发型卡：三列，图片 1:1，label 在卡片下部，选中时使用 indigo 边框和 ring。
- 发色色块仍保持原有四列正方形布局，不受本页改动影响。

## 页面视觉

- 浅灰蓝背景与白色内容区。
- 仅使用 Toolaze indigo 强调色。
- 不新增渐变背景、玻璃拟态、装饰性 SVG、滚动劫持或无意义动画。
- 使用真实发型结果，不使用抽象 AI 概念图。
- 不在图片上写英文标签。
- 最终模板图应保持人物、角度、表情、背景和服装一致，只改变发型。
- 真实模板图完成后可同时作为视觉卡片和隐藏 `referenceImage` 使用。

## 响应式

- Desktop：工具左侧固定宽度，三列 preset。
- Tablet：三列或两列，根据左侧宽度自适应。
- Mobile：工具自然纵向，preset 三列，label 不换行时缩小字号。
- 所有按钮文字保持单行。

## 当前视觉限制

- 22 张模板为占位资产，可用于结构评审，不能作为最终发型效果证明。
- 顶部 16:9 示例仍不是同一人物的真实转换。
- Visual Gate 在最终统一模特模板和同人物 before/after 完成前保持 blocked。
